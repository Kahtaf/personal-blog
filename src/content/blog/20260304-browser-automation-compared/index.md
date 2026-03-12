---
title: "Scrapers vs. Sites That Don't Want to Be Scraped"
description: "Comparing agent-browser, Camoufox, and Scrapling to find the best stealth scraper for AI agents."
date: "Mar 04 2026"
---

**TL;DR:** I tested three tools with different stealth strategies: [agent-browser](https://github.com/vercel-labs/agent-browser) (stock Chromium), [Scrapling](https://github.com/D4Vinci/Scrapling) (stealth-patched Chromium via Patchright), and [Camoufox](https://github.com/jo-inc/camofox-browser) (a Firefox fork with C++-level fingerprint spoofing). When we provide authenticated cookies in a headful environment, all three did well. However, without authentication or in a headless environment: Camoufox came out on top.

## Why this comparison exists

AI agents are browsing the web now. Tools like [OpenClaw](https://openclaw.ai/) let agents control browsers easily, and both [Camoufox](https://github.com/openclaw/skills/tree/main/skills/goodgoodjm/camoufox) and [agent-browser](https://github.com/openclaw/skills/blob/main/skills/thesethrose/agent-browser/SKILL.md) are available as OpenClaw skills. But when an agent hits anti-bot detection, it's stuck. It can't solve a CAPTCHA or click through a login wall. Browsers can deploy stealth tactics to emulate a real user to get around this.

I picked three tools with different stealth strategies and ran them against four sites that actively fight automation. Tested with cookies, without cookies, and headless, and here's what holds up.

## The contenders

| Tool | Version | Engine | Stealth approach |
|------|---------|--------|-----------------|
| [agent-browser](https://github.com/vercel-labs/agent-browser) | 0.15.1 | Chromium (Playwright 1.56.0) | No built-in anti-bot mechanisms. Stock browser with daemon-based session persistence. |
| [Camoufox](https://github.com/jo-inc/camofox-browser) | 0.4.11 (Firefox 135.0.1) | Firefox fork | C++-level fingerprint spoofing, Juggler protocol (invisible to page JS), cursor humanization. |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | 0.4.1 | Chromium (Patchright 1.56.0) | Stealth-patched Playwright fork. Patches WebDriver flags, navigator overrides. |

These sit at different points on the stealth spectrum. Agent-browser doesn't try to hide at all; it's a stock Chromium instance. Scrapling patches the known detection vectors in Chromium. Camoufox goes furthest, forking Firefox itself and spoofing fingerprints at the browser engine level.

Here's what launching a browser looks like with each tool:

```python
# agent-browser - CLI-driven, uses subprocess commands
subprocess.run(["agent-browser", "--session", "my-session",
                "--state", "storage.json", "open", url])

# Camoufox - Python context manager with sync API
from camoufox.sync_api import Camoufox
with Camoufox(headless=False, humanize=True) as browser:
    page = browser.new_context().new_page()
    page.goto(url)

# Scrapling - session-based fetcher
from scrapling.fetchers import StealthySession
with StealthySession(user_data_dir="./profile", cookies=cookies) as session:
    response = session.fetch(url, headless=False)
```

## What I tested

Each tool hit five URLs, three times each, under three different modes. A caveat on sample size: n=3 per combination is enough to reveal clear pass/fail patterns (a tool either works or it doesn't) but not enough for statistically significant conclusions. Treat the percentages as directional: they show trends, not precise rates.

| Site | Page type | What we extracted |
|------|-----------|-------------------|
| [X (Twitter)](https://x.com/jack/status/20) | Post | Tweet text, author, timestamp, URL |
| [Reddit](https://www.reddit.com/r/Python/comments/g53lxf/) | Post | Title, subreddit, author, URL |
| [LinkedIn](https://www.linkedin.com/company/microsoft/) | Company page | Company name, location, URL, metadata |
| [Instagram](https://www.instagram.com/instagram/) | Profile | Username, URL |
| [example.com](https://example.com) | Control | Page title |

The control site (example.com) has no anti-bot protection. If a tool fails there, the problem is the tool, not detection.

**The three modes:**

- **Headed + cookies:** the easy test. Pre-authenticated cookies, visible browser window. Simulates a logged-in user browsing normally.
- **Headed + no cookies:** the stealth test. No cookies, no pre-existing session. Can the tool access content unauthenticated, or does the site gate it?
- **Headless + cookies:** the headless detection test. Cookies are present, but the browser runs headless. Can sites detect the headless environment despite having valid session cookies?

For each attempt, the benchmark navigates to the URL, waits for JS rendering, captures the page HTML and screenshot, then attempts to pull structured data. Extracted fields are validated against known ground truth values.

This benchmark did not run synthetic fingerprint detection tests (via something like CreepJS, BotD, or Sannysoft). It only measures whether tools can load and extract data from real sites. A tool could ace fingerprint test pages and still fail on production sites, or vice versa. The two measure different things.

## Results: the easy test (headed + cookies)

With pre-authenticated cookies in headed mode, every tool navigated to every site successfully.

| Tool | X | Reddit | LinkedIn | Instagram | Control | Total |
|------|:-:|:------:|:--------:|:---------:|:-------:|:-----:|
| **Camoufox** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **Scrapling** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **agent-browser** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |

This confirms the benchmark and extraction pipeline work, but doesn't differentiate the tools. When sites see a valid session from what looks like a normal browser, stealth doesn't matter.

## Results: without cookies (headed + no cookies)

Remove the cookies and the differences start showing.

| Tool | X | Reddit | LinkedIn | Instagram | Control | Total |
|------|:-:|:------:|:--------:|:---------:|:-------:|:-----:|
| **Camoufox** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **Scrapling** | 3/3 | 3/3 | 3/3 | 0/3 | 3/3 | **12/15 (80%)** |
| **agent-browser** | 3/3 | 0/3 | 3/3 | 0/3 | 3/3 | **9/15 (60%)** |

**Camoufox (100%)** passed every site including Instagram without any cookies. Its Firefox engine and C++-level fingerprint spoofing made it indistinguishable from a regular browser, with no login redirects or challenges.

**Scrapling (80%)** handled X, Reddit, and LinkedIn cleanly but was redirected to Instagram's login page. Reddit is notable: Scrapling loaded the full post with comments while agent-browser hit a CAPTCHA on the same page, showing that Patchright's stealth patches make a real difference on Chromium.

**Agent-browser (60%)** was blocked on two sites. Reddit served a "Prove your humanity" reCAPTCHA page, and Instagram redirected to its login page. Stock Chromium without stealth patches is detected by both sites' anti-bot systems.

LinkedIn showed a "Sign in to see who you already know" modal for both Chromium tools, but the underlying page content and meta tags were still accessible, and the extraction checks passed. This is a gray area: the data is technically extractable, but the user experience is a login wall.

## Results: headless mode (headless + cookies)

Now give the cookies back, but switch to headless mode.

| Tool | X | Reddit | LinkedIn | Instagram | Control | Total |
|------|:-:|:------:|:--------:|:---------:|:-------:|:-----:|
| **Camoufox** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **Scrapling** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **agent-browser** | 3/3 | 0/3 | 3/3 | 3/3 | 3/3 | **12/15 (80%)** |

**Camoufox (100%)** was untouched. Headed or headless, cookies or not, it doesn't matter.

**Scrapling (100%)** matched Camoufox across the board. Its Patchright-based stealth patches handle headless mode correctly, with no detection and no failures. Instagram worked here because cookies were present (unlike the no-cookies test where it redirected to login).

**Agent-browser (80%)** was blocked by Reddit's network security ("You've been blocked by network security"), even with valid cookies. Reddit detects headless Chromium regardless of session state. Every other site including the control passed cleanly. The cookies prevented Instagram's login redirect that appeared in the no-cookies test.

## The full picture

| Tool | Headed + Cookies | Headed + No Cookies | Headless + Cookies |
|------|:----------------:|:-------------------:|:------------------:|
| **Camoufox** | 100% | 100% | 100% |
| **Scrapling** | 100% | 80% | 100% |
| **agent-browser** | 100% | 60% | 80% |

**Camoufox is the only tool that works under all conditions.** Whether you're running headed or headless, with cookies or without, it delivers 100%. The Firefox engine with C++-level fingerprint spoofing and the Juggler protocol (invisible to page JavaScript) gives it defenses that Chromium-based tools can't match through patches alone.

**Scrapling is strong but not bulletproof.** It scored 100% in headed+cookies and headless modes, but dropped to 80% without cookies due to Instagram's login redirect. Where it shines is Reddit: it loaded the full post in every mode, including headless, while agent-browser was blocked. Patchright's stealth patches clearly make a difference within the Chromium ecosystem.

**Agent-browser struggles outside the easy mode.** Without cookies, Reddit's CAPTCHA and Instagram's login redirect brought it to 60%. In headless, Reddit blocked it outright ("You've been blocked by network security") even with valid cookies. Stock Chromium without stealth patches is simply detected by sites with serious anti-bot measures.

## When to use what

**Use Camoufox** if stealth is your primary concern, especially for headless or unauthenticated scraping. It's the only tool here that worked in every condition. The trade-off: it's a Firefox fork, so you don't get Chromium DevTools Protocol (CDP). If your workflow depends on CDP-specific features, you'll need to adapt.

**Use Scrapling** if you want Chromium with stealth patches. Its Patchright foundation handles headless mode perfectly and bypasses Reddit's anti-bot where stock Chromium fails. It's the simplest to install (`pip install scrapling`). The trade-off: Instagram blocks it without cookies.

**Use agent-browser** if you need a simple automation layer and will always run headed with valid cookies. It has a clean CLI interface. Don't expect it to survive hostile environments. Reddit blocks it in both no-cookies and headless modes.

**General caveats:** All three tools are actively developed, and results may differ with newer versions. Camoufox's setup is slightly more involved (it downloads its own Firefox binary). Agent-browser requires a running daemon. Scrapling is the simplest to install (`pip install scrapling`).

## Methodology

3 tools x 5 sites x 3 attempts x 3 modes = 135 total attempts. All three tools got the same cookies, exported from a regular Chrome session using [Get cookies.txt locally](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) in Netscape format, omitted entirely for "no cookies" mode. Extraction used a three-layer pipeline (JSON-LD, Open Graph, regex fallback) validated against ground truth, classifying each attempt as success, partial, blocked, timeout, or crash. All tests ran on the same machine, residential IP, no proxies — so these results reflect browser fingerprint stealth, not IP reputation.

Full benchmark code and results: [browser-automation-benchmark](https://github.com/Kahtaf/research/tree/main/browser-automation-benchmark)

## Further reading

- [agent-browser](https://github.com/vercel-labs/agent-browser) - Vercel Labs' Chromium automation tool
- [Camoufox](https://github.com/jo-inc/camofox-browser) - Firefox fork with C++-level fingerprint spoofing
- [Scrapling](https://github.com/D4Vinci/Scrapling) - Stealth browser automation via Patchright
- [Patchright](https://github.com/AresS31/patchright) - Stealth-patched Playwright fork
- [Get cookies.txt locally](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) - Chrome extension for exporting cookies in Netscape format
