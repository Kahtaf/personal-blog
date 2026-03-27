---
title: "How Browser-Based Web Proxies Actually Work"
description: "Service workers, URL rewriting, and the Scramjet generation. An explainer on browser-based web proxies, how they differ from traditional proxies, and where they break."
date: "Mar 26 2026"
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

This is the same trust model as a corporate TLS-intercepting proxy, except without the organizational accountability. Free public proxy sites have strong incentives to monetize traffic data and few reasons not to. Even well-intentioned operators make mistakes with logging, retention, and server security.

If you wouldn't type a password into a random computer at a public library, you shouldn't type it into a web proxy.

## How they work

There are three layers to a browser-based web proxy: request interception, backend transport, and runtime emulation. Most explanations focus on the first two, but the third is what makes modern sites actually load.

### Request interception

When you load a web proxy site, it registers a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) in your browser. A service worker is a script that intercepts [`fetch` events](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event) from pages it controls. That means it can catch HTTP requests made by the page (XHR, fetch calls, stylesheet/script/image loads), but not everything the browser does. WebRTC, WebSocket upgrades, and some browser-internal requests fall outside its reach.

Here's the interception flow for a single page load:

```
Browser Tab              Service Worker             Proxy Backend            Target Site
    |                         |                          |                       |
    |-- fetch(example.com) -> |                          |                       |
    |                         |-- encode URL, forward --> |                       |
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

The page thinks it's talking to `example.com`. The browser thinks it's talking to `proxy-site.com`. The network only sees traffic to `proxy-site.com`.

### Backend transport

The service worker handles interception and rewriting on the browser side, but the actual HTTP requests to target sites need a server. In this ecosystem, two main transport protocols have emerged:

The **Bare Server** protocol (part of the [TompHTTP specification](https://github.com/tomphttp/specifications)) is the older standard. The service worker sends an HTTP request to a REST-style endpoint on the proxy server, specifying the target URL and headers. The server makes the request and returns the response. One outgoing HTTP request per proxied resource.

The **Wisp protocol** ([spec](https://github.com/MercuryWorkshop/wisp-protocol)) is newer. It multiplexes multiple TCP and UDP sockets over a single WebSocket connection. Instead of opening a new HTTP request for every resource, the service worker sends lightweight messages over an existing WebSocket, and the server fans them out. Fewer connections, less overhead, and better performance on pages that load dozens of resources in parallel.

Other transports exist (you could back a web proxy with anything that can make HTTP requests on the server side), but Bare and Wisp are what most projects in this space use.

The backend is also where your traffic actually exits to the internet. The target site sees the proxy server's IP address, not yours.

### Runtime emulation

Intercepting requests and rewriting responses gets you partway there, but modern sites also interact with browser APIs that expose origin information. If the proxy doesn't patch these, the page will see the proxy's URL instead of the original one, and things break.

The major APIs that need patching:

- **`window.location` and `document.location`** need to return the original site's URL, not the proxy's. The proxy overrides these getters so code that checks `location.hostname` or `location.href` sees the expected values.
- **`history.pushState()` and `history.replaceState()`** need intercepting. SPAs use these to update the URL bar during client-side navigation. The proxy wraps these calls to translate between the original URLs the app expects and the encoded proxy URLs the browser actually uses.
- **`document.cookie`** access needs scoping. Since all proxied sites share the proxy's origin, the proxy has to maintain separate cookie jars per proxied domain and intercept cookie reads/writes to return the right set.
- **`localStorage` and `sessionStorage`** have the same problem: they're keyed by origin, and the proxy is one origin. Proxies that handle this typically namespace storage access by the proxied domain.
- **`Worker` and `SharedWorker` constructors** need their script URLs rewritten, or web workers will try to load scripts from the original domain and fail.
- **`postMessage` origin checks** may need patching if the page validates the origin of incoming messages.

This runtime emulation layer is what separates a working proxy from one that loads a page but breaks on the first user interaction. It's also the most fragile part of the system, because every new browser API that exposes origin or URL information is another thing the proxy needs to intercept.

### URL rewriting approaches

The body rewriting from step 4 above deserves more detail, because it's the biggest performance bottleneck and the most common source of breakage.

Web pages contain URLs everywhere: in HTML attributes, CSS properties, inline JavaScript, dynamically constructed strings, `import()` statements, `new URL()` calls, `postMessage` payloads. Miss one and the page breaks. An image fails to load, a script throws a CORS error, or navigation goes to the raw target URL and bypasses the proxy entirely.

Ultraviolet tackled this with **AST-based rewriting**. It parses JavaScript into an abstract syntax tree, walks every node looking for URL-shaped values, rewrites them, and serializes the tree back to source code. The advantage is thoroughness: parsing the syntax means fewer missed URLs. The cost is speed, since building and serializing an AST for every script on a page adds latency.

Scramjet takes a different approach: **byte-span rewriting** using a WASM-compiled Rust parser. Instead of building a full AST, it scans the source as a byte stream, identifies spans that contain URLs (by recognizing patterns like `http://`, `https://`, or relative path structures in known contexts), and rewrites them in place. The Scramjet project claims this is significantly faster than AST-based parsing. Independent benchmarks are hard to find, but the architectural reasoning is sound: skipping the parse-and-serialize round trip should be cheaper. The trade-off is that pattern-matching on raw text is less precise than syntax-aware rewriting, and it can miss URLs constructed in unusual ways.

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

