---
title: "Loop Engineering: Designing the System That Drives the Agent Instead of Prompting It | Saulius blog"
url: "https://saulius.io/blog/loop-engineering-systems-that-drive-agents"
final_url: "https://saulius.io/blog/loop-engineering-systems-that-drive-agents"
retrieved: 2026-07-09
content_type: "text/html; charset=utf-8"
source_type: article
---

Loop Engineering: Designing the System That Drives the Agent Instead of Prompting It | Saulius blog 

Saulius blog 

Blog Tags About 

Home 

Blog 

Tags 

About 

Published on June 17, 2026 

Loop Engineering: Designing the System That Drives the Agent Instead of Prompting It 

For the past two years, getting useful work out of a coding agent meant holding it by the hand. You wrote a careful prompt, supplied enough context, read what came back, and typed the next instruction. The agent was a tool, and you were the loop — one turn after another. 

That pattern is breaking down. As models stay with a hard problem for hours rather than minutes, the bottleneck shifts. The interesting question is no longer "can the model write good code?" — it can — but "can it keep making progress on its own without losing the thread, repeating mistakes, or declaring victory prematurely?" 

Loop engineering is the discipline that answers that. Instead of prompting the agent yourself, you design the system that prompts it: a loop that discovers work, hands it out, checks the result, records what was done, and decides what to do next. You move from operator to architect. 

You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents. 

This post covers what loop engineering is, the architecture that makes it work, concrete examples you can build today, and the practices that separate a reliable loop from an expensive one that spins in place. Every flow is drawn out as a diagram. 

The progression: from prompts to loops 

It helps to place loop engineering in context, because it is the latest layer in a clear progression. Each layer sits on top of the previous one. 

A harness is the environment a single agent operates in for one run. A loop sits one floor higher: it runs on a timer, spawns helper agents, verifies results, and continues without you. The shift, in one line: 

From "I prompt → the agent responds → I prompt again" to "I design the autonomous system that discovers work, verifies results, and drives progress." 

The lineage: this is not a new idea 

Loop engineering did not appear from nowhere; it is the productization of a pattern the field has been circling for years. Knowing the lineage makes the current moment easier to evaluate. 

ReAct (2022–2023) — the first formalized agent loop: a model reasons, calls a tool to act, reads the result, and repeats until done. One model, one loop, a human watching every step. 

AutoGPT — added a goal and let the model prompt itself toward it. It proved autonomy was possible, but it also pioneered the failure mode: long rabbit holes that wasted time and tokens. 

The Ralph loop — run the same prompt repeatedly on a fresh context until the work is complete or a max iteration count is hit. The discipline came from "forced amnesia": a clean conversation each run gave the agent fresh eyes and stopped history from clogging the context. 

/goal and equivalents (now) — a Ralph loop whose stop condition is "the task is actually done," verified against criteria rather than a fixed iteration count. Both major coding-agent products now ship this directly. 

It is worth being precise about what an agent is , because it clarifies what a loop adds. A coding agent is not a smarter model — it is a model wrapped around a loop . 

Prompt engineering optimizes a single interaction. Loop engineering turns that single interaction into a component inside a larger, repeating system — and the system, not the prompt, becomes the unit of work. 

The core architecture 

A loop is not "run the agent again on a schedule." That is just a more expensive way to fail repeatedly. A working loop has a specific shape, with a feedback signal and an independent verifier built in. 

Each stage has a precise job: 

Goal — a clear, testable statement of done. Not "fix the bug" but "all 47 tests in test/auth pass and the feature matches the spec." If you cannot write the stop condition as a check, the loop has no way to know when to terminate. 

Attempt — the agent reads the repo, writes code, calls an API, runs a command. 

Feedback — the environment responds. Tests fail, a type check errors, output fails a rubric. This is the signal the loop runs on. 

Self-correct — the agent reads the feedback and adjusts its approach . This is what distinguishes a loop from a retry: it must diagnose, not repeat . 

Verify — a separate context grades the output against a rubric. Self-critique does not count; models are poor judges of their own work. 

Stop condition — the loop ends only when the verifier passes, not when the agent believes it is finished. 

The model is the engine. The loop is the chassis. Without the loop, even a strong model fails on long tasks. 

Why agents fail without a loop 

Loop engineering exists to address five specific, recurring failure modes. Naming them makes the architecture above easier to motivate. 

