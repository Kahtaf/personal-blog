---
title: "Loop Engineering: How to Design Coding Agent Loops That | explainx.ai Blog | explainx.ai"
url: "https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026"
final_url: "https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026"
retrieved: 2026-07-09
content_type: "text/html; charset=utf-8"
source_type: article
---

explainx.ai newsletter 3.5k 

trending pathways workshops skills 
solutions 

registry 

resources 
pricing 
workshops ↗ 

explainx.ai 
Upskill in AI — 16 free pathways, live workshops & bootcamps, and 50+ courses from practitioners. Plus the skills, tools, and MCP servers to practice on. 

follow us 

custom AI agents 
[email protected] 

get started 

Join · $29/mo 

learn 

pathways — start free workshops bootcamps courses certifications mock tests explainx university corporate training learn skills & mcp 

discover 

skills mcp servers tools agents llms designs agi tracker ranks 

company 

about vision mission team instructors community hackathons careers 

content 

daily AI news blog releases prompts generators resource library demo for LLMs 

solutions 

all solutions developer upskilling marketing upskilling product manager upskilling leadership upskilling 

Sister Products 

Infloq 

Influencer marketing 

BgBlur 

Privacy-first blur 

Olly Social 

Social AI copilot 

Ceptory 

Video intelligence 

BgRemover 

Background removal 

newsletter · weekly 

Get AI news, tools, and insights in your inbox. 

Email for skill picks newsletter Subscribe 

contact support privacy terms data rights submission guidelines 

© 2026 AISOLO Technologies Pvt Ltd 

share bookmark 

Loop Engineering: How to Design Coding Agent Loops That | explainx.ai Blog | explainx.ai 

On this page 

The tweet that triggered it 

The job moved up one altitude 

Why "loop" started five different arguments 

"It's just a cron job with a hat on" 

What loop engineering looks like in practice 

Verification: the feedback inside the loop 

Guardrails: the expensive part is managing the loop 

Skills are the asset inside the loop 

Build your first loop this week 

Key patterns from the research 

Related reading 

Summary 

← Back to blog 
explainx / blog 

Loop Engineering: How to Design Coding Agent Loops That Run While You Sleep (2026 Guide) 

Loop engineering: write programs that prompt coding agents on cron, with guardrails and skills inside. From ReAct and ralph to /goal and /loop in Claude Code. 

Jun 9, 2026 · 15 min read · Yash Thakker 

Loop Engineering Claude Code AI Coding Agent Harness Developer Productivity 

copy mdx copy post 
read go deep share request update 
chat with blog 

Loop engineering is the shift from typing prompts into a coding agent to writing the program that prompts the agent for you . This guide exists because of one tweet—and the thousand replies asking what it actually meant. 

For how that inner loop fits product-building (developer steering + user feedback on slower clocks), see Andrew Ng's three loops (The Batch, June 30, 2026). 

The tweet that triggered it 

On June 8, 2026 at 12:28 AM , Peter Steinberger (@steipete) —creator of OpenClaw , now at OpenAI—posted two sentences that hit 6.5 million views on X: 

Here's your monthly reminder that you shouldn't be prompting coding agents anymore. 

You should be designing loops that prompt your agents. 

That was it. No diagram. No repo link. The entire AI-coding timeline spent the next week arguing about six words. 

What the replies actually asked 

The thread surfaced three recurring questions: 

Reply Who What they wanted 

"Can you explain your workflow in detail? Would love a blog post about it" @MatthewBerman 

Related posts 

Jun 29, 2026 

Context vs Prompt vs Loop vs Harness Engineering: The Four-Layer Agent Stack 

Most teams conflate prompt writing with context design, loop orchestration, and harness code. They are four layers of the same stack. Here is how they nest, what breaks when you skip one, and which layer to fix when agents fail. 

Jun 20, 2026 

How to Build Your First Agent Loop: A Step-by-Step Guide (2026) 

Every developer asking "how do I actually build one of these loops?" gets the same answer: five components, three levels, and one feedback gate that says no. This guide walks you from a blank terminal to a working autonomous agent loop in under an hour — no orchestration framework required. 

Jun 19, 2026 

Top 10 AI Agent Loops for Coding Workflows (2026 Guide) 

Loop engineering replaced one-shot prompting as the default AI coding skill in 2026. These ten loops cover the workflows teams run most — fixing CI, triaging bugs, building test coverage, syncing docs, and clearing review feedback — each with a verifiable stop condition. Browse all ~100 loops at explainx.ai/loops. 

A concrete how-to 

"how do we do that though?" @InderosD The on-ramp 

