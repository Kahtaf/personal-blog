# Loop engineering research brief

Research-only brief for the eventual post. Do not publish this as-is.

## The useful definition

Loop engineering is the layer above prompting/context/harness work: instead of steering an agent one prompt at a time, the engineer designs a repeatable system that wakes the agent, gives it work, checks the result, stores state, and decides whether to stop, retry, escalate, or run again.

The most concrete definition across sources is:

> A loop specification = trigger + goal + execution/handoff + verification + stopping rule + durable memory.

This is distinct from:

- an ordinary programming `while` loop,
- the internal tool-use loop every coding agent already runs,
- a cron job that blindly re-prompts the model,
- a long prompt with no independent check.

## Strong article thesis candidate

The hype says engineers should stop prompting agents and start writing loops. The better version is narrower: loops are useful when the work is repeated, bounded, observable, and verifiable. The engineer is not removed; they move to the outer loop, where their job is to define success, design checks, decide what may happen unattended, and preserve enough comprehension to remain accountable.

AgentMail's line to preserve: **Build the loop. Stay the engineer.**

## The core shift

Prompt engineering optimized one model call. Context engineering optimized what the model sees. Harness engineering optimized the environment and tools around one agent run. Loop engineering optimizes the repeated control system around many agent runs.

The practical shift is from:

- “How do I ask this agent better?”

to:

- “What wakes the agent?”
- “What state does it read?”
- “What is it allowed to do?”
- “Who or what can say no?”
- “When does it stop?”
- “What gets remembered for next time?”
- “Where does the human remain accountable?”

## Common loop primitives

Sources converge on these pieces:

1. **Trigger / automation** — manual, scheduled, event-driven, or proactive.
2. **Goal / contract** — a clear job, ideally with observable acceptance criteria.
3. **Handoff / isolation** — one task per agent, often one branch/worktree per attempt.
4. **Skills / context** — durable project knowledge, not a giant repeated prompt.
5. **Tools / connectors** — file system, shell, GitHub, Linear, Slack, browser, staging, MCP, etc.
6. **Verifier / evaluator** — tests, type checks, browser checks, model judge, second agent, or human gate.
7. **State / memory** — `STATE.md`, tickets, logs, run notes, or artifacts outside the context window.
8. **Stop and escalation rules** — success, no-op, blocked, stalled, exhausted; errors should not be mislabeled as success.
9. **Budget and risk controls** — iteration caps, token/cost caps, permission scopes, rollback paths.
10. **Human oversight** — especially before merges, deploys, purchases, deletes, messages, production writes, or irreversible actions.

## What makes a loop worth building

A loop is worth building when several conditions are true:

- The task repeats often enough to amortize setup.
- The output can be checked by a machine or a clear rubric.
- The agent can finish a useful unit without constantly handing partial work back.
- Failure is low-stakes, reversible, or gated before external action.
- The expected value beats token cost plus review cost.
- There is an obvious state artifact that can survive between runs.

Bad candidates:

- one-off tasks,
- highly ambiguous taste calls,
- high-stakes irreversible actions without a human gate,
- tasks where “done” cannot be observed,
- work where the verifier would be more expensive than just doing it manually.

## The verifier is the bottleneck

Many sources independently point to verification as the center of the discipline.

Key framing:

- The generator gives speed; the verifier gives permission to trust the speed.
- A loop without a real verifier becomes a machine for generating polished mistakes.
- The agent should not be the only judge of its own output.
- Tests, invariants, property checks, visual/browser checks, benchmark scores, and independent review are stronger than persuasive explanations.
- The verifier itself needs tests: feed it known-good and known-bad outputs.
- Assume the agent will optimize whatever you measure. Ask: “What is the laziest output that passes this check?”

This is where the eventual post can connect loop engineering to eval engineering: as loops become stronger, the bar they optimize against becomes the product.

## Human-in-the-loop is not a checkbox

The user agrees with the AgentMail view: engineers need to stay in the loop.

Important nuance from LoopRails and AgentMail:

- Human oversight only matters if the human has enough context, time, and detection affordances to catch the problem.
- A confirmation dialog after an opaque agent plan is a rubber stamp, not oversight.
- The useful human role is often the **outer loop**: reviewing failures, improving the verifier, sharpening goals, deciding which tasks deserve automation, and gating irreversible actions.
- Humans are worst at high-volume, low-signal review. If the loop produces 40 outputs and the human carefully reads the first 10, skims the next 15, and rubber-stamps the rest, the oversight has failed.

A strong post can argue that “human in the loop” should mean **engineered review moments**, not vibes:

