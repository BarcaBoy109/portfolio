# Portfolio design notes

This visual identity is for my portfolio. The dark background, oversized headings, and seasonal color changes let the real product screenshots lead while keeping the page personal.

## Type and color

Syne is used for display headings and Public Sans for body text. The theme palettes are defined in `styles.css`; `themes.js` provides their names and seasonal behavior. The default selector setting is **Automatic (season & rain)**.

## Page layout

The page uses a centered column with wide margins on desktop and smaller side padding on phones. The sticky header keeps my name and online name visible and becomes more compact while scrolling. Project rows pair a real screenshot with a short description and direct links; on narrow screens, the screenshot and description stack vertically.

The closing “Things I enjoy” section links to OffTime-TV and Radio Pulze. Development projects are clearly separated from published work.

## Themes and motion

Automatic mode follows the Singapore calendar season and uses current NEA rainfall readings for the Raining theme. Personal celebration dates and a manual selection take precedence. Seasonal particles sit behind the page content; visitors can pause them, and reduced-motion preferences are respected.

## Accessibility

Links and controls are keyboard accessible, focus is visible, images have descriptive alternatives, and the layout adapts to mobile screens. Motion stops when the page is hidden or reduced motion is enabled.
