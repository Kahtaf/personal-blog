What even is loop engineering?

When the agent does the work, is the codebase even yours anymore?

Seems like loops is all everyone talks about. Loop engineering was probably the most talked about subject at the AI Engineers fair last week. And still I don't have concrete feelings over what makes this so important.

How did we get here?

Loop eng is actually the latest evolution of prompt engineering. First it was prompt engineering, wording and rewording a single instruction like a magic spell. Then the wording stopped mattering and the game became context engineering: feeding the model the right files, the right memory, the right tools. Now you don't talk to the agent at all. You write a little program that talks to it for you, checks what came back, and kicks off the next round.

This blew up because Boris Cherny, who built Claude Code, said: "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."

Looks to me like every stage of the evolution, we back up one more chair from the keyboard. More leverage, less contact. And now the question is how far back is too far?

What people actually mean when they say "loop."

The inner loop. The agent doing its own thing: try, look, try again. You don't build this one. It just is the agent.

 
The Ralph loop. Throw the same spec at the agent over and over, wiping its memory each time, until it passes. Named after a guy who ran it in a bash while loop.

 
The software machine. The whole pipeline running itself: triage, fix, review, test, ship. The version the startups are selling you.

 
The system loop. A loop that rewrites your loops. Watches your setup, tries to improve it without you.

 
The oversight loop. You. Deciding what the agents work on, judging what comes back, pulling the plug when they wander.

When we can't even agree on the core definition of the concept, it looks like the marketing got ahead of the engineering. Every loop on that list except one is a machine you can build or buy. The oversight loop is the one you can't hand off, because it's not made of software.

The good version is real.

It works when the work is checkable. That's the whole reason loops blew up in code first: a test passes or it doesn't, so the agent always knows if it's done. Andrej Karpathy pointed a 630-line loop at a training script, went to sleep, and woke up to a hundred completed experiments and a measurably better model. When you can machine-grade the output, this stuff is legitimately nuts.

Your best prompt helps just you; a loop is a file your whole team can read and re-run. It's the jump from being good at your job to building something that's good without you in the room.

Now the same story, told honestly.

Shopify's CEO ran Karpathy's loop against Liquid, the templating engine he wrote twenty years ago. Woke up to a 53% speedup. The screenshots went everywhere. It was the proof-of-loop moment of the season. Weeks later the change was flagged as overfit to the benchmark. It never merged.

The loop's flagship demo produced a confidently wrong result that looked spectacular, and the euphoria did the review. That's the anecdote about what loops are: machines that scale execution while quietly assuming someone is still watching. And the watching degrades in a very specific order.

It starts with comprehension. Armin Ronacher, the guy who made Flask, says he hasn't "moved past the point of comprehension being important," and his fear is subtle: every pass adds another little patch, and the system gets less understandable while looking more solid from the outside. You end up with a codebase you treat like an organism. You monitor it. You keep it alive. You no longer know where the load-bearing walls are.

If you get a ping at 4am that your service is down, and that service was written, reviewed, and tested by agents, and the commit history is four thousand green checkmarks deep, not one of them read by a person. Whose screen does that page land on?

Because comprehension decays, the failures go silent. The failure everyone fears is the runaway loop that spins forever, but that one announces itself. The dangerous one exits clean and hands you something confidently wrong. An engineer who runs fleets of these described exactly how it happens: you read the first dozen results carefully, you're skimming by twenty-five, and somewhere around forty everything looks fine so you stop reading at all.

Execution scales. Your attention doesn't.

Once attention is the bottleneck, accountability starts to hollow out. Anthropic's Mike Krieger, whose teams automate a huge chunk of their code, says they're now bottlenecked on reviews and on "the human ability to fully conceptualize what we're doing." When the people furthest ahead tell you the wall is human understanding, we gotta listen.

Let's talk cost.

Loops run on tokens, and the bill compounds, because every pass carries more context than the last and the pile keeps growing. Caching softens the blow, but growth outruns that discount. Uber capped its engineers at $1,500 a month per AI tool after torching its annual AI budget in about four months, with individual engineers running up $500 to $2,000 in tokens.

Here's a number that is not talked about enough: cost per accepted change. If the loop hands you ten results and you throw six away, you're doing the review work it was supposed to save you, at a premium.

In Stack Overflow's latest survey, 76% of developers using AI tools admitted to shipping code they don't fully understand at least some of the time.

The bottom of the stack.

Comprehension decays, so failures go silent, so attention becomes the bottleneck, so accountability hollows out. And accountability has a floor requirement that almost nobody has built: the second an agent stops suggesting and starts doing, and it's one of thirty doing it at once, somebody has to answer a very boring question. Which agent did that, and was it allowed to?

You cannot be accountable for a crowd you can't tell apart. The moment these things become actors, they need to be someone: an identity, permissions, a record of what they touched. It doesn't fix comprehension, nothing at the infrastructure layer does. It fixes the part where "who did this" has an answer at all.

Should you even build one?

A heavy loop is worth building when four things are true at once: the task repeats (weekly at least), something can automatically fail the bad output, the agent can finish it end to end without handing you half of it back, and "done" is objective, not a taste call. Miss even one and you're better off with a good prompt and your hands on the wheel.

So. The agent writes it, runs it, checks it, all while you sleep. Is the output yours anymore? The easy answer is yes, you're the one accountable when it breaks. The real answer: it's yours given you can still explain it.

Build the loop. Stay the engineer.