---
title: "I Benchmarked 3 Browser Automation Tools Against Sites That Don't Want to Be Scraped"
description: "Comparing agent-browser, Camoufox, and Scrapling across three test modes: with cookies, without cookies, and headless. Only one tool survived all three."
date: "Mar 04 2026"
---

**TL;DR:** I tested three browser automation tools ([agent-browser](https://github.com/vercel-labs/agent-browser), [Camoufox](https://github.com/jo-inc/camofox-browser), and [Scrapling](https://github.com/D4Vinci/Scrapling)) against X, Reddit, LinkedIn, and Instagram under three conditions: headed with cookies, headed without cookies, and headless with cookies. With cookies in headed mode, all three scored 100%. Remove the cookies or switch to headless and only Camoufox holds at 100%. Agent-browser drops to 60% without cookies and 13% headless. Scrapling drops to 60% in both harder modes due to intermittent navigation timeouts.

## Why this comparison

If you're building anything that touches the real web (monitoring, data collection, testing against production sites) you've probably noticed that "just use Playwright" doesn't cut it anymore. Major sites fingerprint automated browsers and serve degraded content or outright block them.

A new generation of tools has emerged to deal with this. They take different approaches: patched browser engines, custom protocols, fingerprint spoofing at the C++ level. But which ones actually work? Marketing pages will tell you they all do. I wanted numbers.

So I picked three tools with fundamentally different stealth strategies and ran them against four sites that actively resist automation. The first round of testing (with pre-authenticated cookies) showed no differences — all three scored 100%. That prompted me to test under harder conditions: without cookies and in headless mode. That's where the real story emerged.

## The contenders

| Tool | Engine | Stealth approach |
|------|--------|-----------------|
| [agent-browser](https://github.com/vercel-labs/agent-browser) | Chromium via Playwright | No built-in anti-bot. Stock browser with daemon-based session persistence. |
| [Camoufox](https://github.com/jo-inc/camofox-browser) | Firefox fork | C++-level fingerprint spoofing, Juggler protocol (invisible to page JS), cursor humanization. |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | Chromium via Patchright | Stealth-patched Playwright fork. Patches WebDriver flags, navigator overrides. |

These sit at different points on the stealth spectrum. Agent-browser doesn't try to hide at all; it's a stock Chromium instance. Scrapling patches the known detection vectors in Chromium. Camoufox goes furthest, forking Firefox itself and spoofing fingerprints at the browser engine level.

## What we tested

Each tool hit five URLs, three times each, under three different modes — 45 attempts per mode, 135 total:

| Site | Page type | What we extracted |
|------|-----------|-------------------|
| [X (Twitter)](https://x.com/jack/status/20) | Post | Tweet text, author, timestamp, URL |
| [Reddit](https://www.reddit.com/r/Python/comments/g53lxf/) | Post | Title, subreddit, author, URL |
| [LinkedIn](https://www.linkedin.com/company/microsoft/) | Company page | Company name, location, URL, metadata |
| [Instagram](https://www.instagram.com/instagram/) | Profile | Username, URL |
| [example.com](https://example.com) | Control | Page title |

The control site (example.com) has no anti-bot protection. If a tool fails there, the problem is the tool, not detection.

**The three modes:**

- **Headed + cookies** — the easy test. Pre-authenticated cookies, visible browser window. Simulates a logged-in user browsing normally.
- **Headed + no cookies** — the stealth test. No cookies, no pre-existing session. Can the tool access content unauthenticated, or does the site gate it?
- **Headless + cookies** — the headless detection test. Cookies are present, but the browser runs headless. Can sites detect the headless environment despite having valid session cookies?

For each attempt, the benchmark navigates to the URL, waits for JS rendering, captures the page HTML and screenshot, then runs a three-layer extraction pipeline (JSON-LD, Open Graph, regex fallback) to pull structured data. Extracted fields are validated against known ground truth values.

## Results: the easy test (headed + cookies)

| Tool | Sites passed (3/3) | Total attempts | Overall |
|------|:------------------:|:--------------:|:-------:|
| **agent-browser** | **5/5** | **15/15** | **100%** |
| **Camoufox** | **5/5** | **15/15** | **100%** |
| **Scrapling** | **5/5** | **15/15** | **100%** |

All three tools achieved perfect scores. Every site, every attempt, correct data extracted. This is the baseline — it tells you that the benchmark works and the extraction pipeline is sound, but it doesn't differentiate the tools at all.

With pre-authenticated cookies in headed mode, stealth doesn't matter. The sites see a valid session from what looks like a normal browser. Any tool can pass this test.

## Results: without cookies (headed + no cookies)

Remove the cookies and things get interesting.

| Tool | X | Reddit | LinkedIn | Instagram | Control | Total |
|------|:-:|:------:|:--------:|:---------:|:-------:|:-----:|
| **Camoufox** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **agent-browser** | 3/3 | 3/3 | 0/3 | 0/3 | 3/3 | **9/15 (60%)** |
| **Scrapling** | 2/3 | 2/3 | 1/3 | 2/3 | 2/3 | **9/15 (60%)** |

**Camoufox (100%)** passed every site including LinkedIn and Instagram without any cookies. Its Firefox engine and C++-level fingerprint spoofing made it indistinguishable from a regular browser, even without an authenticated session.

**Agent-browser (60%)** handled X and Reddit fine (both serve public content to unauthenticated users) but crashed on LinkedIn and Instagram. The failures were `browser-closed` errors — the tool itself crashed, not an anti-bot block. LinkedIn also had one soft-block (a "Join LinkedIn" gate). The control site passed perfectly, confirming the tool works when there's no adversarial environment.

**Scrapling (60%)** hit `navigation-timeout` errors intermittently across every site — including the control site (example.com). This isn't anti-bot detection; it's a reliability issue. When Scrapling didn't timeout, it extracted data correctly. But one-in-three attempts failing on a control site with no bot protection points to something in Scrapling's navigation pipeline, not in the target sites.

## Results: headless mode (headless + cookies)

Now give the cookies back, but switch to headless mode.

| Tool | X | Reddit | LinkedIn | Instagram | Control | Total |
|------|:-:|:------:|:--------:|:---------:|:-------:|:-----:|
| **Camoufox** | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | **15/15 (100%)** |
| **Scrapling** | 2/3 | 1/3 | 2/3 | 1/3 | 3/3 | **9/15 (60%)** |
| **agent-browser** | 0/3 | 0/3 | 1/3 | 1/3 | 0/3 | **2/15 (13%)** |

**Camoufox (100%)** was untouched. Headed or headless, cookies or not — it doesn't matter. 100% across all conditions.

**Scrapling (60%)** showed the same timeout pattern as the no-cookies test. The control site passed 3/3 this time, but other sites had intermittent `navigation-timeout` failures. The consistency of this pattern across modes suggests it's a tool-level reliability issue rather than headless detection.

**Agent-browser (13%)** nearly collapsed. It crashed with `browser-closed` errors on almost everything — including the control site (0/3 on example.com). These aren't anti-bot blocks; a site with zero bot protection shouldn't crash your tool. Agent-browser's headless mode appears to have fundamental stability issues. The two successes (one LinkedIn, one Instagram) look like lucky attempts rather than consistent behavior.

## The full picture

| Tool | Headed + Cookies | Headed + No Cookies | Headless + Cookies |
|------|:----------------:|:-------------------:|:------------------:|
| **Camoufox** | 100% | 100% | 100% |
| **agent-browser** | 100% | 60% | 13% |
| **Scrapling** | 100% | 60% | 60% |

The pattern is clear:

**Camoufox is the only tool that works under all conditions.** Whether you're running headed or headless, with cookies or without, it delivers 100%. The Firefox engine with C++-level fingerprint spoofing and the Juggler protocol (invisible to page JavaScript) gives it defenses that Chromium-based tools can't match through patches alone.

**Agent-browser only works in the easiest mode.** It's fine when you hand it cookies and a headed browser — but that's the scenario where stealth doesn't matter anyway. Without cookies it crashes on hardened sites. In headless mode it crashes on everything, including a control site with no bot protection. These are tool-level stability issues, not anti-bot detection.

**Scrapling has a reliability problem independent of stealth.** Its 60% score in both harder modes comes from intermittent `navigation-timeout` errors spread across all sites, including the control. When it works, it works correctly. But the timeouts are unpredictable and site-independent, suggesting an issue in Scrapling's navigation pipeline rather than in its stealth capabilities.

## Speed comparison

From the headed + cookies baseline where all tools succeeded, here's how fast they navigate:

| Site | agent-browser | Camoufox | Scrapling |
|------|:-------------:|:--------:|:---------:|
| X (Twitter) | **8.7s** | 10.8s | 19.0s |
| Reddit | 10.3s | **9.6s** | 19.3s |
| LinkedIn | **9.5s** | 12.0s | 17.0s |
| Instagram | **7.1s** | 9.8s | 15.7s |
| Control | **6.8s** | 9.0s | 13.0s |

Bold = fastest per site. Agent-browser is quickest on 4 of 5 sites, which makes sense since it's stock Chromium with no stealth overhead. Camoufox wins on Reddit. Scrapling is consistently 1.5-2x behind Camoufox.

Speed matters, but only when the tool actually works. Agent-browser's speed advantage is irrelevant if it crashes in headless mode. Camoufox trades a few seconds of navigation time for the only reliable performance across all conditions.

## Methodology

**Test matrix:** 3 tools x 5 sites x 3 attempts x 3 modes = 135 total attempts. The first attempt used a cold browser profile; subsequent ones were warm with a 2-second delay between them.

**Cookies:** All three tools got the same cookies, exported from a regular Chrome session using [Get cookies.txt locally](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) in Netscape format. One file per site. The "no cookies" mode omitted these entirely.

**Extraction:** Three-layer pipeline — JSON-LD structured data, Open Graph meta tags, regex fallback. Extracted fields are validated against ground truth (e.g., Jack's tweet text must contain "just setting up my twttr", Reddit author must be "iEslam"). The benchmark classifies each attempt as success, partial, blocked, timeout, or crash.

**Environment:** All tests ran from the same machine on a residential IP. No proxies, no IP rotation. This means the results reflect the tools' browser fingerprint stealth and reliability, not IP reputation. Sites with IP-level blocking (rate limiting, datacenter IP detection) would produce different results.

**Sample size:** 3 attempts per tool/site/mode combination. This is sufficient to show clear pass/fail patterns — a tool either works consistently or it doesn't — but not enough for statistically significant speed comparisons. Treat the timing numbers as directional, not precise.

Full benchmark code and results: [browser-automation-benchmark](https://github.com/Kahtaf/research/tree/main/browser-automation-benchmark)

## Further reading

- [agent-browser](https://github.com/vercel-labs/agent-browser) - Vercel Labs' Chromium automation tool
- [Camoufox](https://github.com/jo-inc/camofox-browser) - Firefox fork with C++-level fingerprint spoofing
- [Scrapling](https://github.com/D4Vinci/Scrapling) - Stealth browser automation via Patchright
- [Patchright](https://github.com/AresS31/patchright) - Stealth-patched Playwright fork
- [Get cookies.txt locally](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) - Chrome extension for exporting cookies in Netscape format
