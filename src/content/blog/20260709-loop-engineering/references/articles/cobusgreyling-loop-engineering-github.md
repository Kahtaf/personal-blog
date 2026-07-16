---
title: "GitHub - cobusgreyling/loop-engineering: Practical patterns, starters &amp; CLI tools for loop engineering with AI coding agents. Design systems that prompt and orchestrate agents (inspired by Addy Osmani and Boris Cherny). Includes loop-audit, loop-init, loop-cost. \u00b7 GitHub"
url: "https://github.com/cobusgreyling/loop-engineering"
final_url: "https://github.com/cobusgreyling/loop-engineering"
retrieved: 2026-07-09
content_type: "text/html; charset=utf-8"
source_type: article
---

GitHub - cobusgreyling/loop-engineering: Practical patterns, starters & CLI tools for loop engineering with AI coding agents. Design systems that prompt and orchestrate agents (inspired by Addy Osmani and Boris Cherny). Includes loop-audit, loop-init, loop-cost. · GitHub 

Skip to content 

Navigation Menu 
Toggle navigation 

Sign in 
Appearance settings 

Platform 

AI CODE CREATION 

GitHub Copilot Write better code with AI 

GitHub Copilot app Direct agents from issue to merge 

MCP Registry New Integrate external tools 

DEVELOPER WORKFLOWS 

Actions Automate any workflow 

Codespaces Instant dev environments 

Issues Plan and track work 

Code Review Manage code changes 

APPLICATION SECURITY 

GitHub Advanced Security Find and fix vulnerabilities 

Code security Secure your code as you build 

Secret protection Stop leaks before they start 

EXPLORE 
Why GitHub 

Documentation 

Blog 

Changelog 

Marketplace 

View all features 

Solutions 

BY COMPANY SIZE 
Enterprises 

Small and medium teams 

Startups 

Nonprofits 

BY USE CASE 
App Modernization 

DevSecOps 

DevOps 

CI/CD 

View all use cases 

BY INDUSTRY 
Healthcare 

Financial services 

Manufacturing 

Government 

View all industries 

View all solutions 

Resources 

EXPLORE BY TOPIC 
AI 

Software Development 

DevOps 

Security 

View all topics 

EXPLORE BY TYPE 
Customer stories 

Events & webinars 

Ebooks & reports 

Business insights 

GitHub Skills 

SUPPORT & SERVICES 
Documentation 

Customer support 

Community forum 

Trust center 

Partners 

View all resources 

Open Source 

COMMUNITY 

GitHub Sponsors Fund open source developers 

PROGRAMS 
Security Lab 

Maintainer Community 

Accelerator 

GitHub Stars 

Archive Program 

REPOSITORIES 
Topics 

Trending 

Collections 

Enterprise 

ENTERPRISE SOLUTIONS 

Enterprise platform AI-powered developer platform 

AVAILABLE ADD-ONS 

GitHub Advanced Security Enterprise-grade security features 

Copilot for Business Enterprise-grade AI features 

Premium Support Enterprise-grade 24/7 support 

Pricing 

Search or jump to... 

Search code, repositories, users, issues, pull requests... 

Search 

Clear 

Search syntax tips 

Provide feedback 

We read every piece of feedback, and take your input very seriously. 
Include my email address so I can be contacted 

Cancel Submit feedback 

Saved searches 

Use saved searches to filter your results more quickly 

Name 

Query 

To see all available qualifiers, see our documentation . 

Cancel Create saved search 

Sign in 
Sign up 
Appearance settings 

Resetting focus 

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert 

{{ message }} 

cobusgreyling / loop-engineering Public 

Notifications You must be signed in to change notification settings 

Fork 865 

Star 6.8k 

Code 

Issues 21 

Pull requests 2 

Discussions 

Actions 

Projects 

Security and quality 0 

Insights 

Additional navigation options 

Code 

Issues 

Pull requests 

Discussions 

Actions 

Projects 

Security and quality 

Insights 

cobusgreyling/loop-engineering 

main 

Branches Tags 

Go to file 

Code 
Open more actions menu 

Folders and files 

Name Name 
Last commit message 

Last commit date 

Latest commit 

History 
191 Commits 

191 Commits 

.github 

.github 

assets 

assets 

docs 

docs 

examples 

examples 

patterns 

patterns 

resources 

resources 

scripts 

scripts 

skills 

skills 

starters 

starters 

stories 

stories 

templates 

templates 

tools 

tools 

.gitignore 

.gitignore 

AGENTS.md 

AGENTS.md 

CODEOWNERS 

CODEOWNERS 

CONTRIBUTING.md 

CONTRIBUTING.md 

CONTRIBUTORS.md 

CONTRIBUTORS.md 

LICENSE 

LICENSE 

LOOP.md 

LOOP.md 

README.md 

README.md 

RELEASE_NOTES_DRAFT.md 

RELEASE_NOTES_DRAFT.md 

RELEASE_NOTES_v1.5.0.md 

RELEASE_NOTES_v1.5.0.md 

SECURITY.md 

SECURITY.md 

STATE.md 

