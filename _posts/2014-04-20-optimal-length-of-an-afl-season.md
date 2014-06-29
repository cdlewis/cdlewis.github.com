---
layout: post
title: "Ranking AFL Teams"
description: "Using sorting algorithms to minimise the number of games required to complete an AFL season."
category: 
tags: [algorithms]
---
{% include JB/setup %}

The 2014 [AFL](http://www.afl.com.au) season will feature 18 teams playing each other over 23 rounds for a total of 198 games (due to byes). While a number of factors contribute to this structure, such as the need to provide a good experience for fans and a fair competition for the players, one key feature must be to gather enough data to properly rank teams on the ladder. At the very least, we want to be reasonably certain that the teams selected for the finals are in fact the top eight and not just those who played a disproportionate number of games against bad teams.

So *why* 198 games?

## Comparing Teams

We can find where a particular team belongs on the ladder by having it play every other team. For a complete ladder we simply repeat this process for all teams. This would take O(n²) time although the actual number of games required will be much lower if we assume **X** vs. **Y** = **Y** vs. **X** and that a team cannot play itself. With these assumptions we'd need 18²/2-18 = 144 games. Fewer than the real number of games this season but probably not optimal.

The number of required games could be reduced by leveraging knowledge of existing games to infer the outcome of new ones. That is to say: because **X** beat **Y** and **Y** beat **Z**, **X** would also beat **Z**. While this is a simplification (games are not transitive), the neat thing about this approach is that it orders the three teams using two games. Knowing the outcome of the first two games makes the **X** vs. **Z** comparison (game) redundant. If applied more generally, it would allow for a complete ordering of all teams without the need to compare each of them with every other team.

This more general approach is itself a specific application of the well-known problem of sorting using comparisons. It is known that an optimal program taking this approach will have a [lower bound of O(nlogn)](http://planetmath.org/sites/default/files/texpdf/32948.pdf). We can therefore produce a ladder after roughly 18 × log₂18 ≈ 75.059 games.

<p><img alt="quicksort probably wouldn't work" src="/images/2014-04-20/quicksort_problems.png" style="width: 224px;" /></p>
<p class="caption">Not all sorting algorithms are appropriate. If quicksort were used, the pivot team (and only the pivot team) would end up playing multiple games per round.</p>

Mergesort could be an appropriate choice. It's guaranteed to require no more than O(nlogn) games and, importantly, is [tolerant of faulty comparisons](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.303.1304&rep=rep1&type=pdf).

Our revised season structure would involve:
<ol><li>Dividing the league into 18 'groups';</li>
<li>Repeatedly merging adjacent groups until only one remains.</li></ol>

The merge step assumes the two groups are already ordered from best to worst team and produces an amalgamated group that is also correctly ordered. The number of additional games required to determine order in the combined group is minimised by the fact that the two existing groups are sorted. 

Despite being efficient, there are a number of potential issues with this approach including *wild variation* in the number of games per team and the unpredictability of when they would occur (depending on what was considered a 'round' in the context of the algorithm).

## Alternate Approach

But do we *really* need 75.059 games?

An alternate approach, known as the [Feedback Arc Set](http://en.wikipedia.org/wiki/Feedback_arc_set) Problem for Tournaments, asks whether it's possible to rank teams after having them play only O(n) games. Under this approach each team would play a fixed number of games (say one home and one away) against two different teams. Based on the outcome we construct a directed graph with weighted edges to represent the size of the win.

<p><img alt="cyclic graph" src="/images/2014-04-20/cyclic_graph.png" style="width: 224px;" /></p>

This approach has many advantages over mergesort:
<ul><li>Each team plays a fixed number of games;</li>
<li>The time and identity of the opposing team are known in advance;</li>
<li>The fiction of transitivity is not required as such inconsistencies in performance can be represented through cycles in the graph.</li></ul>

Once the games are played we need to go through the graph and ensure it's acyclic. If necessary edges will have to be removed to undo cycles whilst [minimising the inconsistencies](http://www.lehigh.edu/~gi02/iplf.pdf) that this introduces. Doing this efficiently however is non-trivial, ([50-year-old problem](http://cs.brown.edu/~ws/papers/fast_conf.pdf). And has been [proven NP-Hard](http://www.tau.ac.il/~nogaa/PDFS/paley.pdf). The interesting side effect of this approach is that the solution decouples game playing from computational complexity of the ranking algorithm.

## Conclusion

By treating an AFL as a sorting problem we improve overall performance 263.792%, allowing us to finish a season in just over 8 weeks. This in turn could allow for two seasons per year with time to spare. We could further half the number of games if we were willing to brute force the Feedback Arc Set approach. Finally, it has the added benefit of cutting down on the number of one-sided games, minimising the number of floggings Melbourne supporters would have to endure.