# Failure mode What it looks like The loop's answer 

1 Context collapse By step 12 the agent has forgotten what step 1 was for. External memory on disk, re-read each cycle. 

2 No self-correction Hits an error, retries the identical approach, repeats. A feedback stage that forces diagnosis before the next attempt. 

3 No verifier "Finished" is treated as "correct." An independent grader with a rubric. 

4 No memory across sessions Restart, and it repeats the same mistake from zero. Durable state (a file, a ticket board) outside the context window. 

5 No stop condition Stops too early, or runs forever burning tokens. A hard, checkable definition of done. 

A useful way to summarize the goal: a good agent is not one that starts well. It is one that still knows what it is doing three hours later. 

The five building blocks 

In practice, a loop is assembled from five capabilities, plus one piece of durable memory. The encouraging part is that these no longer require a pile of bespoke bash scripts — both major coding-agent products now ship all of them. 

Automations — the heartbeat. These make a loop a loop rather than a single run you did once. They fire on a schedule, an event, or a trigger condition. Runs that find something route to a triage queue; runs that find nothing archive themselves. 

Worktrees — parallel without chaos. The moment you run more than one agent, their file edits collide — the same problem as two engineers committing to the same lines without coordinating. A git worktree gives each agent a separate working directory on its own branch, sharing repository history, so one agent's edits cannot touch another's checkout. 

Skills — project knowledge, written once. A skill (a SKILL.md file with instructions and metadata) records conventions, build steps, and hard-won "we don't do it this way because of that incident" rules. Without skills, a loop re-derives your entire project context from zero every cycle. With them, intent compounds. 

Connectors (MCP) — the loop touches real tools. Built on the Model Context Protocol, connectors let the agent read your issue tracker, query a database, hit a staging API, or post to Slack. This is the difference between an agent that says "here is the fix" and a loop that opens the PR, links the ticket, and notifies the channel once CI is green. 

Sub-agents — the maker/checker split. One agent proposes; a different one checks. Keeping these in separate contexts is what makes verification trustworthy. 

The sixth piece — memory. A markdown file, a Linear board, anything that lives outside a single conversation and records what is done and what is next. The model forgets everything between runs, so the state of the work has to live on disk. The agent forgets; the repository does not. 

Worked example: an autonomous fix-the-failing-tests loop 

The clearest way to make this concrete is a worker/verifier pair with external memory. The worker attempts the fix and self-corrects against test feedback; a separate verifier grades the result against a rubric; memory carries lessons between runs. Below is a deliberately minimal Python sketch using the Anthropic SDK and Claude Opus 4.8. 

