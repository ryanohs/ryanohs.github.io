---
layout: post
title: Knuth's prime algorithm
---


For several years I’ve intended to check out Donald Knuth’s _The Art of Computer Programming_. I finally picked up a copy and hopefully I won’t regret it. I’ve been programming for well over a decade, but had very little formal computer science education (only Algorithms 101). Knuth’s book aims to lay down a mathematical foundation for programming. He’s been releasing new volumes for over 50 years. I didn’t realize how encyclopedic this book was until I flipped through it.

Immediately I discovered that I’m going to have to think differently. I program primarily in high level object oriented languages. Knuth defines his algorithms in pseudocode and a made up assembly language for a 1960’s style processor. As an introduction to this processor he presents an algorithm for computing the first 500 primes. Before I read his algorithm, I set the book aside and tried it myself in C#. Then I returned to Knuth’s book and identified three optimizations that should have been obvious. (It was very late)

1. Don’t check any even numbers

2. Don’t check divisibility by 2

3. Only check primes less than sqrt(n)

My resulting code:

    lang: C#
    var primes = new int[500];
    primes[0] = 2;
    var found = 1;
    var n = 3;
    while(found < 500)
    {
    	// for each odd n = 3, 5, 7, ....
    	// check if n has a divisor in the found primes less than sqrt(n)
    	// if n has no prime divisor, n is prime
    
    	var foundDivisor = false;
    	var sqrt = Math.Sqrt(n);
    	for(int i = 0; i < found && primes[i] <= sqrt && !foundDivisor; i++) // iterate found primes up to sqrt(n)
    	{
    		if(n % primes[i] == 0)
    		{
    			// we found a divisor so n is not prime
    			foundDivisor = true;
    		}
    	}
    
    	if(!foundDivisor)
    	{
    		// we found a new prime
    		primes[found] = n;
    		found++;
    	}
    
    	n += 2; // next odd n
    }

I recognize this may be a naïve solution but at least it’s easy to understand.

Returning to Knuth’s algorithm, I initially found it difficult to follow. He doesn’t use any programming language abstractions like loops but rather uses GOTO statements for flow control. I translated his algorithm into C# using while loops, but the break logic was not very intuitive and I was also curious about the q <= primes[k] conditional. What is he up to there? Also, he uses 1 indexed arrays so I left an empty element at the start of the array to avoid -1 everywhere.

    lang: C#
    var primes = new int[501];
    int n,
    	j,   // number of primes found
    	k,   // indexer
    	q,
    	r;
    
    primes[1] = 2;
    n = 3;
    j = 1;
    
    while (true)
    {
    	j++;
    	primes[j] = n;
    
    	if (j == 500)
    	{
    		break;
    	}
    
    	while (true)
    	{
    		n += 2;
    		k = 2;
    
    		while (true)
    		{
    			q = n / primes[k];
    			r = n % primes[k];
    
    			if (r == 0)
    			{
    				break;
    			}
    
    			if(q <= primes[k])
    			{
    				break;
    			}
    
    			k++;
    		}
    
    		if(r != 0)
    		{
    			if(q <= primes[k])
    			{
    				break;
    			}
    		}
    	}
    }
    
The reason Knuth’s algorithm is so different from mine is that I cheated. I used a math library to compute square roots. Knuth uses an algebraic trick to determine when he’s tested all the prime factors below the square root of n. He leaves proving this as an exercise. I had to think about it for far longer than I care to admit.

His test of primality algorithm is:

> Let p<Sub>k</sub> be the k<sup>th</sup> element of the set of primes in increasing order.
> (2, 3, 5, …)
> 
> Let n be the integer we are testing for primality.
> 
> Let k be the integer 2. (The first prime divisor we will test is 3)
> 
> _Loop:_
> 
> Determine q and r for n = q*p<Sub>k</sub> + r where 0 <= r < p<Sub>k</sub>
> 
> If r = 0, n is not prime.
> 
> If q <= p<Sub>k</sub>, n is prime; otherwise, increment k and loop.

This last test is what I wanted to understand. This clearly has to do with checking if p<Sub>k</sub> > sqrt(n) or equivalently if p<Sub>k</sub><sup>2</sup> > n.

Let’s consider three cases.

If q = p, then p<Sub>k</sub><sup>2</sup> < n

> We know that p<Sub>k</sub><sup>2</sup> != n because then r = 0 and the algorithm would not have reached this step. We can ignore this case.
> 
> In the case p<Sub>k</sub> < sqrt(n), we can show that p<Sub>k</sub> is the last prime we need to test by showing that p<Sub>k+1</sub> is larger than sqrt(n).
> 
> The next possible prime we would test, p<Sub>k+1</sub>, would at minimum be p<Sub>k</sub>+2. Squaring p<Sub>k</sub>+2 gives (p<Sub>k</sub>+2)<sup>2</sup> = p<Sub>k</sub><sup>2</sup> +4p<Sub>k</sub>+4. We also know that sqrt(n) = p<Sub>k</sub><sup>2</sup> + r where r < p<Sub>k</sub>. But clearly p<Sub>k</sub><sup>2</sup> +4p<Sub>k</sub>+4 > p<Sub>k</sub><sup>2</sup> + r. Thus p<Sub>k+1</sub> is larger than sqrt(n) so we do not need to test further.
> 
> n is prime.

If q < p<Sub>k</sub>, then p<Sub>k</sub><sup>2</sup> > q*p<Sub>k</sub> + r, by substitution is p<Sub>k</sub><sup>2</sup> > n, and thus p<Sub>k</sub> is not possibly an even divisor of n. n is prime.

If q > p<Sub>k</sub>, then p<Sub>k</sub><sup>2</sup> < n by observation that p<Sub>k</sub><sup>2</sup> < q*p<Sub>k</sub> + r.

> In this case the algorithm cannot yet determine primality and requires
> a loop to test the next prime. This tripped me up initially. While it
> is possible that p<Sub>k</sub> is the largest prime less than or equal
> to sqrt(n), the algorithm cannot know that until it tests the next
> largest prime. This results in the algorithm sometimes testing
> divisibility by primes larger than sqrt(n).

There may be a better way to explain this (I have not referred to the back of the book answer key), but it was a good exercise. Now that I understand how intensive this book is, I’m going to be much more selective about what sections I’m reading. I understand there’s a lot of great history in this book, but also might redirect my attention to a more modern algorithms book.
