---
layout: post
title: Finding recent files in MacOS Monterey
---

The result of this is you are able to type `recent` at any terminal to get a listing of recently modified documents.

The Recents list in Finder was not sufficient for me because it does not include all file types, such as .webloc.

The `recent` function accepts an argument in the form of a time offset such as 1d, 2d, 1w, 1m, etc.

e.g., All files modified in the last 3 days: `recent 3d`

1. Start up Terminal
2. Type `cd ~/` to go to your home folder
3. Type `touch .zshrc` to create your new file
4. Edit .zshrc with your favorite editor (or you can just type `open -e .zshrc` to open it in TextEdit. Include this in the file and save it.

        recent() {
          find ~/Documents -newermt "`date -v-${1:-1d} +%F`" -type f \! -name .DS_Store
        }

6. Quit and restart Terminal
7. Type `recent` to list recently modified files

Directions based on [this StackOverflow answer](https://stackoverflow.com/a/8967864)

Enhancement ideas:

* Allow the directory to be specified and default to ~/Documents, e.g., `recent 1w .`
* Format output to colorize by file type
* Format output to bold leaf directory name