STATE.md 

_config.yml 

_config.yml 

loop-budget.md 

loop-budget.md 

loop-constraints.md 

loop-constraints.md 

loop-run-log.md 

loop-run-log.md 

package-lock.json 

package-lock.json 

package.json 

package.json 

View all files 

Repository files navigation 

README 

Contributing 

MIT license 

Security 

More items 

Loop Engineering 

Stop prompting. Design the loop. Get a score. 

npx @cobusgreyling/loop-init . 

loop-init scaffolds skills, state, and budget files, then prints your Loop Ready score and first loop command. Swap --tool for claude , codex , or opencode . 

Loop engineering replaces you as the person who prompts the agent — you design the system that does it instead. 

New here? Quickstart (5 min) · Interactive picker 

For developers using Grok, Claude Code, Codex, Cursor, and other AI coding agents. 

→ Interactive showcase + pattern picker · Essay · Addy Osmani 

Contents 

Quickstart (5 min) 

Quick Links 

Why This Matters 

The Five Building Blocks + Memory 

Patterns 

Getting Started (5 minutes) 

Examples by Tool 

Operating & Safety 

Caveats 

Contributing 

Sources 

License 

Quick Links 

Start here Description 

Quickstart (5 min) Scaffold → cost check → audit → first loop — start here if you just landed 

Loop Engineering essay The concept, primitives, and Grok mapping — read for the why 

Pattern Picker Which loop to run first — start here if unsure 

Primitives Matrix Cross-tool loop primitive mapping — bookmark this 

Loop Design Checklist Ship readiness rubric 

Patterns 7 production patterns + interactive picker 

Starters Clone-and-run kits (Grok, Claude Code, Codex, Opencode) 

Opencode examples CLI-first loops: cron/systemd + opencode run , skills, worktrees 

loop-audit Loop Readiness Score CLI (v1.5 + constraints scoring) — npx @cobusgreyling/loop-audit . --suggest · --badge for README 

loop-init Scaffold starters + budget/run-log + constraints (v1.2) — npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok 

loop-cost Token spend estimator — npx @cobusgreyling/loop-cost 

loop-sync Drift detection between STATE.md and LOOP.md — npx @cobusgreyling/loop-sync . 

loop-context Stateful memory manager + circuit breaker for long runs — npx @cobusgreyling/loop-context --check --ledger run.json 

loop-mcp-server MCP runtime lookup for patterns, skills, state — npx @cobusgreyling/loop-mcp-server 

loop-worktree Manage isolated git worktrees per fix attempt — npx @cobusgreyling/loop-worktree create --run-id <id> --pattern <p> 

Goal Engineering Companion: loops discover, goals finish — /goal + stack cookbook ( npx @cobusgreyling/goal doctor . ) 

Stories Real wins and honest failures 

Contributor quickstart Help wanted: 25 scoped good first issues — comment I'll take this to get assigned 

Community update July 4: 5.5k stars, traffic sources, contributor merges 

Prior release notes v1.5.0 — loop-sync, constraints, MCP server 

Add your project Pinned: Loop Ready badge + adopters list 

Why This Matters 

Peter Steinberger: 

“You shouldn’t be prompting coding agents anymore. You should be designing loops that prompt your agents.” 

Boris Cherny (Head of Claude Code at Anthropic): 

“I don’t prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops.” 

The leverage point has moved from crafting individual prompts to designing the control systems that orchestrate agents over time. 

The Five Building Blocks + Memory 

Primitive Job in the Loop 

Automations / Scheduling Discovery + triage on a cadence 

Worktrees Safe parallel execution 

Skills Persistent project knowledge 

Plugins & Connectors Reach into your real tools (MCP) 

Sub-agents Maker / checker split 

+ Memory / State Durable spine outside any conversation 

Full detail: docs/primitives.md · Cross-tool matrix: docs/primitives-matrix.md 

Visual Overview 

Anatomy of a Loop 

Mermaid diagram (copy-friendly) 

flowchart LR
 A[Schedule / Automation] --> B[Triage Skill]
 B --> C[Read + Write STATE / Memory]
 C --> D[Isolated Worktree]
 D --> E[Implementer Sub-agent]
 E --> F[Verifier Sub-agent<br/>tests + gates]
 F --> G[MCP / Git / Tickets]
 G --> H{Human Gate?}
 H -->|safe / allowlisted| I[Commit / PR / Action]
 H -->|risky / ambiguous| J[Escalate to human<br/>with full context]
 I --> A
 J --> A 

Loading 

This reference repo now runs its own validate-patterns + audit workflows on every push/PR (see .github/workflows/ ). We also added LOOP.md describing the loops that will maintain it. 

Patterns 

Pattern Cadence Starter Week 1 Token cost 

Daily Triage 1d–2h minimal-loop L1 report Low 

PR Babysitter 5–15m pr-babysitter L1 watch High 

CI Sweeper 5–15m ci-sweeper L2 cautious Very high 

Dependency Sweeper 6h–1d dependency-sweeper L2 patch-only Medium 