"wtf is a loop?" @MatthewBerman — video explainer A definition 

Berman's early reply captured the mood before the explainers landed: "nobody knows but him and boris." 

The most useful reply in the thread came from @mosyaseen : 

"designing the loop is half of it. the other half is putting something in the loop that can say no: a test, a type check, a real error. a loop with nothing to push back is the agent agreeing with itself on repeat." 

Steinberger agreed—and pointed to VISION.md , a file he uses at the project level to anchor what agents should build toward (alongside agent rules in AGENTS.md and his broader agentic engineering workflow ). 

Skeptics pushed back too: @SaidAitmbarek flagged token efficiency; @jxnlco noted Steinberger's outsized reach on the topic. Fair—but the question underneath was real: if prompting is the old job, what is the new one? 

Matt Van Horn (@mvanhorn) —who runs loops that open PRs across ~30 open-source repos overnight—ran /last30days research across Reddit, X, YouTube, and Hacker News and published a synthesis thread. Boris Cherny had already named the answer on stage four days earlier. 

This post is the technical answer to "how do we do that though?" — what a loop is, where it came from, how to build one, and what production teams worry about once the tweet wears off. 

TL;DR 

Question Answer 

What triggered this? @steipete's June 8 tweet — 6.5M views, two sentences, one argument. 

What is a loop? A program that prompts an agent, reads output, checks if done, repeats—or stops. 

Who defines it cleanly? Boris Cherny , Claude Code creator, at WorkOS Acquired Unplugged (June 2, 2026) . 

Fastest on-ramp? Claude Code /loop — one slash command. 

Old hat vs new? Single-agent ralph loops (2025) are baseline; multi-agent orchestration loops (2026) are the new layer. 

What makes loops trustworthy? Self-verification: write → run → read result → correct. 

What makes loops expensive? Not tokens per call—the loop management and runaway iterations. 

Weekly digest 3.5k readers 

Catch up on AI 

Curated AI updates on agents, skills, and MCP — delivered to your inbox. Unsubscribe anytime. 

Leave blank 
Email for explainx.ai newsletter Subscribe 

Video course: Introduction to Loop Engineering (~46 min) — ReAct and loop types, self-improvement and product-evaluation builds, live /loop in Cursor, guardrails. Course hub → 

Learn more about loop engineering 

The job moved up one altitude 

Boris Cherny created Claude Code as a side project in September 2024 . It now sits behind close to 4% of all public commits on GitHub , per industry reporting cited in the June 2026 discourse. 

At WorkOS Acquired Unplugged on June 2, 2026 , Boris gave the cleanest definition of what practitioners mean by "loop": 

"Now it's actually leveled up, I think, again, to the next wave of abstraction where I don't prompt Claude anymore. I have loops that are running. They're the ones that are prompting Claude and figuring out what to do. My job is to write loops." 

Plain version: 

You write a small program (or configure /loop ). 

Each tick, it prompts the coding agent . 

It reads what the agent produced (files, test output, PR state). 

It decides whether the task is done . 

If not, it prompts again —with fresh or anchored context. 

You stop being the thing inside the loop typing prompts. You become the author of the loop . The model becomes a subroutine . 

Boris describes three stages on his ladder: 

Stage What Boris did Your role 

1. Autocomplete Wrote code by hand with AI suggestions Typist 

2. Parallel sessions Ran 5–10 Claude sessions, prompted each Prompt operator 

3. Loops Writes loops; agents read GitHub, Slack, Twitter and decide what to build Loop engineer 

The receipt: in the 30 days before December 27, 2025 , Boris reported that 100% of his contributions to Claude Code were written by Claude Code — 259 PRs landed . He deleted his IDE in November 2025 and has not opened it since. 

The nuance the "prompt engineering is dead" crowd skips: Boris is not saying engineers are obsolete. Someone still decides what to build, talks to customers, and coordinates teams. The job did not vanish—it moved from writing code to writing the thing that writes the code . 

For the broader Anthropic framing, see our harness engineering deep dive . This post focuses on loop engineering as a buildable discipline . 

Why "loop" started five different arguments 

The June 2026 replies were a mess because "loop" hides at least five different things . Here is the ladder—oldest to newest—so you can stop talking past people. 

Stage 1: The academic while-loop (ReAct, 2022) 

The ReAct paper (2022) formalized the pattern: the model reasons , calls a tool , reads the result , repeats until done. One model, one loop, a human watching. 

Stage 2: Goal-driven self-prompting (AutoGPT, 2023) 

AutoGPT gave an agent a goal and let it prompt itself. It became famous for spinning forever doing nothing —which seeded years of "agents are a toy" skepticism. 

