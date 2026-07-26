# Changelog

## 0.12.0

### Added

- Added a Korean lockup, `tinyrack-lockup-ko.svg` and its inverse. The identity had only a Latin wordmark, and the logo rules forbid typesetting one, so Korean surfaces had no approved way to show the brand at all — they fell back to plain bold text. The new artwork sits on the same grid as the Latin lockup: same mark at the same inset, same 38-unit height, same gap before the wordmark, with the wordmark outlined from IBM Plex Sans KR SemiBold and sized so its inked height matches the Latin cap height. Korean glyph widths differ, so the canvas is narrower — scale it by height. `pnpm --filter @tinyrack/ui generate:wordmark` regenerates it and `--check` proves the committed files still match the font.
- Brand artwork now ships with the package under `@tinyrack/ui/brand/*.svg`. It previously existed only in the documentation site's `public/` directory, so every consumer had to copy it by hand and drift from the source over time.
- Added `pageScroll` to `TRAppShell.Root`, along with the `--tr-app-shell-header-block-size` token and the `data-page-scroll` state attribute. `container`, the default, keeps today's behaviour: the shell owns a viewport-height frame and `Main scroll` renders the scroll panel. `document` hands scrolling to the document and leaves only the sidebar and the outline as independent scrollers. Use `document` for a full-page site and `container` when the shell is embedded in a fixed-height box. Under `document` the host page must not set `overflow: hidden` or `height: 100%` on `html` or `body`, `--tr-app-shell-block-size` no longer applies, and `Main` has no nested scroll region so `viewportLabel` is ignored.

### Fixed

- A pinch-zoomed documentation page can be panned on a phone again. The site shell locked itself to `100dvh` with `overflow: hidden` and scrolled inside a nested scroll panel, while the documentation stylesheet set `overflow: hidden` on `body` — so the document's scroll height always equalled the viewport and a zoomed visual viewport had nowhere to pan, with one-finger drags consumed by the inner scroller. The site now runs with `pageScroll="document"`, which is the structure Docusaurus, VitePress, Starlight, and react.dev all use. `TRAppShell` owns scroll restoration in both postures, so React Router's `<ScrollRestoration />` no longer runs alongside it. On desktop the page content is now narrower by the width of the document scrollbar.

### Changed

- The documentation site's `public/brand` is now a synced copy of the package artwork rather than the original. `pnpm --filter @tinyrack/homepage sync:brand --check` runs in its build so the two cannot diverge.
- **Breaking.** `TRField.Root` no longer takes `uiSize`. It only ever reached `.tr-field-control`, and it won over the control's own `uiSize` — a root set to `md` around a control set to `sm` rendered 40px, not 32px. Every comparable library resolves that the other way. Move the size onto the control.
- `TRTextarea` is now built on Base UI `Field.Control`, so a bare `TRField.Label` names it. It previously rendered a plain `<textarea>` that never joined the labelable context — the one control a field could not label. The prop surface, the `tr-textarea` class, and `uiSize` are unchanged.

### Removed

- **Breaking.** Removed `TRBrand` and its `@tinyrack/ui/components/brand` subpath. It was a wrapper around `TRLink` with one consumer and no internal dependents, and five of its eight props existed only to reach the primitive underneath. The logo, title, and version lockup is a product decision, so it now lives in `@tinyrack/docs` where it is used. Consumers that imported it should compose `TRLink` directly.

## 0.11.0

### Changed

- `--tinyrack-font-mono` now resolves to `"IBM Plex Mono", monospace` instead of `"IBM Plex Sans"`. The single-family rule still holds for prose, but the mono role is the one place it worked against the design: `code`, `TRCode`, `TRCodeBlock`, and `TRFileTree` all render content whose columns are meant to line up, and a proportional face breaks that. The generic `monospace` fallback keeps those surfaces fixed-width before the webfont loads. **Consumers that render code must now load IBM Plex Mono** (`@fontsource/ibm-plex-mono`); `@tinyrack/docs` loads it for you.

## 0.10.0

### Added

- Added the `TRPagination` component: a numbered page navigator for lists split across static pages. Pass `currentPage` and `totalPages` and it derives the visible sequence, collapsing wide gaps into an ellipsis while never hiding a single page behind one. Every cell is a real link built from `hrefFor`, so page one can point at an unpaginated path and the control works without JavaScript. `getPaginationRange` is exported from the same subpath for callers that need the sequence without the markup.

## 0.9.3

### Fixed

- Stopped docs-layout pages scrolling by the header's height too. 0.9.1 fixed this for splash and standalone pages only, so a short docs page still showed a scrollbar even when its content fit. Long pages are unaffected.

## 0.9.2

### Fixed

- Let a full-height child of a splash or standalone page actually fill it. 0.9.1 gave the page the right size but left its height indefinite, so a hero using `block-size: 100%` collapsed to its own content.

## 0.9.1

### Added

- Added the `--tr-mdx-page-min-height` override so the MDX page box is customizable end to end, matching the existing page width and padding overrides. The default is unchanged.

### Fixed

- Stopped splash and standalone pages scrolling by exactly the header's height. The MDX page height was hard-coded to `100vh`, which ignores the row the shell reserves for chrome, so consumers had to reach into shell internals to undo it.
- Gave `AppShell` main content a definite block size so descendants can resolve percentage heights instead of collapsing to their content.

## 0.9.0

### Added

- Added the `TRLinkButton` component: a navigation control that renders a real anchor (`role="link"`) with the Button visual contract, so links can look like buttons without losing link semantics or emitting Base UI's native-button warning.

### Changed

- Added the public `xs` through `xl` breakpoint scale, aligned Tailwind responsive variants, and migrated first-party media queries to shared tokens.
- Removed the `tinyrack-docs` CLI in favor of native React Router and Vite commands, with static build finalization handled by React Router `buildEnd`.
- Made Tailwind CSS 4 and its Vite plugin explicit docs peers and replaced CSS source rewriting with authored source/published entries plus asset copying.
- Made Tailwind CSS 4 required for UI styles and replaced custom-media processing with native Tailwind variants.
- Isolated package builds and tests, reduced test commands to `test`, `test:unit`, and `test:e2e`, and removed duplicate exhaustive documentation browser audits.
- Removed duplicate `check` scripts by moving production validation into builds and test-support type validation into unit tests.
- Added contrast-safe control, track, inverse, skeleton, overlay, measure, and spinner foundation tokens.
- Enforced foundation fallbacks for component-owned length, time, and opacity custom properties.
- Standardized public overlay anatomy on `tr-layer-arrow`, `tr-layer-backdrop`, `tr-layer-positioner`, and `tr-layer-viewport` classes.
- Removed the duplicate `Link` `primary` variant and narrowed invalid Dialog and Spinner prop combinations.
- Moved Separator and Context Menu Separator to Base UI wrapper contracts.
- Preserved Form value generics and added Field size and Meter status variants.

### Fixed

- Reset uncontrolled Checkbox Groups from the form actually owned by descendant checkbox inputs.
- Synchronized mixed Checkbox Playground state after activation.
- Hid AppShell mobile controls on desktop regardless of consumer display styles.
- Restored CopyButton focus and selection after the legacy clipboard fallback.
- Implemented four-direction Drawer anchoring and attached-edge radii.
- Removed Field Control styling dependence on Input CSS import order.
- Rendered only a Spinner with a single loading name in loading IconButtons.
- Sized Toolbar separators from the separator's own orientation.
