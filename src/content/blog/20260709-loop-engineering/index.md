---
title: "The human loop is the one nobody is engineering"
description: "Agent loops can write, test, and retry at machine speed. The hard part is designing the review moment where an engineer can still understand and redirect the work."
date: "Jul 9 2026"
---

Peter Steinberger's [monthly reminder](https://x.com/steipete/status/2063697162748260627) is now the slogan of the moment: stop prompting coding agents and start designing loops that prompt them.

The idea is real. A loop can wake an agent on a schedule, find work, hand it off, run checks, save state, and decide what happens next. Claude Code now describes turn-based, goal-based, time-based, and proactive loops in its [own guide](https://claude.com/blog/getting-started-with-loops). OpenAI's [agent-improvement example](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop) connects traces, feedback, evals, and an implementation handoff into a repeatable cycle. The primitive is here now, not in some distant agent future.

But the conversation keeps putting the interesting engineering on the machine side of the boundary.

What wakes the agent? How many subagents can it spawn? Does it use worktrees? Which model judges the goal? What is the token budget?

All good questions. Then the loop emits twelve PRs, each with a green test run and a friendly summary, and the human side of the system is usually: “please review.”

That is not a review loop. It is an inbox.

The hard problem is not merely letting an agent work unattended. It is designing the moment when a human can still understand what happened, catch the thing the loop missed, and make a decision that means something.

## “Human in the loop” is not a design

People reach for “human in the loop” as if it closes the safety argument. It does not.

A human can be technically in the loop while functionally absent. Give someone fifty opaque agent reports, an unfamiliar diff, and a green checkmark from a test suite they did not write. Put an Approve button at the bottom. You have not added meaningful oversight. You have created a rubber stamp with a person’s name on it.

The difference matters because agent loops change the shape of failure. The obvious failure is a runaway loop that spends too much money or keeps retrying the same broken task. At least that one makes noise. The quieter failure is the loop that exits cleanly and produces something plausible enough that nobody looks closely.

The [human-in-the-loop framework from LoopRails](https://looprails.dev/framework.html/) makes a useful distinction: oversight is only useful when the person has enough context, enough time, and enough ability to detect or correct the failure. A confirmation gate after an opaque plan does not create those things. It mostly records who to blame later.

This is why I think the missing discipline is **review-loop engineering**.

Loop engineering designs the system that prompts the agent. Review-loop engineering designs the system that makes the resulting work legible to the person still accountable for it.

## There are really three loops

Andrew Ng recently described [three loops for building products](https://x.com/AndrewYNg/status/2071988145667928442): an agentic coding loop, a developer feedback loop, and an external feedback loop from users and the world. That is a better frame than the popular story that agents simply replace a developer’s loop.

For agent-built software, I would make the split explicit:

| Loop | Runs at | Job | Typical failure |
| --- | --- | --- | --- |
| Agent loop | seconds to minutes | Make a change, use tools, react to feedback | Wrong implementation, hallucinated progress, repeated failure |
| Verifier loop | minutes | Test, inspect, score, or challenge the change | Weak test, reward hacking, correlated reviewer mistakes |
| Human loop | hours to days | Set direction, judge trade-offs, improve the system | Comprehension decay, review fatigue, rubber-stamping |

The first two are getting a lot of attention. They should. A loop without a real check is just a model agreeing with itself.

But the third loop is where the organization pays for everything the first two get wrong.

The agent loop is fast. The verifier loop can be fast. The human loop is slow because understanding is slow. It takes time to recognize that a passing test proves the wrong thing, that a change violates a product constraint the agent never saw, or that a clean local fix quietly created an operational mess somewhere else.

You cannot solve that mismatch by asking humans to review more output faster. You have to design for it.

## The verifier is necessary, but it is not the finish line

The strongest advice in the loop-engineering material is also the least controversial: do not let the maker grade its own homework.

Use tests. Use a browser check. Use an invariant. Use a separate evaluator. Run a second agent with a skeptical rubric. Have a human gate irreversible actions. Anthropic's [guide](https://claude.com/blog/getting-started-with-loops) makes the same point in product language: goal-based loops work best when “done” has a quantitative or deterministic check. The [OpenAI cookbook example](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop) goes further, turning traces and feedback into rerunnable evals rather than treating feedback as a comment thread that disappears.

That is the right direction. But a verifier is not an all-purpose substitute for engineering judgment.

A test suite tells you what the test suite knows how to ask. A model judge tells you what its rubric can see. A benchmark tells you what the benchmark rewards. Every loop is an optimizer pointed at those signals. If the signal is weak, the loop can produce an increasingly polished version of the wrong answer.

The useful question is not “does this pass on good work?” It is “what is the laziest thing that passes, and would I still accept it?”

That is a review question. Someone has to own it.

## Review artifacts should help people find errors, not accept explanations

Most agent summaries are optimized to reassure the reader:

> Fixed the checkout bug. Updated the test. Everything passes.

That is a status update. It is not review evidence.

A useful review packet should make it easier to disagree with the agent. It should include the evidence a skeptical engineer needs before they spend twenty minutes reconstructing the run from logs.

Something closer to this:

```md
## Agent run packet

Goal
Fix the checkout total when a discount and tax are both present.

What changed
- `checkout.ts`: apply the discount before tax.
- `checkout.test.ts`: add a case for a 10% discount and regional tax.

Evidence
- Before: `checkout.test.ts` returned 108.00; expected 107.10.
- After: targeted test, checkout suite, typecheck, and lint pass.

Verifier
- Independent reviewer checked the diff for deleted tests, weakened assertions,
  and unrelated changes.

Not verified
- Tax rules outside the tested region.
- The browser checkout flow.

Decision needed
Approve the product rule that discounts apply before tax, or route to finance.
```

The point is not that every run needs a giant report. That would be another kind of failure. The point is that the report should expose the boundary of knowledge.

What did we change? What did we prove? What did we not prove? What assumption is still carrying the decision? What does the human need to decide?

A green check only answers one of those questions.

## Review has an attention budget

The usual advice is to keep a human in the loop for high-risk actions. Fine. But humans also have a rate limit.

If an agent loop generates a trickle of high-quality, well-scoped review packets, a human can stay engaged. If it generates a flood of “looks good” summaries, the process decays predictably. The first few changes get careful reading. Then people scan. Then they learn that green checks usually mean no immediate disaster. Then the approval gate becomes a formality.

This is not a moral failure by reviewers. It is system behavior.

The review loop needs its own constraints:

- **Escalate only when a person can make a meaningful decision.** Do not interrupt someone because the agent is uncertain about a spelling change.
- **Batch low-risk work, but preserve exceptions.** A dependency bump with a clean lockfile diff is not the same as a migration touching auth.
- **Show the consequence before the action.** “This merges to production” is more useful than “approval required.”
- **Show why the item arrived here.** Was the test incomplete? Did two agents disagree? Did a budget cap stop the loop? Did the work touch a protected area?
- **Make non-coverage explicit.** “Not tested in the browser” is much more valuable than a vague claim that validation passed.
- **Treat review time as a budget.** If the loop produces more work than a team can understand, reduce the loop’s scope or improve the filters. Do not just hire more approvers.

The control plane around agents should optimize for human attention, not merely agent throughput.

## The engineer moves outward

The scary version of loop engineering says the engineer is being removed from the work. The useful version says the engineer moves outward.

They stop manually carrying every task across every turn. They spend more time deciding which tasks deserve a loop, writing the acceptance conditions, shaping the state the loop reads, reviewing failures, and turning repeated mistakes into stronger tests or skills.

That last part matters. A good review loop does not just reject bad output. It improves the next run.

When a reviewer finds that an agent changed the wrong layer, that feedback should become a constraint. When an agent’s browser check missed a visual regression, the check should become part of the loop. When an approval is difficult because the product decision was ambiguous, the ambiguity belongs in the spec, not in the next reviewer’s head.

This is how a loop earns more autonomy without asking for blind trust: it turns human judgment into artifacts the system can reuse.

Karpathy has made a related argument for [explicit, navigable, file-based knowledge](https://x.com/karpathy/status/2040572272944324650). The important part is not merely that the agent remembers. It is that people can inspect what the agent knows, change it, and see where the knowledge ends. The same rule should apply to review state.

A loop’s memory should not be a pile of transcripts nobody will read. It should be a living record of decisions, failed attempts, known boundaries, and the checks that now exist because a human caught something once.

## Start with a boring loop

The best first loop is not “run my engineering team while I sleep.” It is one repeated, bounded task where a bad result is easy to spot and cheap to undo.

A failing CI check is a good candidate. So is daily issue triage that creates drafts rather than tickets. So is a dependency-update loop that opens a PR but cannot merge it. So is a frontend check that compares a small, known UI state against an expected screenshot and hands a human the diff when it cannot decide.

The [safe-loop guidance from Verdent](https://www.verdent.ai/guides/tutorial/build-coding-agent-loop) gets the basics right: define an observable contract, isolate the work, check each attempt, cap retries and budget, and preserve the failure state for a human rather than spinning forever.

Then add a review packet before adding more agents.

If the packet makes a real engineer faster at finding the wrong thing, you have a loop worth extending. If it only makes the agent look busier, you have an expensive notification system.

## Build the loop. Engineer the review.

The new skill is not simply writing a better cron job around a coding agent. It is deciding where automation should stop, what evidence it owes a human, and how a human’s judgment becomes a better system instead of a delayed click.

The agent loop writes. The verifier loop checks. The human loop decides what still matters.

If we only build the first two, we will produce more output than anyone can responsibly own.

Build the loop. Then engineer the moment where someone can still say no.