Stage 3: The ralph loop (July 2025) 

Geoffrey Huntley published the ralph loop in July 2025 . In Huntley's words: "Ralph is a bash loop." 

bash Copy 
while :; do cat PROMPT.md | claude ; done 

The innovation was not clever orchestration—it was discipline : 

Every iteration resets context to a fixed set of anchor files ( PROMPT.md , specs, AGENTS.md ). 

Progress lives on disk and in git , not in a growing conversation. 

The agent does one discrete unit of work per iteration, validates, exits. 

Huntley used ralph to build Cursed , an esoteric programming language, for roughly $297 in API costs—a number widely cited in practitioner threads. Matt Pocock's workshop coverage walks through a production-oriented ralph variant with test gates and commit-on-green logic. 

@trashpandaemoji had the sharpest reply under Steinberger's tweet: 

"It's not ralph/goal loops, that's old hat by now. It's probably some kind of continuous orchestration loop that oversees other threads/agents." 

That reply is the closest correct answer in the public thread. Hold onto it. 

Stage 4: Productized ralph (/goal, spring 2026) 

In spring 2026 , both Codex and Claude Code shipped a /goal command that runs until a validator confirms the task is done. See our Claude Code /goal guide and Goal Mode complete guide . 

Stage 5: Orchestration loops (2026) 

What Boris and Steinberger actually mean in June 2026 is genuinely new—not just renamed ralph. Four things changed: 

Shift Ralph (2025) Orchestration loop (2026) 

Unit of work One task, one agent Loop supervises many tasks/agents 

Concurrency Sequential bash pipe Parallel sub-agents (worktrees, /batch ) 

Scheduling Human starts terminal Cron, /loop , infrastructure time 

Durability Terminal must stay open Git-backed state, crash recovery 

Steve Yegge's Gas Town (launched January 2026 ) coordinates 20–30 Claude Code instances via a "Mayor" agent, with patrol agents running continuous loops and state stored in git so work survives a crash. That is the continuous orchestration loop Trash Panda was reaching for—shipped and open source. 

"It's just a cron job with a hat on" 

The best skeptic line in the June 2026 corpus was four words: 

"Cronjobs have funny re-branding rn." 

Half right. Yes—the scheduling layer is cron. Boris literally runs loops on cron. Claude Code's /loop command uses scheduling under the hood. 

If your whole definition is "a thing that runs on a timer," we invented that in 1975 and you can go home. 

What cron never had is the part in the middle: 

Cron job Agent loop 

Runs a fixed script Runs a model that reads current state 

Same branches every tick Decides the next action each tick 

No self-correction Can verify, fail, and retry 

One process Can dispatch and supervise other agents 

@rohit_jsfreaky deflated the mythology cleanly: 

"Every ai agent i shipped this year is a for-loop, an llm call, and a try/catch around the json parsing. The only thing agentic about it is the anthropic bill at the end of the month." 

Honest framing: loops are cron plus a decision-maker in the body . The interesting engineering is everything you wrap around that decision so it does not run off a cliff. 

What loop engineering looks like in practice 

Enough lineage. Here is the on-ramp. 

One line: Claude Code /loop 

Claude Code ships /loop as a bundled skill . Boris's canonical starter: 

snippet Copy 
/loop babysit all my PRs. Auto-fix build issues, and when comments come in, use a worktree agent to fix them. 

Read that twice. He is not asking Claude to fix one PR . He is asking Claude to maintain all of them indefinitely , dispatching worktree-isolated sub-agents as comments arrive. 

More examples from Boris's public posts: 

Command What it does 

/loop 5m /babysit Auto-address code review, rebase PRs every 5 minutes 

/loop 30m /slack-feedback Put up PRs for Slack feedback on a 30-minute cadence 

/loop 5m check the deploy Poll deploy status on a fixed interval 

/loop check the deploy Same prompt, interval chosen dynamically by Claude 

Dynamic intervals: when you omit the interval, Claude picks a delay between one minute and one hour based on what it observed—short waits while a build is finishing, longer waits when nothing is pending. 

Custom default: a loop.md file in your project replaces the built-in maintenance prompt for bare /loop . 

Stop a loop: press Esc while it is waiting for the next iteration. 

Sources: Claude Code scheduled tasks docs , Vibe Coder breakdown of /loop . 

Boris's five tips for hours-long autonomy 

In June 2026 , Boris posted five tips for running Opus autonomously for hours or days: 

Auto mode for permissions — Claude does not stop to ask for approval on every file write. 

