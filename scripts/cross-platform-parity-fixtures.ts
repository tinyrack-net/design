import {
  type CrossPlatformParityLevel,
  reactComponentParity,
} from './cross-platform-component-support.ts';

export type CrossPlatformParityState =
  | 'disabled'
  | 'focusVisible'
  | 'hovered'
  | 'loading'
  | 'open'
  | 'pressed'
  | 'readOnly'
  | 'resting'
  | 'selected';

export type CrossPlatformParityFixture = {
  component: string;
  flutterPreview: string;
  geometry?: {
    compare: readonly ('bounds' | 'parts' | 'style')[];
    tolerance: number;
  };
  level: Exclude<CrossPlatformParityLevel, 'adapted'>;
  sharedOptions: Readonly<Record<string, readonly unknown[]>>;
  states: readonly CrossPlatformParityState[];
  themes: readonly ('dark' | 'light')[];
};

const statusVariants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
const controlSizes = ['sm', 'md', 'lg'] as const;
const orientations = ['horizontal', 'vertical'] as const;

const fixtureOverrides: Partial<
  Record<string, Partial<Omit<CrossPlatformParityFixture, 'component' | 'level'>>>
> = {
  alert: { sharedOptions: { variant: statusVariants } },
  avatar: { sharedOptions: { shape: ['circle', 'square'], uiSize: controlSizes } },
  badge: { sharedOptions: { uiSize: controlSizes, variant: statusVariants } },
  button: {
    sharedOptions: {
      appearance: ['solid', 'outline', 'ghost'],
      intent: ['neutral', 'primary', 'info', 'success', 'warning', 'danger'],
      uiSize: controlSizes,
    },
    states: ['resting', 'hovered', 'pressed', 'focusVisible', 'disabled', 'loading'],
  },
  card: {
    sharedOptions: {
      padding: ['none', 'sm', 'md', 'lg'],
      variant: ['default', 'outlined', 'elevated'],
    },
  },
  checkbox: {
    sharedOptions: {
      checked: [false, true],
      indeterminate: [false, true],
      uiSize: controlSizes,
    },
    states: ['resting', 'hovered', 'focusVisible', 'selected', 'disabled', 'readOnly'],
  },
  'checkbox-group': {
    states: ['resting', 'selected', 'disabled', 'readOnly', 'focusVisible'],
  },
  'copy-button': {
    sharedOptions: { appearance: ['solid', 'outline', 'ghost'], uiSize: controlSizes },
    states: ['resting', 'focusVisible', 'disabled', 'loading'],
  },
  dialog: { sharedOptions: { placement: ['middle', 'top', 'bottom', 'start', 'end'] } },
  drawer: { sharedOptions: { swipeDirection: ['down', 'up', 'left', 'right'] } },
  'icon-button': {
    sharedOptions: {
      appearance: ['solid', 'outline', 'ghost'],
      variant: ['secondary', 'primary', 'danger'],
      uiSize: ['md', 'lg'],
    },
    states: ['resting', 'hovered', 'pressed', 'focusVisible', 'disabled', 'loading'],
  },
  input: {
    flutterPreview: 'text-field',
    sharedOptions: { uiSize: ['md', 'lg'] },
    states: ['resting', 'hovered', 'focusVisible', 'disabled', 'readOnly'],
  },
  link: {
    sharedOptions: {
      underline: ['always', 'hover', 'none'],
      variant: ['default', 'muted', 'danger'],
    },
    states: ['resting', 'hovered', 'focusVisible', 'disabled'],
  },
  'link-button': {
    flutterPreview: 'button',
    sharedOptions: {
      appearance: ['solid', 'outline', 'ghost'],
      intent: ['neutral', 'primary', 'info', 'success', 'warning', 'danger'],
      uiSize: controlSizes,
    },
    states: ['resting', 'hovered', 'pressed', 'focusVisible', 'disabled'],
  },
  meter: { sharedOptions: { variant: statusVariants } },
  'number-field': { sharedOptions: {} },
  'otp-field': {
    sharedOptions: {
      length: [3, 6, 8],
      uiSize: ['md', 'lg'],
    },
    states: ['resting', 'focusVisible', 'disabled', 'readOnly'],
  },
  progress: { sharedOptions: { uiSize: controlSizes, variant: statusVariants } },
  radio: {
    sharedOptions: { uiSize: controlSizes },
    states: ['resting', 'hovered', 'focusVisible', 'selected', 'disabled', 'readOnly'],
  },
  select: {
    sharedOptions: { uiSize: ['md', 'lg'] },
    states: ['resting', 'open', 'focusVisible', 'selected', 'disabled', 'readOnly'],
  },
  separator: { sharedOptions: { orientation: orientations } },
  skeleton: { sharedOptions: { shape: ['text', 'rectangle', 'circle'] } },
  slider: {
    sharedOptions: { orientation: orientations, uiSize: ['md', 'lg'] },
    states: ['resting', 'hovered', 'focusVisible', 'disabled'],
  },
  spinner: {
    sharedOptions: {
      uiSize: controlSizes,
      variant: ['current', 'muted', 'primary', 'danger'],
    },
  },
  switch: {
    states: ['resting', 'hovered', 'focusVisible', 'selected', 'disabled', 'readOnly'],
  },
  tabs: { sharedOptions: { uiSize: ['md', 'lg'] } },
  text: {
    sharedOptions: {
      align: ['start', 'center', 'end'],
      color: ['default', 'muted', 'primary', 'danger'],
      variant: [
        'caption',
        'label',
        'body',
        'bodySm',
        'code',
        'headingSm',
        'headingMd',
        'headingLg',
        'display',
      ],
    },
  },
  textarea: {
    sharedOptions: { uiSize: ['md', 'lg'] },
    states: ['resting', 'hovered', 'focusVisible', 'disabled', 'readOnly'],
  },
  toggle: {
    sharedOptions: {},
    states: ['resting', 'hovered', 'pressed', 'focusVisible', 'selected', 'disabled'],
  },
  'toggle-group': {
    sharedOptions: { orientation: orientations },
    states: ['resting', 'selected', 'focusVisible', 'disabled'],
  },
  toolbar: { sharedOptions: {} },
};

function createFixture(
  component: string,
  level: 'contract' | 'geometry',
): CrossPlatformParityFixture {
  const override = fixtureOverrides[component];
  return {
    component,
    flutterPreview: override?.flutterPreview ?? component,
    ...(level === 'geometry'
      ? { geometry: { compare: ['bounds', 'parts', 'style'] as const, tolerance: 0.5 } }
      : {}),
    level,
    sharedOptions: override?.sharedOptions ?? {},
    states: override?.states ?? ['resting'],
    themes: override?.themes ?? ['light', 'dark'],
  };
}

export const crossPlatformParityFixtures = Object.fromEntries(
  Object.entries(reactComponentParity)
    .filter(([, support]) => support.level !== 'adapted')
    .map(([component, support]) => [
      component,
      createFixture(component, support.level as 'contract' | 'geometry'),
    ]),
) as Record<string, CrossPlatformParityFixture>;

export type CrossPlatformParityFixtureName = keyof typeof crossPlatformParityFixtures;
