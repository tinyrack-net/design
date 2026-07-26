# Changelog

## 0.9.3

### Added

- Added the `TRPagination` component: a numbered page navigator for lists split across static pages. Pass `currentPage` and `totalPages` and it derives the visible sequence, collapsing wide gaps into an ellipsis while never hiding a single page behind one. Every cell is a real link built from `hrefFor`, so page one can point at an unpaginated path and the control works without JavaScript. `getPaginationRange` is exported from the same subpath for callers that need the sequence without the markup.

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
