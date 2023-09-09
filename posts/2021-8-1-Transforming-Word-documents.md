---
layout: post
title: Transforming Word Documents
---

I have tons of notes in Word documents which I'd like to import into a my bullet based knowledge tracker. Thankfully my notes follow a well structured format so I set out to write a utility to import these files.

The documents are structured using heading styles as well as paragraphs and bulleted or numbered lists. I've used various highlight colors to identify outstanding tasks or things I want to flag.

Here is an example of what the notes look like in Word.

![Word Sample](/images/docxsample.PNG)

I also have sections of copy-pasted text blocks (usually from an email or other reference document) which I indented in, kind of like a blockquote. To capture these in my system I added a TextBlock property to the node model.

I started by reading about the docx file format. I knew docx is actually a zip archive of XML files. [This post](https://www.toptal.com/xml/an-informal-introduction-to-docx) was very helpful in explaining the structure of the docx file.

Then I found an existing open source .NET [library](https://github.com/xceedsoftware/DocX) which already implemented most of the parsing logic I needed. I was able to write my transformer using this. The only thing I had to manually find was the paraId attribute, which I'm planning to use for change tracking in a future enchancement.

This is what the result of the transform looks like. Note that the highlighted line has a distinct bullet style. I will feed this into the bullet journal parser I wrote in a previous [post](/A-bullet-journal-parser). I prefered transforming to this intermediate format because it was easy to view the output for debugging.

	- 11-2-2020
		- Getting Unstuck
			- Emotions of happiness
				- Pleasure 	vs	Pain
				- Happiness 	vs 	Sadness
				- Joy 		vs 	Sorrow
			- Bliss – a maintainable state
				- Must be nourished
				! Watch what you consume = inputs to brain

A future enhancement will be to support formatting like bold, italics, etc.

The code is available [here](https://gist.github.com/ryanohs/795caa5e3be0f8c9d9e0c6d1efd88989). Nothing fancy.