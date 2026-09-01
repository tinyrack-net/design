# Changelog

## @tinyrack/ui 0.33.0

### Added

- Added `TRRichText`, a token-backed document and notice typography boundary for
  semantic React content. `tinyrack-ui-check` accepts native prose elements
  inside this boundary while continuing to reject raw HTML injection.

## @tinyrack/ui 0.32.0

### Breaking

- `tinyrack-ui-check` now follows translated, fragmented, and conditional text
  rendered by native containers, requires `TRField.Label` for native labels and
  `TRText` for inline emphasis, and rejects `TRText` configured as a structural
  layout element. Text owned by Tinyrack control and compound-component parts
  remains valid without a nested `TRText` wrapper.

## @tinyrack/ui 0.31.0

### Breaking

- `tinyrack-ui-check` now enforces Tinyrack text and form components, rejects
  raw HTML and Typography prose utilities, verifies that `tinyrack-*`
  utilities exist, checks component-token and mixed literal values, and
  requires `core.css` before component styles. Existing consumers must replace
  native typographic and form elements or add a reasoned next-line exception.

### Added

- Added `xl` and `2xl` Avatar sizes, the `TRTable.Root layout="wide"` recipe,
  accessible segmented `TRSteps.Progress`, and `TRProviderMark` for Google,
  GitHub, and Apple identity-provider artwork.
- Added the `2xs` spacing and wide-table measurement tokens. IBM Plex body and
  heading tokens now include the official variable, Latin, Korean, and
  Japanese family names without system-font fallbacks.

## @tinyrack/ui 0.30.0

### Breaking

- Renamed the TinyAuth app icon family under `@tinyrack/ui/brand/apps` to
  `issuary-*`. Consumers must replace every `tinyauth-*` asset import with the
  corresponding `issuary-*` path. The artwork and generated pixel output are
  unchanged; SVG accessible names and the App icons documentation now use the
  Issuary product name.

## @tinyrack/ui 0.29.0

### Added

- `TROTPField.Root` now accepts `layout="stretch"` to distribute equal-width
  square slots across the available inline size. The default `compact` layout
  preserves the existing token-sized slots.

## @tinyrack/ui 0.28.0 / @tinyrack/docs 0.22.0

### Added

- Added an explicit React–Flutter parity catalog for all shared components,
  executable contract and geometry fixtures, normalized runtime observations,
  and a dedicated CI gate for cross-platform component changes.

### Changed

- Button parity now verifies shared size, intent, appearance, theme, focus,
  pointer, disabled, and loading behavior against the Flutter Web preview.

## @tinyrack/ui 0.27.1

### Fixed

- Select item indicators now constrain nested SVG icons to the design-system
  size, preventing default 24px icons from overflowing their 16px slots.

## @tinyrack/ui 0.27.0 / @tinyrack/docs 0.21.0

### Breaking

- Intent colors now separate solid fills from foreground-only emphasis. Use
  `primaryForeground`, `infoForeground`, `successForeground`,
  `warningForeground`, and `dangerForeground` for outline and ghost controls,
  text, icons, links, indicators, and markers. The existing intent roles remain
  the solid fill contract, while `on*` roles remain content painted on those
  fills.

### Changed

- Dark-mode solid actions use deeper intent fills with white content across
  normal, hover, and pressed states. Solid buttons keep a transparent border so
  they preserve control geometry without drawing an outline.
- Filled selection states use the solid primary/on-primary pair, while status
  text and unfilled emphasis use the corresponding foreground role. Web UI,
  documentation chrome, and generated Tailwind tokens now follow the same
  contract.

## @tinyrack/ui 0.26.1 / @tinyrack/docs 0.20.0

### Fixed

- Restored unordered-list bullets in React MDX after Tailwind preflight removes
  native markers. Ordered lists keep decimal markers and task lists remain
  markerless.

### Added

- Restored the reusable static-site entrypoints for sites that own their React
  Router shell: SEO and feed helpers under `@tinyrack/docs/site`, sitemap/feed
  asset generation under `@tinyrack/docs/vite`, and static 404 finalization
  under `@tinyrack/docs/react-router`.

## 0.26.0

### Fixed

- Select popups can grow wider than narrow triggers up to the small overlay
  limit, and option rows include token-based block padding.
- Restored the Input focus contract for Select: pointer hover, open, selected,
  and highlighted states use background emphasis only, while keyboard-origin
  focus paints the inset focus border. Invalid danger borders are unchanged.

### Breaking