Dynamic workflows — orchestrate hundreds or thousands of sub-agents for large tasks. See Claude Code dynamic workflows . 

/goal or /loop — nudge Claude to keep going until done. 

Claude Code in the cloud — close your laptop; the loop keeps running. 

Self-verify end to end — a loop is only as trustworthy as its ability to check its own work. 

Tip 5 is what practitioners obsess over and hype skips. 

The loop contract 

Developers Digest names the pieces that turn an agent from a clever assistant into a useful background process: 

snippet Copy 
TRIGGER → every 15m, on PR comment, on CI failure
SCOPE → open PRs authored by me, repo X only
ACTION → run tests, fix lint, respond to review
BUDGET → max 3 sub-agents per tick, 50k tokens
STOP → all PRs green, or 10 iterations, or $5 spent
REPORT → post summary to Slack #eng-bots 

That is not "task, repeated." That is loop engineering . 

Verification: the feedback inside the loop 

The fastest-growing sub-theme after Steinberger's tweet was not orchestration—it was verification . @mosyaseen said it directly in the thread: half of loop engineering is design; the other half is something that can say no . 

@DanKornas , shipping roborev , put it plainly: 

"Your coding agent can move fast, but bad commits compound fast too." 

An open loop that writes code with no feedback is a machine for generating confident mistakes. A loop that writes → runs → reads the result → corrects is what actually works in production. 

Loop type Behavior Production fit 

Open loop Agent writes until it says "done" Demo only 

Closed loop Agent runs tests/lint/review after each write Ship with guardrails 

Review loop Background reviewer feeds findings back while context is fresh Best for long sessions 

The loop is not the magic. The feedback inside it is. 

Anchor files: VISION.md, CLAUDE.md, AGENTS.md 

Steinberger's reply in the thread pointed at VISION.md —a project-level file that states what you are building and why, so each loop tick does not re-derive intent from scratch. That sits alongside: 

File Role in loops 

VISION.md North star: product direction, constraints, what "done" looks like 

CLAUDE.md / AGENTS.md Operating rules: stack, commands, guardrails per tick 

PROMPT.md / loop.md The prompt the loop pipes in each iteration 

Tests & type checks The thing that says no when the agent is wrong 

Pair loops with persistent project memory: What is CLAUDE.md? and MEMORY.md patterns . Steinberger's shared agent rules live in steipete/agent-scripts . 

Guardrails: the expensive part is managing the loop 

Once the model writes code for almost nothing, cost moves to the loop running it . 

@runes_leo : 

"The costliest thing in AI coding is no longer writing code, it's managing the agent loop." 

The receipt: Uber capped engineers at $1,500 per person per tool per month for Claude Code and Cursor after burning its annual AI budget in four months , per June 2026 reporting in the discourse. 

@cv_usk on the failure mode everyone in production fears: 

"Without guardrails, you get infinite loops and billing surprises orders of magnitude over budget." 

Every serious 2026 write-up converges on three hard stops : 

1. Maximum iteration count 

bash Copy 
MAX_ITER=20
iter=0 while [ $iter -lt $MAX_ITER ]; do claude -p < prompt.md
 iter=$((iter + 1 )) done 

Claude Code's /goal tracks turns natively. Bare ralph loops have no ceiling unless you add one. 

2. No-progress detection 

Stop when the same error message, empty diff, or failing test appears N times in a row . Huntley tunes ralph prompts "like a guitar" based on failure patterns—loop engineering includes prompt iteration , not just bash. 

3. Token or dollar budget ceiling 

Set a per-loop budget before you sleep. AI token cost governance covers enterprise-scale patterns. 

Gartner puts agentic AI at the peak of inflated expectations , with only about 17% of organizations actually deploying agents, per citations in Van Horn's research. The gap between the timeline and the receipts is the real state of play. 

Skills are the asset inside the loop 

Steinberger's other recurring point pairs with the loops thesis—and it is the more durable half: 

If you do something more than once, turn it into an automated skill . If you do something hard, turn it into a skill afterward so next time is free. 

A loop with no reusable skills inside it is a while true around a stranger. A loop that calls a library of sharp, tested, named skills is a system that compounds . 

Boris's public advice: experiment with turning workflows into skills + loops . 

snippet Copy 
/loop 30m /code-review
/loop 15m /fix-ci
/loop 1h /dependency-audit 

Each skill is a named recipe —prompt + tool policy + verification steps. The loop is plumbing that invokes those recipes on a schedule. 

Browse reusable skills at /skills . For security before you automate: Agent skills threat model . 

Build your first loop this week 

Level 0: Babysit one PR (15 minutes) 

