# Project: Bluespectrum Innovative website

The global Figma-to-code rules in ~/.claude/CLAUDE.md apply here. This file only sets this project's stack and paths.

## Stack
- Plain HTML, CSS and vanilla JavaScript. No framework, no build step.
- Pages: index.html, about.html, contact.html, events.html, foundation.html, services.html
- Shared script: script.js
- Local server for previews: `npx serve .` (or `python3 -m http.server 8000`)

## Paths
- Design tokens: `assets/css/tokens.css` — CSS variables, single source of truth for all values
- Design system: `assets/css/system.css` — shared layout, typography and color utility classes
- Global styles: `styles.css` — component styles; `:root` aliases tokens.css via `var(--color-*)` etc.
- Figma reference images: `design/`
- Exported assets: `assets/<section-name>/`
- Existing image folders to reuse before exporting: `Icons/`, `logos/`, `Images/Event/`

## CSS load order (every page `<head>`)
```html
<link rel="stylesheet" href="assets/css/tokens.css" />
<link rel="stylesheet" href="assets/css/system.css" />
<link rel="stylesheet" href="styles.css" />
```
Inline `<style>` blocks (page-specific overrides) load last.

---

## ⚠️ MANDATORY pre-flight checklist — run BEFORE writing any CSS

For every new section or change, answer each question before touching code:

### Layout
- [ ] **Section padding** → use `.section` (80px), `.section--lg` (120px), or `.section--sm` (48px). Do NOT hardcode a vertical padding value.
- [ ] **Inner width** → use `.section-inner` (1440px) or `.section-inner--frame` (1200px / Figma frame). Do NOT write a one-off `max-width`.
- [ ] No new wrapper divs unless they exist as frames in Figma.

### Colors
- [ ] Every color must come from `tokens.css` via a `var(--color-*)` token. No hardcoded hex values.
- [ ] Background → use `.bg-navy`, `.bg-white`, `.bg-dark`, `.bg-light`, or `var(--gradient-*)`.
- [ ] On dark backgrounds use `var(--color-gray-text)` (#dbdaff) for body, `var(--color-white)` for headings.
- [ ] On light backgrounds use `var(--color-subtext)` (#4a5453) for body, `var(--color-primary)` (#002347) for headings.

### Typography
- [ ] Font family → always `var(--f-semibold)`, `var(--f-bold)`, `var(--f-medium)`, `var(--f-body)`. Never a hardcoded font name string.
- [ ] Font size → always a `var(--text-*)` token (e.g. `var(--text-40)`). No hardcoded px values.
- [ ] Line height → always a `var(--lh-*)` token. No hardcoded decimals.
- [ ] For standard heading/body combos use the `.t-h1` / `.t-h2` / `.t-body` classes from `system.css`.

### Section label
- [ ] The cyan-bar label MUST use `.section-label` from `system.css`. Never create a one-off equivalent.
- [ ] `.ev-label` in events.html is an alias that must be kept in sync with `.section-label`.

### Existing patterns
- [ ] Grep for the CSS property you are about to write. If a class already does it, use that class.
- [ ] Check `system.css` first, then `styles.css`, then page `<style>`. Never duplicate.

---

## Design system quick reference

| Need | Class / Token |
|---|---|
| Section padding (default) | `.section` |
| Section padding (large) | `.section--lg` |
| Inner container (1440px) | `.section-inner` |
| Inner container (1200px Figma) | `.section-inner--frame` |
| White background | `.bg-white` |
| Navy background | `.bg-navy` |
| Dark background | `.bg-dark` |
| Light blue tint | `.bg-light` |
| Heading on white | `.t-h1` / `.t-h2` / `.t-h3` + `.text-primary` |
| Heading on dark | `.t-h1` / `.t-h2` / `.t-h3` + `.text-white` |
| Body on white | `.t-body` + `.text-muted` |
| Body on dark | `.t-body` + `.text-lavender` |
| Section label | `.section-label` |
| Section label on dark | `.section-label section-label--on-dark` |
| Cyan accent color | `var(--color-cyan)` |
| Primary dark | `var(--color-primary)` |
| Navy | `var(--color-navy)` |
| Subtle border | `var(--color-navy-08)` |
| Light border | `var(--color-gray-d0)` |

---

## Project rules
- Every page must share the same tokens file, system file, styles file, and the same header and footer markup.
- Keep class names consistent across pages. Reuse existing classes before creating new ones.
- `FramerMigrate/` is reference material from the old Framer site. Do not edit it or link to it from live pages.
- When adding a new reusable pattern, add it to `system.css` — not to a page `<style>` block.
