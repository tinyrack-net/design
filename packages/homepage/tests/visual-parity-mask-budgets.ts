import type { ParityComponent } from './visual-parity-scenarios.ts';

/**
 * The largest fraction of the image, in percent, that a component may hide
 * behind raster masks.
 *
 * A raster mask excludes a region from the structural pixel comparison because
 * CanvasKit and Chromium rasterize the same glyph outlines and shadows to
 * slightly different pixels. Every masked pixel is a pixel the suite no longer
 * checks, so a green result overstates coverage by exactly the masked area.
 *
 * Masking is not the only forgiveness in the comparison, and it is the bluntest:
 * a masked pixel and one the antialiasing classifier accepts are counted
 * identically, so a mask is really a pre-emptive, unconditional version of that
 * classifier. Most of the former whole-box masks turned out to be unnecessary
 * once measured -- 29 components now mask nothing at all -- because
 * `isSharedPaletteBlend` and `isShiftedRasterAntialiasing` already absorb glyph
 * rasterization over a flat surface.
 *
 * Update an entry only to LOWER it, or to raise it with the reason in the diff.
 */
export const parityMaskBudgets: Readonly<Record<ParityComponent, number>> = {
  accordion: 2,
  alert: 38,
  'alert-dialog': 40,
  'animated-number': 2,
  'app-shell': 49,
  autocomplete: 6,
  avatar: 2,
  badge: 18,
  breadcrumbs: 2,
  button: 20,
  card: 44,
  checkbox: 2,
  'checkbox-group': 9,
  code: 2,
  'code-block': 2,
  collapsible: 2,
  combobox: 6,
  'context-menu': 14,
  'copy-button': 2,
  dialog: 20,
  drawer: 51,
  field: 2,
  fieldset: 2,
  'file-tree': 21,
  form: 2,
  'icon-button': 11,
  link: 35,
  menu: 18,
  menubar: 2,
  meter: 2,
  'navigation-menu': 17,
  'number-field': 2,
  'otp-field': 2,
  pagination: 2,
  popover: 40,
  'preview-card': 39,
  progress: 2,
  radio: 2,
  'radio-group': 9,
  'scroll-area': 2,
  select: 8,
  separator: 2,
  skeleton: 2,
  slider: 2,
  spinner: 2,
  steps: 61,
  switch: 11,
  table: 2,
  tabs: 2,
  text: 63,
  'text-field': 2,
  textarea: 52,
  toast: 29,
  toggle: 15,
  'toggle-group': 17,
  toolbar: 17,
  tooltip: 2,
  'tree-nav': 12,
  'window-frame': 2,
};

/** Components whose mask still hides most of the render, flagged for tightening. */
export const heavilyMaskedComponents: readonly ParityComponent[] = [
  // Both are glyph runs by nature: `text` is nothing but type, and `steps` is a
  // marker rail beside a copy column. Their typography and geometry are
  // asserted separately, and the residue the classifier cannot absorb is CJK
  // edge rasterization.
  'steps',
  'text',
];
