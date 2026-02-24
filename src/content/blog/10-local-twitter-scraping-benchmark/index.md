---
title: "A Local Scraping Benchmark: agent-browser vs Camoufox (via camofox-browser) vs Scrapling"
description: "A painfully detailed experiment comparing three local scraping tools on a hostile, JS-heavy target: reliability, session handling, scrolling depth, and practical gotchas."
date: "Feb 24 2026"
---

**TL;DR:** If you want to scrape a modern, hostile, JS-heavy site locally, you need a real browser session plus a stealthy fingerprint. In my tests, **Camoufox (accessed via the `camofox-browser` server + OpenClaw `camofox_*` tools)** and **agent-browser (Playwright-like CLI with a storage state)** both loaded and scrolled authenticated pages. **Scrapling** (even with the same cookies injected) consistently returned effectively empty content for this target in this environment. Cookies are necessary, but not sufficient: **fingerprint and automation signals matter more than people want to admit**.

This post is intentionally over-documented. We’ll cut it down later.

---

## What I was trying to learn

I wanted to answer one question with evidence:

> If I run everything locally (no paid scraping APIs), what’s the most reliable way to scrape a site like X (Twitter) that’s designed to resist automation?

And a closely related question:

> If I use the *same* login cookies across tools, do I get the same access?

To test that, I compared three “local scraping” approaches inside **OpenClaw**:

1. **Agent Browser** (OpenClaw skill / CLI): a fast browser automation CLI with Playwright-style primitives.
2. **Camoufox (via `camofox-browser`)**: a server + OpenClaw plugin that wraps Camoufox (a hardened Firefox build optimized for anti-bot evasion). The OpenClaw tool names are `camofox_*`.
3. **Scrapling** (Python): a scraping framework with static HTTP fetchers and browser-based dynamic fetchers.

I started with Reddit as a warm-up target (because it has a nice JSON endpoint) and then moved to X, which is basically the boss fight of “scrape it like a normal web page.”

---

## Links (tools + docs)

### OpenClaw
- Docs: https://docs.openclaw.ai
- Source: https://github.com/openclaw/openclaw

### agent-browser
- Skill repo (OpenClaw workspace skill): `skills/agent-browser` (in my OpenClaw workspace)
- CLI help shows Playwright-like commands: `open`, `wait`, `scroll`, `get count`, `eval`, etc.

### Camoufox vs `camofox-browser` vs OpenClaw tool names
There are multiple similarly-named pieces here, so clarity matters:

- **Camoufox** (the actual browser engine; stealthy Firefox build)
  - Project site: https://camoufox.com/
  - GitHub: https://github.com/daijro/camoufox

- **`camofox-browser`** (a REST API server that wraps Camoufox)
  - GitHub: https://github.com/jo-inc/camofox-browser

- **OpenClaw tool names** exposed by the plugin are prefixed with `camofox_` (e.g. `camofox_snapshot`, `camofox_scroll`, etc.):
  - `camofox_create_tab(url)`
  - `camofox_snapshot(tabId)`
  - `camofox_scroll(tabId, …)`
  - `camofox_import_cookies(cookiesPath, domainSuffix)`

### Scrapling
- Docs: https://scrapling.readthedocs.io/en/latest/index.html
- GitHub: https://github.com/D4Vinci/Scrapling

### Playwright (dependency used indirectly by multiple approaches)
- Docs: https://playwright.dev

---

## Important constraints (aka: why this is hard)

### X is not “scrape HTML and parse it”
X serves a JS-heavy application. Depending on how it detects you, it can:

- Serve a normal app shell that loads content via API calls.
- Serve a **“JavaScript is not available”** wall.
- Serve partial/empty responses with HTTP 200.
- Throttle, challenge, or quietly degrade content.

### Cookies ≠ authentication in a vacuum
Even valid cookies (`auth_token`, `ct0`, etc.) may not be accepted equally across tools because X also evaluates:

