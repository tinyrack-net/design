export const parityComponents = [
  'alert',
  'badge',
  'button',
  'card',
  'icon-button',
  'spinner',
  'text',
  'text-field',
] as const;
export type ParityComponent = (typeof parityComponents)[number];

export type VisualParityScenario = {
  args: Record<string, boolean | string>;
  component: ParityComponent;
  id: string;
  state?: ParityState;
};

export type MotionParityScenario = {
  args: Record<string, boolean | string>;
  component: 'button' | 'icon-button' | 'text-field';
  id: string;
  transition: 'hover-in' | 'hover-out' | 'press-in' | 'press-out';
};

export const parityStates = [
  'default',
  'hover',
  'pressed',
  'release-hover',
  'focus-visible',
  'focus-visible-hover',
  'keyboard-pressed',
  'disabled',
  'disabled-hover',
  'loading',
  'loading-hover',
] as const;
export const textFieldStates = [
  'default',
  'hover',
  'pressed',
  'pointer-focused',
  'focus-visible',
  'focus-visible-hover',
  'readonly',
  'readonly-focus-visible',
  'disabled',
  'invalid',
  'invalid-hover',
  'invalid-focus-visible',
  'value',
  'placeholder',
] as const;
export type ParityState =
  | (typeof parityStates)[number]
  | (typeof textFieldStates)[number];

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'];
const statusVariants = ['neutral', 'info', 'success', 'warning', 'danger'];
const appearances = ['solid', 'outline', 'ghost'];
const sizes = ['sm', 'md', 'lg'];

function product(
  component: ParityComponent,
  axes: Record<string, readonly string[]>,
): VisualParityScenario[] {
  return Object.entries(axes).reduce<VisualParityScenario[]>(
    (scenarios, [name, values]) =>
      scenarios.flatMap((scenario) =>
        values.map((value) => ({
          ...scenario,
          args: { ...scenario.args, [name]: value },
          id: `${scenario.id}-${name}-${value}`,
        })),
      ),
    [{ args: {}, component, id: component }],
  );
}

const textVariants = [
  'caption',
  'label',
  'body',
  'bodySm',
  'code',
  'headingSm',
  'headingMd',
  'headingLg',
  'display',
  'displayLg',
] as const;
const textColors = [
  'default',
  'muted',
  'placeholder',
  'inverse',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
] as const;
const textWeights = ['regular', 'medium', 'heading', 'bold', 'strong'] as const;
const textAlignments = ['start', 'center', 'end'] as const;

const textAxes = {
  align: textAlignments,
  color: textColors,
  truncate: [false, true],
  variant: textVariants,
  weight: textWeights,
} as const;

const textAxisEntries = Object.entries(textAxes) as [
  keyof typeof textAxes,
  readonly (boolean | string)[],
][];
const textScenarios: VisualParityScenario[] = [];
let textScenarioIndex = 0;
for (let left = 0; left < textAxisEntries.length; left += 1) {
  for (let right = left + 1; right < textAxisEntries.length; right += 1) {
    const leftAxis = textAxisEntries[left];
    const rightAxis = textAxisEntries[right];
    if (leftAxis === undefined || rightAxis === undefined) {
      throw new Error('Text parity axis index is out of bounds.');
    }
    const [leftName, leftValues] = leftAxis;
    const [rightName, rightValues] = rightAxis;
    for (const leftValue of leftValues) {
      for (const rightValue of rightValues) {
        const args = Object.fromEntries(
          textAxisEntries.map(([name, values], axisIndex) => [
            name,
            values[(textScenarioIndex + axisIndex) % values.length],
          ]),
        ) as Record<string, boolean | string>;
        args[leftName] = leftValue;
        args[rightName] = rightValue;
        textScenarios.push({
          args,
          component: 'text',
          id: `text-pair-${textScenarioIndex}`,
        });
        textScenarioIndex += 1;
      }
    }
  }
}

function withStates(scenarios: VisualParityScenario[]): VisualParityScenario[] {
  return scenarios.flatMap((scenario) =>
    parityStates.map((state) => ({
      ...scenario,
      args: {
        ...scenario.args,
        ...(state === 'disabled' || state === 'disabled-hover'
          ? { disabled: true }
          : {}),
        ...(state === 'loading' || state === 'loading-hover'
          ? { loading: true, loadingLabel: 'Loading' }
          : {}),
      },
      id: `${scenario.id}-state-${state}`,
      state,
    })),
  );
}

const alertScenarios = product('alert', {
  variant: statusVariants,
}).flatMap((scenario) =>
  [false, true].flatMap((showIcon) =>
    [false, true].flatMap((showDescription) =>
      [false, true].map((showActions) => ({
        ...scenario,
        args: {
          ...scenario.args,
          showActions,
          showDescription,
          showIcon,
        },
        id: `${scenario.id}-icon-${showIcon}-description-${showDescription}-actions-${showActions}`,
      })),
    ),
  ),
);