Changelog Drafter 1d or tag changelog-drafter L1 draft Low 

Post-Merge Cleanup 1d–6h post-merge-cleanup L1 off-peak Low 

Issue Triage 2h–1d issue-triage L1 propose-only Low 

Not sure which to pick? Try the interactive picker or pattern-picker . 

Machine-readable index: patterns/registry.yaml (7 patterns) 

Getting Started (5 minutes) 

# 1. Scaffold + get your Loop Ready score (printed automatically) npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok # 2. Estimate token spend for your cadence npx @cobusgreyling/loop-cost --pattern daily-triage --level L1 # 3. Re-audit after improvements npx @cobusgreyling/loop-audit . --suggest # Optional: paste Loop Ready badge into your README npx @cobusgreyling/loop-audit . --badge # 4. See scores climb: empty → L1 → L2 bash scripts/before-after-demo.sh # 5. Start report-only (Grok example) /loop 1d Run loop-triage. Update STATE.md. No auto-fix in week one. 

All three CLIs publish to npm from tagged releases — see docs/RELEASE.md . No clone required. 

Develop from source (monorepo contributors): 

cd tools/loop-init && npm ci && npm test && node dist/cli.js /path/to/project --pattern daily-triage --tool grok cd tools/loop-audit && npm ci && npm test && node dist/cli.js /path/to/project --suggest cd tools/loop-cost && npm ci && npm test && node dist/cli.js --pattern ci-sweeper --cadence 15m 

Phased rollout: L1 report → L2 assisted fixes → L3 unattended — see loop-design-checklist . 

Examples by Tool 

Grok 

Claude Code 

Codex 

OpenClaw 

Opencode 

GitHub Actions 

Operating & Safety 

Failure Modes — incident-style catalog 

Anti-Patterns — design mistakes before production 

Multi-Loop Coordination — when loops collide 

Operating Loops — cost, logging, when to kill 

Safety — denylist, auto-merge, MCP scopes 

Security — reporting and unattended automation risks 

Concepts — intent debt, comprehension debt, harness vs loop 

MCP Cookbook — connector examples by pattern 

Caveats 

Loop engineering amplifies judgment — both good and bad. 

Token costs can explode with sub-agents and long-running loops. 

Verification is still on you. Unattended loops make unattended mistakes. 

Comprehension debt grows faster unless you read what the loop ships. 

Two people can run the same loop and get opposite results. The loop doesn't know. You do. 

Addy Osmani: 

“Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go.” 

Help wanted 

First PR? Start with the contributor quickstart — ~10 min to ~1 hr tasks with same-day review on stories and adopters. See CONTRIBUTORS.md for everyone who has shipped so far. 

Pick one Issue 

~10 min #120 — Add your project to adopters 

~15 min #227 — loop-sync subsection in QUICKSTART 

~30 min #147 — Cline appendix · #220 — Cursor CI Sweeper example 

~45 min #225 — Hermes PR Babysitter example 

~1 hr #230 / #231 — your story (worktree week-two, multi-loop failure) 

Comment "I'll take this" on any good first issue for assignment. 

Contributing 

Share production patterns, tool mappings, and failure stories. See CONTRIBUTING.md (contribution ladder + good first issue backlog ), adopters , and GitHub Discussions . 

Sources 

Cobus Greyling – Loop Engineering (Substack) 

Addy Osmani – Loop Engineering 

Attribution & further reading 

License 

MIT 

Practical, tool-aware reference for loop engineering, patterns you can clone, checklists you can ship against, and stories that include what broke. 

Essay · Showcase · Cobus Greyling 

Static chart (CI-updated daily). Live chart needs a GitHub token — stored in your browser only. 

About 

Practical patterns, starters & CLI tools for loop engineering with AI coding agents. Design systems that prompt and orchestrate agents (inspired by Addy Osmani and Boris Cherny). Includes loop-audit, loop-init, loop-cost. 

cobusgreyling.github.io/loop-engineering/ 

Topics 

automation mcp devtools grok codex ai-agents claude github-actions devops-automation llm prompt-engineering anthropic coding-agents agentic-ai ai-coding claude-code loop-engineering 

Resources 

Readme 

License 

MIT license 

Contributing 

Contributing 

Security policy 

Security policy 

Uh oh! 

There was an error while loading. Please reload this page . 

Activity 

Stars 

6.8k stars 

Watchers 

38 watching 

Forks 

865 forks 

Report repository 

Releases 1 

v1.5.0 — Community Tools Drop Latest 

Jun 30, 2026 

Packages 0 

Uh oh! 

There was an error while loading. Please reload this page . 

Uh oh! 

There was an error while loading. Please reload this page . 

Contributors 

Uh oh! 

There was an error while loading. Please reload this page . 

Languages 

JavaScript 54.5% 

TypeScript 35.2% 

Shell 5.2% 

Python 5.1% 

Footer 

© 2026 GitHub, Inc. 

Footer navigation 

Terms 

Privacy 

Security 

Status 

Community 

Docs 

Contact 

Manage cookies 

Do not share my personal information 

You can’t perform that action at this time.