import anthropic , subprocess , json client = anthropic . Anthropic ( ) tools = [ { "name" : "read_file" , "description" : "Read a file from the repository" , "input_schema" : { "type" : "object" , "properties" : { "path" : { "type" : "string" } } , "required" : [ "path" ] } } , { "name" : "write_file" , "description" : "Write or edit a file" , "input_schema" : { "type" : "object" , "properties" : { "path" : { "type" : "string" } , "content" : { "type" : "string" } } , "required" : [ "path" , "content" ] } } , { "name" : "run_tests" , "description" : "Run the test suite and return results" , "input_schema" : { "type" : "object" , "properties" : { "test_path" : { "type" : "string" } } , "required" : [ "test_path" ] } } , ] def execute_tool ( name , args ) : if name == "read_file" : try : with open ( args [ "path" ] ) as f : return f . read ( ) except Exception as e : return f"Error reading file: { e } " if name == "write_file" : try : with open ( args [ "path" ] , "w" ) as f : f . write ( args [ "content" ] ) return f"Written: { args [ 'path' ] } " except Exception as e : return f"Error writing file: { e } " if name == "run_tests" : r = subprocess . run ( [ "python" , "-m" , "pytest" , args [ "test_path" ] , "-v" , "--tb=short" ] , capture_output = True , text = True , timeout = 60 ) return r . stdout + r . stderr return "Unknown tool" def run_worker ( issue , repo_context , memory_notes , max_steps = 20 ) : """Attempt the fix. Self-correct against test feedback. Stop at DONE or max_steps.""" system = f"""You are a senior engineer fixing a real issue. MEMORY FROM PREVIOUS RUNS: { memory_notes or "No previous runs yet." } REPO CONTEXT: { repo_context } GOAL: Fix the issue. All tests must pass. Do not stop until they do. RULES: - Read the relevant files before changing them. - Run tests after every change. - If tests fail, diagnose the root cause — do not repeat the same fix. - When all tests pass, reply: DONE: <one-line summary>. """ messages = [ { "role" : "user" , "content" : f"Fix this issue:\n\n { issue } " } ] for step in range ( 1 , max_steps + 1 ) : resp = client . messages . create ( model = "claude-opus-4-8" , max_tokens = 4096 , system = system , tools = tools , messages = messages ) for block in resp . content : if getattr ( block , "text" , "" ) and "DONE:" in block . text : return messages , block . text results = [ ] for block in resp . content : if block . type == "tool_use" : out = execute_tool ( block . name , block . input ) results . append ( { "type" : "tool_result" , "tool_use_id" : block . id , "content" : out [ : 2000 ] } ) messages . append ( { "role" : "assistant" , "content" : resp . content } ) if results : messages . append ( { "role" : "user" , "content" : results } ) elif resp . stop_reason == "end_turn" : messages . append ( { "role" : "user" , "content" : "You stopped without finishing. Run the tests and continue." } ) return messages , "MAX_STEPS_REACHED" def run_verifier ( issue , worker_summary , test_results ) : """A SEPARATE context. Grades the worker's output against a rubric.""" rubric = """Grade the fix: 1. All tests pass (required) 2. Fix addresses the root cause, not just symptoms 3. No new errors introduced 4. Code follows existing patterns 5. Summary matches what was actually done Reply with: VERDICT: PASS or FAIL REASON: one sentence GAPS: what is still missing (if FAIL)""" resp = client . messages . create ( model = "claude-opus-4-8" , max_tokens = 512 , messages = [ { "role" : "user" , "content" : f"ISSUE:\n { issue } \n\nWORKER SUMMARY:\n { worker_summary } \n\n" f"TEST RESULTS:\n { test_results } \n\n { rubric } " } ] ) text = resp . content [ 0 ] . text return ( "VERDICT: PASS" in text ) , text def loop ( issue , repo_context , max_rounds = 5 ) : memory = "" for round_n in range ( 1 , max_rounds + 1 ) : _ , summary = run_worker ( issue , repo_context , memory ) test_results = execute_tool ( "run_tests" , { "test_path" : "tests/" } ) passed , verdict = run_verifier ( issue , summary , test_results ) if passed : return f"Done in round { round_n } : { summary } " memory += f"\n[Round { round_n } ] Rejected: { verdict } " # carry the lesson forward return "Stopped: max rounds reached without verifier pass." 

Three structural choices make this a loop rather than a long prompt: the worker has a feedback signal ( run_tests ), the verifier runs in an independent context , and memory carries forward why previous attempts were rejected so the worker does not repeat them. 

Examples: good first loops 

If you are looking for where to start, choose tasks that are repetitive, machine-checkable, and reversible. The following are reliable first loops, several used internally at the companies building these tools: 

CI failure triage — nightly: scan failed runs, classify by cause (environment, flake, real bug, dependency, infra), draft fix PRs for the easy classes, escalate the rest. 

Dependency bump PRs — weekly: scan for updates, test compatibility in an isolated worktree, open PRs for the ones that pass. 

Lint-and-fix passes — on every PR-open event, apply style fixes automatically. 

Flaky-test reproduction — loop until a theory about the flake survives the test. 

Issue-to-PR drafts — on repos with strong test suites, where bad output is rejected by the suite before a human ever sees it. 

Commit briefings and daily summaries — summarize what changed, what failed, and what needs attention. 

A concrete end-to-end example: the morning triage loop 

Here is a realistic "day-in-the-life" loop that requires no prompting from you once designed. 

The point is what you did not do: you did not ask the agent seven times, you did not prompt it when you woke up, and you did not steer the PR by hand. You designed the system once — backed by skills that encode how you would have done the work — and let it run. That is the difference between an automation, which always runs step one, then two, then three, and a loop, which inspects the current state, decides what to do next, checks the result, and decides whether another iteration is needed. 

Triggers and stop conditions, by example 

Two design choices do most of the work in any loop: what starts it, and what tells it it can stop . 

There must be some check. Without one, you have not built a loop — you have built a very confident token furnace. 

