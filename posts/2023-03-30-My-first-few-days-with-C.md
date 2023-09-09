---
layout: post
title: My first few days with C
---

This week I started relearning C. I used C++ for a year in college and about a decade ago I worked on a microcontroller project in C, but my familiarity with C is fairly rusty. I picked up a copy of K&R and started by reading the first few chapters and doing the exercises in a text editor and compiling with gcc.

I quickly decided I wanted to jump into a real project. I'm following the [Make A Lisp](https://github.com/ryanohs/mal/blob/master/process/guide.md) guide to write a Lisp interpreter. I recently watched a few videos by [Tim Morgan](https://www.youtube.com/@TimMorgan) where he started this project in C++.

My toolkit is currently Visual Studio Code with the C/C++ plugin on an M1 Mac. That worked out of the box for single file compilation, but I, perhaps foolishly, decided to split my implementation into multiple files and I ran into my first roadblock trying to get VSCode to use the Makefile. I ended up just switching to Terminal and running Make. Path of least resistance at the moment.

A really nice feature of the plugin is that it autocorrects my usage of . and -> for struct pointers. I'm mostly getting it right, but the immediate feedback when I make a mistake is really helpful.

Along with not getting the Makefile working, I couldn't get the debugger working on multi-file projects. I'll come back to that, but in the meantime I saw someone else using lldb on a stream and decided to try that out. I spent a bit exploring the available commands and wrote a cheat sheet for myself to step through my code and format structs and arrays.

I haven't used lldb yet to solve a bug since I just learned how to use it. I did trace down two bugs by using printf debugging and, my favorite, the "think real hard about it" strategy.

My strategy currently is to read a chapter in K&R and then work on my project. Sometimes I can bring something from my reading immediately into the codebase, like appropriately using static methods was something I didn't know about at first. If I need to figure out how to do something I try to find it in the book and then fallback to a web search.

I wrote a few macros to write unit tests. It's working so far, but I did poke around for some existing tools. I might switch to the CLion IDE so then I'll adopt a unit test framework that's compatible.

I learned that gcc + lldb is an odd combination. clang is from the LLVM project and clang + lldb is Apple's favored solution. I'll have to read more about clang. I used gcc simply because of name recognition. gdb is the GNU debugger, but it's not installed on my machine.

I found that C is coming back to me quickly. I wrote about 500 lines and there were only two rough spots that I really had to work through. I used a pointer comparison to compare strings, which worked in my unit test but broke on real world input. I had to replace the comparison with strcmp(). The second one I haven't solved yet, but I have an idea. The problem is I stored a function pointer in void* which isn't allowed on modern systems. Modern OSes won't allow pointers casted from void* to be executed. That is the first thing in K&R that misled me. I'll have to pick up a modern C book next. I'll also seek out more live coding sessions in C to watch out for useful habits.



