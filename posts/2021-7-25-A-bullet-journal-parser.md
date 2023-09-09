---
layout: post
title: A bullet journal parser
---

I wrote a state machine that can parse the following bullet journal syntax into a tree structure. I tried to leverage C# 9 features to learn more about them.

The code is [here](https://gist.github.com/ryanohs/caf769dbe554ded0fec151a53a17f8ee)

    A title level node
    - Bullet types
        - Note
        * Task/to do
        o Event
        ! Inspiration
    - Supports tabs or spaces (4 spaces = tab)
    - Tech details
        - Written in C# 9
        - #nullable enable = object references can't be null unless explicitly declared nullable
        - It uses a state machine pattern
        - The parser uses an immutable record type for tracking state
        - Then node type is not quite immutable
            - It holds two StringBuilder references
            - And its child collection is mutable
        
I really like the record types and return with syntax. I found this code very easy to rationalize about.

    return state with
    {
        CurrentIndentDepth = 0,
        CurrentState = State.Start,
        NodeType = NodeType.Title
    };
    
This is awesome! C# is looking more like F#.

    public record Transition(State State, Token Token);

The new switch syntax is also very compact and easy to read.

    return c switch
    {
        '-' => NodeType.Note,
        '*' => NodeType.Task,
        'o' => NodeType.Event,
        '!' => NodeType.Inspiration,
        _ => throw new ArgumentOutOfRangeException(nameof(c), c, null)
    };


