You are an autonomous benchmarking agent. Your task is to run a **local comparison benchmark** of three browser automation tools already installed on this machine:

* `agent-browser` (https://agent-browser.dev/)
* `camofox-browser` (https://clawtrove.com/skills/camofox-browser)
* `Scrapling` (https://github.com/D4Vinci/Scrapling)

Your goal is to produce **detailed, reproducible benchmark documentation** that a human editor can later distill into a blog post.
z  
## Objective

Determine which tool performs best for **scraping public content on anti-bot-heavy websites** in practical, real-world conditions.

The benchmark must prioritize:

1. **Anti-bot success rate**
2. **Time to successful scrape**
3. **Data quality/completeness**
4. **Stability over repeated runs**

## Sites to test

Test these 4 targets:

1. **X (Twitter)**
2. **Reddit**
3. **LinkedIn**
4. **Instagram (web)**

## Guardrails

* We will provide cookies that can be injected to simulate authenticated state
* Do **not** brute force logins, solve account security challenges manually, or perform high-volume scraping.
* Keep request volume low and consistent across tools.
* Do not change account settings or post content.
* If a site blocks access, record the failure and continue.

## What to benchmark (core metrics)

### 1) Anti-bot success rate (headline metric)

For each tool and each site, measure:

* **Success**: reached target page and extracted expected fields
* **Blocked/Challenged**: CAPTCHA, challenge page, suspicious activity screen, forced login wall
* **Partial**: page loaded but missing key content or only placeholders

Report:

* Success count / total attempts
* Block/challenge count / total attempts
* Partial count / total attempts

### 2) Time to successful scrape

Measure timing for each attempt:

* **Cold start time** (fresh process/session)
* **Warm run time** (reusing session)
* **Total time to successful extraction**
* **P95 successful scrape time** per site/tool

Important:

* Report timing for **successful runs**
* Track failures separately (don’t hide them inside average timings)

### 3) Data quality/completeness

For each successful scrape, evaluate whether the tool extracted expected fields correctly.

Use a per-site expected field checklist (examples below) and score:

* **Completeness %** = extracted fields / expected fields
* **Correctness %** = correctly extracted fields / expected fields (spot-check against page content)

### 4) Stability over repeated runs

Run repeated attempts and measure:

* **Timeout rate**
* **Crash rate**
* **Retry-needed rate**
* **Success degradation over time** (e.g., first 5 runs vs last 5 runs)

## Test design

## Run structure

For each **tool × site** pair:

1. **Cold run**

   * Start from a fresh process/session
   * Perform one scrape attempt
   * Record metrics

2. **Warm repeated runs**

   * Reuse the same session/profile when supported
   * Run **10 repeated attempts** on the same page type
   * Record metrics per run

3. **Optional second page type** (if time permits)

   * Run a second page type on the same site (e.g., profile page vs post page)

Use the same:

* machine
* network
* proxy configuration (or no proxy)
* account/cookie state
* time window (as much as possible)

## Page types to test (recommended)

Choose one primary page type per site for fairness and simplicity:

### X (Twitter)

* Public **post page** (single tweet/post)
* Expected fields:

  * post text
  * author handle
  * timestamp
  * canonical URL

### Reddit

* Public **post page** (with comments visible if possible)
* Expected fields:

  * post title
  * post body (if present)
  * subreddit
  * author
  * timestamp
  * canonical URL

### LinkedIn

* Public **job posting page** or public **company page**
* Expected fields:

  * title/company
  * location (if visible)
  * page URL
  * key visible metadata (job/company details)

### Instagram

* Public **post page** or **public profile page**
* Expected fields:

  * username
  * post caption (if post page)
  * timestamp (if visible)
  * canonical URL

## How to execute each attempt

For every attempt, the agent must:

1. Record metadata:

   * tool name
   * site
   * page type
   * attempt number
   * cold/warm
   * timestamp
   * session/profile identifier (if applicable)

2. Start timer

3. Execute the scrape flow:

   * open page
   * wait for stable content
   * perform any required scrolling/clicks (minimal)
   * extract expected fields

4. Stop timer

5. Classify outcome:

   * success
   * blocked/challenged
   * partial
   * timeout
   * crash/error

6. Save artifacts for the attempt:

   * screenshot (success or failure)
   * raw extracted data (JSON/text)
   * error/log output
   * any snapshot/DOM/accessibility output available from the tool

## Tool-specific notes (use these strengths, don’t ignore them)

### agent-browser

Use it in a way that reflects its strengths:

* ref-based snapshots
* compact text output
* session reuse
* profiling/tracing if available

Capture:

* snapshot output (or equivalent)
* timing
* any profiler trace if supported

### camofox-browser

Use features relevant to anti-bot benchmarking:

* built-in anti-detection browser mode
* cookie import/session reuse if available locally
* structured logs

Capture:

* logs
* page result classification
* session behavior across repeated runs

### Scrapling

Test the mode most relevant to anti-bot pages (and note which mode was used):

* dynamic browser fetcher
* stealth fetcher/session (if applicable)

Capture:

* whether blocked-request detection/retry triggers
* retry behavior
* extracted content completeness
* timing and resource usage if visible

## Standardized scoring (for internal documentation)

After all runs, compute these per **tool × site** and overall:

### Core scores

* **Success Rate (%)**
* **Challenge/Block Rate (%)**
* **Partial Rate (%)**
* **Avg Successful Scrape Time (s)**
* **P95 Successful Scrape Time (s)**
* **Data Completeness (%)**
* **Correctness Spot-Check (%)**
* **Stability Score** (based on crashes/timeouts/retries)

### Recommended overall weighted score

Use this for ranking, but also report raw metrics:

* **40%** Anti-bot success rate
* **25%** Data quality/completeness
* **20%** Time to successful scrape
* **15%** Stability over repeated runs

## Required output artifacts (documentation)

Produce a **single detailed benchmark report** in clear markdown-style prose with these sections:

# Browser Automation Anti-Bot Benchmark Report

## 1. Test setup

Include:

* machine specs (CPU/RAM/OS)
* network conditions
* whether logged-in sessions/cookies were used
* date/time window
* tools and versions tested
* any configuration differences between tools

## 2. Benchmark methodology

Include:

* sites tested
* page types
* expected fields per site
* number of cold/warm runs
* how outcomes were classified (success/partial/blocked/etc.)

## 3. Per-tool results

For each tool:

* short summary of behavior
* site-by-site outcomes
* strengths/weaknesses observed
* any setup friction or quirks

## 4. Per-site results

For each site:

* compare all 3 tools
* include which tool succeeded most often
* include timing comparison
* include data completeness comparison
* include notable failure patterns (challenges, login walls, timeouts)

## 5. Stability findings

Summarize:

* repeated-run reliability
* degradation over time
* retries/crashes/timeouts
* session persistence observations

## 6. Final ranking

Provide:

* best overall
* best for anti-bot success
* fastest successful scraper
* most stable for repeated local runs

## 7. Raw appendix

Include:

* all per-attempt logs/records
* screenshots paths
* extracted field samples
* error snippets
* exact commands/flows used (enough for reproducibility)

## Output quality requirements

* Be detailed and concrete.
* Use exact numbers, not vague statements.
* Include both wins and failures.
* Do not hide failed attempts.
* Note uncertainty when a result may have been influenced by site/account/IP conditions.
* Keep the tone neutral and evidence-based.

## Important benchmarking fairness rules

* Use the same target URL(s) across all tools for each site.
* Use the same extraction goals across all tools.
* Keep interaction flow minimal and consistent.
* Avoid “hand-tuning” one tool more than others unless documented.
* If one tool requires extra configuration to work, document that setup effort.

## If blocked or a test cannot be completed

If a site blocks all tools, or a test cannot be completed:

* Record the exact failure mode
* Save screenshot/logs
* Mark the result as inconclusive for that site
* Continue the rest of the benchmark

Do not stop the benchmark because one site fails.