Three more patterns practitioners actually run 

Beyond morning triage, three patterns come up repeatedly because each has a clean, machine-checkable signal: 

The scored code-review loop. Push a feature; an automated code-review tool reviews the PR and returns a score out of five. A small "review loop" skill reads the review, applies the fixes, pushes again, and waits for a fresh score — repeating until the score clears a threshold (say 4/5) or a max number of turns. This works precisely because the feedback is fixed and the output is close to binary. A practical limit: it degrades on very large diffs (roughly 1,000+ lines) where there is too much for the reviewer to contextualize — the mitigation is to split into smaller PRs. 

The front-end verification loop. After a UI change, the loop drives a browser (via an extension or simulator), takes snapshots, inspects the DOM, and cross-references the result against the spec — or the original design in a design tool — iterating until the implementation matches at high fidelity. Wrap it in a goal condition so it continues until the match is near-100%, with an iteration cap. 

The issue-backlog loop. Point the loop at your tracker: work through open issues, apply a systematic-debugging approach, write a regression test for each bug, and open a PR per issue. It only reports "done" once every tagged issue is resolved. 

A heavier pattern experienced practitioners run is a continuous PR-shepherding loop — e.g. a babysit command on a short interval that auto-addresses review comments, rebases, and moves PRs toward production. Once you run many parallel agents, the volume of commits and PRs itself becomes something a loop is needed to manage. 

Beyond code: the loop as a way of working 

The pattern is not limited to coding. The same shape — set a goal, act, gather a feedback signal, improve, repeat — describes higher-level workflows. A frequently cited aspiration is the product-market-fit loop : build the product, get it in front of users, read analytics and error logs, decide what to improve, ship, and repeat on a daily cadence. The caveat: these outer loops are gated by real-world time — you cannot iterate faster than users actually use the product — which makes them fundamentally different from a tight, seconds-per-iteration coding loop. 

When not to build a loop 

Keep a human in the chair for: architecture rewrites; authentication, payments, or billing code; production deployments; vague product work; and anything where "done" is a judgment call rather than a check. 

The honest framing: loop engineering is real, and most developers do not need it for most tasks yet . A loop multiplies output; if your real constraint is review capacity rather than typing speed, a loop simply makes the review queue longer. 

Best practices 

The pre-flight check 

Before turning any task into a loop, run it through this checklist. If it misses a box, keep it a manual prompt. 

Separate the maker from the checker 

This is the single most important practice. The agent that produced the output must not be the agent that grades it. Self-critique is unreliable — models tend to agree with themselves. Run verification in a separate context , with an explicit rubric, and ideally a separate model instance. The stop condition should depend on the verifier's verdict, not the worker's belief that it is finished. 

Treat skills as the highest-leverage, most underused block 

Skills are consistently underused, and they are where a loop either compounds or leaks. A loop with no reusable skills rediscovers your project from zero on every run, burning tokens relearning what you already know. A practical convention: keep one skill per task , make each file as dense as possible but also as small and clean as possible, then have your agent organize the skills and build an index . The agent consults the index to decide which skill to open, so you never have to say "use skill X and Y" — only "check the skill list and use what's relevant." 

Keep memory on disk, not in context 

The model forgets everything between runs. Durable state — a STATE.md file, a ticket board, a database row — is what lets a loop learn across sessions instead of repeating the same mistake from zero. Update it after every run: files touched, classifications made, PRs opened, items escalated. 

Always set a hard stop — three controls, not one 

Every loop needs explicit termination bounds in addition to the success condition. A serious loop has all three. 

A few more, briefly 

Keep the orchestration outside the agent. Early loops went off the rails because the agent orchestrated itself and locked onto a questionable decision. Put control logic (iteration limits, branching, stop conditions) in an external script or workflow function; let the agent do the work inside that structure rather than steer it. 

Write the goal down as a vision.md . A loop optimizes toward its stated goal, so that goal deserves real effort: the core problem, the intended solution, the key goals, the technical principles, what success looks like. Sanity-check it — when you prompt the agent manually against that document, does it consistently make the decisions you would have made? If not, the loop won't either. 

A readiness test. Loops amplify your existing workflow; they don't create competence you lack. If you cannot already run two or three parallel agent sessions comfortably and be happy with the output, building an autonomous loop on top is premature. Get fluent with supervised parallelism first; automate it second. 

