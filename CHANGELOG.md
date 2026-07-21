# Changelog

## Unreleased

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
