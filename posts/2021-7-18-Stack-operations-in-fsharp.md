---
layout: post
title: Stack operations in F#
---

In this post, I'm going to combine some linear list concepts from *The Art of Programming* with my recent introduction to F# and immutable programming. Section 2.2.1 covers various types of singly linked list structures. I'm going to implement a few of these operations in F#.

Instead of utilizing the built in list type, I'm implementing my own for the sake of exercise. This will consist of a Stack class with a Head pointer to the first Node (or None). The Node class will have a value and a pointer to the next node (or None).

    lang: f#
    type Node(value, next:Option<Node>) =
	    member _.Value = value
	    member _.Next = next

	type Stack(head:Option<Node>) = 
	    new() = new Stack(None)
	    member _.Head = head

1. Gain access to the kth node of the list.

Whenever you would iterate in C#, in F# you should think recursive. My function starts at the head node and recursively moves to the next node and decrements k until it's 0. If the target index is greater than the stack length, then it throws an exception.

    lang: f#
    let getn k (stack:Stack) =
	    let rec inner x (node:Option<Node>) =
	        match (x, node) with 
	        | (_, None) -> failwith "out of range"
	        | (0, Some n) -> n.Value
	        | (x, Some n) -> inner (x-1) n.Next
	    inner k stack.Head

2. Insert a new node before the kth node.

Because I'm implementing a stack structure, I'm restricting k to 0. All inserts will be at the head/top of the stack. This makes insertion trivial to implement. It's also ideal for immutable structures because the existing nodes of the stack can be reused. This is an O(1) operation.

	Stack A:        1 -> 2 -> 3
	Push 4
	Stack A':  4 -> A
	Or A':     4 -> 1 -> 2 -> 3

Code:

    lang: f#
    let push value (stack:Stack) =
	    new Stack(Some(new Node(value, stack.Head)))

3. Return and delete the first node.

Again I'm going to restrict k to 0 so all deletions happen at the top of the stack. The existing nodes of the stack are reused. Only a new Stack object is created with Head pointing to the second node of the original stack. This is also O(1).

	Stack A:   1 -> 2 -> 3 -> 4
	Pop
	Stack A':       2 -> 3 -> 4

Because the original stack is immutable, we can't just return the popped node. We must also return the new stack. I do this by returning a tuple.

    lang: f#
	let pop (stack:Stack) =
	    match stack.Head with
	    | Some h -> (Some(h.Value), new Stack(h.Next))
	    | None -> (None, stack)

4. Delete the kth node.

This is not really an operation you would want to do on an immutable list or stack, but I wanted to try writing it anyway. This is an O(N) operation because the stack and all of its nodes preceding the deleted node must be copied to a new stack since we cannot mutate the Head or Next pointer to skip the deleted node.

	A:     1 -> 2 -> 3 -> 4
	Delete 2
	A':    1'   ->   3 -> 4

Code:

    lang: f#
	let delete k (stack:Stack) =
	    let rec nextNode i (node:Option<Node>) =
	        match (i, node) with
	        | (_, None) -> None
	        | (i, Some n) when i = k -> n.Next
	        | (i, Some n) -> Some(new Node(n.Value, nextNode (i+1) n.Next))
	    new Stack(nextNode 0 stack.Head)
   
F#'s built in list type is a singly linked list so this exercise was a good introduction to the limitations of using that type. If you implement your own stack type (don't) using the built in list, there are F# syntax features like head::rest pattern matching that simply this code even further. I found [this post](https://swlaschin.gitbooks.io/fsharpforfunandprofit/content/posts/stack-based-calculator.html) with some great examples.

Another data structure covered in 2.2.1 is deques ("decks") which are a type of list optimized for inserts and deletes at the beginning and end only. [This post](http://jackfoxy.com/double-ended-queues-for-fsharp/) has an explanation of how one was implemented in F#. They used two lists internally. A head list and a reversed tail list.

	Head: A -> B -> C -> D
	Tail: Z -> Y -> X -> W

As the lists change in length, there is a mechanism shuffle items so neither list is more than double the length of the other list to keep the performance relatively consistent on both ends. An interesting observation is reversing a deque is an O(1) operation.
