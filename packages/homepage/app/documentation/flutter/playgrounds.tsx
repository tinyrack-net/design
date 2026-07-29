import type { DemoMeta } from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { FlutterPreview } from './flutter-preview.js';
import type { FlutterPreviewComponent } from './preview-registry.generated.js';

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'];
const statusVariants = ['neutral', 'info', 'success', 'warning', 'danger'];
const sizes = ['sm', 'md', 'lg'];

function flutterPlayground(
  component: FlutterPreviewComponent,
  args: Record<string, unknown>,
  argTypes: DemoMeta['argTypes'],
  localizedArgs?: DemoMeta['localizedArgs'],
) {
  return definePlayground({
    args,
    argTypes,
    ...(localizedArgs === undefined ? {} : { localizedArgs }),
    render: (currentArgs) => (
      <FlutterPreview args={currentArgs} component={component} />
    ),
    title: `Flutter/${component}`,
  });
}

export const buttonPlayground = flutterPlayground(
  'button',
  {
    appearance: 'solid',
    children: 'Deploy',
    disabled: false,
    intent: 'primary',
    loading: false,
    uiSize: 'md',
  },
  {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    intent: { control: 'select', options: intents },
    loading: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
  {
    ja: { children: 'デプロイ' },
    ko: { children: '배포' },
  },
);

export const alertPlayground = flutterPlayground(
  'alert',
  { variant: 'info' },
  { variant: { control: 'select', options: statusVariants } },
);

export const badgePlayground = flutterPlayground(
  'badge',
  { uiSize: 'md', variant: 'success' },
  {
    uiSize: { control: 'select', options: sizes },
    variant: { control: 'select', options: statusVariants },
  },
);

export const iconButtonPlayground = flutterPlayground(
  'icon-button',
  {
    appearance: 'solid',
    disabled: false,
    intent: 'primary',
    loading: false,
    uiSize: 'md',
  },
  {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    disabled: { control: 'boolean' },
    intent: { control: 'select', options: intents },
    loading: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
);

export const spinnerPlayground = flutterPlayground(
  'spinner',
  { uiSize: 'md', variant: 'current' },
  {
    uiSize: { control: 'select', options: sizes },
    variant: {
      control: 'select',
      options: ['current', 'muted', 'primary', 'danger'],
    },
  },
);

export const textPlayground = flutterPlayground(
  'text',
  {
    align: 'start',
    color: 'default',
    truncate: false,
    variant: 'headingMd',
    weight: 'heading',
  },
  {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    color: {
      control: 'select',
      options: [
        'default',
        'muted',
        'placeholder',
        'inverse',
        'primary',
        'info',
        'success',
        'warning',
        'danger',
      ],
    },
    truncate: { control: 'boolean' },
    variant: {
      control: 'select',
      options: [
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
      ],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'heading', 'bold', 'strong'],
    },
  },
);

export const textFieldPlayground = flutterPlayground(
  'text-field',
  {
    disabled: false,
    errorText: '',
    placeholder: 'Rack alpha',
    readOnly: false,
    uiSize: 'md',
    value: '',
  },
  {
    disabled: { control: 'boolean' },
    errorText: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
    value: { control: 'text' },
  },
);

export const cardPlayground = flutterPlayground(
  'card',
  { padding: 'md', variant: 'default' },
  {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
  },
);

export const flutterPlaygrounds = {
  alert: alertPlayground,
  badge: badgePlayground,
  button: buttonPlayground,
  card: cardPlayground,
  'icon-button': iconButtonPlayground,
  spinner: spinnerPlayground,
  text: textPlayground,
  'text-field': textFieldPlayground,
} as const satisfies Record<FlutterPreviewComponent, DemoMeta>;
