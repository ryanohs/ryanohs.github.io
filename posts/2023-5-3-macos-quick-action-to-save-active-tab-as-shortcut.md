---
layout: post
title: MacOS quick action to save active tab as shortcut
---

When I want to save a shortcut to a website in a folder in Finder, I had an awkward workflow to position the Finder window and browser window such that I could drag the icon from the nav bar into the Finder window. To make this simpler, I created a quick action in Automator.

1. Launch Automator
2. File > New
3. Choose Quick Action
4. Add a Run Applescript block and add this code:


        lang: applescript
        on run {input, parameters}
          set theURL to (the clipboard as text)
          set theName to "Untitled URL"
          tell application "Brave Browser" to set theName to title of active tab of front window
          tell application "Brave Browser" to set theURL to URL of active tab of front window
          tell application "Finder"
            set currentDir to target of Finder window 1 as alias
            make new internet location file at currentDir to theURL with properties {name:theName}
          end tell
          return input
        end run

5. Save it
6. In the Finder menu open Services > Services Preferences
7. Check the entry for your new action and add a keyboard shortcut.

Now when you are in any Finder window, you can press your keyboard shortcut and the last active tab in Brave will be saved as a webloc file in the open directory. The file name will be the page title.