- Renamed the Coder app icon assets under `@tinyrack/ui/brand/apps` to
  `tinest-app-icon.{svg,png}`. Consumers must replace every
  `coder-app-icon-*` import with the corresponding `tinest-app-icon-*` path;
  the artwork and generated pixel output are unchanged.
- Design token sources now use the DTCG 2025.10 format and resolver. The Web
  public token surface removes unused palette steps, the `xs` and `xl`
  breakpoints, `4xl` and `5xl` spacing, unused typography steps, and the
  brand-mark, pane, page-width, reading-width, page-gutter, control-width, and
  large overlay measurements. Consumers must use the remaining semantic,
  measure, spacing, and `sm`/`md`/`lg` breakpoint tokens or define
  product-specific layout values locally.
- `TRCodeBlock` no longer bundles a highlighter. `shiki` moved from a UI dependency to an optional peer, so an application that passes `language` must now supply a highlighter through the new `highlighter` prop or `TRCodeHighlighterProvider` (`@tinyrack/ui/providers/highlighter`). The two-line migration is to install `shiki` and wrap the tree with `trShikiWebHighlighter` from `@tinyrack/ui/highlighters/shiki-web`. An unconfigured block still renders readable plain text and sets `data-highlight="no-highlighter"`; pass `onHighlightFailure` to be notified.
- Widened `TRCodeBlockProps.language` from Shiki's `BundledLanguage` union to `string`. The valid set now follows the configured highlighter rather than a union the package cannot honor at runtime.

### Added

- Added six theme-aware illustration color roles for primary, secondary, and
  tertiary faces, details, strokes, and shadows. They are available from the
  Web token export, CSS variables, and Tailwind color utilities. The new
  Illustration foundation documents general vector and isometric composition
  in English, Korean, and Japanese.
- `tinyrack-ui-check` now audits CSS, JSX, inline styles, Tailwind utilities,
  and local CSS variable aliases for SVG fill and stroke roles. Raw colors and
  text, border, control, focus, or mismatched illustration roles fail the check.
- Added `TRVirtualList<T, K>` at `@tinyrack/ui/components/virtual-list` for
  stable-key vertical and horizontal virtualization. It includes controller
  navigation and snapshots, dynamic `ResizeObserver` measurement, visible-anchor
  correction across complete collection diffs, pinned edge following, focused
  item retention, independent deduplicated edge requests, RTL scrolling, and an
  explicit hydration-safe `ssrFallback`. The public API hides TanStack types;
  `@tanstack/react-virtual` is pinned as a regular dependency.
- Added `tinyrack-ui-check` and `@tinyrack/ui/check` for enforcing public
  Tinyrack tokens, Tailwind utilities, component imports, component CSS, and
  foundation CSS across Web application source. The command supports readable,
  JSON, and GitHub Actions output and fails on every violation without a
  baseline.
- Added an `appearance` prop to the seven chrome-bearing input controls — `TRInput`, `TRTextarea`, `TRSelect.Trigger`, `TRCombobox.InputGroup`, `TRAutocomplete.InputGroup`, `TRNumberField.Root`, and `TROTPField.Root` — typed as the new `TRFieldAppearance` (`'solid' | 'ghost'`, exported from `@tinyrack/ui/core`). Only buttons and shell surfaces could drop their chrome before, so a select or a text field placed inside a sidebar or a toolbar had no way to stop looking like a boxed control. It is emitted as `data-appearance`, matching `TRButton`. This is deliberately narrower than `TRButtonAppearance`: a field's solid form is already outlined, so an `outline` step would be indistinguishable from the default.
- `ghost` drops only the resting fill and border. Hover, focus, and invalid emphasis are still painted by the control from the same tokens `solid` uses, and `TRSelect.Trigger` also marks its open popup, and the border box is kept at its normal width and painted transparent, so swapping appearance never shifts layout. Focus and the open popup state take precedence over hover rather than competing with it.

