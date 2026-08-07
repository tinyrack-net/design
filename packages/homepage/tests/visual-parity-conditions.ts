import type {
  ParityComponent,
  ParityState,
  VisualParityScenario,
} from './visual-parity-scenarios.ts';

/** Pseudo classes Chromium can be told to force during style resolution. */
export type ForcedPseudo = 'active' | 'focus' | 'focus-visible' | 'hover';

/** The Flutter preview's vocabulary for a declared interaction state. */
export type FlutterForcedState =
  | 'focused'
  | 'focused-hover'
  | 'hover'
  | 'keyboard-pressed'
  | 'pointer-focused'
  | 'pressed';

/**
 * How one scenario state is declared to each runtime.
 *
 * The suite compares appearance under a declared condition rather than driving
 * real input on two runtimes and requiring their event pipelines to agree.
 * Everything here is data: the harness states the condition, both sides render
 * it, and only the pixels are compared.
 */
export type RenderCondition = {
  /** Forced on the web target, and on its ancestors where the CSS chains. */
  forced: readonly ForcedPseudo[];
  /** Written to `<html data-tr-focus-modality>`, or cleared when undefined. */
  modality: 'keyboard' | 'pointer' | undefined;
  /** Asked of the Flutter preview. */
  flutterState: FlutterForcedState | undefined;
  /**
   * Whether entering the state must repaint.
   *
   * `inert` is not an absence of a check: it asserts the render is *identical*
   * to rest, which is how a hover tint reappearing on a disabled control gets
   * caught.
   */
  paint: 'changes' | 'inert';
  /** Whether the forced element must paint a focus outline. */
  ring: 'absent' | 'present' | 'unchecked';
};

const rest: RenderCondition = {
  flutterState: undefined,
  forced: [],
  modality: undefined,
  paint: 'inert',
  ring: 'unchecked',
};

const hover: RenderCondition = {
  flutterState: 'hover',
  forced: ['hover'],
  modality: undefined,
  paint: 'changes',
  ring: 'absent',
};

const keyboardFocus: RenderCondition = {
  flutterState: 'focused',
  forced: ['focus', 'focus-visible'],
  modality: 'keyboard',
  paint: 'changes',
  ring: 'present',
};

export const renderConditions: Record<ParityState, RenderCondition> = {
  // Carried entirely by scenario args; nothing to force.
  default: rest,
  disabled: rest,
  invalid: rest,
  loading: rest,
  placeholder: rest,
  readonly: rest,
  value: rest,

  hover,
  'invalid-hover': hover,
  // Hover emphasis is gated behind `:not(:disabled)` on the web and behind the
  // enabled check in Flutter. The state is real; the paint is not.
  'disabled-hover': { ...hover, paint: 'inert' },
  'loading-hover': { ...hover, paint: 'inert' },

  pressed: {
    flutterState: 'pressed',
    forced: ['hover', 'active'],
    modality: undefined,
    paint: 'changes',
    ring: 'absent',
  },
  'focus-visible': keyboardFocus,
  'readonly-focus-visible': keyboardFocus,
  'invalid-focus-visible': keyboardFocus,
  'focus-visible-hover': {
    ...keyboardFocus,
    flutterState: 'focused-hover',
    forced: ['focus', 'focus-visible', 'hover'],
  },
  // Chromium keeps matching `:focus-visible` on a clicked text field, so there
  // the ring is suppressed by the modality attribute and that suppression is the
  // thing under test. Every other control reaches the same appearance by never
  // matching `:focus-visible` in the first place -- see `forcedPseudosFor`.
  // Either way the ring must be absent, which is what this asserts.
  'pointer-focused': {
    flutterState: 'pointer-focused',
    forced: ['focus', 'focus-visible'],
    modality: 'pointer',
    paint: 'inert',
    ring: 'absent',
  },
  'keyboard-pressed': {
    flutterState: 'keyboard-pressed',
    forced: ['focus', 'focus-visible', 'active'],
    modality: 'keyboard',
    paint: 'changes',
    ring: 'present',
  },
};

export function conditionFor(scenario: VisualParityScenario): RenderCondition {
  return renderConditions[scenario.state ?? 'default'];
}

/**
 * Components whose parity target is text-editable.
 *
 * `:focus-visible` matches a text-editable element however focus arrived, which
 * is why a clicked text field still needs its ring suppressed by the modality
 * attribute. Nothing else works that way: Chromium's heuristic simply does not
 * match a clicked button, so a control outside this set has no `:focus-visible`
 * to suppress.
 */
const textEditableComponents = new Set<ParityComponent>([
  'autocomplete',
  'combobox',
  'number-field',
  'otp-field',
  'text-field',
  'textarea',
]);

/**
 * The pseudo classes to force for this condition on this component.
 *
 * Forcing `:focus-visible` on a pointer-focused button would invent a state the
 * browser never produces, and then assert a ring is absent that nothing could
 * have painted -- a green that means nothing. Worse, it makes every control
 * whose ring rule is (correctly) ungated look like a defect.
 */
export function forcedPseudosFor(
  condition: RenderCondition,
  component: ParityComponent,
): readonly ForcedPseudo[] {
  if (condition.modality !== 'pointer' || textEditableComponents.has(component)) {
    return condition.forced;
  }
  return condition.forced.filter((pseudo) => pseudo !== 'focus-visible');
}

export function isRestCondition(condition: RenderCondition): boolean {
  return condition.forced.length === 0 && condition.flutterState === undefined;
}

/**
 * The element that owns the interaction state.
 *
 * A composite component forces on its interactive part, the way a real pointer
 * would land there. This replaces the pixel offsets the old harness carried for
 * `tabs` and `collapsible`, which had to be re-tuned whenever a control's
 * metrics moved.
 */
export function forceTargetSelector(component: ParityComponent): string {
  return (
    (
      {
        accordion: '.tr-accordion-trigger',
        checkbox: '.tr-checkbox',
        'checkbox-group': '.tr-checkbox',
        collapsible: '.tr-collapsible-summary',
        radio: '.tr-radio',
        'radio-group': '.tr-radio',
        switch: '.tr-switch',
        tabs: '.tr-tabs-tab',
        // The fixture builds its text field from TRInput inside a TRField, so
        // the interactive element is the input, not the field control.
        'text-field': '.tr-input',
        textarea: '.tr-textarea',
        'toggle-group': '.tr-toggle',
      } as Partial<Record<ParityComponent, string>>
    )[component] ?? '[data-parity-target] > *'
  );
}
