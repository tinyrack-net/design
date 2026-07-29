import type { DemoMeta } from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { FlutterPreview } from './flutter-preview.js';
import type { FlutterPreviewComponent } from './preview-registry.generated.js';

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'];
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
  { intent: 'info' },
  { intent: { control: 'select', options: intents } },
);

export const badgePlayground = flutterPlayground(
  'badge',
  { intent: 'success', uiSize: 'md' },
  {
    intent: { control: 'select', options: intents },
    uiSize: { control: 'select', options: sizes },
  },
);

export const iconButtonPlayground = flutterPlayground(
  'icon-button',
  { intent: 'primary', uiSize: 'md' },
  {
    intent: { control: 'select', options: intents },
    uiSize: { control: 'select', options: sizes },
  },
);

export const spinnerPlayground = flutterPlayground(
  'spinner',
  { uiSize: 'md' },
  { uiSize: { control: 'select', options: sizes } },
);

export const textPlayground = flutterPlayground(
  'text',
  { role: 'headingMd' },
  {
    role: {
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
  },
);

export const textFieldPlayground = flutterPlayground(
  'text-field',
  { disabled: false, uiSize: 'md', value: '' },
  {
    disabled: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
    value: { control: 'text' },
  },
);

export const cardPlayground = flutterPlayground('card', {}, {});

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