- Added `sm` to the control size scale. `uiSize="sm"` is a 28px-tall recipe with 8px inline padding, 4px gap, and 12px/16px label type, sized for dense application chrome such as a title bar or a toolbar. The scale previously started at `md`, so `TRControlUiSize` accepted only `md` and `lg`; every component that reads a `uiSize` now resolves the new step, and the `--tinyrack-control-*-sm` and `--tinyrack-spinner-size-sm` tokens are available to consumer CSS.
- Added the `TRCodeHighlighter` contract, `TRCodeHighlighterProvider`, and the `@tinyrack/ui/highlighters/shiki` and `@tinyrack/ui/highlighters/shiki-web` adapters, so grammar selection is an explicit consumer decision instead of a private build-time alias.
- Added the `data-highlight` state attribute (`plain`, `pending`, `highlighted`, `unsupported`, `no-highlighter`, `error`) and the `onHighlightFailure` callback, replacing a silent `catch {}` that hid missing grammars.
- Added `highlight.languages` to `DocsConfig` and published `@tinyrack/docs/highlighting`. A docs site declares its grammars and only those are built; unknown identifiers now fail the build instead of silently rendering as plain text.
- Added `mdx` and `python` to the documentation site's grammar set. Nine pages that requested `mdx` had been rendering unhighlighted, while the site now emits chunks only for grammars its content requests.
- Added `collapsed` to `TRAppShell.Sidebar`. A collapsed sidebar animates to zero inline size over `--tinyrack-duration-normal`, becomes `inert` the moment the collapse starts so a focused control cannot keep receiving keys, and is hidden from the page once the transition ends. It reflects `data-collapsed` for styling and honours `prefers-reduced-motion`.

### Changed

- A disabled `TRSwitch` now fades the whole control at `--tinyrack-opacity-disabled` and keeps its checked and unchecked palettes, the way `TRCheckbox` and a disabled field already report unavailability. The old rule dimmed only the thumb when the switch was off, leaving the track and its border at full contrast, and repainted an on switch entirely — a `--tinyrack-surface-selected` track behind a full-opacity `--tinyrack-primary` thumb. That inverted the enabled on state, so a switch that was merely unavailable read as a different control instead of as the same switch the reader had just lost access to; it was also the more prominent of the two disabled states. The five `--tr-switch-disabled-background`, `--tr-switch-disabled-border`, `--tr-switch-checked-disabled-background`, `--tr-switch-checked-disabled-border`, and `--tr-switch-checked-disabled-thumb-background` custom properties are gone with the declarations they fed; a consumer that set them should style `.tr-switch[data-disabled]` directly. No token values changed.
- `TRDialog`, `TRAlertDialog`, and `TRDrawer` now inset their slots by `--tinyrack-space-md` instead of `--tinyrack-space-xl`, so an overlay box is padded 12px rather than 24. A dialog is a focused surface holding one short decision, and a quarter of its width was going to chrome; the delete confirmations and pickers that make up most overlay traffic read as oversized boxes around two lines of text. `.tr-dialog-body` drops from `--tinyrack-space-lg` to `--tinyrack-space-sm`, and `.tr-alert-dialog-popup` stacks its slots at `--tinyrack-space-sm` instead of `--tinyrack-space-md`, so the interior rhythm shrinks with the box rather than leaving the content block looking detached. The `max-sm` override that padded a dialog at `--tinyrack-space-lg` is gone: it existed to give a narrow viewport more breathing room than the desktop default, and at the new default it would have made a phone dialog wider-padded than a desktop one. No token values changed, and `--tr-dialog-box-padding` still overrides the box. A consumer that sized overlay content against the old 24px inset — a fixed `max-width` on a body meant to fill the box, say — gets 24px more room than it asked for.
- Every popup layer row now renders at the `sm` control size instead of `md`. A menu item, a select option, a combobox or autocomplete suggestion, and a toolbar link were all as tall as the control that opened them, so an open menu of five commands took as much vertical space as five stacked buttons. A row inside an already-open surface is not a control the page has to reserve space for, and sizing it like one made short command lists read as oversized. Menu rows are 32px instead of 36, select and combobox options 28 instead of 32, inline padding 8 instead of 12, and row text is the `sm` control label type instead of `--tinyrack-text-sm`, which also aligns a menu item's type with a `TRButton` of the same size. Row icons are sized explicitly at the `sm` icon size; they previously inherited the ambient 16px icon size and stayed large while the row shrank. The context menu's minimum width is now five `sm` rows rather than five `md` ones. Popup widths are otherwise unchanged, because `--tinyrack-measure-md` is a layout scale shared with things that are not controls. No token values changed — the `sm` metrics already existed and the layer chrome now reads them. Consumers that hard-coded a row height to match the old geometry, or that relied on menu text inheriting the surrounding font, will need to drop that override.
- The list separators of `TRSelect`, `TRCombobox`, and `TRAutocomplete` now render `role="presentation"` instead of `role="separator"`. A separator is not a valid child of a `listbox`, so assistive technology was being handed an element the role does not permit there; axe DevTools and ARC Toolkit both flag it. The rendered class names, `orientation`, `data-orientation`, and the painted line are unchanged, so styling and layout are unaffected. `TRCombobox.Separator` and `TRAutocomplete.Separator` previously delegated to `TRSeparator` and so accepted its props, including `role`; they now wrap the corresponding Base UI part, which means the `role` escape hatch is gone. `TRMenu`, `TRContextMenu`, and `TRToolbar` separators keep `role="separator"`, which is valid inside a menu or a toolbar.
- `TRAppShell` sidebar sizing moved from the root's `grid-template-columns` onto `inline-size` on `.tr-app-shell-sidebar`, so the sidebar animates its own width and keeps that width when it is composed inside a flex row instead of the shell's grid area. `--tr-app-shell-sidebar-width` and `--tr-app-shell-sidebar-rail-width` keep their meaning and their defaults; a consumer that overrode `grid-template-columns` on `.tr-app-shell` directly must move that override to the sidebar. Switching between the expanded width and the rail is now animated as well.