- Browser fingerprint (WebGL/canvas, fonts, navigator properties)
- Headless/automation leaks (`navigator.webdriver`, weird timing)
- TLS/HTTP fingerprinting (for non-browser fetchers)
- Local storage / service worker / other state

The main takeaway: **“I injected cookies” is not the same as “I reproduced a logged-in browser session.”**

---

## Experimental setup

### Hardware + environment
- Everything ran on my own hardware via OpenClaw (no external scraping providers).
- OS: Linux (arm64)
- OpenClaw version in this run: 2026.2.23

### Targets (X)
I used:
- `https://x.com/home` (to confirm authenticated state)
- `https://x.com/elonmusk` (public profile + posts feed, easy baseline)

I did **not** benchmark the X “Search” results page yet in the strict “N scrolls then extract” format — this post documents the tool behavior on timelines first, because search is just another infinite-scroll surface with extra UI complexity.

### What I measured
For each tool, I cared about:

1. **Reliability**: did it load the page without a block wall?
2. **Session realism**: did it behave like a logged-in browser?
3. **Depth**: after N scrolls, did more posts load?
4. **Practical scrape handle**: can I extract structured output (counts/links/text) without writing a mini-browser framework?
5. **Performance**: rough end-to-end time for “open → wait → count → scroll x5 → count.”

### Cookie material (sensitive)
I used an exported **Netscape-format** cookie file for X.

To export cookies, I used the Chrome extension **“Get cookies.txt locally”**:
- https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc

I’m not publishing the cookie contents (obviously). But what matters is that the same cookie material was used across tools wherever possible.

---

## Part 1 — Agent Browser (OpenClaw)

### Storage state handling (key detail)
Agent Browser requires the browser storage state to be loaded **at browser launch**.

If you try to apply cookies/state *after* the browser is already running, it will ignore it.

I generated a Playwright-ish state file:

- `tmp/twitter_state.json`

And then ran agent-browser with:

```bash
agent-browser --state tmp/twitter_state.json open "https://x.com/elonmusk"
```

### Counting posts (simple metric)
To avoid over-fitting to arbitrary HTML structure, I used a dumb but useful selector metric:

- Count visible tweets/posts via:

```bash
agent-browser get count "[data-testid='tweet']"
```

### Scrolling (N=5)
I used:

```bash
for i in 1 2 3 4 5; do
  agent-browser scroll down 1200
  sleep 0.4
done
```

### Results (agent-browser)
One concrete run on `https://x.com/elonmusk`:

- tweet count after initial load: **5**
- tweet count after 5 scrolls: **9**
- end-to-end time for the sequence: **~15 seconds**

This indicates:
- session worked well enough to render a real timeline
- scrolling worked
- extraction via selector was straightforward

### Notes / gotchas
- The tool runs a daemon; if it’s already running, `--state` can be ignored until you `agent-browser close`.
- If your initial `count` is 0, it may mean you’re blocked, not logged in, or the content is still loading.

---

## Part 2 — Camoufox (via `camofox-browser` + OpenClaw `camofox_*` tools)

### Why I tried it
X is extremely sensitive to automation fingerprints, and Camoufox is widely positioned as a “stealthy Firefox build” for scraping.

### Cookie import: the big footgun
I hit a confusing failure mode early:

- `camofox_import_cookies(...)` returned `403 Forbidden`.

At first glance, that looked like “cookie file format wrong” or “X blocked me.”

The real cause was more subtle:

> The camofox-browser server disables cookie injection unless `CAMOFOX_API_KEY` is set, and the server validates `Authorization: Bearer <CAMOFOX_API_KEY>`.

In my environment, the **OpenClaw gateway** and the **camofox-browser server** were running with *different* `CAMOFOX_API_KEY` values.

So the plugin *sent* an Authorization header… but the server rejected it because the key didn’t match.

Once I restarted the `camofox-browser` server so it inherited the same API key as OpenClaw, cookie import worked.