- show the consequence and reversibility,
- show provenance and why the item reached the human,
- show disagreement/counter-evidence,
- provide diffs and validation evidence,
- keep interruption volume small and high-precision.

## Failure modes to preserve

1. **Verification debt** — output volume outruns checking quality.
2. **Comprehension rot** — the system changes faster than the engineer’s mental model.
3. **Cognitive surrender** — the loop feels competent, so the human stops having opinions.
4. **Token blowout** — vague goals, subagents, long contexts, and high frequency compound cost.
5. **Reward hacking** — the loop learns to satisfy the metric rather than the true goal.
6. **Context collapse** — long-running sessions forget original intent unless state lives on disk.
7. **No-progress spin** — repeated identical failures keep retrying without new information.
8. **Permission/accountability gaps** — nobody can answer which agent did what, with what authority.
9. **Benchmark overfit** — spectacular loop demos can optimize the benchmark and fail real review.
10. **Review fatigue** — human gates become symbolic when too many low-quality interruptions arrive.

## Concrete examples collected

- Addy Osmani morning triage loop: reads CI failures/issues/recent commits, writes findings to state, uses worktrees and subagents, opens PRs/tickets, escalates unresolved work.
- Claude Code `/goal`: run until a verifiable condition holds or turn cap is hit; separate evaluator checks whether the goal is done.
- Claude Code `/loop` / `/schedule`: recurring prompts for PR babysitting, deploy checks, Slack summaries, bug triage.
- OpenAI Agents SDK cookbook: traces + feedback + generated evals + Promptfoo + HALO + Codex handoff for harness improvement.
- Lenny/ChatPRD loop examples: daily PR review loop, weekly skills loop spawning subagents, Mozilla/Mythos security bug loop with verifier subagents.
- LoopEngineering.app examples: CI fix loop with validation evidence, independent checker, stop rule, and human approval before merge.
- Verdent safe-loop structure: observable contract, isolated execution, action-and-check cycle, review gate, exit/recovery state.
- Eesel support-loop analogy: confidence thresholds and simulation against past tickets as support-world stopping/verification logic.
- Cobus Greyling repo: loop-init, loop-audit, loop-cost, loop-sync, loop-context, pattern library.
- Saulius examples: scored code-review loop and front-end verification loop.

## X/Twitter discourse notes

See `twitter-findings.md` for raw links and excerpts. High-signal items include:

- Peter Steinberger: “you shouldn’t be prompting coding agents anymore. You should be designing loops that prompt your agents.”
- Boris Cherny discourse: often quoted as “I don’t prompt Claude anymore… My job is to write loops,” plus related posts on Claude Code subagents/background work/checkup.
- Andrew Ng: frames loop engineering as part of three loops for building products: agentic coding loop, developer feedback loop, external feedback loop.
- Karpathy: less directly “loop engineering,” but useful adjacent material on idea files, explicit file-based memory, and agents customizing/building from artifacts.
- Simon Willison: adjacent token/subagent judgement note; use carefully, not as a direct loop-engineering endorsement unless the specific tweet supports it.

Caution: X results include many hype summaries repeating the same Boris/Peter claims. Treat high engagement as evidence that the phrase spread, not as proof that the method is mature.

## Potential post shape later

1. **Cold open:** everyone says “write loops,” but the important question is who still understands and verifies the output.
2. **Definition:** loop spec, not just cron or a long prompt.
3. **Why now:** coding agents have tools, subagents, worktrees, skills, and scheduling; the primitives shipped into tools.
4. **The good version:** repeatable + checkable + bounded work; concrete examples.
5. **The missing half:** verifier, stop condition, state, and independent review.
6. **Why engineers must remain in the loop:** comprehension, accountability, human review moments.
7. **Checklist:** when to build a loop / when not to.
8. **Ending:** Build the loop, but stay the engineer.

## Claims to verify before drafting

- Exact Boris Cherny quote source and context. Many secondary posts repeat it; prefer original interview/transcript if available.
- Peter Steinberger’s exact wording and date. `twitter-findings.md` has a direct X link.
- Karpathy experiment / Shopify Liquid 53% speedup / benchmark-overfit story from AgentMail needs primary-source confirmation before using as fact.
- Stack Overflow survey claim about developers shipping code they do not understand needs direct survey source before publishing.
- Uber AI budget/token cap anecdote from AgentMail needs direct source before publishing.
- Mozilla/Mythos numbers from Lenny/ChatPRD should be verified against Mozilla/Brian Grinstead primary source if used prominently.