## 0.19.0

### Added

- Added `--tinyrack-layer-chrome` (100), bridged to Tailwind as `z-tinyrack-chrome`, for in-flow page furniture that pins while the page scrolls — a sticky app header or toolbar. The ladder had `base` and then jumped to `backdrop`, so anything that needed to out-paint scrolling content had no name to reach for and grabbed `dropdown`, the nearest thing above it. That is the wrong shelf: sticky chrome is part of the page a scrim is meant to cover, not an overlay competing with one.

### Fixed

- `TRAppShell`'s sticky header no longer paints over a modal's scrim. It sat on `--tinyrack-layer-dropdown` (1000) while every backdrop in the system sits on `--tinyrack-layer-backdrop` (900), so opening a `TRDialog`, a `TRAlertDialog`, or the shell's **own mobile navigation drawer** dimmed the page and left the header bright above it — the header stayed at full contrast and looked interactive while the content behind it was blocked. The header only has to out-paint the content scrolling underneath, so it moves to the new `chrome` layer at 100 and a scrim now covers it like the rest of the page. This affects the `docs`, `splash`, and `standalone` chrome modes and the `pageScroll="document"` posture, which are the two places the shell sets a header z-index. A browser test renders a shell under an open dialog and hit-tests the header's centre point to keep the ordering from drifting back.

  **A consumer that set its own z-index on `TRAppShell.Header` keeps that value and stays above the scrim.** Move those call sites to `z-tinyrack-chrome`.

## 0.16.0

### Added

- Dotweave and TinyAuth app icons now ship with `@tinyrack/ui` under `@tinyrack/ui/brand/apps/*`. Each product includes its canonical SVG plus generated 16, 32, 48, 128, and 512 pixel PNGs, so consumers can import the same reviewed artwork used by the Tinyrack documentation site instead of copying files from the site or maintaining local derivatives. `packages/ui_web/src/brand` is now the source of truth for the complete 21-file brand catalog; the UI build verifies every PNG against its SVG master, the homepage mirrors the published tree without changing its `/brand/*` URLs, and the packed-consumer test resolves both top-level and nested asset subpaths from the real tarball.

## 0.15.0

### Added

- Added `TRInput.Group`, `TRInput.Adornment`, and `TRInput.Action`, also exported individually as `TRInputGroup`, `TRInputAdornment`, and `TRInputAction`. The framing styles for an input with a leading icon or a trailing button already existed and were already used by Combobox and Autocomplete, but a plain input had no React surface for them — the only way to get a password reveal toggle or a search affordance was to hand-write internal class names that were never a public contract. The group owns the border, background, focus ring, and control height; an input rendered inside it discovers the group and takes the flat treatment itself, so callers never name those classes. `Adornment` ignores pointer events so clicking it still focuses the input, and `Action` defaults to `type="button"` so it cannot submit the surrounding form. `TRInput` stays directly renderable, so nothing changes for existing call sites.

### Fixed

