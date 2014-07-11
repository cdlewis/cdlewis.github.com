---
layout: post
title: "Leveraging PEP 380 for more Elegant Recursive Graph Functions"
description: ""
category: 
tags: []
---
{% include JB/setup %}

As my original introduction to data structures was in the context of C/C++, it's been interesting recently to see how these translate into a more concise, magical language such as Python. A classic example of it making life easier is in DFS path finding.

A recursive algorithm to find a path between two vertices, as in almost any other language, is trivial.

<pre>
def find_path( self, x, y, path = [] ):
    path.append( x )
        if x == y:
            return path
    for v in self.vertices[ x ]:
        if v in path:
            continue
        else:
            return self.find_path( v, y, path )
</pre>

But trying to generalize this algorithm to find all paths requires the addition of a 'paths' variable outside the scope of our beautiful recursive function. Instead of returning the path, we'd do something like paths.append( path ).

A neat way to circumvent this problem would be to turn the function into a generator and yield valid paths to the caller. However recursion throws a spanner in the works as a generator expression only yields to its immediate caller. So we'd have to loop over the recursive call and yield the yields.

<pre>
for i in self.find_path( v, y, path ): # ugh
    yield i
</pre>

Thankfully [PEP 380 -- Syntax for Delegating to a Subgenerator](http://legacy.python.org/dev/peps/pep-0380/) comes to the rescue by allowing us to pretend yields from the sub generator originated in the calling function.

<pre>
def find_paths( self, x, y, path = [] ):
    path.append( x )
    if x == y:
        yield path
    for v in self.vertices[ x ]:
        if v in path:
            continue
        else:
            yield from self.find_paths( v, y, path )
</pre>