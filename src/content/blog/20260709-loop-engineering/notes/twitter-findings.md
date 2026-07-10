# X/Twitter loop-engineering research

Retrieved: 2026-07-09

Raw JSON files live in `../raw-social/`. This file keeps high-signal items surfaced for drafting later.

## High-signal tweets/posts

- @karpathy · likes 26837 · views 7197710 · 2026-04-04T16:45:23+00:00 · [2040470801506541998](https://x.com/karpathy/status/2040470801506541998)
  - Source file: `user_karpathy_recent.json`
  - Wow, this tweet went very viral! I wanted share a possibly slightly improved version of the tweet in an "idea file". The idea of the idea file is that in this era of LLM agents, there is less of a point/need of sharing the specific code/app, you just share the idea, then the other person's agent customizes & builds it for your specific needs. So here's the idea in a gist format: https://t.co/NlAfEJjtJV You can give this to your agent and it can build you your own LLM wiki and guide you on how to use it etc. It's intentionally kept a little bit abstract/vague because there are so many directions to take this in. And ofc, people can adjust the idea or contribute their own in the Discussion which is cool.

- @karpathy · likes 20872 · views 4522964 · 2026-04-09T20:10:52+00:00 · [2042334451611693415](https://x.com/karpathy/status/2042334451611693415)
  - Source file: `user_karpathy_recent.json`
  - Judging by my tl there is a growing gap in understanding of AI capability. The first issue I think is around recency and tier of use. I think a lot of people tried the free tier of ChatGPT somewhere last year and allowed it to inform their views on AI a little too much. This is a group of reactions laughing at various quirks of the models, hallucinations, etc. Yes I also saw the viral videos of OpenAI's Advanced Voice mode fumbling simple queries like "should I drive or walk to the carwash". The thing is that these free and old/deprecated models don't reflect the capability in the latest round of state of the art agentic models of this year, especially OpenAI Codex and Claude Code. But that brings me to the second issue. Even if people paid $200/month to use the state of the art models, a 

- @steipete · likes 19841 · views 8461384 · 2026-06-07T18:58:39+00:00 · [2063697162748260627](https://x.com/steipete/status/2063697162748260627)
  - Source file: `search_3_designing_loops_agents.json`
  - Here’s your monthly reminder that you shouldn’t be prompting coding agents anymore. You should be designing loops that prompt your agents.

- @bcherny · likes 19635 · views 3059127 · 2026-06-28T23:45:25+00:00 · [2071379474277613732](https://x.com/bcherny/status/2071379474277613732)
  - Source file: `user_bcherny_recent.json`
  - As engineering, product, design, DS, etc. melt into a new kind of role, I was reflecting on what roles might look like in the future. For example, when I look at the Claude Code team I see what I think is five archetypes: 1. Prototyper: comes up with brand new ideas; churns out many ideas, most of which don't ship 2. Builder: quickly turns a prototype/idea into production-grade product/infra 3. Sweeper: cleans up the UI, simplifies the code and system, unships, optimizes performance 4. Grower: takes a product that has been built and iterates on it to improve Product-Market Fit 5. Maintainer: owns a mature system to make it secure, reliable, fast, and efficient as it scales Many people span across 2 roles, and sometimes 3 roles. I also notice that these roles are not really tied to job func

- @ClaudeDevs · likes 16931 · views 5544247 · 2026-07-06T19:08:45+00:00 · [2074208949205881033](https://x.com/ClaudeDevs/status/2074208949205881033)
  - Source file: `search_2_loops_Claude_Code.json`
  - https://t.co/v694m8Eaj6

- @bcherny · likes 9885 · views 635838 · 2026-06-29T17:31:10+00:00 · [2071647677591466098](https://x.com/bcherny/status/2071647677591466098)
  - Source file: `user_bcherny_recent.json`
  - In the next version of Claude Code: subagents run in the background by default, so you can keep talking to Claude while your subagents work If you want your agent to run in the foreground, just tell Claude

- @bcherny · likes 9200 · views 523612 · 2026-07-08T23:22:27+00:00 · [2074997570317779038](https://x.com/bcherny/status/2074997570317779038)
  - Source file: `user_bcherny_recent.json`
  - New in Claude Code: /checkup Run /checkup to: 1. Clean up unused skills/MCPs/plugins and save context 2. Dedup your local CLAUDE.md against the checked in CLAUDE.md 3. Break up root CLAUDE.md into nested CLAUDE.md's + skills 4. Turn off slow hooks 5. Update your Claude Code to the latest version 6. Enable auto mode by default 7. Pre-approve frequently denied read-only commands .. And a few other goodies. /checkup confirms with you before making any changes. Enjoy!

- @karpathy · likes 9085 · views 1439838 · 2026-04-04T23:28:36+00:00 · [2040572272944324650](https://x.com/karpathy/status/2040572272944324650)
  - Source file: `user_karpathy_recent.json`
  - Farzapedia, personal wikipedia of Farza, good example following my Wiki LLM tweet. I really like this approach to personalization in a number of ways, compared to "status quo" of an AI that allegedly gets better the more you use it or something: 1. Explicit. The memory artifact is explicit and navigable (the wiki), you can see exactly what the AI does and does not know and you can inspect and manage this artifact, even if you don't do the direct text writing (the LLM does). The knowledge of you is not implicit and unknown, it's explicit and viewable. 2. Yours. Your data is yours, on your local computer, it's not in some particular AI provider's system without the ability to extract it. You're in control of your information. 3. File over app. The memory here is a simple collection of files 

- @AnatoliKopadze · likes 8965 · views 1895472 · 2026-06-21T13:41:03+00:00 · [2068690663919530207](https://x.com/AnatoliKopadze/status/2068690663919530207)
  - Source file: `search_2_loops_Claude_Code.json`
  - Anthropic engineers just showed how they build a full app from scratch, using a loop of agents 40 minutes from the team behind Claude Code they used three agents: one to plan, one to build, one to judge, cycling until the app actually works the winners won't have the smartest model, they'll have the best loop watch it, then read the full guide on how to actually use loops below

- @AndrewYNg · likes 8303 · views 620701 · 2026-06-30T16:04:04+00:00 · [2071988145667928442](https://x.com/AndrewYNg/status/2071988145667928442)
  - Source file: `search_1_loop_engineering.json`
  - “Loop engineering” is a hot buzzphrase after mentions of it by Boris Cherny (Claude Code’s creator) and Peter Steinberger (OpenClaw's creator) went viral on social media. Loops are now a key part of how we get AI agents to iterate at length to build software. In this letter, I’d like to share my 3 key loops, shown in the image below, for building 0-to-1 products. These loops guide not just how I build software, but also how I decide what software to build. Agentic coding loop: Given a product specification and optionally a set of evals (that is, a dataset against which to measure performance), we can have an AI agent write code, test its work, and keep iterating until the code is bug-free and meets its specification. This idea of closing the loop took off around the end of last year, and i

- @addyosmani · likes 8037 · views 2353222 · 2026-06-08T23:30:35+00:00 · [2064127981161959567](https://x.com/addyosmani/status/2064127981161959567)
  - Source file: `search_3_designing_loops_agents.json`
  - https://t.co/hIe0UX7z6T

- @OpenAI · likes 6993 · views 1656382 · 2026-07-08T21:41:33+00:00 · [2074972179385720836](https://x.com/OpenAI/status/2074972179385720836)
  - Source file: `user_steipete_recent.json`
  - We audited SWE-Bench Pro, one of the most widely used AI coding benchmarks, and found it no longer reliably measures frontier coding capability. We find 30% of SWE-Bench Pro tasks to be broken, and are retracting our previous recommendation that the research community use it as a leading coding eval. https://t.co/wDdSEjBe4F

- @mitchellh · likes 6348 · views 964236 · 2026-07-08T14:27:40+00:00 · [2074862990214787301](https://x.com/mitchellh/status/2074862990214787301)
  - Source file: `user_steipete_recent.json`
  - I had early access to 5.6/Sol for ~month. Sol is my default. It is faster, plans/judges just as good as Fable, and I think produces better overall work. I’ll reach for Fable still for highly targeted debug or performance work with clear reward functions. A cheeky way I describe Sol vs Fable to my friends is that Sol is a charismatic, efficient, talented coworker you’re jealous of. Fable is a genius recluse that is brilliant at its fixations but doesn’t go out, doesn’t date, and you don’t want to hang out with them much lol. Fable is undefeated at highly targeted debug/security/performance goals. It’s a sight to behold and I was never able to get Sol to push as hard in this category. I’ll keep using it for this. Sol is better or comparable at everything else, in my experience. Give it a sho

- @karpathy · likes 6166 · views 1241058 · 2026-04-30T17:28:50+00:00 · [2049903821095354523](https://x.com/karpathy/status/2049903821095354523)
  - Source file: `user_karpathy_recent.json`
  - Fireside chat at Sequoia Ascent 2026 from a ~week ago. Some highlights: The first theme I tried to push on is that LLMs are about a lot more than just speeding up what existed before (e.g. coding). Three examples of new horizons: 1. menugen: an app that can be fully engulfed by LLMs, with no classical code needed: input an image, output an image and an LLM can natively do the thing. 2. install .md skills instead of install .sh scripts. Why create a complex Software 1.0 bash script for e.g. installing a piece of software if you can write the installation out in words and say "just show this to your LLM". The LLM is an advanced interpreter of English and can intelligently target installation to your setup, debug everything inline, etc. 3. LLM knowledge bases as an example of something that w

- @Google · likes 5903 · views 1726346 · 2026-05-19T17:36:34+00:00 · [2056791134295273554](https://x.com/Google/status/2056791134295273554)
  - Source file: `user_addyosmani_recent.json`
  - Introducing Gemini Spark ✨ It’s your 24/7 personal AI agent that helps you navigate your digital life, taking action on your behalf, and under your direction. 🧠 It runs on Gemini 3.5 and is built on @Antigravity, so it can perform long-running tasks easily in the background. ⏱️ And because it runs on dedicated virtual machines on Google Cloud, you don’t even need to keep your laptop open. 🧰 Spark will integrate seamlessly with Google tools, and soon with third parties through MCP. #GoogleIO

- @AndrewYNg · likes 5396 · views 815456 · 2026-05-12T16:25:23+00:00 · [2054236506756370865](https://x.com/AndrewYNg/status/2054236506756370865)
  - Source file: `user_AndrewYNg_recent.json`
  - There will be no AI jobpocalypse. The story that AI will lead to massive unemployment is stoking unnecessary fear. AI — like any other technology — does affect jobs, but telling overblown stories of large-scale unemployment is irresponsible and damaging. Let’s put a stop to it. I’ve expressed skepticism about the jobpocalypse in previous posts. I’m glad to see that the popular press is now pushing back on this narrative. The image below features some recent headlines. Software engineering is the sector most affected by AI tools, as coding agents race ahead. Yet hiring of software engineers remains strong! So while there are examples of AI taking away jobs, the trends strongly suggest the net job creation is vastly greater than the job destruction — just like earlier waves of technology. Fu

- @mvanhorn · likes 5178 · views 3686611 · 2026-06-08T06:08:18+00:00 · [2063865685558903149](https://x.com/mvanhorn/status/2063865685558903149)
  - Source file: `search_2_loops_Claude_Code.json`
  - https://t.co/DM0CAuyprS

- @simonw · likes 4877 · views 413275 · 2026-07-03T18:52:16+00:00 · [2073117641020215566](https://x.com/simonw/status/2073117641020215566)
  - Source file: `user_simonw_recent.json`
  - The most interesting Fable tip I've heard so far is to let the model use its own judgement as much as possible I told it "For all coding tasks use your judgement to decide an appropriate lower power model and run that in a subagent" and it seems to be saving a lot of tokens

- @sairahul1 · likes 4540 · views 1798970 · 2026-06-09T09:34:16+00:00 · [2064279904989147577](https://x.com/sairahul1/status/2064279904989147577)
  - Source file: `search_2_loops_Claude_Code.json`
  - Claude Code's creator said something that stopped me cold: "I don't prompt Claude anymore. I write loops — and the loops do the work. My job is to write loops." Most developers are still crafting the perfect prompt. The person who built the tool moved past prompting entirely. In 30 minutes Boris reveals his actual daily Claude Code setup. Claude Code + loops + dynamic workflows. Worth more than any $500 vibe-coding course. Watch it. Then read this - everything you need to know about loops to actually apply what he says ↓ Bookmark both. This is your weekend.

- @AndrewYNg · likes 4530 · views 578542 · 2026-06-01T15:58:45+00:00 · [2061477558693384395](https://x.com/AndrewYNg/status/2061477558693384395)
  - Source file: `user_AndrewYNg_recent.json`
  - One of the new, buzzy jobs in Silicon Valley is the AI Forward Deployed Engineer (FDE), an engineer who is embedded within a client organization to help customize solutions, such as building and tuning agentic workflows that suit the client’s particular needs. I’ve heard from people who are wondering anew about the FDE career path since OpenAI and Anthropic started building new teams to place FDEs within client organizations. The rise of FDEs for AI workloads is one way AI is creating new jobs (and why the jobpolcalypse narrative of upcoming job market collapse is false -- there will be many AI and non-AI jobs). However, I believe there will be far more AI Engineer jobs than FDEs, as I explain below. The FDE role was pioneered about two decades ago by Palantir, which sent engineers to gove

- @karpathy · likes 4138 · views 555575 · 2026-04-09T20:38:48+00:00 · [2042341482531864741](https://x.com/karpathy/status/2042341482531864741)
  - Source file: `user_karpathy_recent.json`
  - Someone recently suggested to me that the reason OpenClaw moment was so big is because it's the first time a large group of non-technical people (who otherwise only knew AI as synonymous with ChatGPT as a website) experienced the latest agentic models.

- @bcherny · likes 3820 · views 413443 · 2026-07-06T21:40:50+00:00 · [2074247226038063316](https://x.com/bcherny/status/2074247226038063316)
  - Source file: `user_bcherny_recent.json`
  - This is our first time telling the story of how we first built and launched Claude Code, starting with its origins in Anthropic safety research. So much more to do. We are 1% done.

- @jayair · likes 3427 · views 657498 · 2026-07-08T18:51:33+00:00 · [2074929399842078839](https://x.com/jayair/status/2074929399842078839)
  - Source file: `user_steipete_recent.json`
  - We've usually stayed away from model comparisons but 5.6 vs Fable is a unique situation We've never had a case where the team is so completely convinced on which one is better Here's the timeline of our experience with it - We test early versions of 5.6 for a couple of weeks and have a great time, it feels like a step change improvement, enabling new workflows - We get to try Fable and don't think it's not as good, I personally would take this experience with a grain of salt, there tends to be a bias when trying a new model when you already like another - Fable and 5.6 are taken away because of the regulatory issues - Our team is literally depressed that 5.6 is gone, we are looking for anything that could even partly replace it - Fable comes back, and here's where it gets interesting, you 

- @AndrewYNg · likes 3360 · views 249772 · 2026-05-11T15:20:59+00:00 · [2053857910451827061](https://x.com/AndrewYNg/status/2053857910451827061)
  - Source file: `user_AndrewYNg_recent.json`
  - I'm delighted that @coursera and @udemy have come together as one company to serve learners. Both Coursera and Udemy were founded with the belief that access to high-quality education changes lives. Over the years, both companies have advanced this goal, creating opportunities for individuals, organizations, and communities around the world. That role is even more important now, as AI is changing the nature of work and increasing the need for continuous learning. Helping people build job-relevant skills will be critical to how we create a better world. By combining the strengths of both ‌companies, we can better serve this need. We bring together a broader range of learning content, trusted instructors and educators, and engaging learning experiences. This creates new opportunities to make

- @sairahul1 · likes 2963 · views 4699168 · 2026-06-09T09:26:15+00:00 · [2064277888216555684](https://x.com/sairahul1/status/2064277888216555684)
  - Source file: `search_3_designing_loops_agents.json`
  - https://t.co/kZFYtIdHAj

- @petergostev · likes 2940 · views 959293 · 2026-07-08T18:06:58+00:00 · [2074918176354115886](https://x.com/petergostev/status/2074918176354115886)
  - Source file: `user_steipete_recent.json`
  - My view of: Fable 5 vs GPT-5.6-Sol. They are not easy models to compare, these are my vibes - take them as you will. My overall feel is that Fable is a 'wise owl' who is very thoughtful and very well spoken, GPT-5.6-Sol is like a rottweiler who will grab the problem by the throat and not let go until it is done. In other words, Fable, is a fundamentally smarter model - even at low reasoning it can be very insightful and writes in a clear compelling way. GPT-5.6-Sol on the other hand is extremely diligent, I can give it a list of 8 things to do and you will be sure that they will be done. Fable feels more arrogant to me, I was both to get it to build a new benchmark for me - 5.6 worked between 6 hours and 2 days (I tried several times) and it came up with very thoroughly tested, working ben

- @AndrewYNg · likes 2875 · views 458497 · 2026-04-15T16:16:38+00:00 · [2044449830605582629](https://x.com/AndrewYNg/status/2044449830605582629)
  - Source file: `user_AndrewYNg_recent.json`
  - New course: Spec-Driven Development with Coding Agents, built in partnership with @jetbrains, and taught by @paulweveritt. Vibe coding is fast, but often produces code that doesn't match what you asked for. This short course teaches you spec-driven development: write a detailed spec defining what to build, and work with your coding agent to implement it. Many of the best developers already build this way. A spec lets you control large code changes with a few words, preserve context across agent sessions, and stay in control as your project grows in complexity. Skills you'll gain: - Write a detailed specification to define your mission, tech stack, and roadmap, giving your agent the context it needs from the start - Plan, implement, and validate features in iterative loops using a spec as y

- @theo · likes 2683 · views 255618 · 2026-07-08T04:32:01+00:00 · [2074713090978132362](https://x.com/theo/status/2074713090978132362)
  - Source file: `user_steipete_recent.json`
  - I would like to add that OpenAI has been awesome to work with despite the obvious government-related setbacks. They've been more transparent than I'd ever have expected, and they did a good job keeping us in the loop during the confusion. The only "restriction" is that they've requested is that we wait on posting our formal content about the model (blog posts, videos, podcasts etc) until Thursday. They've given us ZERO restrictions on what we can and can't say. Every employee involved with early access program deserves a promotion and a shitload of praise. They're so, idk, real? Hard to find the right words. I'm just thankful they make this so easy for us

- @bcherny · likes 2655 · views 408475 · 2026-07-02T20:20:34+00:00 · [2072777472970563995](https://x.com/bcherny/status/2072777472970563995)
  - Source file: `user_bcherny_recent.json`
  - Artifacts in Claude Code have been life changing. Excited to expand to Pro and Max!

- @EXM7777 · likes 2648 · views 1634728 · 2026-07-03T14:06:29+00:00 · [2073045719020343705](https://x.com/EXM7777/status/2073045719020343705)
  - Source file: `search_2_loops_Claude_Code.json`
  - https://t.co/zXM38P3HGs

- @rasbt · likes 2281 · views 112367 · 2026-06-27T14:07:26+00:00 · [2070871630201463137](https://x.com/rasbt/status/2070871630201463137)
  - Source file: `user_rasbt_recent.json`
  - I put together a new article on setting up local coding agents with open-weight models. Everything runs 100% locally. I thought it might be useful putting this together because many people asked me about my setup in the past, and I thought it would also motivate people to get started tinkering with local models for serious work (yes, things got incredibly capable this year with better LLMs and better harnesses). So, here's a walkthrough of how to connect a local LLM to a local coding harness (could be Claude Code or Codex, which you may already be familiar with). I also included some assessment notes that are useful as a checklist to select between and consider certain LLMs over others: - Checking RAM usage at long contexts to see if the model is suitable for real work - Measuring prefill 

- @milesdeutscher · likes 2271 · views 427862 · 2026-07-03T20:34:01+00:00 · [2073143246428221562](https://x.com/milesdeutscher/status/2073143246428221562)
  - Source file: `search_1_loop_engineering.json`
  - I don't prompt Claude Code anymore. I have loops running that prompt Fable, and my job is just to write loops. This is the Boris Cherny method, and I have to say, it's extremely powerful. Everything you need to get started with loop engineering (as a complete beginner): https://t.co/ohwQayZMWN

- @AndrewYNg · likes 2187 · views 279873 · 2026-05-22T17:19:35+00:00 · [2057874024672469493](https://x.com/AndrewYNg/status/2057874024672469493)
  - Source file: `user_AndrewYNg_recent.json`
  - Harvard University just voted to limit the number of A grades given in undergraduate classes to about 20% of the class. I’m not in favor of this. It deeply runs counter to how I believe education should be. We should hold a high bar, but also work mightily to support the success of 100% of learners, rather than a fraction. Harvard’s administration took this step — over the objections of a large fraction of the student body — to counter grade inflation. Grade inflation is real: Many universities have been awarding A and B grades to ever larger fractions of students, and this has caused grade point averages (GPAs) to become less useful as signals of student skill. At the same time, we want students to succeed. The heart of the question is the role of educational institutions. Should our goal

- @EXM7777 · likes 2006 · views 667857 · 2026-07-06T15:48:07+00:00 · [2074158459545854232](https://x.com/EXM7777/status/2074158459545854232)
  - Source file: `search_2_loops_Claude_Code.json`
  - https://t.co/BNuZ1GirbS

- @0xMovez · likes 1953 · views 466686 · 2026-06-05T18:49:38+00:00 · [2062970118033023115](https://x.com/0xMovez/status/2062970118033023115)
  - Source file: `search_2_loops_Claude_Code.json`
  - Claude Code creator: "I don’t prompt Claude anymore. What I mostly use now is loops. I create loops - they do the rest of my job." In 24 minutes, Boris reveals his real daily Claude Code setup: Claude + loops + routines + dynamic workflows Worth more than a $500 vibe-coding course

- @AndrewYNg · likes 1930 · views 365309 · 2026-04-27T15:58:13+00:00 · [2048793852702757151](https://x.com/AndrewYNg/status/2048793852702757151)
  - Source file: `user_AndrewYNg_recent.json`
  - AI-native software engineering teams operate very differently than traditional teams. The obvious difference is that AI-native teams use coding agents to build products much faster, but this leads to many other changes in how we operate. For example, some great engineers now play broader roles than just writing code. They are partly product managers, designers, sometimes marketers. Further, small teams who work in the same office, where they can communicate face-to-face, can move incredibly quickly. Because we can now build fast, a greater fraction of time must be spent deciding what to build. To deal with this project-management bottleneck, some teams are pushing engineer:product manager (PM) some teams are pushing engineer:product manager (PM) ratios downward from, say, 8:1 to as low as 

- @mikenevermiss · likes 1594 · views 1872488 · 2026-06-15T06:03:00+00:00 · [2066401066518802637](https://x.com/mikenevermiss/status/2066401066518802637)
  - Source file: `search_3_designing_loops_agents.json`
  - https://t.co/tlLZjVprSj

- @0x_kaize · likes 1581 · views 156717 · 2026-07-07T18:53:46+00:00 · [2074567568635899962](https://x.com/0x_kaize/status/2074567568635899962)
  - Source file: `search_2_loops_Claude_Code.json`
  - Claude Code just dropped "Getting Started with Loops" This is their first official document about Loop Engineering. Spoiler: prompt engineering didn't survive. Here's the full guide in one post: 1. Turn-based Every prompt you send already runs as a loop: Claude gathers context, takes action, checks its own work, and repeats until it decides the task is done or realizes it needs your input. 2. Goal-based You define what "done" looks like with /goal, and Claude keeps iterating toward it. Every time it tries to stop, a separate evaluator model checks your condition - if it's not met, Claude gets sent back to work until the goal is reached or the turn limit hits. 3. Time-based This is the /loop command: нou set an interval and a prompt fires on schedule. For example, every 5 minutes Claude che

- @AndrewYNg · likes 1452 · views 208666 · 2026-05-07T16:15:49+00:00 · [2052422157310083493](https://x.com/AndrewYNg/status/2052422157310083493)
  - Source file: `user_AndrewYNg_recent.json`
  - New course: Build agents that respond to users with not only plaintext, but custom UIs like charts, forms, and whiteboards, generated on demand and displayed right in the chat. This short course is built in partnership with @CopilotKit and taught by @ataiiam, co-founder of CopilotKit. You'll learn three approaches: Your agent can pick from custom components you build, like charts and forms. It can compose new layouts from a set of building blocks you provide, like rows, cards, and text. Or it can incorporate existing third-party apps, like a whiteboard or a calendar, right inside the conversation. Skills you’ll gain: - Build agents that render custom components like charts and forms on demand - Build an app where the agent and user collaborate on shared data, beyond just the chat window - 

- @mikenevermiss · likes 1166 · views 165315 · 2026-06-29T08:39:38+00:00 · [2071513914504802525](https://x.com/mikenevermiss/status/2071513914504802525)
  - Source file: `search_1_loop_engineering.json`
  - this is f*cking dangerous someone just open sourced the entire "LOOP ENGINEERING" framework for free the guy who built Claude Code at Anthropic said it himself: "I don't prompt Claude anymore. I have loops running that prompt Claude. My job is to write loops. stop prompting your agent. build the thing that prompts it for you. discover → plan → execute → verify → repeat you used to be inside that loop loop engineering is you stepping out of it entirely the repo includes: - 6 production ready patterns (daily triage, CI sweeper, PR babysitter) - clone and run starters for Claude Code, Codex, and Grok - a loop readiness CLI that scores your codebase - SKILL. md templates, STATE.md spine, full safety docs use this one command to start(copy/paste): npx @cobusgreyling/loop-init • --pattern daily-

- @simonw · likes 1156 · views 108775 · 2026-07-05T01:06:32+00:00 · [2073574214280544746](https://x.com/simonw/status/2073574214280544746)
  - Source file: `user_simonw_recent.json`
  - Somewhat humbling to have Claude Fable do a final review of some software that you're about to release and have it then find (and fix) FIVE release blockers, for an estimated (unsubsidized) cost of $149.25 https://t.co/9621pMmlmJ

- @AndrewYNg · likes 1154 · views 131592 · 2026-05-20T17:08:55+00:00 · [2057146565500998024](https://x.com/AndrewYNg/status/2057146565500998024)
  - Source file: `user_AndrewYNg_recent.json`
  - New course: Build AI agents that generate images and videos -- an under-explored frontier. A key to performance is having the agent evaluate its own output, and iterate to improve quality. This short course is built together with @googlecloudtech and taught by Katie Nguyen and Wafae Bakkali. You'll learn three evaluation techniques and combine them in an agent: image-text similarity scoring to check the output matches the prompt, an LLM judge that scores against custom criteria like brand consistency, and structured rubrics that break a prompt into verifiable yes/no questions like "is the subject in the frame?" and "does the camera motion match?" Skills you'll gain: - Learn image and video prompt engineering - Build an image agent that turns brand guidelines into UI mockups - Build a video

- @zodchiii · likes 985 · views 120042 · 2026-06-24T11:29:37+00:00 · [2069744750496772379](https://x.com/zodchiii/status/2069744750496772379)
  - Source file: `search_4_agent_loops_Claude_Code.json`
  - A senior Anthropic engineer just published the clearest blueprint on "How to give your AI agent a real memory" and it's a 15-page PDF. Write → Consolidate → Recall → Apply • Write: after every attempt, the agent records what it tried and what happened. • Consolidate: it distills those raw attempts into a few reusable lessons, not a transcript dump. • Recall: before the next task, it reads those lessons first. • Apply: it skips the dead ends it already learned, even on a brand new problem. This is exactly how engineers now build agent loops in Claude Code. Read the paper, then grab the setup below 👇

- @petergostev · likes 924 · views 84993 · 2026-07-08T12:44:04+00:00 · [2074836917619675154](https://x.com/petergostev/status/2074836917619675154)
  - Source file: `user_steipete_recent.json`
  - When you get access to GPT-5.6-Sol in Codex, be careful with how you are using your tokens. It is trivial to blow though your Pro, if you do everything &amp; /fast via Max/Ultra with 10x sub-agents . Just be patient, do it when necessary, otherwise xHigh is a good default.

- @AndrewYNg · likes 893 · views 116937 · 2026-04-13T17:24:23+00:00 · [2043742105852621052](https://x.com/AndrewYNg/status/2043742105852621052)
  - Source file: `user_AndrewYNg_recent.json`
  - As AI agents accelerate coding, what is the future of software engineering? Some trends are clear, such as the Product Management Bottleneck, referring to the idea that we are more constrained by deciding what to build rather than the actual building. But many implications, like AI’s impact on the job market, how software teams will be organized, and more, are still being sorted out. The theme of our AI Developer Conference on April 28-29 in San Francisco is The Future of Software Engineering. I look forward to speaking about this topic there, hearing from other speakers on this theme, and chatting with attendees about it. We’re shaping the future, and I hope you will join me there! It is currently trendy in some technology and policy circles to forecast massive job losses due to AI. Even 

- @rasbt · likes 888 · views 60377 · 2026-06-26T14:42:54+00:00 · [2070518167399698490](https://x.com/rasbt/status/2070518167399698490)
  - Source file: `user_rasbt_recent.json`
  - Have been taking different local open-weight LLMs for a test drive in different harnesses (Qwen-Code, Codex, Claude Code). 30B Mixture-of-Expert models are kind of a nice sweet spot and can solve challenging problems. And they get roughly 40 tok/sec on a Mac or DGX Spark, which is similar to GPT 5.5 in a Pro subscription and totally useable for everyday work. More interesting is also the harness choice! Claude Code seems to be using 2x many tokens as Codex. Gemma 4 E2B is here just for reference to show that the tasks can't be trivially solved by smaller models. Just finishing a longer write-up about this and will share soon (likely tomorrow)!

- @milesdeutscher · likes 845 · views 472601 · 2026-07-01T18:13:20+00:00 · [2072383064031023497](https://x.com/milesdeutscher/status/2072383064031023497)
  - Source file: `search_2_loops_Claude_Code.json`
  - https://t.co/iEhIiQWCPB

- @teach_fireworks · likes 822 · views 163068 · 2026-06-18T14:46:24+00:00 · [2067619946071515148](https://x.com/teach_fireworks/status/2067619946071515148)
  - Source file: `search_4_agent_loops_Claude_Code.json`
  - Loop Engineering 精华文章汇总! 2026 年 Agent 开始聚焦在长任务后，重点慢慢变成了： 如何设计一个能够持续思考、执行、观察、验证和演进的循环系统？ 从 Codex 到 Claude Code，从 OpenHands 到各种 Coding Agent。 业余项目和生产级系统之间最大的差距是Harness 工程，包括 Loop。 Agent 能不能持续工作几十分钟甚至几个小时？ 能不能在失败后恢复？ 能不能控制成本？ 能不能知道什么时候停下来？ 这些问题，最终都落到了 Loop 设计上。 📚 推荐阅读 1. Loop Engineering — Addy Osmani https://t.co/bPvEN2wJIB 2. Loop Engineering — Firecrawl https://t.co/38BnoAs2g1 3. What Is the AI Agent Loop? — Oracle https://t.co/R17XAigxNf 4. Harness Engineering — OpenAI https://t.co/N3qBMBaybB 5. Harness Engineering for Coding Agent Users — Martin Fowler https://t.co/341m6RB95h 6. Agentic Loops: From ReAct to Loop Engineering https://t.co/uZIFZCeOVi 7. Loop Engineering for AI Agents (Memory-First) — Mem0 https://t.co/IbhAUs9CkD 📄 推荐论文 1. Agentic Harness Engineering https://t.co/D8CqREgstF 

- @rasbt · likes 765 · views 51172 · 2026-06-13T12:51:00+00:00 · [2065778965273354545](https://x.com/rasbt/status/2065778965273354545)
  - Source file: `user_rasbt_recent.json`
  - Cool new open-weight model by Cohere: a new lightweight 30B open-weight model for agentic coding tasks. This one builds on Command A+ using the parallel transformer design. Interestingly, even though it's almost half as big, it almost doubles the number of layers. Also, they say that it's been specifically developed for agentic coding, not just coding. I.e., the evaluation is inside a workflow, not just on a single prompt-to-code-answer task. For Terminal-Bench, the model has to use a terminal, inspect the environment, run commands, read outputs, etc. For SWE-Bench the model works on real GitHub-style software issues where it has to understand the repository, find relevant files, make a patch, pass tests, etc. SciCode and LiveCodeBench are more traditional because they mostly test whether 

- @AndrewYNg · likes 763 · views 115292 · 2026-04-14T16:22:22+00:00 · [2044088884989177991](https://x.com/AndrewYNg/status/2044088884989177991)
  - Source file: `user_AndrewYNg_recent.json`
  - I'm excited about voice as a UI layer for existing visual applications — where speech and screen update together. This goes well beyond voice-only use cases like call center automation. The barrier has been a hard technical tradeoff: low-latency voice models lack reliability, while agentic pipelines (speech-to-text → LLM → text-to-speech) are intelligent but too slow for conversation. Ashwyn Sharma and team at Vocal Bridge (an AI Fund portfolio company) address this with a dual-agent architecture: a foreground agent for real-time conversation, a background agent for reasoning, guardrails, and tool calls. I used Vocal Bridge to add voice to a math-quiz app I'd built for my daughter; this took less than an hour with Claude Code. She speaks her answers, the app responds verbally and updates t

- @vincentweisser · likes 723 · views 140872 · 2026-07-08T17:30:56+00:00 · [2074909109229584400](https://x.com/vincentweisser/status/2074909109229584400)
  - Source file: `user_swyx_recent.json`
  - We raised $130M @ $1B for our series A To build the open superintelligence stack for everyone Pre-training concentrated frontier AI in a handful of labs. RL changes who can build frontier AI and just works across almost any verifiable domain. We want to enable everyone to train their own agents. Companies can now own their model optimization loop: train directly on your product, optimize for your specific workflows, and build agents that improve continuously in production Owning this model <> product improvement loop is how you build a compounding moat in the agentic era Super grateful to serve over 6k+ customers, including many leading AI startups, neolabs and enterprises already building on our stack, and to our incredible team for shipping hardcore! We train open frontier models and shi

- @_vmlops · likes 635 · views 67919 · 2026-04-08T16:50:13+00:00 · [2041921566414663720](https://x.com/_vmlops/status/2041921566414663720)
  - Source file: `search_4_agent_loops_Claude_Code.json`
  - This might be the wildest AI engineering breakdown on the internet right now 🤯 After the Anthropic leak… Someone turned the ENTIRE Claude Code system into a readable playbook. 👉 https://t.co/d6OptOkWbC⁠ We’re talking: * 500K+ lines of real production AI agent logic * Broken down into 18 chapters you can actually learn from * Multi-agent systems, tool pipelines, memory, orchestration… all exposed This isn’t theory This is how a top-tier AI coding agent actually works under the hood Key ideas you’ll steal instantly: → Agent loops with async execution → Multi-agent “teams” coordinating tasks → File-based memory (no DB 🤯) → Context compression tricks → Tool execution pipelines at scale Basically… Instead of guessing how to build AI agents you now have a blueprint from a real system used by tho

- @Gavmn · likes 601 · views 43276 · 2026-07-08T18:07:59+00:00 · [2074918433314218459](https://x.com/Gavmn/status/2074918433314218459)
  - Source file: `user_steipete_recent.json`
  - As part of this launch, we updated the shader used to represent ChatGPT. I used Blender to quickly sketch a wide variety of options and had Codex inspect the file and translate the material to Metal and WebGL. https://t.co/Cw4MtPn3mT

- @AndrewYNg · likes 559 · views 74029 · 2026-05-05T15:53:24+00:00 · [2051691741150081122](https://x.com/AndrewYNg/status/2051691741150081122)
  - Source file: `user_AndrewYNg_recent.json`
  - Coding agents are accelerating different types of software work to different degrees. When we architect teams, understanding these distinctions helps us to have realistic expectations. Listing functions from most accelerated to least, my order is: frontend development, backend, infrastructure, and research. Frontend development — say, building a web page to serve descriptions of products for an ecommerce site — is dramatically sped up because coding agents are fluent in popular frontend languages like TypeScript and JavaScript and frameworks like React and Angular. Additionally, by examining what they have built by operating a web browser, coding agents are now very good at closing the loop and iterating on their own implementations. Granted, LLMs today are still weak at visual design, but

- @rasbt · likes 540 · views 39479 · 2026-05-27T15:07:44+00:00 · [2059652784404762711](https://x.com/rasbt/status/2059652784404762711)
  - Source file: `user_rasbt_recent.json`
  - The MiniMax M2 series was one of the most widely used open-weight LLM series earlier this year. Now, we got a technical report with some interesting tidbits. I summarized some of them below: 1. Full attention as an anti-trend?: They tried hybrid sliding-window attention variants (like so many others, like Xiaomi MiMo, Laguna, Gemma 4, Arcee, Olmo 3, etc.). But even though there were efficiency gains, they said that the production-quality tradeoffs were not worth it for M2. 2. Linear and sparse attention deployment issues: They found that linear and sparse attention are attractive on paper because they reduce the cost of long-context attention, but they are harder to make work well in a production agent system. In particular, they found that these efficient attention variants may be more fr

- @_catwu · likes 522 · views 56965 · 2026-07-08T18:36:11+00:00 · [2074925531519468012](https://x.com/_catwu/status/2074925531519468012)
  - Source file: `user_bcherny_recent.json`
  - Tomorrow at 10am PT I'm hosting a live walkthrough of how we progressed from single-player Claude Code to multi-player Claude Tag. Then, we're going deep on how Claude Tag actually works. AI used to finish your sentence. Then, it wrote entire features. Now, Claude Tag can monitor your channels, do proactive work for you, the whole team can steer it, and it remembers what you told it last week. Register: https://t.co/D8Lz61BXn4

- @israfill · likes 496 · views 73502 · 2026-06-12T06:31:16+00:00 · [2065321014066913629](https://x.com/israfill/status/2065321014066913629)
  - Source file: `search_4_agent_loops_Claude_Code.json`
  - use minimax M3 for FREE through tokenrouter - 1M context, zero cost 😳 M3 beats GPT-5.5 on coding benchmarks (SWE-Bench Pro: 59% vs 58.6%) what you get for $0: - SWE-Bench Pro 59% (ahead of GPT-5.5, trails opus 4.8 by ~10 pts) - 1M context window actually usable at 500k+ tokens (opus caps at 200k) - 9-15x faster inference at long contexts (sparse attention) - free input AND output literally $0/0 M3's real edge over opus right now: - 1M context for full codebase dumps - speed: fast enough for real-time agent loops - 1/20th the compute cost of opus for equivalent tasks how to set up (3 min): > go to https://t.co/EtW28QHsgI and sign up (email + verify) > open API Key section and create a new key > copy the base URL and the key > paste into any openai-compatible client (hermes, claude code, cur

- @0xwhrrari · likes 463 · views 116291 · 2026-06-21T21:00:03+00:00 · [2068801141668802792](https://x.com/0xwhrrari/status/2068801141668802792)
  - Source file: `search_2_loops_Claude_Code.json`
  - Creator of Claude Code: "At anthropic, almost every engineer is running 100+ agents with self-improving loops" "The loop makes the agent better every time it runs" In a 1-hour podcast, Boris breaks down how they build agent loops from scratch Claude + Loops + Routines + Dynamic Workflows That's the real setup Bookmark and watch the talk Read breakdown below

- @aiedge_ · likes 425 · views 24388 · 2026-06-28T02:00:02+00:00 · [2071050963843182801](https://x.com/aiedge_/status/2071050963843182801)
  - Source file: `search_1_loop_engineering.json`
  - You should NEVER write your own /goal or /loop prompts. Your AI agents should be loop engineering for you. Steal this prompting structure to have your agents write perfect /goal &amp; /loop prompts - fully autonomously: https://t.co/pxHHANW0bg

- @aiedge_ · likes 424 · views 511427 · 2026-07-03T16:17:17+00:00 · [2073078637730189374](https://x.com/aiedge_/status/2073078637730189374)
  - Source file: `search_1_loop_engineering.json`
  - https://t.co/kAZAkoPphh


## Requested / adjacent figures searched

- `bcherny`: user_bcherny_recent.json

- `steipete`: user_steipete_recent.json

- `karpathy`: user_karpathy_recent.json

- `addyosmani`: user_addyosmani_recent.json

- `swyx`: user_swyx_recent.json

- `simonw`: user_simonw_recent.json

- `AndrewYNg`: user_AndrewYNg_recent.json

- `rasbt`: user_rasbt_recent.json
