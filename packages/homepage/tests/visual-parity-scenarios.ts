export const parityComponents = [
  'alert',
  'avatar',
  'badge',
  'breadcrumbs',
  'button',
  'card',
  'checkbox',
  'code',
  'code-block',
  'field',
  'fieldset',
  'icon-button',
  'link',
  'meter',
  'progress',
  'radio',
  'separator',
  'skeleton',
  'spinner',
  'steps',
  'switch',
  'tabs',
  'text',
  'text-field',
  'textarea',
  'toggle',
  'toggle-group',
  'checkbox-group',
  'radio-group',
  'collapsible',
  'accordion',
  'animated-number',
  'copy-button',
  'menu',
  'select',
  'dialog',
  'alert-dialog',
  'app-shell',
  'autocomplete',
  'combobox',
  'context-menu',
  'drawer',
  'file-tree',
  'form',
  'menubar',
  'navigation-menu',
  'number-field',
  'otp-field',
  'pagination',
  'popover',
  'preview-card',
  'scroll-area',
  'slider',
  'toast',
  'toolbar',
  'tooltip',
  'tree-nav',
  'table',
  'window-frame',
] as const;
export type ParityComponent = (typeof parityComponents)[number];

export type VisualParityScenario = {
  args: Record<string, boolean | number | string>;
  component: ParityComponent;
  id: string;
  state?: ParityState;
};

export type MotionParityScenario = {
  args: Record<string, boolean | number | string>;
  component:
    | 'app-shell'
    | 'button'
    | 'animated-number'
    | 'alert-dialog'
    | 'accordion'
    | 'checkbox'
    | 'collapsible'
    | 'dialog'
    | 'drawer'
    | 'icon-button'
    | 'link'
    | 'meter'
    | 'menu'
    | 'pagination'
    | 'popover'
    | 'preview-card'
    | 'navigation-menu'
    | 'progress'
    | 'radio'
    | 'skeleton'
    | 'scroll-area'
    | 'spinner'
    | 'switch'
    | 'table'
    | 'tabs'
    | 'text-field'
    | 'toggle'
    | 'toast'
    | 'tree-nav';
  id: string;
  nextArgs?: Record<string, boolean | number | string>;
  sampleTimes?: readonly number[];
  transition:
    | 'hover-in'
    | 'hover-out'
    | 'press-in'
    | 'press-out'
    | 'close'
    | 'continuous'
    | 'open'
    | 'state-off'
    | 'state-on'
    | 'value-decrease'
    | 'value-increase';
};

const appShellScenarios: VisualParityScenario[] = [
  ...(['header-first', 'sidebar-first'] as const).flatMap((layout) =>
    (['expanded', 'rail'] as const).map((sidebarMode) => ({
      args: {
        breakpoint: 'sm',
        layout,
        mobileSidebar: 'drawer',
        open: false,
        sidebarMode,
      },
      component: 'app-shell' as const,
      id: `app-shell-desktop-${layout}-${sidebarMode}`,
    })),
  ),
  {
    args: {
      breakpoint: 'lg',
      layout: 'header-first',
      mobileSidebar: 'drawer',
      open: false,
      sidebarMode: 'expanded',
    },
    component: 'app-shell',
    id: 'app-shell-mobile-drawer-closed',
  },
  {
    args: {
      breakpoint: 'lg',
      layout: 'header-first',
      mobileSidebar: 'drawer',
      open: true,
      sidebarMode: 'expanded',
    },
    component: 'app-shell',
    id: 'app-shell-mobile-drawer-open',
  },
  {
    args: {
      breakpoint: 'lg',
      layout: 'sidebar-first',
      mobileSidebar: 'rail',
      open: false,
      sidebarMode: 'rail',
    },
    component: 'app-shell',
    id: 'app-shell-mobile-rail',
  },
];

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
const sizes = ['md', 'lg'];
export const motionSampleTimes = [0, 30, 60, 90, 120, 140] as const;
export const normalMotionSampleTimes = [0, 40, 80, 120, 160, 180] as const;
export const slowMotionSampleTimes = [0, 60, 120, 180, 240, 260] as const;
export const loadingMotionSampleTimes = [0, 300, 600, 900, 1200, 1220] as const;
export const numberMotionSampleTimes = [0, 120, 240, 360, 600, 620] as const;