- **Temporary access to a blocked resource.** You're on a restricted network, you need to check one page, and setting up a VPN is overkill. A web proxy gets you there in seconds.
- **Quick testing.** You want to see how a site behaves when accessed through an intermediary, or how it looks from a different IP, without configuring a proxy at the system level.
- **Educational use.** Understanding how service workers, URL rewriting, and request interception work is interesting computer science. These projects are well-documented and make good case studies.

What they are not good for: anything requiring persistent sessions, authentication, sensitive data entry, or reliability. More on that next.

## Where they break

### Same-origin collapse

This is the core architectural tension. Every site you visit through the proxy shares the proxy's origin. From the browser's perspective, `proxy-site.com/encoded-gmail` and `proxy-site.com/encoded-reddit` are the same origin.

The browser's native isolation between sites is gone. Cookies, storage, and security policies that the browser normally scopes per-domain all collapse into one bucket. Proxies can try to reimplment this isolation in JavaScript (namespacing cookies by proxied domain, partitioning storage), but it's an imperfect emulation of what the browser does natively. For example, `HttpOnly` cookies can't be read from JavaScript at all, so a proxy that manages cookies in JS can't fully replicate that restriction. `SameSite` cookie policies, CSRF protections that check the `Origin` header, and other browser-enforced security boundaries all need to be reimplemented by the proxy, with varying degrees of success.

This isn't a bug that can be patched out. It's a consequence of running everything through a single origin.

### JavaScript and SPA breakage

URL rewriting needs to catch every URL reference in JavaScript. This is harder than it sounds. Consider:

- `window.location.href` and `document.location` need to return the original URL, not the proxied one (handled by runtime emulation, but the shim can break if code accesses these in unexpected ways).
- Dynamic `import()` statements construct module URLs at runtime.
- `new URL()` calls build URLs from strings and base paths.
- String concatenation like `"https://" + domain + "/api/" + endpoint` creates URLs that no parser can reliably detect without executing the code.

Single-page applications hit all of these at once. React Router, Next.js, and similar frameworks make heavy use of the History API and dynamic imports. A rewriter that misses one URL construction pattern causes silent failures: a route doesn't load, an API call 404s, or navigation silently drops out of the proxy.

### What frequently breaks

Some categories of sites cause consistent problems across all current proxy implementations, though the specifics vary by proxy version, deployment, and even IP reputation:

**Google Sign-in** frequently fails because Google's BotGuard system runs integrity checks on the browser environment. Scramjet's docs list Google support, and some deployments report partial success, but the experience is unreliable. The proxy environment triggers enough anomalies that sign-in often stalls or errors out.

**Cloudflare-protected sites** are hit-or-miss. Cloudflare's bot detection examines TLS fingerprints, header ordering, and JavaScript execution behavior. Whether you get a challenge page, a block, or clean access depends on the proxy's backend TLS configuration, the site's Cloudflare settings, and the IP reputation of the proxy server. Some Cloudflare-protected sites work fine; others block consistently.

**DRM content.** Netflix, Disney+, and Spotify use [Widevine](https://www.widevine.com/) or [FairPlay](https://developer.apple.com/streaming/fps/) for content protection. These DRM systems verify the origin and integrity of the playback environment. A proxied page typically fails those checks.

**WebRTC.** WebRTC connections use [STUN](https://datatracker.ietf.org/doc/html/rfc8489) to discover your public IP address via UDP. These connections bypass the service worker entirely (service workers only intercept fetch events, not UDP traffic). Any site using WebRTC can discover your real IP address, which includes most video calling and some real-time communication features.

### Detection vectors

Networks and sites have multiple ways to detect and block these proxies:

- **Domain blocking.** Proxy sites get added to blocklists. New mirrors get added shortly after.
- **Service worker fingerprinting.** Detecting the presence of a non-standard service worker in the page scope is a signal.
- **URL pattern recognition.** Encoded URLs in the path (like base64 or XOR-encoded strings) have a distinctive structure that's easy to identify with a regex.
- **TLS fingerprinting.** The proxy backend's TLS ClientHello doesn't match a real browser. Tools like [JA3](https://github.com/salesforce/ja3) can fingerprint TLS handshakes and flag mismatches.
- **Header anomalies.** Missing, reordered, or inconsistent HTTP headers that a real browser would send in a predictable pattern.

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
