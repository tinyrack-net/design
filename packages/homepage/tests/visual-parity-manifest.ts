import type { ParityComponent } from './visual-parity-scenarios.ts';

/**
 * The scenario count each component contributes to the catalog.
 *
 * This replaces a single total. A total only says "the catalog changed size",
 * which is both too loud and too quiet: renaming a variant trips it with no loss
 * of coverage, while deleting one scenario and adding another somewhere else
 * leaves it silent. That second case is the one that matters -- it is exactly
 * how coverage erodes -- and it really happened here: swapping `release-hover`
 * for `pointer-focused` kept the state count at eleven and the totals matched by
 * coincidence.
 *
 * Update an entry deliberately, in the same commit as the scenario change, so
 * the diff states which component gained or lost coverage.
 */
export const endpointScenarioManifest: Readonly<Record<ParityComponent, number>> = {
  accordion: 7,
  alert: 40,
  'alert-dialog': 2,
  'animated-number': 1,
  'app-shell': 7,
  autocomplete: 4,
  avatar: 4,
  badge: 10,
  breadcrumbs: 1,
  button: 399,
  card: 12,
  checkbox: 54,
  'checkbox-group': 9,
  code: 1,
  'code-block': 1,
  collapsible: 10,
  combobox: 4,
  'context-menu': 2,
  'copy-button': 7,
  dialog: 10,
  drawer: 8,
  field: 2,
  fieldset: 2,
  'file-tree': 1,
  form: 1,
  'icon-button': 399,
  link: 81,
  menu: 2,
  menubar: 2,
  meter: 5,
  'navigation-menu': 2,
  'number-field': 2,
  'otp-field': 2,
  pagination: 4,
  popover: 2,
  'preview-card': 2,
  progress: 10,
  radio: 36,
  'radio-group': 9,
  'scroll-area': 2,
  select: 8,
  separator: 2,
  skeleton: 3,
  slider: 4,
  spinner: 8,
  steps: 1,
  switch: 18,
  table: 6,
  tabs: 14,
  text: 311,
  'text-field': 56,
  textarea: 32,
  toast: 2,
  toggle: 18,
  'toggle-group': 9,
  toolbar: 1,
  tooltip: 2,
  'tree-nav': 4,
  'window-frame': 8,
};

/** The same, for the motion catalog's default scenarios. */
export const motionScenarioManifest: Readonly<
  Partial<Record<ParityComponent, number>>
> = {
  accordion: 1,
  'alert-dialog': 1,
  'animated-number': 4,
  button: 66,
  checkbox: 2,
  collapsible: 2,
  dialog: 1,
  drawer: 4,
  'icon-button': 66,
  link: 6,
  menu: 1,
  meter: 2,
  'navigation-menu': 1,
  pagination: 1,
  popover: 1,
  'preview-card': 1,
  progress: 12,
  radio: 2,
  'scroll-area': 2,
  skeleton: 3,
  spinner: 8,
  switch: 2,
  table: 2,
  tabs: 2,
  'text-field': 4,
  toast: 1,
  toggle: 4,
  'tree-nav': 2,
};

/**
 * Per-component differences between a manifest and what the catalog builds.
 *
 * Returns the drift rather than a boolean so a failure names the component and
 * the direction instead of leaving two totals to be subtracted by hand.
 */
export function manifestDrift(
  manifest: Readonly<Partial<Record<ParityComponent, number>>>,
  scenarios: readonly { component: ParityComponent }[],
): string[] {
  const actual = new Map<string, number>();
  for (const { component } of scenarios) {
    actual.set(component, (actual.get(component) ?? 0) + 1);
  }
  const components = new Set([...Object.keys(manifest), ...actual.keys()]);
  return [...components].sort().flatMap((component) => {
    const expected = manifest[component as ParityComponent] ?? 0;
    const built = actual.get(component) ?? 0;
    if (expected === built) return [];
    const delta = built - expected;
    return [`${component}: ${expected} -> ${built} (${delta > 0 ? '+' : ''}${delta})`];
  });
}