snippet Copy 
/loop 10m Review PR #123. If CI is failing, fix it. If there are unresolved review comments, address them in a worktree and push. If everything is green and approved, stop. 

Watch two ticks. Confirm it reads state before acting. 

Level 1: Ralph with guardrails (1 hour) 

Create PROMPT.md : 

markdown Copy 
You are an autonomous coding agent. 1. Read specs/TODO.md for the next unchecked item. 2. Implement exactly that item. 3. Run `npm test` . 4. If tests pass, commit with a descriptive message and mark the item done. 5. If tests fail twice with the same error, write BLOCKED to specs/TODO.md and exit. 6. Exit after one item either way. 

Wrap it: 

bash Copy 
#!/bin/bash MAX=10 for i in $( seq 1 $MAX ); do cat PROMPT.md | claude -p --dangerously-skip-permissions
 grep -q "BLOCKED" specs/TODO.md && break grep -q "\[ \]" specs/TODO.md || break sleep 10 done 

Run in an isolated worktree or container—not on your main machine without sandboxing. 

Level 2: Orchestration (ongoing) 

Combine /loop + skills + cloud sessions + /goal for multi-hour work. Read agent harness engineering for the seven-plane framework: loop policy, tool surface, context, sandbox, multi-agent routing, observability, model routing. 

Key patterns from the research 

Steinberger's tweet was the spark; the /last30days corpus (compiled June 7–8, 2026 ) distilled five durable patterns: 

A loop is cron plus a decision-maker — the model picks the next action each tick, not a hardcoded branch. 

Lineage is real — ReAct (2022) → AutoGPT (2023) → ralph (2025) → /goal (spring 2026) → orchestration loops (now). Single-agent ralph is old hat; multi-agent supervision is the new layer. 

Feedback makes loops trustworthy — tests, type checks, review gates; a loop with nothing to push back is the agent agreeing with itself. 

Cost shifted to loop management — cap iterations, detect no-progress, set a dollar budget. 

Skills compound; prompts burn — loops that call sharp named skills get cheaper over time; loops that re-derive everything do not. 

Top voices in the corpus: @steipete (trigger), @bcherny (definition), @MatthewBerman (explainer video), @mvanhorn (research synthesis), @mosyaseen (verification framing). 

Related reading 

explainx.ai guides 

Claude Code Model vs Effort: Knowing More vs Trying Harder (July 2026) — when to switch model vs raise effort 

Claude Code loops official guide (July 2026) 

Programmer mental health after AI agents — when parallel /loop sessions trade flow for steady stress 

Loop Engineering Goes Mainstream: June 2026 Discourse Decoded 

Anthropic engineer: harness engineering explained 

Claude Code /goal command 

Claude Code dynamic workflows 

Matt Pocock: ralph loop in practice 

Agent harness engineering: seven planes 

Primary sources 

Claude Code: Run prompts on a schedule ( /loop ) 

Claude Code: Bundled skills including /loop 

Geoffrey Huntley: Ralph Wiggum loop (July 2025) 

HumanLayer: Brief history of ralph 

Gas Town (Steve Yegge) 

ReAct paper (2022) 

Community synthesis 

Peter Steinberger: the June 8, 2026 loop tweet — 6.5M+ views; origin of the discourse 

Matthew Berman: "wtf is a loop?" explainer — video follow-up to the thread 

Matt Van Horn: WTF Is a Loop? research thread — /last30days across Reddit, X, YouTube, TikTok, HN, and GitHub 

Peter Steinberger: Just Talk To It (agentic engineering workflow) 

Summary 

Loop engineering is not a hot take about prompt engineering dying. It started as two sentences from @steipete and became a buildable discipline: 

Stop being the thing in the loop — write the loop once. 

Anchor intent — VISION.md , CLAUDE.md , or AGENTS.md so each tick knows where it's going. 

Give it something that says no — tests, type checks, review gates. 

Give it skills worth calling — named recipes, not one-off prompts. 

Cap it so it halts — iterations, no-progress detection, dollar budget. 

Let it run on cron while you decide what to build next. 

Steinberger named the shift; Boris shipped the primitives. The on-ramp, as of June 2026 , is a single slash command: 

snippet Copy 
/loop babysit all my PRs. Auto-fix build issues, and when comments come in, use a worktree agent to fix them. 

The only people who truly know what a loop feels like are the ones who have already built one. @InderosD asked "how do we do that though?" in the original thread—the sections above are the answer. The good news: the tooling to start is already in your terminal. 

Published June 9, 2026. Steinberger tweet view count and thread citations from June 8–9, 2026—verify against upstream before citing in production decisions.