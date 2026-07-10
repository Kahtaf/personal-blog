---
title: "\ud83c\udf99\ufe0f How I AI: How to write AI agent loops in Claude Code and Codex + How Claude Mythos found a 15-year-old bug in Mozilla Firefox | Brian Grinstead"
url: "https://www.lennysnewsletter.com/p/how-i-ai-how-to-write-ai-agent-loops"
final_url: "https://www.lennysnewsletter.com/p/how-i-ai-how-to-write-ai-agent-loops"
retrieved: 2026-07-09
content_type: "text/html; charset=utf-8"
source_type: article
---

🎙️ How I AI: How to write AI agent loops in Claude Code and Codex + How Claude Mythos found a 15-year-old bug in Mozilla Firefox | Brian Grinstead 

Subscribe Sign in 

How I AI 

🎙️ How I AI: How to write AI agent loops in Claude Code and Codex + How Claude Mythos found a 15-year-old bug in Mozilla Firefox 

Your weekly listens from How I AI, part of the Lenny’s Podcast Network 

Lenny Rachitsky 

Jun 22, 2026 

308 

1 

6 

Share 

How to design AI agent loops: schedules, goals, and subagents in Claude Code and Codex 

Listen now on YouTube • Spotify • Apple Podcasts 

Brought to you by: 

WorkOS —Make your app enterprise-ready today 

Runway —The creative AI platform for images, video and more 

In this hands-on tutorial, Claire explains the difference between heartbeats, crons, hooks, and goal-based loops, then builds real automations in Claude Code and Codex, including a daily PR-review loop and a weekly skills loop that spawns its own subagents. If you’ve heard “loop engineering” and wondered what it actually means, this is the beginner-friendly breakdown. 

Biggest takeaways: 

A loop is just a prompt that fires itself, nothing more exotic than that. The reason “loops” sound intimidating is that the hype cycle turned a basic automation concept into something mystical. Heartbeats, crons, and webhooks have been around forever. What’s new is pointing them at an AI agent instead of a batch job. 

Goals are the most powerful loop type, and the one most people get wrong. A goal loop sets an outcome and runs an agent against it until the outcome is validated or the agent gets stuck. It doesn’t stop on a timer; it stops when the work is actually done. Fuzzy success criteria means the agent loops forever, burning tokens, so my advice is to let Codex write its own goals, using OpenAI’s goal-writing guide as a starting point. 

Think about loops the way you think about onboarding an employee. Define the job: what they check, how often, what output you want, and who to contact when something’s wrong. “Every Friday at 10 a.m., review all merged PRs and identify skills our agents are missing” is a job description. It’s also a loop prompt. 

Your agent can have its own agents. This is where loops get truly powerful. The PR-review loop Claire built in Claude Code doesn’t just check PR status; it spins off dedicated subagents to babysit individual PRs until all merge checks are green. The skills loop in Codex identifies gaps and immediately spawns subagents to validate each new skill using a goal loop. 

Loops get expensive if you don’t write them carefully. If the success criteria is vague or the validation threshold is too thin, the agent will keep running and keep charging without meaningful progress. Monitor both cost and output quality from day one. 

The morning briefing in Claude Cowork is a perfect loop starter. A scheduled task that fires every morning, checks your calendar and email, and sends a summary to Slack is already a fully functional loop. No code required. From there, scaling up to PR reviews or skills identification in Claude Code or Codex is a natural next step. 

The power move is loops that generate their own subagent loops. In the Codex demo, Claire’s weekly automation spawned two named subagents that each ran their own goal loops to validate skills in real time. The ceiling on loop-based automation is basically “how well can you define the job?” not “how complex is the engineering?” 

Blog and detailed workflow walkthroughs from this episode: 

How I AI: Designing AI Agent Loops in Claude Code and Codex: https://www.chatprd.ai/how-i-ai/how-i-ai-designing-ai-agent-loops-in-claude-code-and-codex 
↳ Build a Self-Improving AI to Generate Agent Skills in Codex: https://www.chatprd.ai/how-i-ai/workflows/build-a-self-improving-ai-to-generate-agent-skills-in-codex 
↳ Automate Daily Pull Request Reviews with a Claude Code Agent: https://www.chatprd.ai/how-i-ai/workflows/automate-daily-pull-request-reviews-with-a-claude-code-agent 

How Claude Mythos found a 15-year-old bug in Mozilla Firefox | Brian Grinstead 

Listen now on YouTube • Spotify • Apple Podcasts 

Brought to you by: 

WorkOS —Make your app enterprise-ready today 

Metaview —The agentic recruiting platform for winning teams 

