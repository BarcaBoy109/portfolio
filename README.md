# Shehroz Awadul Hoque — Portfolio

My personal portfolio for software projects, creative work, and the things I enjoy outside coding.

## Portfolio content

Project and profile details live in `content.js`. Published projects link to their live sites and source repositories; unfinished projects are listed separately. Product screenshots are stored in `assets/screenshots/`, with their sources recorded in `assets/screenshots/PROVENANCE.md`.

Project previews load only after selecting **Click to explore** or the preview button. If a project blocks embedding, **Open website** opens it directly.

## Themes

**Automatic (season & rain)** is the default. It follows the calendar seasons in Singapore and checks NEA rainfall readings every five minutes. A current positive reading changes the theme to **Raining**; if readings are missing or stale, the calendar season is used. Personal celebration dates and a manually selected theme take priority. The automatic or manual selection is saved in the visitor's browser.

The recurring celebration dates are January 5, March 24, May 2, May 16, July 4, July 13, August 18, and November 12. Theme and date settings are in `themes.js`.

Weather effects can be paused, respect reduced-motion settings, and stop when the page is hidden.
