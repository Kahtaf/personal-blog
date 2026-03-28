---
title: "Browsing Inside a Browser: How Web Proxies Work"
description: "Service workers, URL rewriting, and the Scramjet generation. An explainer on browser-based web proxies, how they differ from traditional proxies, and where they break."
date: "Dec 26 2025"
---

**TL;DR:** Browser-based web proxies like [Scramjet](https://github.com/MercuryWorkshop/scramjet) use a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to intercept HTTP requests from a page, rewrite URLs to route through a proxy backend, and patch browser APIs so the page behaves as if it loaded from the original site. They run entirely in a browser tab, need no installation, and can bypass network-level filters. Scramjet is the current best option, using a WASM-compiled Rust rewriter for speed. It handles simple sites well but frequently breaks on Google Sign-in, Cloudflare challenges, DRM content, and complex SPAs. These are useful tools for specific situations, but they are not a VPN replacement, and you should never type a password into one.

## What browser-based web proxies are

A browser-based web proxy is a website that lets you browse other websites. You visit a page, type a URL into a text field, and the target site loads inside your browser tab. From the outside, your browser is only talking to the proxy's domain. From the inside, the proxy is rewriting content and patching APIs so the target site renders as if you visited it directly.

These are not browser extensions, VPNs, or system-level proxy configurations. They are web applications. The entire mechanism runs in a browser tab using standard web APIs, with nothing to install and no permissions required.

The two implementations that matter today are [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet) (now deprecated) and its successor [Scramjet](https://github.com/MercuryWorkshop/scramjet). There are others ([Rammerhead](https://github.com/nicknameisthekey/rammerhead) does session-based proxying via server-side URL rewriting, [Womginx](https://github.com/nicknameisthekey/womginx) takes a pure nginx approach), but the service worker model that Ultraviolet pioneered and Scramjet refined is the current standard.

These tools see the most use in schools and workplaces. Network administrators block certain domains at the DNS or firewall level, and a web proxy sidesteps that by routing all traffic through its own unblocked domain. The proxy site itself gets blocked eventually, a new mirror goes up, and the cycle continues.

## The trust model

Before getting into how these work, it's worth understanding what you're trusting when you use one.

The proxy operator can see everything you do. HTTPS between your browser and the proxy protects the connection *to the proxy*, but TLS terminates at the proxy server. The proxy process decrypts your request, makes its own connection to the target site, and relays the response back. At that point, the operator's code has access to the cleartext: every URL you visit, every form submission, every cookie, every response body. They can log it, modify it, or inject content into it.

If you wouldn't type a password into a random computer at a public library, you shouldn't type it into a web proxy.

## How they work

There are three layers to a browser-based web proxy: request interception, backend transport, and runtime emulation. 

### Request interception

When you load a web proxy site, it registers a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) in your browser. A service worker is a script that intercepts [`fetch` events](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event) from pages it controls. That means it can catch HTTP requests made by the page (XHR, fetch calls, stylesheet/script/image loads), but not everything the browser does. WebRTC, WebSocket upgrades, and some browser-internal requests fall outside its reach.

Here's the interception flow for a single page load:

```
Browser Tab              Service Worker             Proxy Backend            Target Site
    |                         |                          |                       |
    |-- fetch(example.com) -> |                          |                       |
    |                         |-- encode URL, forward -->|                       |
    |                         |                          |-- GET example.com --> |
    |                         |                          |<-- response --------- |
    |                         |<-- rewrite body & hdrs   |                       |
    |<-- serve rewritten page |                          |                       |
```

1. You type `example.com` into the proxy's search bar.
2. The proxy encodes that URL and fetches it through its backend.
3. The backend makes the actual HTTP request to `example.com` and returns the response.
4. The service worker rewrites the response body: URLs in HTML `href` and `src` attributes, CSS `url()` values, and JavaScript string literals all get rewritten to point back through the proxy.
5. It also rewrites response headers. `Location` redirects need to point through the proxy. `Set-Cookie` domains get adjusted. `Content-Security-Policy` directives that reference the original domain need updating, or the browser will block resources. `Access-Control-Allow-Origin` headers need to match the proxy's origin for CORS to work.
6. The rewritten response is served to the page, and the service worker intercepts each subsequent resource request (stylesheets, scripts, images, API calls) the same way.

The page thinks it's talking to `example.com`. The browser thinks it's talking to `proxy-site.com`. 

### Backend transport

The service worker handles interception and rewriting on the browser side, but the actual HTTP requests to target sites need a server. In this ecosystem, two main transport protocols have emerged:

The **Bare Server** protocol (part of the [TompHTTP specification](https://github.com/tomphttp/specifications)) is the older standard. The service worker sends an HTTP request to a REST-style endpoint on the proxy server, specifying the target URL and headers. The server makes the request and returns the response. One outgoing HTTP request per proxied resource.

The **Wisp protocol** ([spec](https://github.com/MercuryWorkshop/wisp-protocol)) is newer. It multiplexes multiple TCP and UDP sockets over a single WebSocket connection. Instead of opening a new HTTP request for every resource, the service worker sends lightweight messages over an existing WebSocket, and the server fans them out. Fewer connections, less overhead, and better performance on pages that load dozens of resources in parallel.

The backend is also where your traffic actually exits to the internet. The target site (`example.com`) sees the proxy server's IP address, not yours.

### Runtime emulation

Intercepting requests and rewriting responses gets you partway there, but modern sites also interact with browser APIs that expose origin information. If the proxy doesn't patch these, the page will see the proxy's URL instead of the original one, and things break.

The major APIs that need patching:

- `window.location` and `document.location` need to return the original site's URL, not the proxy's. The proxy overrides these getters so code that checks `location.hostname` or `location.href` sees the expected values.
- `history.pushState()` and `history.replaceState()` need intercepting. SPAs use these to update the URL bar during client-side navigation. The proxy wraps these calls to translate between the original URLs the app expects and the encoded proxy URLs the browser actually uses.
- `document.cookie` access needs scoping. Since all proxied sites share the proxy's origin, the proxy has to maintain separate cookie jars per proxied domain and intercept cookie reads/writes to return the right set.
- `localStorage` and `sessionStorage` have the same problem: they're keyed by origin, and the proxy is one origin. Proxies that handle this typically namespace storage access by the proxied domain.
- `Worker` and `SharedWorker` constructors need their script URLs rewritten, or web workers will try to load scripts from the original domain and fail.
- `postMessage` origin checks may need patching if the page validates the origin of incoming messages.

This runtime emulation layer is what separates a working proxy from one that loads a page but breaks on the first user interaction. It's also the most fragile part of the system, because every new browser API that exposes origin or URL information is another thing the proxy needs to intercept.

## How they differ from traditional proxies

The word "proxy" covers a lot of ground. Here's how browser-based web proxies compare to the other tools people reach for:

|  | Browser-based proxy | HTTP CONNECT | SOCKS5 | VPN |
|---|---|---|---|---|
| **Where it hooks in** | JavaScript in a browser tab | Application-level tunnel | Application-level relay | OS-level network tunnel |
| **Scope** | Single browser tab | Per-application | Per-application | System-wide |
| **Setup** | Visit a URL | Configure browser or app | Configure browser or app | Install a client |
| **Encryption** | HTTPS to proxy; proxy sees cleartext | End-to-end TLS passthrough | Optional, protocol-dependent | Full tunnel encryption |
| **Traffic types** | HTTP/HTTPS web pages | Any TCP connection | TCP and UDP | All IP traffic |
| **WebRTC leak protection** | No | No | No | Usually yes |

An **HTTP CONNECT** proxy creates a TCP tunnel at the application level. Your browser sends `CONNECT example.com:443`, the proxy opens a connection to the target, and raw bytes flow through. The proxy never sees the plaintext because TLS runs end-to-end between your browser and the target server. But you need to configure your browser or application to use it.

A **SOCKS5** proxy relays arbitrary TCP (and optionally UDP) traffic. It doesn't understand HTTP. It just forwards packets between your application and the target. More flexible than HTTP CONNECT, but still requires explicit client configuration.

A **VPN** encrypts and routes all system traffic through a tunnel to a remote server. Everything goes through it: browsers, apps, DNS queries, the lot.

A browser-based web proxy does none of that. It doesn't touch the network stack or tunnel connections. It rewrites web content inside a single browser tab using JavaScript. That means it works on any device with a browser and needs nothing installed. The trade-off: it can only proxy what it can intercept and rewrite, and it can't intercept everything.

## When they are actually useful

The honest answer: the primary real-world use case is bypassing network filters in schools and workplaces. A student on a school Chromebook can't install a VPN client or configure a SOCKS proxy. But they can visit a website. That's the niche these tools fill.

Beyond that, there are some legitimate scenarios:

- Temporary access to a blocked resource
- Quick testing
- Educational use

What they are not good for: anything requiring persistent sessions, authentication, sensitive data entry, or reliability. More on that next.

## Where they break

### Same-origin collapse

This is the core architectural tension. Every site you visit through the proxy shares the proxy's origin. From the browser's perspective, `proxy-site.com/encoded-gmail` and `proxy-site.com/encoded-reddit` are the same origin.

The browser's native isolation between sites is gone. Cookies, storage, and security policies that the browser normally scopes per-domain all collapse into one bucket. Proxies can try to reimplement this isolation in JavaScript (namespacing cookies by proxied domain, partitioning storage), but it's an imperfect emulation of what the browser does natively. For example, `HttpOnly` cookies can't be read from JavaScript at all, so a proxy that manages cookies in JS can't fully replicate that restriction. `SameSite` cookie policies, CSRF protections that check the `Origin` header, and other browser-enforced security boundaries all need to be reimplemented by the proxy, with varying degrees of success.

This isn't a bug that can be patched out. It's a consequence of running everything through a single origin.

### JavaScript and SPA breakage

URL rewriting needs to catch every URL reference in JavaScript. This is harder than it sounds. Consider:

- `window.location.href` and `document.location` need to return the original URL, not the proxied one (handled by runtime emulation, but the shim can break if code accesses these in unexpected ways).
- Dynamic `import()` statements construct module URLs at runtime.
- `new URL()` calls build URLs from strings and base paths.
- String concatenation like `"https://" + domain + "/api/" + endpoint` creates URLs that no parser can reliably detect without executing the code.

Single-page applications hit all of these at once. React Router, Next.js, and similar frameworks make heavy use of the History API and dynamic imports. A rewriter that misses one URL construction pattern causes silent failures: a route doesn't load, an API call 404s, or navigation silently drops out of the proxy.

### What frequently breaks

Google Sign-in often fails because BotGuard's integrity checks flag the proxy environment. Cloudflare-protected sites are hit-or-miss depending on the proxy's TLS fingerprint, header ordering, and IP reputation. DRM content (Netflix, Disney+, Spotify) won't play because [Widevine](https://www.widevine.com/) and [FairPlay](https://developer.apple.com/streaming/fps/) verify the playback origin. And WebRTC connections bypass the service worker entirely — they use [STUN](https://datatracker.ietf.org/doc/html/rfc8489) over UDP to discover your public IP, so any site with video calling or real-time features can see your real address.

### Detection vectors

Networks and sites have multiple ways to detect and block these proxies:

- Domain blocking: Proxy sites get added to blocklists. New mirrors get added shortly after.
- Service worker fingerprinting: Detecting the presence of a non-standard service worker in the page scope is a signal.
- URL pattern recognition: Encoded URLs in the path (like base64 or XOR-encoded strings) have a distinctive structure that's easy to identify with a regex.
- TLS fingerprinting: The proxy backend's TLS ClientHello doesn't match a real browser. Tools like [JA3](https://github.com/salesforce/ja3) can fingerprint TLS handshakes and flag mismatches.
- Header anomalies: Missing, reordered, or inconsistent HTTP headers that a real browser would send in a predictable pattern.

## Where things stand today

As of early 2026, [Scramjet](https://github.com/MercuryWorkshop/scramjet) is the most capable option in this space. Its WASM-compiled Rust rewriter is faster than Ultraviolet's AST parser, and it handles a wider range of sites. YouTube, Twitter, Reddit, Discord, and Spotify all work to varying degrees. For mostly-static sites and light browsing, it gets the job done.

But for anything involving complex authentication flows, third-party sign-in (Google, Apple, Microsoft), aggressive bot detection (Cloudflare, Akamai), or DRM-protected media, it still falls short. These aren't bugs to be fixed. They're architectural constraints. Rewriting web content at the application layer is a game of catch-up against an evolving web platform. Every new browser API, every new way to construct a URL in JavaScript, every new fingerprinting technique is another thing the rewriter needs to handle.

Scramjet pushes the limits of what you can do with service workers and WASM, and the engineering is genuinely good. But the web was built on the assumption that origins matter and that browsers enforce security boundaries. Web proxies break those assumptions on purpose. For simple sites, that works fine. For the modern web with all its auth flows and bot detection and DRM, it's always going to be an approximation.

## Further reading

- [Scramjet](https://github.com/MercuryWorkshop/scramjet) - Mercury Workshop's interception-based web proxy (current standard)
- [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet) - The predecessor that pioneered the service worker model (deprecated)
- [TompHTTP Bare Server specification](https://github.com/tomphttp/specifications) - Protocol spec for proxy backends
- [Wisp protocol](https://github.com/MercuryWorkshop/wisp-protocol) - Multiplexed TCP/UDP transport over WebSocket
- [Service Worker API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - The browser API that makes request interception possible
- [Service Worker fetch event (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event) - What the service worker can and cannot intercept