Brian Grinstead , distinguished engineer at Mozilla, breaks down how his team used AI agents to ship 423 Firefox security fixes in one month. He explains why the real unlock wasn’t just a better model, but the custom harness around it: scoring files, running goal loops, verifying bugs with subagents, and keeping humans in the review process. It’s a tactical look at how to point agents at a massive codebase and get fixes you can actually ship. 

Biggest takeaways: 

The Firefox security bug spike wasn’t just about the model; it was the harness too. While everyone focused on Mythos, the real story is that Firefox built a custom harness that gives AI agents the right tools to find, verify, and fix bugs. Brian says this is simpler than it looks: “It’s actually a reasonably simple wrapper around it. You just need to give it access to the right tools for the job.” 

Agents are relentless in a way humans can’t be. Agents will try 14, 15, 20 different approaches to trigger a bug without getting tired or losing focus. Brian found bugs that required the agent to try 14 times before succeeding. As Brian notes, “Cognitive energy declines over time in a way that agents don’t.” 

The verification loop is what eliminates false positives. Firefox uses a two-stage verification process: first, the agent must trigger an actual crash in their fuzzing build (a crystal-clear signal), and second, a verifier subagent checks that the bug report makes sense and doesn’t involve test-only configurations. By the time a bug reaches human engineers, there are almost no false positives. 

Agents get laser-focused on the specific task and miss the bigger pictu re. When the patching agent fixed a bug, it would often patch just the one vulnerable location. Human engineers would then look at the fix and say, “This is right, but we should also check three other similar places in the codebase.” 

Prioritization is essential when you have millions of lines of code. Firefox built a simple LLM judge that scores each file on two dimensions: likelihood of a memory safety issue, and ease of access from a webpage. Brian says this is “very, very simple” and anyone can replicate it. 

The harness can be built in an afternoon using vendor SDKs. Firefox started with Claude’s agent SDK, which is essentially a wrapper around Claude Code CLI that streams JSON and provides programmatic hooks. Brian’s advice: use the vendor-provided harnesses (Claude agent SDK, OpenAI agent SDK) rather than third-party frameworks, because the models are likely post-trained to work best with their own infrastructure. 

You should run multiple models and harnesses for security work. Because attackers will use whatever model and technique finds bugs, defenders need to scan with multiple approaches. Different models and harnesses spike on different strengths and will identify different vulnerabilities. 

This approach works for more than security—performance, tech debt, and UX are all viable targets. The same pattern applies: score and prioritize areas of your codebase, give the agent a constrained goal with verification criteria, and plug the results into your existing pipeline. Brian says they’re doing active work on performance optimization using the same harness structure. 

Blog and detailed workflow walkthroughs from this episode: 

How Mozilla Fixed 500 Security Bugs with Claude Mythos: https://www.chatprd.ai/how-i-ai/how-mozilla-fixed-500-security-bugs-with-mythos 
↳ Create an AI-Powered Patch and Verification Loop for Security Bugs: https://www.chatprd.ai/how-i-ai/workflows/create-an-ai-powered-patch-and-verification-loop-for-security-bugs 
↳ Use an LLM as a Security Judge to Prioritize Codebase Analysis: https://www.chatprd.ai/how-i-ai/workflows/use-an-llm-as-a-security-judge-to-prioritize-codebase-analysis 
↳ Build an AI Agentic Harness for Automated Security Bug Hunting: https://www.chatprd.ai/how-i-ai/workflows/build-an-ai-agentic-harness-for-automated-security-bug-hunting 

If you’re enjoying these episodes, reply and let me know what you’d love to learn more about: AI workflows, hiring, growth, product strategy—anything. 

Catch you next week, 
Lenny 

P.S. Want every new episode delivered the moment it drops? Hit “Follow” on your favorite podcast app. 

308 

1 

6 

Share 

Previous Next 

Discussion about this post 

Comments Restacks 

Mark S. Carroll 

Jun 22 

The real breakthrough with AI agents is usually not autonomy. 

It’s better supervision. 

That’s what I kept seeing across both examples here. People love to focus on the model, the loop, the subagents, the bug count. The quieter advantage is the harness: the goals, the checks, the scoring, the verification, and the human review path that keeps the whole thing from becoming fast nonsense. 

That’s the practical shift. 

The future probably won’t be people shouting “agentic” the loudest, but a place where those who know how to define the job well enough that the machine can fail safely 🤷‍♂️ 

Reply 

Share 

Top Latest Discussions 

No posts 

Ready for more? 

Subscribe 

© 2026 Substack Inc · Privacy ∙ Terms ∙ Collection notice 

Start your Substack Get the app 

Substack is the home for great culture