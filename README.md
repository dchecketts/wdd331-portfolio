# WDD 331R Portfolio

**Student:** Daniel Checketts
**Semester:** Fall 2026
**Live Site:** [View Site](https://dchecketts.github.io/wdd331-portfolio/index.html)

## About

This repository is my portfolio for WDD 331R: Advanced CSS.
Each week I add new pages and styles as I work through the course
assignments. The site deploys automatically to GitHub Pages on
every push to main.

## Features

The CSS is organized following a hybrid CubeCSS/ITCSS structure, and also features a dynamic dark mode using minimal JavaScript (State tracking). The dark mode is primarily driven by CSS.

Headings use Atkinson Hyperlegible Next, and body text uses Atkinson Hyperlegible.

## Pages

- [Home](index.html)
- [Resume](resume.html)
- [Contact](contact.html)
- [Custom Properties and Nesting](unit-1/custom-properties/index.html)
- [Layered Components](unit-2/layered-components/index.html)
- [Grid Layout Cards](unit-4/grid-layouts/cards.html)
- [Grid Layout Editorial](unit-4/grid-layouts/editorial.html)

## Resume styles

The [resume](resume.html) uses reusable Tailwind CSS components with `@apply` and the shared color and typography tokens.
Its print styles use A4 margins, compact typography, and a layout designed for paper.
Regenerate `css/resume.css` after changing `resume.html`, `css/input.css`, or the shared tokens:

```sh
npx @tailwindcss/cli@4.3.4 -i css/input.css -o css/resume.css --minify
```

Replace `--minify` with `--watch` while editing.
The generated stylesheet is committed so GitHub Pages can serve it directly.

## Contact form

The [contact page](contact.html) has visible labels explicitly associated with the name,
email, message, and optional copy checkbox through matching `for` and `id` values.
Native `required` and email validation catch missing or malformed entries. Autocomplete
helps visitors enter their name and email. The message hint is connected through
`aria-describedby`, keyboard focus stays visible, and a `role="status"` region announces
the result of checking the form.

This is an assignment stub: JavaScript prevents submission, nothing is sent or stored,
and the page offers a direct email link. The checkbox uses the shared `--color-accent`
through the root `accent-color` declaration in `css/tokens/variables.css`. The message
textarea uses `field-sizing: content` with an 8rem minimum and 24rem maximum; browsers
without support retain a manually resizable, five-row textarea with the same limits.
Form element defaults live in `css/base/elements.css`; page and component layout lives
in `css/components/components.css`.

### Form accessibility checks

Checked in Chrome's accessibility tree: the controls are announced as Name, Email,
Message, and “I'd like a copy of my message (optional).” Missing required fields and
an invalid email fail native validation. A valid form shows the local status message
without navigation. At 375px and 1280px widths the page has no horizontal overflow;
light and dark themes were visually reviewed. The textarea grew from 128px to its
384px maximum during the content-sizing check. These checks used the accessibility
tree, not a screen reader.

## Shared-token audit

Audited `css/tokens/variables.css` and `css/tokens/colors.css` against their consumers,
including the unit pages that import them, JavaScript references, and Tailwind's
custom-property syntax. Generated CSS and the independent token systems in units 1,
2, and 7 were excluded from the consumer search.

- Removed 11 orphan tokens: `--font-size-sm`, `--font-size-md`, `--font-size-caption`,
  `--font-size-display`, and the unused seven-step `--accent-200` through `--accent-800` ramp.
- Removed two redundant aliases, `--seed-link` and `--seed-link-hover`. The semantic
  link colors now reference the existing accent seeds directly. Separate semantic
  link tokens remain because their dark-theme values differ from the accent colors.
- Removed two competing shadow declarations from `colors.css`. The existing
  `--shadow-sm` and `--shadow-md` definitions in `variables.css` are now authoritative.
- Kept the intentional spacing/radius scales and the existing `--font-size-*` naming
  convention; no additional near-duplicate values or naming conflicts needed merging.
- Preserved tokens used outside the homepage, including the monospace font used by
  the typography demo and the pill radius used by the editorial layout.

The follow-up audit found zero orphan tokens and zero duplicate declarations in the
shared token files. The smaller token set makes the active typography scale and the
single source of shadow values easier to follow. The legacy resume rules were also
removed from `css/components/components.css`; their reusable replacements live in
`css/input.css`.

Rebuild the shared stylesheet with `npm run build` when the local dependencies are
installed. The site serves `css/main.css` directly; `dist/styles.css` is its committed
PostCSS build. Deployment runs from `.github/workflows/deploy-website.yml` on pushes
to `main`.
