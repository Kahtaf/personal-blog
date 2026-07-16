# Source index: loop engineering

This is a research index, not a draft. Use it to choose which claims deserve to appear in the eventual post.

## User-provided / primary sources

1. `references/agent-mail-loop-engineering.md`
   - User-provided newsletter source.
   - Strongest angle: loop engineering only works if the engineer remains the oversight loop. Execution scales; attention does not. The article argues for keeping comprehension, accountability, and identity/permissions in view.

2. `references/articles/provided-addy-osmani-loop-engineering.md`
   - URL: https://addyosmani.com/blog/loop-engineering/
   - Defines loop engineering as replacing yourself as the person prompting the agent by designing the system that prompts it. Useful taxonomy: automations, worktrees, skills, connectors/plugins, subagents, and state/memory.
   - Important caveat: loops change the work but do not delete the engineer; verification, comprehension, and cognitive surrender get sharper.

3. `references/articles/provided-anthropic-getting-started-with-loops.md`
   - URL: https://claude.com/blog/getting-started-with-loops
   - Official Claude Code framing: turn-based, goal-based, time-based, and proactive loops. Good for definitions, concrete `/goal`, `/loop`, `/schedule` examples, token-control advice, and quality practices.
   - Useful phrasing: loops are agents repeating cycles of work until a stop condition is met.

4. `references/articles/provided-lenny-how-i-ai-agent-loops.md`
   - URL: https://www.lennysnewsletter.com/p/how-i-ai-how-to-write-ai-agent-loops
   - Concrete product/tutorial source. Good examples: PR review loops, skills loops, subagent loops, and Mozilla/Mythos security bug loop.
   - Strong quoteable idea: loops are not mystical; they are prompts that fire themselves with a validation strategy.

## Additional concrete sources collected

5. `references/articles/langchain-art-of-loop-engineering.md`
   - URL: https://www.langchain.com/blog/the-art-of-loop-engineering
   - Useful for mainstream tooling/vendor view and the phrase loopcraft. Pull for human input before sensitive tool calls and agent loop design patterns.

6. `references/articles/openai-agent-improvement-loop.md`
   - URL: https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop
   - Concrete runnable loop: traces → human/model feedback → evals → Promptfoo validation → HALO recommendations → Codex handoff.
   - Best use: concrete example of improvement loops where evidence becomes harness changes.

7. `references/articles/looprails-human-in-the-loop-framework.md`
   - URL: https://looprails.dev/framework.html
   - Human-in-the-loop framework. Useful for oversight design: grade by consequence, choose oversight mode, design the review episode, prove oversight works.
   - Strong angle: “human in the loop” is not enough; the oversight moment must actually help a human detect and correct errors.

8. `references/articles/looprails-evaluation-driven-development.md`
   - URL: https://looprails.dev/article-evaluation-driven-development.html
   - Strong verifier-centered argument: the generator gets attention, but the verifier makes the loop trustworthy.
   - Best use: “the verifier is the point,” independent maker/checker, invariants, reward hacking, and testing the verifier itself.

9. `references/articles/eesel-loop-engineering-explained.md`
   - URL: https://www.eesel.ai/blog/loop-engineering
   - Applies loop engineering outside coding, especially support agents. Good for making the post broader than coding agents.
   - Useful five levers: tools, stopping conditions, context management, verification, guardrails.

10. `references/articles/verdent-coding-agent-loop-stops-safely.md`
   - URL: https://www.verdent.ai/guides/tutorial/build-coding-agent-loop
   - Practical safety guide: observable contract, iteration/budget caps, isolated execution, independent checks, review gates, and recovery paths.
   - Good for a “when to build one” checklist.

11. `references/articles/arxiv-stop-hand-holding-coding-agent.md`
   - URL: https://arxiv.org/html/2607.00038v1
   - Position-paper treatment: loop specification as trigger + goal + verification + stopping rule + memory, distinct from programming loops and internal agent cycles.
   - Useful for vocabulary and taxonomy; treat empirical claims cautiously until checked.

12. `references/articles/cobusgreyling-loop-engineering-github.md`
   - URL: https://github.com/cobusgreyling/loop-engineering
   - Reference implementation/tooling repo. Useful for concrete artifacts: loop-init, loop-audit, loop-cost, loop-sync, patterns such as daily triage, PR babysitter, CI sweeper, dependency sweeper.

13. `references/articles/loopengineering-app-tools.md`
   - URL: https://loopengineering.app/
   - Tool/pattern site focused on safe loop specs. Useful for loop templates, validation evidence, human approval before merge/deploy, stop rules, and budget caps.

14. `references/articles/explainx-loop-engineering-coding-agents.md`
   - URL: https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026
   - Broad explainer with lineage: ReAct → AutoGPT → Ralph → `/goal` → orchestration loops. Useful for differentiating a real loop from cron plus retries.

15. `references/articles/saulius-loop-engineering-systems.md`
   - URL: https://saulius.io/blog/loop-engineering-systems-that-drive-agents
   - Practical architecture article. Good for worker/verifier/memory framing and examples like scored code-review loops and front-end verification loops.

16. `references/articles/ai-builder-club-loop-engineering-guide.md`
   - URL: https://www.aibuilderclub.com/blog/loop-engineering-guide-2026
   - Strong “verifier is the bottleneck” framing; mentions Andrew Ng’s three loops and the idea that the human’s context advantage becomes the verifier.

## X/Twitter research

- Raw files: `raw-social/*.json`
- Synthesized findings: `notes/twitter-findings.md`
- Searched queries:
  - `"loop engineering"`
  - `"loops" "Claude Code"`
  - `"designing loops" agents`
  - `"agent loops" "Claude Code"`
  - `"My job is to write loops"`
- Pulled recent posts for: `bcherny`, `steipete`, `karpathy`, `addyosmani`, `swyx`, `simonw`, `AndrewYNg`, `rasbt`.

## Draft-use caution

Many sources repeat the same viral claims. For the eventual post, avoid making it look like ten independent authorities discovered the same thing if they are all downstream of Steinberger/Boris/Addy. Use the repeated pattern as evidence of discourse momentum, not proof of correctness.
