---
layout: post
title: A printable calendar
---

[Demo](https://ryanohs.github.io/demos/Calendar.html)

Recently I read about modern CSS layout technologies including CSS Grids. To practice, I recreated a tool I use to generated printable calendars. I have a multi-year collection of print outs from print-a-calendar.com. I wanted my tool to mimic the printed style of that site.

I started by creating a static calendar for the current month. CSS Grid may not be the ideal technology for this sort of a layout, but I was determined. The cell borders are only 1px thick. Since CSS grid does not support border-collapse like tables do, I had to define the borders in a piecemeal fashion. The calendar border is a solid border on the grid container. Each calendar cell defines a right and bottom border.

    .cell {
        border-right: solid 1px #ccc;
        border-bottom: solid 1px #ccc;
    }

However this leaves an extra thick border on the right column and bottom row. To eliminate this I used pseudo-selectors to remove the borders from cells in the right column and bottom row.

    .cell:nth-last-child(-n+7) {
        border-bottom: none;
    }

    .cell:nth-child(7n) {
        border-right: none;
    }

Another challenge I ran into was getting the calendar to display full screen in the browser and on paper. To get it full screen in the browser, I made the entire body into a flexbox and set the calendar to auto-grow. I also had to give the body a computed height. Setting body height to 100vh does not work because the body tag padding is outside the box height. I probably could have used a wrapper element around the entire page contents, but I was trying to avoid that.

    body {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 10px;
        min-height: calc(100% - 20px);
    }

    #calendar {
        flex: 1 1 auto;
    }

The body height is not used when printing so I had to use a print media query to set the page height to 98%. Any larger value forced the calendar onto a second page.

Once formatting was correct, I replaced the calendar markup with elements generated in javascript. I added a previous and next link to navigate months and hid those elements when printing.

I only tested in Chrome.

The final result is hosted [here](https://ryanohs.github.io/demos/Calendar.html)

