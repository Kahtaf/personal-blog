---
title: "I Benchmarked 3 Browser Automation Tools Against Sites That Don't Want to Be Scraped"
description: "Comparing agent-browser, Camoufox, and Scrapling on X, Reddit, LinkedIn, and Instagram — which ones get through, and how fast."
date: "Mar 04 2026"
---

**TL;DR:** I tested three browser automation tools — [agent-browser](https://github.com/vercel-labs/agent-browser) (Vercel Labs), [Camoufox](https://github.com/jo-inc/camofox-browser), and [Scrapling](https://github.com/D4Vinci/Scrapling) — against X, Reddit, LinkedIn, and Instagram to see which ones could reliably load pages and extract structured data without getting blocked. Camoufox and Scrapling both scored 100%. Agent-browser got 80%, failing only on X's tweet text. Camoufox was the fastest by a wide margin.

## Why this comparison

If you're building anything that touches the real web — monitoring, data collection, testing against production sites — you've probably noticed that "just use Playwright" doesn't cut it anymore. Major sites fingerprint automated browsers and serve degraded content or outright block them.

A new generation of tools has emerged to deal with this. They take different approaches: patched browser engines, custom protocols, fingerprint spoofing at the C++ level. But which ones actually work? Marketing pages will tell you they all do. I wanted numbers.

So I picked three tools with fundamentally different stealth strategies and ran them against four sites that actively resist automation.

## The contenders

| Tool | Engine | Stealth approach |
|------|--------|-----------------|
| [agent-browser](https://github.com/vercel-labs/agent-browser) | Chromium via Playwright | No built-in anti-bot. Stock browser with daemon-based session persistence. |
| [Camoufox](https://github.com/jo-inc/camofox-browser) | Firefox fork | C++-level fingerprint spoofing, Juggler protocol (invisible to page JS), cursor humanization. |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | Chromium via Patchright | Stealth-patched Playwright fork. Patches WebDriver flags, navigator overrides. |

These sit at different points on the stealth spectrum. Agent-browser doesn't try to hide at all — it's a stock Chromium instance. Scrapling patches the known detection vectors in Chromium. Camoufox goes furthest, forking Firefox itself and spoofing fingerprints at the browser engine level.

## What we tested

Each tool hit five URLs, three times each, in headed mode:

| Site | Page type | What we extracted |
|------|-----------|-------------------|
| [X (Twitter)](https://x.com/jack/status/20) | Post | Tweet text, author, timestamp, URL |
| [Reddit](https://www.reddit.com/r/Python/comments/g53lxf/) | Post | Title, subreddit, author, URL |
| [LinkedIn](https://www.linkedin.com/company/microsoft/) | Company page | Company name, location, URL, metadata |
| [Instagram](https://www.instagram.com/instagram/) | Profile | Username, URL |
| [example.com](https://example.com) | Control | Page title |

The control site (example.com) has no anti-bot protection. If a tool fails there, the problem is setup, not detection.

For each attempt, the benchmark navigates to the URL, waits for JS rendering, captures the page HTML and screenshot, then runs a three-layer extraction pipeline (JSON-LD, Open Graph, regex fallback) to pull structured data. Extracted fields are validated against known ground truth values.

## Results

### Who got through

| Tool | Sites passed (3/3) | Total attempts | Overall |
|------|:------------------:|:--------------:|:-------:|
| **Camoufox** | **5/5** | **15/15** | **100%** |
| **Scrapling** | **5/5** | **15/15** | **100%** |
| agent-browser | 4/5 | 12/15 | 80% |

Camoufox and Scrapling both achieved perfect scores — every site, every attempt, 100% correctness against ground truth.

Agent-browser's only failure was X. It loaded the page and extracted the author handle, timestamp, and URL correctly, but consistently missed the tweet text itself. This looks like an extraction issue rather than a block — the page loaded, the data was partially there, but the tweet content wasn't accessible to the extractor.

### How fast

Navigation time isolates page load and JS rendering, stripping out tool setup overhead:

| Site | agent-browser | Camoufox | Scrapling |
|------|:-------------:|:--------:|:---------:|
| X (Twitter) | — | **10.8s** | 19.0s |
| Reddit | 10.3s | **9.6s** | 19.3s |
| LinkedIn | **9.5s** | 12.0s | 17.0s |
| Instagram | **7.1s** | 9.8s | 15.7s |
| Control | **6.8s** | 9.0s | 13.0s |

Bold = fastest per site. Agent-browser is quickest on 3 of the 4 sites where it succeeds, which makes sense — it's running stock Chromium with no stealth overhead. Camoufox wins on X and Reddit.

Scrapling is consistently the slowest, running 1.5-2x behind Camoufox across all sites. Patchright's stealth patches appear to add meaningful overhead to the Chromium startup and navigation pipeline.

### What each tool actually extracted

Here's the raw data from the first attempt on each site, so you can see exactly what came back.

**X (Twitter)** — Jack Dorsey's first tweet:

| Field | Camoufox | Scrapling | agent-browser |
|-------|----------|-----------|---------------|
| post_text | "just setting up my twttr" | "just setting up my twttr" | *missing* |
| author_handle | jack | jack | jack |
| timestamp | 3:50 PM - Mar 21, 2006 | 3:50 PM - Mar 21, 2006 | 3:50 PM - Mar 21, 2006 |
| canonical_url | x.com/jack/status/20 | x.com/jack/status/20 | x.com/jack/status/20 |

**Reddit, LinkedIn, Instagram** — all three tools returned identical, correct data. No differences worth showing in a table.

### Stability

All outcomes were deterministic across 3 attempts. No flaky results. Navigation time standard deviations stayed under 1 second (median stdev: 0.17s). Anti-bot decisions appear to be fingerprint and reputation-based, not probabilistic — you either pass or you don't, and the answer doesn't change between runs.

| Metric | agent-browser | Camoufox | Scrapling |
|--------|:-------------:|:--------:|:---------:|
| Stability score | 100% | 100% | 100% |
| Nav time stdev (typical) | 0.04-0.14s | 0.08-0.98s | 0.03-0.21s |
| Setup overhead | ~3.5s | ~2.5s | ~0.5s |

Setup overhead covers browser launch, cookie import, and post-capture steps. Agent-browser's higher overhead comes from its CLI architecture (multiple sequential commands per attempt). Scrapling has the lowest setup cost at ~0.5s.

## What the numbers mean

**Camoufox is the best all-rounder.** Perfect success rate, fastest navigation on the toughest sites, and the deepest stealth approach. The Firefox engine with C++-level fingerprint spoofing and the Juggler protocol (which is invisible to page JavaScript) gives it an edge that Chromium-based tools can't match through patches alone. If you're choosing one tool, this is the one.

**Scrapling is the reliable Chromium option.** It matched Camoufox's perfect success rate despite being Chromium-based. If your workflow depends on Chrome-specific behavior or you need the Chromium DevTools protocol, Scrapling delivers — you'll just pay a speed penalty. Navigation times run about 1.5-2x slower than Camoufox.

**Agent-browser is fast but incomplete.** Its stock Chromium approach means it's the fastest on most sites (no stealth overhead), but it lacks the evasion needed for X's anti-bot measures. The tweet text extraction failure was consistent across all 3 attempts — not a fluke. For sites that don't actively resist automation, it's a solid choice. For adversarial environments, it's not enough.

**A surprise: no site fully blocked any tool.** LinkedIn loads reCAPTCHA Enterprise scripts as standard page infrastructure, but this didn't translate to active blocking — all three tools extracted complete data. Reddit and Instagram served content without challenge pages. The differentiation came down to *completeness* of extraction, not whether the page loaded at all.

## Methodology

Each tool/site combination ran 3 attempts in headed mode (some tools, like Camoufox's cursor humanization, only work headed). The first attempt used a cold profile; subsequent ones were warm with a 2-second delay between them.

The extraction pipeline runs three layers: JSON-LD structured data, Open Graph meta tags, and regex fallback. Extracted fields are validated against ground truth (e.g., Jack's tweet text must contain "just setting up my twttr", Reddit author must be "iEslam").

The benchmark classifies each attempt as success, partial, blocked, timeout, or crash. Correctness is only reported for successful outcomes.

Full benchmark code and results: [browser-automation-benchmark](https://github.com/Kahtaf/research/tree/main/browser-automation-benchmark)

## Further reading

- [agent-browser](https://github.com/vercel-labs/agent-browser) — Vercel Labs' Chromium automation tool
- [Camoufox](https://github.com/jo-inc/camofox-browser) — Firefox fork with C++-level fingerprint spoofing
- [Scrapling](https://github.com/D4Vinci/Scrapling) — Stealth browser automation via Patchright
- [Patchright](https://github.com/AresS31/patchright) — Stealth-patched Playwright fork
