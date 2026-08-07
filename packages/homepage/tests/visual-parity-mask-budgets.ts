import type { ParityComponent } from './visual-parity-scenarios.ts';

/**
 * The largest fraction of the image, in percent, that a component may hide
 * behind raster masks.
 *
 * A raster mask excludes a region from the structural pixel comparison because
 * CanvasKit and Chromium rasterize the same glyph outlines and shadows to
 * slightly different pixels. That is legitimate, but every masked pixel is a
 * pixel the suite no longer checks, so a green result overstates coverage by
 * exactly the masked area. Freezing each component's mask at its measured size
 * turns any later growth -- a widened rect, a mask that starts covering a
 * border -- into a loud failure instead of a quieter green.
 *
 * The numbers are the observed maximum across all locales, themes and states
 * plus a small headroom for sub-pixel layout jitter. They are a ceiling to push
 * down over time, not a target: several are high because the component is mostly
 * text (`text`, `steps`, `field`) or a rasterized frame (`card`'s elevated
 * shadow), and tightening those is per-component work tracked separately.
 *
 * Update an entry only to LOWER it, or to raise it with the reason in the diff.
 */
export const parityMaskBudgets: Readonly<Record<ParityComponent, number>> = {
  accordion: 72,
  alert: 38,
  'alert-dialog': 41,
  'animated-number': 30,
  'app-shell': 49,
  autocomplete: 6,
  avatar: 2,
  badge: 18,
  breadcrumbs: 47,
  button: 20,
  card: 90,
  checkbox: 7,
  'checkbox-group': 9,
  code: 29,
  'code-block': 33,
  collapsible: 63,
  combobox: 6,
  'context-menu': 14,
  'copy-button': 23,
  dialog: 20,
  drawer: 51,
  field: 56,
  fieldset: 50,
  'file-tree': 21,
  form: 2,
  'icon-button': 11,
  link: 35,
  menu: 18,
  menubar: 2,
  meter: 40,
  'navigation-menu': 27,
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
  tabs: 69,
  text: 63,
  textarea: 52,
  'text-field': 52,
  toast: 29,
  toggle: 15,
  'toggle-group': 17,
  toolbar: 17,
  tooltip: 2,
  'tree-nav': 12,
  'window-frame': 2,
};

/** Components whose mask hides most of the render, flagged for tightening. */
export const heavilyMaskedComponents: readonly ParityComponent[] = [
  // Mostly a rasterized frame or glyph run: the elevated card's shadow fringe,
  // and components that are almost entirely text.
  'card',
  'tabs',
  'accordion',
  'collapsible',
  'text',
  'steps',
  'field',
  'textarea',
  'text-field',
  'fieldset',
];
