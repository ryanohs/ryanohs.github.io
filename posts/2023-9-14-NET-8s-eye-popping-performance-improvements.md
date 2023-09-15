---
layout: post
title: .NET 8's eye popping performance improvements
---

Yesterday Stephen Toub posted an [extensive (200 page!) treatise](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/) on the performance improvements in .NET 8. It seems everywhere you look in that document there's a 50-90% performance improvement, whether its in the collections, string operations, JSON parsing, reflection, JIT, and many other core operations. They even rewrote the Enum type.

I wrote an application to help me find files on my computer. It's very, very basic. My goal was to learn about indexing data structures but the naive iterative solution was fast enough for me that I just use that one. On startup it enumerates all files in the target directories. It provides live search as you type, so every key press does a `.Contains()` search over the entire list, about 40,000 files.

I updated the app to .NET 8-rc1 today. This is a very text heavy and CPU bound application so the .NET 8 performance improvements really shine. I saw about a 7X (85%) improvement in performance in both file loading and search times. The search already felt responsive, but the startup time was a bit sluggish. Now the startup feels instant.

Here are the benchmarks.

Startup time:

	| Runtime  | Mean      | Error    | StdDev   | Ratio |
	|--------- |----------:|---------:|---------:|------:|
	| .NET 7.0 | 282.68 ms | 1.470 ms | 1.375 ms |  1.00 |
	| .NET 8.0 |  46.37 ms | 0.345 ms | 0.306 ms |  0.16 |

Search time:

	| Runtime  | Mean      | Error     | StdDev    | Ratio |
	|--------- |----------:|----------:|----------:|------:|
	| .NET 7.0 | 10.695 ms | 0.0229 ms | 0.0203 ms |  1.00 |
	| .NET 8.0 |  1.471 ms | 0.0049 ms | 0.0041 ms |  0.14 |

Stay tuned for a post on the next version of this search software. Its benchmarks are in nanoseconds!