### Confirming authenticated state
After successful cookie import, I opened:

- `https://x.com/home`

The UI showed:
- my account menu
- the “What’s happening?” composer

This is a strong signal we’re actually authenticated, not just “seeing public content.”

### Profile timeline test: `https://x.com/elonmusk`
Using the Camoufox snapshot output, I could see the page structure including multiple `article` blocks and post metadata.

After scrolling, the snapshot showed deeper content (more articles), indicating infinite-scroll loading worked.

### Results (Camoufox via `camofox-browser`)
This is not an apples-to-apples metric vs `data-testid='tweet'` counts yet.

But in terms of practical outcomes:

- ✅ Cookie import succeeded (after fixing API key mismatch)
- ✅ Logged-in state confirmed on `/home`
- ✅ `/elonmusk` timeline loads
- ✅ Scrolling loads more posts

### Notes / gotchas
- The server process can be killed by the system (I saw a SIGKILL event in one run), so you need to ensure the server stays running.
- Once it’s stable, it looks like the most robust approach against X’s automation heuristics.

---

## Part 3 — Scrapling

### Why I expected Scrapling to do well
Scrapling advertises:

- HTTP fetchers with browser impersonation
- Browser-based dynamic fetchers (Playwright)
- “Stealth” options via `StealthyFetcher`

So it *should* be competitive.

### What I actually observed on X
Even with the same cookie material (converted into a Playwright-ish cookie list), my Scrapling runs against X were not usable.

I tested two modes:

1. **Static** HTTP:

```python
from scrapling.fetchers import Fetcher
resp = Fetcher.get("https://x.com/elonmusk", timeout=30)
html = resp.text
```

2. **Dynamic** browser automation:

```python
from scrapling.fetchers import DynamicFetcher
page = DynamicFetcher.fetch(
    "https://x.com/elonmusk",
    headless=True,
    timeout=20000,
    network_idle=False,
    cookies=cookies,
)
```

### Results (Scrapling)
In this environment, I got:

- HTTP 200 responses
- But **zero useful body** (length 0)
- No `data-testid="tweet"` markers

That effectively means “blocked / degraded / not rendering,” even if the status code looks fine.

### Hypothesis: cookies were not the deciding factor
The best explanation that fits the observations:

- Scrapling’s dynamic mode, as configured here, still presents a fingerprint that X degrades/blocks.
- “Cookies injected” can be true while “session accepted” is false.

To make Scrapling competitive on X, I likely need to:

- run with a real Chrome install (`real_chrome=True`) rather than bundled Chromium
- tune stealth / fingerprint settings
- potentially run in headful/virtual display mode
- capture and debug the real block page (screenshot + HTML)

---

## Interim conclusion (so far)

### If your goal is “search X and scrape results” locally
My current recommendation (based on the evidence above):

1. **Camoufox (via `camofox-browser`)** for robustness (best odds against anti-bot).
2. **agent-browser** when you want the simplest automation API and it isn’t blocked.
3. Treat **Scrapling** on X as “needs further tuning” rather than a drop-in solution.

### Why cookies worked in some tools but not Scrapling
Because X uses cookies *plus* fingerprint/automation heuristics.

The same cookies can be accepted in one browser context and silently downgraded in another.

---

## Reproducible benchmark protocol (v1)

Here’s the protocol I used (and will keep using) for apples-to-apples comparisons:

1. Start from a clean state:
   - For agent-browser: `agent-browser close`.
   - For camofox: ensure server is running and cookie import succeeded.

2. Open URL `https://x.com/elonmusk`.

3. Wait for at least one post/tweet marker.

4. Record initial count:
   - agent-browser: `get count [data-testid='tweet']`
   - camofox: (next step) run an `eval()` to count `document.querySelectorAll('[data-testid="tweet"]').length`

5. Scroll N times (N=5), fixed scroll distance (1200px), fixed delay (400ms).

6. Record final count.

7. Record elapsed wall-clock time.