export const visualParityScenarios: VisualParityScenario[] = [
  ...alertScenarios,
  ...product('badge', { uiSize: sizes, variant: statusVariants }),
  ...withStates(
    product('button', {
      appearance: appearances,
      intent: intents,
      uiSize: sizes,
    }),
  ),
  ...withStates(
    product('icon-button', {
      appearance: appearances,
      intent: intents,
      uiSize: sizes,
    }),
  ),
  ...product('card', {
    padding: ['none', 'sm', 'md', 'lg'],
    variant: ['default', 'outlined', 'elevated'],
  }),
  ...product('spinner', {
    uiSize: sizes,
    variant: ['current', 'muted', 'primary', 'danger'],
  }),
  ...textScenarios,
  ...sizes.flatMap((uiSize) =>
    [
      { args: {}, state: 'default' },
      { args: {}, state: 'hover' },
      { args: {}, state: 'pressed' },
      { args: {}, state: 'pointer-focused' },
      { args: {}, state: 'focus-visible' },
      { args: {}, state: 'focus-visible-hover' },
      { args: { readOnly: true, value: 'Rack alpha' }, state: 'readonly' },
      {
        args: { readOnly: true, value: 'Rack alpha' },
        state: 'readonly-focus-visible',
      },
      { args: { disabled: true }, state: 'disabled' },
      { args: { errorText: 'Required' }, state: 'invalid' },
      { args: { errorText: 'Required' }, state: 'invalid-hover' },
      { args: { errorText: 'Required' }, state: 'invalid-focus-visible' },
      { args: { value: 'Rack beta' }, state: 'value' },
      { args: { placeholder: 'Rack alpha' }, state: 'placeholder' },
    ].map(({ args, state }) => ({
      args: { ...args, uiSize },
      component: 'text-field' as const,
      id: `text-field-${uiSize}-state-${state}`,
      state: state as ParityState,
    })),
  ),
];

export const parityLocales = ['en', 'ko', 'ja'] as const;
export const parityThemes = ['light', 'dark'] as const;

export const representativeParityScenarios = parityComponents.map((component) => {
  const scenario = visualParityScenarios.find(
    (candidate) => candidate.component === component,
  );
  if (scenario === undefined) {
    throw new Error(`Missing representative parity scenario for ${component}.`);
  }
  return scenario;
});

export const parityContract = {
  alert: { variant: statusVariants },
  badge: { uiSize: sizes, variant: statusVariants },
  button: { appearance: appearances, intent: intents, uiSize: sizes },
  card: {
    padding: ['none', 'sm', 'md', 'lg'],
    variant: ['default', 'outlined', 'elevated'],
  },
  'icon-button': { appearance: appearances, intent: intents, uiSize: sizes },
  spinner: {
    uiSize: sizes,
    variant: ['current', 'muted', 'primary', 'danger'],
  },
  text: {
    align: textAlignments,
    color: textColors,
    truncate: [false, true],
    variant: textVariants,
    weight: textWeights,
  },
  'text-field': { uiSize: sizes },
} as const;

const buttonMotionScenarios = (['button', 'icon-button'] as const).flatMap(
  (component) => {
    const fullMd = product(component, {
      appearance: appearances,
      intent: intents,
      uiSize: ['md'],
    });
    const sizeRepresentatives = appearances.flatMap((appearance, index) =>
      ['sm', 'lg'].map((uiSize, sizeIndex) => ({
        args: {
          appearance,
          intent: intents[(index * 2 + sizeIndex) % intents.length] ?? 'primary',
          uiSize,
        },
        component,
        id: `${component}-motion-appearance-${appearance}-uiSize-${uiSize}`,
      })),
    );
    return [...fullMd, ...sizeRepresentatives].flatMap((scenario) =>
      (['hover-in', 'hover-out', 'press-in', 'press-out'] as const).map(
        (transition) => ({
          ...scenario,
          component,
          id: `${scenario.id}-transition-${transition}`,
          transition,
        }),
      ),
    );
  },
);

export const motionParityScenarios: MotionParityScenario[] = [
  ...buttonMotionScenarios,
  ...sizes.flatMap((uiSize) =>
    (['hover-in', 'hover-out'] as const).map((transition) => ({
      args: { uiSize },
      component: 'text-field' as const,
      id: `text-field-motion-uiSize-${uiSize}-transition-${transition}`,
      transition,
    })),
  ),
];

export const defaultMotionParityScenarios = motionParityScenarios.filter((scenario) => {
  if (scenario.component === 'text-field') return true;
  if (scenario.args['uiSize'] !== 'md') return true;
  if (scenario.transition === 'hover-in' || scenario.transition === 'press-in') {
    return true;
  }
  return scenario.args['intent'] === 'primary';
});

export const motionSampleTimes = [0, 30, 60, 90, 120, 140] as const;
