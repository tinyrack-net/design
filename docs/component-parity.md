# Component parity

Tinyrack aligns Mantine and daisyUI through shared component contracts in
`@tinyrack/themes/tokens`, generated CSS, and the Mantine theme adapter.

The parity target is semantic, not only name-based. Components are mapped when
both libraries expose the same kind of UI primitive and the visual axes can be
made equivalent without changing the component's meaning. Same-name components
that represent different primitives are documented as contracted exceptions.

## Mapped components

These components are mapped with shared Tinyrack tokens and browser
computed-style coverage:

| Tinyrack contract | Mantine | daisyUI |
| --- | --- | --- |
| alert | `Alert` | `alert` |
| avatar | `Avatar` | `avatar` |
| badge | `Badge` | `badge` |
| breadcrumbs | `Breadcrumbs` | `breadcrumbs` |
| button | `Button` | `button` |
| card | `Card` | `card` |
| checkbox | `Checkbox` | `checkbox` |
| divider | `Divider` | `divider` |
| drawer | `Drawer` | `drawer` |
| fieldset | `Fieldset` | `fieldset` |
| fileInput | `FileInput` | `fileinput` |
| indicator | `Indicator` | `indicator` |
| input | `Input`, `TextInput` | `input` |
| kbd | `Kbd` | `kbd` |
| list | `List` | `list` |
| loader | `Loader` | `loading` |
| menu | `Menu` | `dropdown`, `menu` |
| modal | `Modal` | `modal` |
| progress | `Progress` | `progress` |
| radialProgress | `RingProgress`, `SemiCircleProgress` | `radialprogress` |
| radio | `Radio` | `radio` |
| range | `RangeSlider`, `Slider` | `range` |
| rating | `Rating` | `rating` |
| select | `NativeSelect`, `Select` | `select` |
| skeleton | `Skeleton` | `skeleton` |
| stepper | `Stepper` | `steps` |
| switch | `Switch` | `toggle` |
| table | `Table` | `table` |
| tabs | `Tabs` | `tab` |
| textarea | `Textarea` | `textarea` |
| timeline | `Timeline` | `timeline` |
| tooltip | `Tooltip` | `tooltip` |

## Contracted exceptions

These components intentionally stay out of automatic visual parity:

| Contract | Reason |
| --- | --- |
| collapse | Mantine `Collapse` is an unstyled transition wrapper. daisyUI `collapse` is a styled disclosure surface with title/content structure. |
| stack | Mantine `Stack` is a vertical flex layout primitive. daisyUI `stack` is an overlapping visual stack. |

Use a local wrapper component when an app needs one of these exceptions to look
like a specific disclosure or overlapping-stack pattern.

## Verification

Parity is covered by:

- `src/integrations/parity.ts`: source-of-truth contract manifest
- `src/exports/tokens.ts`: public token export surface
- `src/theme/components.ts`: shared component token contracts
- `src/theme/create-css.ts`: generated Mantine and daisyUI CSS mappings
- `src/integrations/parity.browser.test.tsx`: computed-style parity tests in Chromium

Run:

```bash
pnpm biome
pnpm check:types
pnpm check:css
pnpm test
```
