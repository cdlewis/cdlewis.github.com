---
layout: post
title: "Disjoint-Sets and Agglomerative Clustering"
description: "Application of disjoint sets to agglomerative  clustering."
category: 
tags: [algorithms]
---

As part of an exercise I recently to implemented agglomerative clustering for a small set of news articles. After fiddling around for a while it occurred to me that the solution would be much more elegant if cluster membership was tracked with a disjoint-set. In fact it turns out that the data structure is [quite commonly](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-046j-design-and-analysis-of-algorithms-spring-2012/lecture-notes/MIT6_046JS12_lec21.pdf) used to solve this particular problem.

Agglomerative clustering is a hierarchical clustering method that starts from the 'bottom up'. Each element initially forms its own cluster, with the nearest two clusters being progressively merged until only one remains.

![example cluster](assets/images/2014-03-23/clusters.png)
<p class="caption">One potential clustering of {A, B, C, D},  represented as a binary tree. Each level is a stage in the clustering process. Elements are missing from a level in the tree when their cluster is unchanged.</p>

This could be more formally expressed as:

<pre>
1. Let each element x in set 𝐂 be a singleton cluster
2. Until |𝐂| = 1:
	2.1 Remove two most similar clusters (x₁, x₂)
	2.2 Join to create new cluster (xₐ)
	2.3 Insert xₐ into 𝐂
</pre>

Of course the main issue with this approach is efficiently finding similar clusters, which (optimistically) could take Ο(n²) time. But an important secondary issue relates to the need for a data structure to track cluster membership. A simple approach would be to use map element_id → cluster_id however this does not adequately handle the case where the two elements being merged are part of larger clusters, which would in turn also require merging.

Disjoint-sets provide a ready-made solution to this problem. The data structure maintains a collection of non-overlapping (disjoint) sets, each of which is *represented* by some member of that set. They can be used in a wide variety of contexts but are particularly popular with graph problems such as finding the minimum spanning tree or strongly connected components.

Three basic operations are supported by disjoint-sets:
- **Make-Set( x )** creates a new set containing only x
- **Union( x, y )** combines x and y into a single set
- **Find( x )** identifies the set to which x belongs

Because of the importance of Union( x, y ) and Find( x ), disjoint-sets are sometimes referred to as union-find data structures.

Disjoint-sets, like the initial hash table approach, can be implemented as a mapping of element → subset. A particular subset is uniquely identified by the root element in the tree representing that subset. And an element is a root element if it is its own parent.

![disjoint set representation](assets/images/2014-03-23/disjoint_set_representation.png)
<p class="caption">An example of {A, B, C, D} at after the second merge. Only {A, B, C} and {D} remain.</p>

In a neat bit of symmetry with bottom-up clustering, disjoint-sets are initialised by calling Make-Set on each element.

<pre>
def MakeSets( x ):
    return dict( [ ( i, i ) for i in x ] )
</pre>

To find the set to which a particular element belongs, we recursively look for the parent until we find a node that is its own parent.

<pre>
def Find( x, parent ):
    if parent[ x ] is x:
        return x
    else:
        return Find( parent[ x ], parent )
</pre>

To merge two existing elements, we simply find the parents of the two elements and change one to be the parent of the other.

<pre>
def Union( x, y, parent ):
    parent[ Find( x, parent ) ] = Find( y, parent )
</pre>

We can even use some Python magic to find all subsets by grouping them according to their representative element.

<pre>
def Subsets( x ):
    return itertools.groupby( x, lambda i: Find( i, x ) )
</pre>

The above Python implementation of disjoint-sets is very simple but it can nonetheless be directly applied to the agglomerative clustering problem. In which case we call MakeSets( 𝐂 ) in step 1 and Union( x₁, x₂ ) in lieu of steps 2.2 and 2.3 of the original algorithm.

More efficient disjoint-set implementations introduce optimisations such as path compression, which speeds up the Find operation by reducing the height of the tree. This leads to an [amortised complexity of Ο(log₂n)](http://en.wikipedia.org/wiki/Proof_of_O%28log*n%29_time_complexity_of_union%E2%80%93find). To take advantage of these performance gains, I ended up using an [existing disjoint-set implementation](http://code.activestate.com/recipes/577225-union-find/) by Ahmed El Deeb for my project.

That said, the specific paths formed by the Union function could be used to reconstruct the history of the clustering hierarchy and therefore might be worth leaving untouched. Otherwise it would be necessary to dump a copy of the subsets before each merge in order to make use of the cluster topology. Ultimately the trade off is between increased computation time (longer traversals) and memory (storing intermediate clusterings) with the former generally scarcer on modern computers.
