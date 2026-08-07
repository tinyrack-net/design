import type {
  ParityComponent,
  ParityState,
  VisualParityScenario,
} from './visual-parity-scenarios.ts';

/**
 * A named, budgeted relaxation of one geometry assertion.
 *
 * Every entry is a divergence that product code cannot drive to zero, not a
 * convenience. The budget is a hard cap: a scenario that drifts past it fails
 * exactly as it would without an entry, so a tolerance can absorb the known
 * residue without hiding a regression on top of it.
 */
export type ParityGeometryTolerance = {
  /** Stable identifier, used in failure messages and the coverage report. */
  id: string;
  /** Scenario ids this covers. Deliberately explicit -- no globs. */
  scenarios: readonly string[];
  metric: 'height' | 'width';
  /** Hard cap in CSS pixels. Anything above this fails. */
  maxDelta: number;
  /** Why the two runtimes cannot agree. */
  reason: string;
  /** What would let this entry be deleted. */
  review: string;
};

export const parityGeometryTolerances: readonly ParityGeometryTolerance[] = [
  {
    id: 'shrink-wrapped-display-text-advance',
    scenarios: ['text-pair-41', 'text-pair-51', 'text-pair-61', 'text-pair-301'],
    metric: 'width',
    maxDelta: 3,
    reason:
      'CanvasKit and Chromium shape the same display string to slightly different ' +
      'advances. The generated per-variant tracking constants cancel the bulk of it, ' +
      'but a single uniform letter-spacing cannot cancel a per-glyph-pair difference. ' +
      'It only surfaces at truncate: true, where the box hugs the text instead of the ' +
      'container, and measures ~1% of a 228px string.',
    review:
      'Delete when the Flutter preview shapes text through the same engine as ' +
      'Chromium, or when the text parity scenarios stop shrink-wrapping.',
  },
  {
    id: 'data-table-column-advance',
    scenarios: [
      'table-density-compact-striped-false',
      'table-density-compact-striped-true',
      'table-density-comfortable-striped-false',
      'table-density-comfortable-striped-true',
      'table-density-spacious-striped-false',
      'table-density-spacious-striped-true',
    ],
    metric: 'width',
    maxDelta: 3,
    reason:
      'The row model, cell padding, typography and container now derive from the same ' +
      'tokens as the web, and every density matches on height. The residue is ~1px per ' +
      'column of text advance, which DataTable then rounds to whole column widths ' +
      'while CSS keeps them fractional.',
    review:
      'Delete when column widths are driven by a shared measurement rather than each ' +
      'engine laying the cells out independently.',
  },
  {
    id: 'korean-caption-line-box',
    scenarios: [
      'table-density-compact-striped-false',
      'table-density-compact-striped-true',
      'table-density-comfortable-striped-false',
      'table-density-comfortable-striped-true',
      'table-density-spacious-striped-false',
      'table-density-spacious-striped-true',
    ],
    metric: 'height',
    maxDelta: 2,
    reason:
      'Only the caption is localised, and only Korean diverges: CanvasKit lays the ' +
      'Hangul run out one pixel taller than Chromium does at the same pinned line ' +
      'height (React 136, Flutter 137). English and Japanese match exactly, so this ' +
      'is fallback-font metrics rather than the caption box model.',
    review:
      'Delete when the Korean fallback face reports the same line metrics to both ' +
      'engines, or when the caption stops relying on a pinned line height.',
  },
];

export function geometryToleranceFor(
  scenario: VisualParityScenario,
  metric: 'height' | 'width',
): ParityGeometryTolerance | undefined {
  return parityGeometryTolerances.find(
    (tolerance) =>
      tolerance.metric === metric && tolerance.scenarios.includes(scenario.id),
  );
}

/**
 * Component and state pairs that deliberately render the same as rest.
 *
 * The declared-condition model asserts that entering a state repaints, because
 * a forcing call that never landed is otherwise indistinguishable from a state
 * with no styling. Where a control genuinely has no styling for a state, that
 * has to be stated -- and stating it flips the assertion, so the pair also
 * cannot silently start painting later.
 */
export type ParityInertState = {
  id: string;
  components: readonly ParityComponent[];
  states: readonly ParityState[];
  /**
   * Narrows the entry when only some argument combinations are inert.
   *
   * A ghost field is the reason this exists: it paints a hover background where
   * the bordered one only restates its resting border colour, so the two cannot
   * share a verdict.
   */
  appliesTo?: (scenario: VisualParityScenario) => boolean;
  reason: string;
  review: string;
};

export const parityInertStates: readonly ParityInertState[] = [
  {
    id: 'controls-without-pointer-styling',
    components: ['accordion', 'checkbox', 'checkbox-group', 'collapsible'],
    states: ['hover', 'pressed'],
    reason:
      'These components declare no `:hover` and no `:active` rule at all on the web, ' +
      'and their Flutter counterparts track no hover state either. The pointer ' +
      'changes the cursor and nothing else, so rest and state are the same render ' +
      'by design rather than by omission.',
    review:
      'Delete the affected entry as soon as one of these grows a hover or press ' +
      'treatment, which will fail this list rather than pass unnoticed.',
  },
  {
    id: 'invalid-fields-opt-out-of-hover',
    components: ['text-field'],
    states: ['invalid-hover'],
    reason:
      'The hover rule excludes invalid fields by selector (`:not([aria-invalid="true"], ' +
      '[data-invalid], ...)` in input.css), so an invalid field keeps its danger border ' +
      'under the pointer. Flutter resolves the invalid border first for the same reason. ' +
      'Both platforms are deliberately unmoved by hover here.',
    review:
      'Delete if invalid fields ever gain a hover treatment; the exclusion is one ' +
      'selector, so its removal should fail this entry.',
  },
];

export function isDeclaredInert(scenario: VisualParityScenario): boolean {
  const state = scenario.state ?? 'default';
  return parityInertStates.some(
    (entry) =>
      entry.components.includes(scenario.component) &&
      entry.states.includes(state) &&
      (entry.appliesTo?.(scenario) ?? true),
  );
}
