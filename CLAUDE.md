# Project: Bluespectrum Innovative website

The global Figma-to-code rules in ~/.claude/CLAUDE.md apply here. This file only sets this project's stack and paths.

## Stack
- Plain HTML, CSS and vanilla JavaScript. No framework, no build step.
- Pages: index.html, about.html, contact.html, events.html, foundation.html
- Shared script: script.js
- Local server for previews: `npx serve .` (or `python3 -m http.server 8000`)

## Paths
- Design tokens: `assets/css/tokens.css` (CSS variables, linked in the <head> of every page)
- Figma reference images: `design/`
- Exported assets: `assets/<section-name>/`
- Existing folders to reuse before exporting duplicates: `Icons/`, `logos/`, `Images/Event/`

## Project rules
- Every page must share the same tokens file and the same header and footer markup.
- Keep class names consistent across pages. Reuse existing classes before creating new ones.
- `FramerMigrate/` is reference material from the old Framer site. Do not edit it or link to it from live pages.