- `@tinyrack/docs` is released at 0.15.0 so it requires `@tinyrack/ui@^0.15.0`. It had been left at 0.13.0 while the UI package moved to 0.14.0 and 0.15.0, and a caret range on a `0.x` version pins the minor — so `^0.13.0` excluded both. Any site depending on the two together got **two copies of `@tinyrack/ui` installed**, the app resolving one version and the documentation framework another. That silently undoes the 0.14.0 cascade-layer fix for anything that reaches the older copy, and doubles the shipped CSS wherever both are reachable. The package contents are unchanged; only the version and therefore the resolved peer range move.
- `--tinyrack-weight-strong` is now `700` instead of `800`. IBM Plex Sans stops at Bold 700 and the variable build's `wght` axis ends there too, so nothing heavier could ever be drawn: CSS font matching already picked the 700 face and a variable font already clamped to the end of its axis. Measured in Chromium against the faces `@tinyrack/docs` loads, text set at 700 and at 800 renders to the same width while 600 differs, so **nothing changes visually** — the token simply stops claiming a weight the typeface cannot produce. `strong` and `bold` now hold the same value; whether the scale should keep two names for one weight is a separate API question, deliberately left alone here.

## 0.14.0

### Fixed

- **Breaking.** The twenty component stylesheets that shipped outside a cascade layer now sit in `@layer components` with the other forty. Unlayered CSS outranks every layered rule no matter the specificity or the import order, so those twenty silently beat the consumer's own Tailwind utilities: `<TRSeparator className="my-tinyrack-xl">` computed a zero margin because `.tr-separator { margin: 0 }` won, and `<TRIconButton className="md:hidden">` stayed visible at every breakpoint because `.tr-btn { display: inline-flex }` won. The failure is silent — the class is in the DOM, DevTools shows it struck through, and nothing warns — so it read as a consumer bug every time. `.tr-text`, `.tr-card-*`, `.tr-table`, `.tr-tabs-*`, `.tr-breadcrumbs`, and `.tr-pagination` carried the same trap. Tailwind registers `theme, base, components, utilities` before our CSS is imported, so landing in `components` keeps component styles above preflight while letting consumer utilities win, which is what shipping Tailwind-authored CSS is supposed to mean. **A consumer that was relying on a component style beating its own utility class will now see the utility take effect.** A test over `src/components/*/*.css` keeps the layer from drifting again.

### Added

- Added page-frame measurements: `--tinyrack-page-width-{sm,md,lg,xl}` (64/72/76/80rem) and `--tinyrack-reading-width-{sm,md,lg}` (44/48/56rem), bridged to Tailwind as `max-w-tinyrack-page-*` and `max-w-tinyrack-reading-*`. The existing `measure-*` scale sizes a component and stops at 32rem, and `overlay-width-*` is dialog geometry, so a site laying out a page had no token to reach for and every consumer invented its own shell width — including this repo, whose `mdx.css` hardcodes 76rem and 64rem for exactly these two roles.
- Added `--tinyrack-page-gutter`, the horizontal breathing room a page frame keeps against the viewport, as `clamp(1rem, 4vw, 2.5rem)` and available as `px-tinyrack-page-gutter`. It is a clamp rather than a breakpoint ladder so it needs no variants and keeps working inside a container query. The previous answer was private to `.tr-mdx`, which stepped 1rem → 1.5rem → 2.5rem through `@variant` blocks; consumers outside MDX generally settled for a flat 1rem, which runs the content into the screen edge on a tablet.
- Extended the spacing scale with `3xl` (3rem), `4xl` (4rem), and `5xl` (6rem). It stopped at 2rem, so section-level rhythm had no token at all and callers reached for literals or synthesized steps with `calc()` — `mdx.css` does both.

## 0.13.0

### Added

- Added `@tinyrack/docs/site`, a reusable static-site SEO core for React Router sites. It creates canonical, locale alternate, Open Graph, Twitter, article, and JSON-LD metadata from page descriptors, plus sitemap, robots, and RSS 2.0 output. `tinyrackSiteAssets` serves the same sitemap, robots, and feed assets in development and emits them in production without taking ownership of a consumer's content scanner.
- Added `finalizeStaticSiteBuild` to `@tinyrack/docs/react-router` so static sites can explicitly produce `404.html` from React Router's SPA fallback or supplied HTML.
- Added `TRColorSchemeProvider` and its no-flash bootstrap helpers under `@tinyrack/ui/providers/color-scheme`. The provider supports auto, light, and dark preferences, reacts to system changes in auto mode, and reads the legacy `tinyrack-light` and `tinyrack-dark` stored values.
- Added `createTinyrackFontPreloadLinks` to `@tinyrack/ui/core` so consumers share the language-aware Latin, Korean, and Japanese preload policy while retaining control of their font asset URLs.

### Changed

- `@tinyrack/docs` now uses the shared site SEO generators, color-scheme provider, and font preload policy internally. Existing docs metadata and static assets retain their public behavior.

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