The key improvement for v2 is to make the Camoufox path report the same metric as agent-browser (so we’re comparing like-for-like).

---

## Practical engineering notes (what bit me)

### 1) Cookie import is a security boundary
`camofox-browser` intentionally gates cookie injection behind an API key. That’s correct.

But it also means: **your automation can fail with a confusing 403 even when everything else is correct**.

If you’re running OpenClaw + `camofox-browser`, make sure:
- the server and OpenClaw plugin share the same `CAMOFOX_API_KEY`

### 2) “HTTP 200” can mean “blocked”
Scrapling returning HTTP 200 with empty body is exactly the kind of failure mode that makes scraping annoying.

The fix is always: screenshot + dump HTML + inspect the content for block markers.

### 3) Repo hygiene matters when you’re experimenting
While building this benchmark, I accidentally committed Python virtualenv binaries (`.venv/`) into my OpenClaw workspace repo.

That caused GitHub pushes to fail with “large file detected” errors (Playwright driver `node` binaries >100MB).

Lesson:
- Always `.gitignore` `.venv/` (and purge it from git history if you already committed it).

This is orthogonal to scraping, but extremely relevant to running experiments without sabotaging your own tooling.

---

## What’s next (to finish the experiment properly)

1. **Make the metric identical across all tools**
   - Camofox `eval()` to count `[data-testid='tweet']`
   - Extract the first N tweet URLs and texts in a consistent format

2. **Run the same protocol on X Search**
   - URL form: `https://x.com/search?q=<query>&src=typed_query&f=live` for Latest
   - Compare initial + after 5 scrolls counts

3. **Try to salvage Scrapling for X**
   - Install real Chrome and run `real_chrome=True`
   - Enable any documented stealth/patchright options
   - Capture screenshots and blocked HTML when it fails

4. **Add an accuracy/completeness rubric**
   - Are we seeing “complete” results or just a subset?
   - Does scrolling actually fetch more, or just reshuffle?
   - Do we get stable permalinks for each post?

---

## Appendix A — Commands and code (as used)

### Agent Browser (conceptual)

```bash
# Ensure state is applied at launch
agent-browser close
agent-browser --state tmp/twitter_state.json open "https://x.com/elonmusk"
agent-browser wait "[data-testid='tweet']"
agent-browser get count "[data-testid='tweet']"

for i in 1 2 3 4 5; do
  agent-browser scroll down 1200
  sleep 0.4
done

agent-browser get count "[data-testid='tweet']"
```

### Camofox cookie import (conceptual)

```ts
camofox_import_cookies({
  cookiesPath: "~/.camofox/cookies/twitter_cookies.txt",
  domainSuffix: "x.com",
})
```

### Scrapling minimal test (conceptual)

```python
import json
from scrapling.fetchers import Fetcher, DynamicFetcher

url = "https://x.com/elonmusk"

# Static
resp = Fetcher.get(url, timeout=30)
print(len(resp.text or ""))

# Dynamic
state = json.load(open("tmp/twitter_state.json"))
cookies = state.get("cookies", [])
page = DynamicFetcher.fetch(
    url,
    headless=True,
    timeout=20000,
    network_idle=False,
    cookies=cookies,
)
# Depending on Scrapling version, the API for pulling HTML differs.
```

---

## Further reading

- OpenClaw docs: https://docs.openclaw.ai
- Scrapling docs: https://scrapling.readthedocs.io/en/latest/index.html
- Scrapling GitHub: https://github.com/D4Vinci/Scrapling
- camofox-browser GitHub: https://github.com/jo-inc/camofox-browser
- Camoufox GitHub: https://github.com/daijro/camoufox
- Playwright: https://playwright.dev

- Background on why stealth browsers matter:
  - ScrapingBee: “How to Scrape With Camoufox to Bypass Antibot Technology” https://www.scrapingbee.com/blog/how-to-scrape-with-camoufox-to-bypass-antibot-technology/