Gate irreversible actions behind a human. Worktrees remove the mechanical collision of parallel agents, but you remain the ceiling: your review bandwidth determines how many agents you can actually run. 

Respect token economics. Measure spend per useful outcome , not per run, and treat a rising token-per-merged-PR ratio as a signal that the loop design needs attention. 

Drawbacks and risks 

Loop engineering is easy to be enthusiastic about and easy to get wrong. The same properties that make a loop powerful — autonomy, persistence, self-direction — are exactly what make a poorly designed one dangerous. The two problems that do the most damage, each pointing to a specific guardrail: 

Five more risks round out the honest picture: 

Weak verification invites reward hacking. If the verifier is weak — or the agent grades its own work — the loop satisfies the letter of the goal while missing its intent. A loop whose only check is the worker's self-assessment is just an agent agreeing with itself on repeat, with a cost meter running. 

Reliability degrades over long horizons. Per-step success compounds against you. Even a 95%-per-step model completes a 20-step task far less reliably — a strong argument for short loops with frequent verification over long autonomous runs. 

The review bottleneck doesn't disappear — it moves. A loop multiplies output. If your real constraint was already review capacity, a loop lengthens the queue rather than relieving it. 

Quality drift and "slop" when unattended. Left to run without inspection, loops accumulate low-quality changes that pass the checks but degrade the codebase — duplicated patterns, unnecessary churn, changes that satisfy a test without respecting the design. 

The deepest risk: outsourcing understanding. A loop can be used to move faster on work you understand or to avoid understanding the work at all. The first compounds your leverage; the second quietly erodes it. 

What you are escaping: the babysitting loop 

It is worth seeing the starting point clearly — the manual workflow most people run today, where you are the loop and most of your time goes to the mechanical steps rather than the thinking. Loop engineering's goal is to take you out of every box except the first design step. 

The single most important decision happens before you build anything — should this even be a loop? Start simple and add autonomy only when it pays for itself. 

The litmus phrase: if you find yourself doing only the dumb, repeatable actions, that is a loop. If the task is "think of a better product strategy," it is not — step away and figure out the goal first. 

A measured conclusion 

Loop engineering is a genuine shift in how we work with coding agents, not merely a rebranding of automation. The core idea — design the system that drives the agent, verify with an independent checker, and persist state outside the context window — is sound and already in production for narrow, well-checked tasks. 

It is also early. Multi-step reliability still degrades as loops grow longer and more complex, tooling is maturing, and the discipline rewards careful scoping over ambition. The pragmatic path: start with one repetitive, machine-verifiable, reversible task; build the smallest loop that closes the feedback-and-verify cycle; and expand only once that loop earns its keep. 

The job is changing from operating the agent to engineering the loop it runs inside . The teams that learn to design good loops — with real stop conditions, independent verification, and durable memory — will get the leverage. The ones that wrap a retry in a cron job and call it autonomous will mostly get a larger bill. 

Sources and further reading 

This piece synthesizes the public discussion of loop engineering as it developed across written posts and video explainers. Particularly useful: 

Addy Osmani — Loop Engineering (the five-blocks-plus-memory breakdown). 

Peter Steinberger and Boris Cherny — the originating "write loops, not prompts" framing. 

"What's AI" (Louis-François Bouchard) — Loop Engineering: The New Way to Use Claude Code & Codex — the two-big-problems analysis and the worked morning-loop walkthrough. 

"Startup Ideas Podcast" (Greg Isenberg, with Ross Mike) — WTF Is an "AI Agent Loop"? Genius or Hype? — the skeptical case, the binary-vs-creative heuristic, and the scored code-review loop. 

Sean Kochel — Claude Code Creator: "Write Loops, Not Prompts" — the ReAct → AutoGPT → Ralph → /goal lineage and the three cost controls. 

Elie Steinbock — What is Loop Engineering? — the product-market-fit / business-as-loops framing. 

"Discover AI" — It's a Loop in a Wrapper — the LLM/loop/wrapper conceptual model. 

Load Comments 

← Hierarchical Clustering of Agent Traces for Discovering Unknown Failure Modes 

Claude Code as a GitHub-Native Agent: The Issue-to-Merge Development Loop → 

github linkedin scholar 

Saulius 

• 

© 2026 

• 
Saulius blog