function product(
  component: ParityComponent,
  axes: Record<string, readonly (boolean | string)[]>,
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

function withStates(
  scenarios: VisualParityScenario[],
  states: readonly ParityState[] = parityStates,
): VisualParityScenario[] {
  return scenarios.flatMap((scenario) =>
    states.map((state) => ({
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

// Every button-grade interaction state except the loading pair, which only
// exists on components with a loading prop.
const controlStates = parityStates.filter(
  (state) => state !== 'loading' && state !== 'loading-hover',
);

// Components without a disabled prop drop the disabled pair too.
const enabledControlStates = controlStates.filter(
  (state) => state !== 'disabled' && state !== 'disabled-hover',
);

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
  ...product('avatar', { shape: ['circle', 'square'], uiSize: sizes }),
  ...product('badge', { uiSize: sizes, variant: statusVariants }),
  ...product('breadcrumbs', {}),
  ...withStates(
    product('checkbox', {
      mark: ['unchecked', 'checked', 'indeterminate'],
      uiSize: sizes,
    }),
    controlStates,
  ),
  ...withStates(
    product('link', {
      underline: ['always', 'hover', 'none'],
      variant: ['default', 'muted', 'danger'],
    }),
    controlStates,
  ),
  ...withStates(
    product('radio', { uiSize: sizes }).flatMap((scenario) =>
      [false, true].map((checked) => ({
        ...scenario,
        args: { ...scenario.args, checked },
        id: `${scenario.id}-checked-${checked}`,
      })),
    ),
    controlStates,
  ),
  ...withStates(
    product('switch', {}).flatMap((scenario) =>
      [false, true].map((checked) => ({
        ...scenario,
        args: { ...scenario.args, checked },
        id: `${scenario.id}-checked-${checked}`,
      })),
    ),
    controlStates,
  ),
  ...withStates(
    product('toggle', {}).flatMap((scenario) =>
      [false, true].map((pressed) => ({
        ...scenario,
        args: { ...scenario.args, pressed },
        id: `${scenario.id}-pressed-${pressed}`,
      })),
    ),
    controlStates,
  ),
  ...product('code', {}),
  ...product('field', { helper: ['none', 'description'] }),
  ...product('fieldset', {}).flatMap((scenario) =>
    [false, true].map((disabled) => ({
      ...scenario,
      args: { ...scenario.args, disabled },
      id: `${scenario.id}-disabled-${disabled}`,
    })),
  ),
  ...product('meter', { variant: statusVariants }),
  ...product('progress', { uiSize: sizes, variant: statusVariants }),
  ...product('steps', {}),
  ...withStates(product('tabs', { uiSize: sizes }), enabledControlStates),
  ...withStates(product('toggle-group', {}), controlStates),
  ...withStates(product('accordion', {}), enabledControlStates),
  ...product('animated-number', {}),
  ...withStates(product('copy-button', {}), enabledControlStates),
  ...product('menu', {}).flatMap((scenario) =>
    [false, true].map((open) => ({
      ...scenario,
      args: { ...scenario.args, open },
      id: `${scenario.id}-open-${open}`,
    })),
  ),
  ...product('select', { uiSize: sizes }).flatMap((scenario) =>
    [false, true].map((open) => ({
      ...scenario,
      args: { ...scenario.args, open },
      id: `${scenario.id}-open-${open}`,
    })),
  ),
  ...product('dialog', {
    placement: ['middle', 'top', 'bottom', 'start', 'end'],
  }).flatMap((scenario) =>
    [false, true].map((open) => ({
      ...scenario,
      args: { ...scenario.args, open },
      id: `${scenario.id}-open-${open}`,
    })),
  ),
  ...appShellScenarios,
  ...(
    [
      'alert-dialog',
      'autocomplete',
      'combobox',
      'context-menu',
      'navigation-menu',
      'popover',
      'preview-card',
      'toast',
      'tooltip',
    ] as const
  ).flatMap((component) =>
    [false, true].map((open) => ({
      args: { open },
      component,
      id: `${component}-open-${open}`,
    })),
  ),
  ...product('drawer', {
    swipeDirection: ['down', 'up', 'left', 'right'],
  }).flatMap((scenario) =>
    [false, true].map((open) => ({
      ...scenario,
      args: { ...scenario.args, open },
      id: `${scenario.id}-open-${open}`,
    })),
  ),
  ...product('slider', {
    orientation: ['horizontal', 'vertical'],
    uiSize: sizes,
  }),
  ...(['file-tree', 'form', 'number-field', 'otp-field', 'toolbar'] as const).map(
    (component) => ({ args: {}, component, id: component }),
  ),
  ...[false, true].map((open) => ({
    args: { open },
    component: 'menubar' as const,
    id: `menubar-open-${open}`,
  })),
  ...product('tree-nav', {
    collapsed: [false, true],
    selected: [false, true],
  }),
  ...product('scroll-area', { autoHide: [false, true] }),
  ...withStates(
    product('collapsible', {}).map((scenario) => ({
      ...scenario,
      args: { ...scenario.args, open: false },
      id: `${scenario.id}-open-false`,
    })),
    controlStates,
  ),
  ...product('collapsible', {}).map((scenario) => ({
    ...scenario,
    args: { ...scenario.args, open: true },
    id: `${scenario.id}-open-true`,
  })),
  ...withStates(product('checkbox-group', {}), controlStates),
  ...withStates(product('radio-group', {}), controlStates),
  ...sizes.flatMap((uiSize) =>
    [
      { args: {}, state: 'default' },
      { args: {}, state: 'hover' },
      { args: {}, state: 'pointer-focused' },
      { args: {}, state: 'focus-visible' },
      {
        args: { readOnly: true, value: 'Rack alpha' },
        state: 'readonly',
      },
      { args: { disabled: true }, state: 'disabled' },
      { args: { value: 'Rack beta' }, state: 'value' },
      { args: { placeholder: 'Rack alpha' }, state: 'placeholder' },
    ].map(({ args, state }) => ({
      args: { ...args, uiSize },
      component: 'textarea' as const,
      id: `textarea-${uiSize}-state-${state}`,
      state: state as ParityState,
    })),
  ),
  ...product('code-block', {}),
  ...product('pagination', {
    boundaryCount: ['0', '1'],
    siblingCount: ['0', '1'],
  }).map((scenario) => ({
    ...scenario,
    args: { ...scenario.args, currentPage: '3', totalPages: '12' },
  })),
  ...product('table', {
    density: ['compact', 'comfortable', 'spacious'],
    striped: [false, true],
  }),
  ...product('window-frame', {
    padding: ['none', 'sm', 'md', 'lg'],
    variant: ['macos', 'browser'],
  }),
  ...product('separator', { orientation: ['horizontal', 'vertical'] }),
  ...product('skeleton', {
    shape: ['text', 'rectangle', 'circle'],
  }).map((scenario) => ({
    ...scenario,
    args: { ...scenario.args, animate: false },
    id: `${scenario.id}-animate-false`,
  })),
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
  avatar: { shape: ['circle', 'square'], uiSize: sizes },
  badge: { uiSize: sizes, variant: statusVariants },
  breadcrumbs: {},
  checkbox: {
    mark: ['unchecked', 'checked', 'indeterminate'],
    uiSize: sizes,
  },
  code: {},
  'code-block': {},
  pagination: {
    boundaryCount: ['0', '1'],
    siblingCount: ['0', '1'],
  },
  field: { helper: ['none', 'description'] },
  link: {
    underline: ['always', 'hover', 'none'],
    variant: ['default', 'muted', 'danger'],
  },
  radio: { checked: [false, true], uiSize: sizes },
  switch: { checked: [false, true] },
  tabs: { uiSize: sizes },
  textarea: { uiSize: sizes },
  toggle: { pressed: [false, true] },
  'toggle-group': {},
  'checkbox-group': {},
  'radio-group': {},
  collapsible: { open: [false, true] },
  accordion: {},
  'animated-number': {},
  'copy-button': {},
  menu: { open: [false, true] },
  select: { open: [false, true], uiSize: sizes },
  dialog: {
    open: [false, true],
    placement: ['middle', 'top', 'bottom', 'start', 'end'],
  },
  'alert-dialog': { open: [false, true] },
  'app-shell': {
    breakpoint: ['sm', 'lg'],
    layout: ['header-first', 'sidebar-first'],
    mobileSidebar: ['drawer', 'rail'],
    open: [false, true],
    sidebarMode: ['expanded', 'rail'],
  },
  autocomplete: { open: [false, true] },
  combobox: { open: [false, true] },
  'context-menu': { open: [false, true] },
  drawer: {
    open: [false, true],
    swipeDirection: ['down', 'up', 'left', 'right'],
  },
  'file-tree': {},
  form: {},
  menubar: { open: [false, true] },
  'navigation-menu': { open: [false, true] },
  'number-field': {},
  'otp-field': {},
  popover: { open: [false, true] },
  'preview-card': { open: [false, true] },
  'scroll-area': { autoHide: [false, true] },
  slider: { orientation: ['horizontal', 'vertical'], uiSize: sizes },
  toast: { open: [false, true] },
  toolbar: {},
  tooltip: { open: [false, true] },
  'tree-nav': {},
  table: {
    density: ['compact', 'comfortable', 'spacious'],
    striped: [false, true],
  },
  'window-frame': {
    padding: ['none', 'sm', 'md', 'lg'],
    variant: ['macos', 'browser'],
  },
  fieldset: { disabled: [false, true] },
  meter: { variant: statusVariants },
  progress: { uiSize: sizes, variant: statusVariants },
  separator: { orientation: ['horizontal', 'vertical'] },
  skeleton: { animate: [false], shape: ['text', 'rectangle', 'circle'] },
  steps: {},
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
  ...(['radio', 'switch'] as const).flatMap((component) =>
    (['state-on', 'state-off'] as const).map((transition) => ({
      args: { checked: transition === 'state-off' },
      component,
      id: `${component}-motion-transition-${transition}`,
      nextArgs: { checked: transition === 'state-on' },
      ...(component === 'switch' ? { sampleTimes: normalMotionSampleTimes } : {}),
      transition,
    })),
  ),
  ...(['state-on', 'state-off'] as const).map((transition) => ({
    args: { mark: transition === 'state-off' ? 'checked' : 'unchecked' },
    component: 'checkbox' as const,
    id: `checkbox-motion-transition-${transition}`,
    nextArgs: { mark: transition === 'state-on' ? 'checked' : 'unchecked' },
    transition,
  })),
  ...(['default', 'muted', 'danger'] as const).flatMap((variant) =>
    (['hover-in', 'hover-out'] as const).map((transition) => ({
      args: { underline: 'hover', variant },
      component: 'link' as const,
      id: `link-motion-variant-${variant}-transition-${transition}`,
      transition,
    })),
  ),
  ...sizes.flatMap((uiSize) =>
    (['hover-in', 'hover-out'] as const).map((transition) => ({
      args: { uiSize },
      component: 'text-field' as const,
      id: `text-field-motion-uiSize-${uiSize}-transition-${transition}`,
      transition,
    })),
  ),
  ...(['hover-in', 'hover-out'] as const).map((transition) => ({
    args: { pressed: false },
    component: 'toggle' as const,
    id: `toggle-motion-transition-${transition}`,
    transition,
  })),
  ...(['hover-in', 'hover-out'] as const).map((transition) => ({
    args: { uiSize: 'md' },
    component: 'tabs' as const,
    id: `tabs-motion-transition-${transition}`,
    transition,
  })),
  {
    args: {
      boundaryCount: '1',
      currentPage: '3',
      siblingCount: '1',
      totalPages: '12',
    },
    component: 'pagination',
    id: 'pagination-motion-transition-hover-out',
    transition: 'hover-out',
  },
  ...(['hover-in', 'hover-out'] as const).map((transition) => ({
    args: { density: 'comfortable', striped: false },
    component: 'table' as const,
    id: `table-motion-transition-${transition}`,
    transition,
  })),
  ...(['hover-in', 'hover-out'] as const).map((transition) => ({
    args: { collapsed: false, selected: true },
    component: 'tree-nav' as const,
    id: `tree-nav-motion-transition-${transition}`,
    transition,
  })),
  ...(['hover-in', 'hover-out'] as const).map((transition) => ({
    args: { autoHide: true },
    component: 'scroll-area' as const,
    id: `scroll-area-motion-transition-${transition}`,
    transition,
  })),
  ...(['state-on', 'state-off'] as const).map((transition) => ({
    args: { pressed: transition === 'state-off' },
    component: 'toggle' as const,
    id: `toggle-motion-transition-${transition}`,
    nextArgs: { pressed: transition === 'state-on' },
    transition,
  })),
  ...(['meter', 'progress'] as const).flatMap((component) =>
    (['value-increase', 'value-decrease'] as const).map((transition) => ({
      args: { value: transition === 'value-increase' ? 25 : 75 },
      component,
      id: `${component}-motion-transition-${transition}`,
      nextArgs: { value: transition === 'value-increase' ? 75 : 25 },
      sampleTimes: normalMotionSampleTimes,
      transition,
    })),
  ),
  // The parity viewport is 480px wide, where the shell only keeps a sidebar in
  // the page as an inline rail; the drawer posture unmounts it entirely. One
  // direction is enough: the reverse shares the same tween, and running both
  // back to back leaves the second one with no style change to transition.
  {
    args: {
      breakpoint: 'sm',
      layout: 'sidebar-first',
      mobileSidebar: 'rail',
      open: false,
      sidebarCollapsed: false,
      sidebarMode: 'rail',
    },
    component: 'app-shell' as const,
    id: 'app-shell-motion-transition-close',
    nextArgs: { sidebarCollapsed: true },
    sampleTimes: normalMotionSampleTimes,
    transition: 'close',
  },
  ...(['open', 'close'] as const).map((transition) => ({
    args: { open: transition === 'close' },
    component: 'collapsible' as const,
    id: `collapsible-motion-transition-${transition}`,
    nextArgs: { open: transition === 'open' },
    sampleTimes: normalMotionSampleTimes,
    transition,
  })),
  ...(['value-increase', 'value-decrease'] as const).map((transition) => ({
    args: {
      animation: 'roll',
      duration: 600,
      value: transition === 'value-increase' ? 12345 : 67890,
    },
    component: 'animated-number' as const,
    id: `animated-number-motion-transition-${transition}`,
    nextArgs: { value: transition === 'value-increase' ? 67890 : 12345 },
    sampleTimes: numberMotionSampleTimes,
    transition,
  })),
  ...(['value-increase', 'value-decrease'] as const).map((transition) => ({
    args: {
      animation: 'count',
      duration: 600,
      value: transition === 'value-increase' ? 12345 : 67890,
    },
    component: 'animated-number' as const,
    id: `animated-number-motion-animation-count-transition-${transition}`,
    nextArgs: { value: transition === 'value-increase' ? 67890 : 12345 },
    sampleTimes: numberMotionSampleTimes,
    transition,
  })),
  ...sizes.flatMap((uiSize) =>
    (['current', 'muted', 'primary', 'danger'] as const).map((variant) => ({
      args: { uiSize, variant },
      component: 'spinner' as const,
      id: `spinner-motion-uiSize-${uiSize}-variant-${variant}`,
      sampleTimes: loadingMotionSampleTimes,
      transition: 'continuous' as const,
    })),
  ),
  ...(['text', 'rectangle', 'circle'] as const).map((shape) => ({
    args: { animate: true, shape },
    component: 'skeleton' as const,
    id: `skeleton-motion-shape-${shape}`,
    sampleTimes: loadingMotionSampleTimes,
    transition: 'continuous' as const,
  })),
  ...sizes.flatMap((uiSize) =>
    statusVariants.map((variant) => ({
      args: { uiSize, value: 'indeterminate', variant },
      component: 'progress' as const,
      id: `progress-motion-indeterminate-uiSize-${uiSize}-variant-${variant}`,
      sampleTimes: loadingMotionSampleTimes,
      transition: 'continuous' as const,
    })),
  ),
  {
    args: { open: false },
    component: 'popover',
    id: 'popover-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: normalMotionSampleTimes,
    transition: 'open',
  },
  {
    args: { open: false },
    component: 'preview-card',
    id: 'preview-card-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: slowMotionSampleTimes,
    transition: 'open',
  },
  {
    args: { open: false },
    component: 'navigation-menu',
    id: 'navigation-menu-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: normalMotionSampleTimes,
    transition: 'open',
  },
  {
    args: { open: false },
    component: 'alert-dialog',
    id: 'alert-dialog-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: slowMotionSampleTimes,
    transition: 'open',
  },
  {
    args: { open: false },
    component: 'dialog',
    id: 'dialog-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: slowMotionSampleTimes,
    transition: 'open',
  },
  {
    args: { open: false },
    component: 'accordion',
    id: 'accordion-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: normalMotionSampleTimes,
    transition: 'open',
  },
  {
    args: { open: false },
    component: 'toast',
    id: 'toast-motion-transition-open',
    nextArgs: { open: true },
    transition: 'open',
  },
  ...(['down', 'up', 'left', 'right'] as const).map((swipeDirection) => ({
    args: { open: false, swipeDirection },
    component: 'drawer' as const,
    id: `drawer-motion-swipeDirection-${swipeDirection}-transition-open`,
    nextArgs: { open: true },
    sampleTimes: slowMotionSampleTimes,
    transition: 'open' as const,
  })),
  {
    args: { open: false },
    component: 'menu',
    id: 'menu-motion-transition-open',
    nextArgs: { open: true },
    sampleTimes: normalMotionSampleTimes,
    transition: 'open',
  },
];

export const defaultMotionParityScenarios = motionParityScenarios.filter((scenario) => {
  // The shell is the one motion source held out of the default sweep. Its
  // transition moves the whole page layout rather than one control, and the
  // pooled parity pages reuse a single shell across both themes, which drifts
  // the sampled frames by a few pixels when the second theme reuses the first
  // one's warm page. Run it explicitly with TINYRACK_VISUAL_PARITY_SCENARIO
  // when the collapse itself changes; the animation contract is otherwise held
  // by app_shell_test.dart and app-shell.browser.test.tsx.
  if (scenario.component === 'app-shell') return false;
  if (
    scenario.component === 'animated-number' ||
    scenario.component === 'alert-dialog' ||
    scenario.component === 'accordion' ||
    scenario.component === 'dialog' ||
    scenario.component === 'drawer' ||
    scenario.component === 'link' ||
    scenario.component === 'meter' ||
    scenario.component === 'menu' ||
    scenario.component === 'pagination' ||
    scenario.component === 'progress' ||
    scenario.component === 'popover' ||
    scenario.component === 'preview-card' ||
    scenario.component === 'navigation-menu' ||
    scenario.component === 'checkbox' ||
    scenario.component === 'collapsible' ||
    scenario.component === 'radio' ||
    scenario.component === 'scroll-area' ||
    scenario.component === 'skeleton' ||
    scenario.component === 'spinner' ||
    scenario.component === 'switch' ||
    scenario.component === 'table' ||
    scenario.component === 'tabs' ||
    scenario.component === 'text-field' ||
    scenario.component === 'toggle' ||
    scenario.component === 'toast' ||
    scenario.component === 'tree-nav'
  ) {
    return true;
  }
  if (scenario.args['uiSize'] !== 'md') return true;
  if (scenario.transition === 'hover-in' || scenario.transition === 'press-in') {
    return true;
  }
  return scenario.args['intent'] === 'primary';
});

// Every public React stylesheet that declares transition/animation motion must
// resolve to a fixed-frame Flutter comparison. Field/Input/Textarea share the
// Flutter TRTextField rendering contract, so those source names intentionally
// point at the same scenario component.
export const motionSourceCoverage = {
  accordion: 'accordion',
  'app-shell': 'app-shell',
  'alert-dialog': 'alert-dialog',
  'animated-number': 'animated-number',
  button: 'button',
  checkbox: 'checkbox',
  collapsible: 'collapsible',
  dialog: 'dialog',
  drawer: 'drawer',
  field: 'text-field',
  input: 'text-field',
  link: 'link',
  menu: 'menu',
  meter: 'meter',
  'navigation-menu': 'navigation-menu',
  pagination: 'pagination',
  popover: 'popover',
  'preview-card': 'preview-card',
  progress: 'progress',
  radio: 'radio',
  'scroll-area': 'scroll-area',
  skeleton: 'skeleton',
  spinner: 'spinner',
  switch: 'switch',
  table: 'table',
  tabs: 'tabs',
  textarea: 'text-field',
  toast: 'toast',
  toggle: 'toggle',
  'tree-nav': 'tree-nav',
} as const satisfies Record<string, MotionParityScenario['component']>;
