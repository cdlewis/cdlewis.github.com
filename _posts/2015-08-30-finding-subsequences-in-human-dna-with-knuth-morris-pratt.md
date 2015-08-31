---
layout: post
title: "Finding Subsequences in Human DNA with Knuth-Morris-Pratt"
description: ""
category: 
tags: []
---

## Introduction

One interesting pattern in computer science is that the solution to a problem is often discovered before its most significant applications have been identified. String processing is one such area. Knuth-Morris-Pratt (KMP) was conceived in 1974 and was immediately useful in areas such as text editing. But, looking back on the field, Skiena identified the two ‘killer applications’ for string processing as being in online searching and computational biology,[^1] both of which wouldn’t emerge until decades later.

## DNA as Strings

The applications to biology are particularly cool. While substring matching is typically framed in relation to the English alphabet, the same algorithms can be applied to search chromosomes for sequences of nucleotides. Represented by the letters A (Adenine), C (Cytosine), G (Guanine), and T (Thymine).

![results from an analysis done by electrophoresis automatic sequencing](/assets/images/2015-08-30/DNA.png)
<div class="caption">results from an analysis done by electrophoresis automatic sequencing.[^3]</div>

## Why this is Interesting

DNA in particular provides an interesting application for substring searching, both because of its size and utility. At over 3 billion basepairs, having an efficient algorithm for searching human DNA is not merely a curiosity, but an essential prerequisite for any kind of large scale analysis.
- Ann efficient algorithm is the difference between doing one search a second and one an hour.
- ‘A typical question in molecular biology is whether a given sequence has appeared elsewhere.’[^2]
— Can we use the subsequence searching to gain an insight into the current or future medical issues associated with a particular person
— Can it tell us about our relationship with other species
— This can have very useful applications, does a genetic sequence associated with a particular illness appear in your own DNA? Of course, between erroneous and unknown base-pairs, the problem is often not so simple.

## Explanation of How KMP Works

- An efficient substring function. Whereas a naive matching approach will take O(n^2) time, we can do it in O(n+k). This is achieved by avoiding backtracking (only looking at each character once).
- Key insight: when a string is rejected, use information from the partial match rather than starting from scratch
— take advantage of the knowledge gained by scanning the string
- One way of doing this is to construct a finite state machine.
— internalise knowledge about the structure of the pattern and our place in it at any given state. utilise this pattern we can detect matches without needing to backtrack on failure.
— when the machine enters its final state a substring has matched
- The most obvious way to construct this state machine would be to use a table of every possible state transition.

![dfa representing nucleotide pattern](/assets/images/2015-08-30/DFA.jpg)
<p class=“caption”>DFA for the pattern ATGAT.</p>

- This is actually linear but will consume space proportional to R*M where R (radix) and M (length) are the length of the string and the size of the alphabet respectively. This is not a huge deal, especially for DNA where the alphabet is only four characters long.

~~~ python
def create_dfa( pattern, alphabet ):
    dfa = [ dict( ( i, 0 ) for i in alphabet ) for j in pattern ]
    dfa[ 0 ][ pattern[ 0 ] ] = 1 # initial transition
    x = 0 # current state
    for state in xrange( 1, len( dfa ) ):
        # copy old states
        for l in alphabet:
            dfa[ state ][ l ] = dfa[ x ][ l ]
        # new accept state
        dfa[ state ][ pattern[ state ] ] = state + 1
        # transition to new state
        x = dfa[ x ][ pattern[ state ] ]
    return dfa
~~~

### A variation of this algorithm using a NFDA but I’m not going to. Here’s why.
- This DFA is sometimes known as the ‘failure function’ and is represented as an array. We represent the DFA as an array where every cell represents the path taken in the event of a failed state transition. That is, the path to take if the match were to fail at a given point. The successful paths are implicit in the ordering of the array, e.g. A[0] —> A[1] —> A[2] —> A[3].
- This solves the problem of memory consumption scaling with alphabet size by essentially creating a non-deterministic finite state machine instead.
- In my view, when introducing people to KMP the NDFA is an unnecessary complication that serves to obscure the fundamental insight of the algorithm. It is where most people get lost so I’m going to avoid it. That said, there are some great resources out there covering it. [skiena youtube?]

### Once we have the machine the actual algorithm is trivial

(code to run string through state machine)

~~~ python
def kmp( needle, haystack, alphabet ):
    dfa = create_dfa( needle, alphabet )
    x = 0
    for index, character in enumerate( haystack ):
        x = dfa[ x ][ character ]
        if x == len( needle ):
            return index
    return False
~~~

### What about the DNA?
- You can download the DNA here: (link)
- Then you need to parse it, you can use (this library) and parse it (this way)

~~~ python
def chromosone( number, buffer_size=1000000 ):
    genome = twobitreader.TwoBitFile( 'hg38.2bit' )
    chromosome = genome[ 'car' + str( number ) ]
    for i in xrange( 0, len( chromosome ), buffer_size ):
        buffer = chromosone[ :i ]
        for nucleotide in buffer:
            yield nucleotide.lower()

kmp( 'atgatc', chromosone( 20 ), [ 'a', 't', 'g', 'c', 'n' ] )
~~~

### How fast is it?

(some speed results)

(link to completed code)

http://useast.ensembl.org/Homo_sapiens/Variation/Explore?r=4:61226534-61227533;v=rs34640111;vdb=variation;vf=9452422 —> quite literally a search engine for humans

## It’s good but not perfect for bioinformatics

Pros / Cons
- Because we never need to backtrack on failure, we don’t have to be able to store the entire string in memory, each nucleotide can be read once and thrown away. This is particularly useful for large strings such as DNA.
- One disadvantage is that often we don’t have perfect knowledge about the sequences we’re searching or looking for. And might therefore want to do some kind of ‘fuzzy’ matching instead. KMP’s inability to do this makes it unsuitable for a lot of bioinformatics applications.

[^1]: Skiena’s Introduction to Computational Biology course is [online](http://www3.cs.stonybrook.edu/~skiena/549/)!
[^2]: http://www.cs.hut.fi/~tarhio/papers/dna.pdf
[^3]: By Stef (Own work) [Public domain], via Wikimedia Commons