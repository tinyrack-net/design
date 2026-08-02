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
    parameters: { playgroundLayout: 'fill-block' },
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

export const dialogPlayground = flutterPlayground(
  'dialog',
  { open: false, placement: 'middle' },
  {
    open: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['middle', 'top', 'bottom', 'start', 'end'],
    },
  },
);

export const alertDialogPlayground = flutterPlayground('alert-dialog', {}, {});
export const appShellPlayground = flutterPlayground('app-shell', {}, {});
export const autocompletePlayground = flutterPlayground('autocomplete', {}, {});
export const comboboxPlayground = flutterPlayground('combobox', {}, {});
export const contextMenuPlayground = flutterPlayground('context-menu', {}, {});
export const drawerPlayground = flutterPlayground('drawer', {}, {});
export const fileTreePlayground = flutterPlayground('file-tree', {}, {});
export const formPlayground = flutterPlayground('form', {}, {});
export const menubarPlayground = flutterPlayground('menubar', {}, {});
export const navigationMenuPlayground = flutterPlayground('navigation-menu', {}, {});
export const numberFieldPlayground = flutterPlayground('number-field', {}, {});
export const otpFieldPlayground = flutterPlayground('otp-field', {}, {});
export const popoverPlayground = flutterPlayground('popover', {}, {});
export const previewCardPlayground = flutterPlayground('preview-card', {}, {});
export const scrollAreaPlayground = flutterPlayground('scroll-area', {}, {});
export const sliderPlayground = flutterPlayground('slider', {}, {});
export const toastPlayground = flutterPlayground('toast', {}, {});
export const toolbarPlayground = flutterPlayground('toolbar', {}, {});
export const tooltipPlayground = flutterPlayground('tooltip', {}, {});
export const treeNavPlayground = flutterPlayground('tree-nav', {}, {});

export const menuPlayground = flutterPlayground(
  'menu',
  { disabled: false, open: false },
  {
    disabled: { control: 'boolean' },
    open: { control: 'boolean' },
  },
);

export const selectPlayground = flutterPlayground(
  'select',
  {
    disabled: false,
    errorText: '',
    open: false,
    readOnly: false,
    uiSize: 'md',
    value: 'stable',
  },
  {
    disabled: { control: 'boolean' },
    errorText: { control: 'text' },
    open: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
    value: { control: 'select', options: ['', 'stable', 'beta'] },
  },
);

export const accordionPlayground = flutterPlayground(
  'accordion',
  { multiple: false },
  { multiple: { control: 'boolean' } },
);

export const animatedNumberPlayground = flutterPlayground(
  'animated-number',
  {
    animation: 'roll',
    duration: 600,
    formatPreset: 'decimal',
    locale: 'en-US',
    rollDirection: 'auto',
    value: 1248,
  },
  {
    animation: { control: 'select', options: ['roll', 'count'] },
    duration: { control: { type: 'range', min: 0, max: 1500, step: 50 } },
    formatPreset: {
      control: 'select',
      options: ['decimal', 'currency', 'percent', 'unit'],
    },
    locale: { control: 'select', options: ['en-US', 'ko-KR', 'ja-JP'] },
    rollDirection: { control: 'select', options: ['auto', 'up', 'down'] },
    value: { control: { type: 'range', min: -10_000, max: 10_000, step: 1 } },
  },
  {
    ja: { locale: 'ja-JP' },
    ko: { locale: 'ko-KR' },
  },
);

export const avatarPlayground = flutterPlayground(
  'avatar',
  { shape: 'circle', uiSize: 'md' },
  {
    shape: { control: 'select', options: ['circle', 'square'] },
    uiSize: { control: 'select', options: sizes },
  },
);

export const breadcrumbsPlayground = flutterPlayground('breadcrumbs', {}, {});

export const checkboxPlayground = flutterPlayground(
  'checkbox',
  { checked: true, disabled: false, indeterminate: false, uiSize: 'md' },
  {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
);

export const checkboxGroupPlayground = flutterPlayground(
  'checkbox-group',
  {
    disabled: false,
    label: 'Rack features',
    readOnly: false,
    selectedValues: ['metrics', 'backups'],
  },
  {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
  },
  {
    ja: { label: 'ラック機能' },
    ko: { label: '랙 기능' },
  },
);

export const codePlayground = flutterPlayground('code', {}, {});

export const codeBlockPlayground = flutterPlayground('code-block', {}, {});

export const collapsiblePlayground = flutterPlayground(
  'collapsible',
  { disabled: false },
  { disabled: { control: 'boolean' } },
);

export const copyButtonPlayground = flutterPlayground(
  'copy-button',
  { appearance: 'solid', intent: 'neutral', uiSize: 'md' },
  {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    intent: { control: 'select', options: intents },
    uiSize: { control: 'select', options: sizes },
  },
);

export const fieldPlayground = flutterPlayground(
  'field',
  { disabled: false, errorText: '', helper: 'none' },
  {
    disabled: { control: 'boolean' },
    errorText: { control: 'text' },
    helper: { control: 'select', options: ['none', 'description'] },
  },
);

export const fieldsetPlayground = flutterPlayground(
  'fieldset',
  { disabled: false },
  { disabled: { control: 'boolean' } },
);

export const linkPlayground = flutterPlayground(
  'link',
  { disabled: false, underline: 'hover', variant: 'default' },
  {
    disabled: { control: 'boolean' },
    underline: { control: 'select', options: ['always', 'hover', 'none'] },
    variant: { control: 'select', options: ['default', 'muted', 'danger'] },
  },
);

export const meterPlayground = flutterPlayground(
  'meter',
  { variant: 'neutral' },
  { variant: { control: 'select', options: statusVariants } },
);

export const progressPlayground = flutterPlayground(
  'progress',
  { uiSize: 'md', variant: 'neutral' },
  {
    uiSize: { control: 'select', options: sizes },
    variant: { control: 'select', options: statusVariants },
  },
);

export const radioPlayground = flutterPlayground(
  'radio',
  { disabled: false, uiSize: 'md' },
  {
    disabled: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
);

export const radioGroupPlayground = flutterPlayground(
  'radio-group',
  { disabled: false },
  { disabled: { control: 'boolean' } },
);

export const separatorPlayground = flutterPlayground(
  'separator',
  { orientation: 'horizontal' },
  {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
);

export const skeletonPlayground = flutterPlayground(
  'skeleton',
  { animate: true, shape: 'text' },
  {
    animate: { control: 'boolean' },
    shape: { control: 'select', options: ['text', 'rectangle', 'circle'] },
  },
);

export const stepsPlayground = flutterPlayground('steps', {}, {});

export const switchPlayground = flutterPlayground(
  'switch',
  { checked: false, disabled: false, readOnly: false },
  {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
);

export const tabsPlayground = flutterPlayground(
  'tabs',
  { uiSize: 'md' },
  { uiSize: { control: 'select', options: sizes } },
);

export const textareaPlayground = flutterPlayground(
  'textarea',
  { disabled: false, placeholder: 'Rack alpha', readOnly: false, uiSize: 'md' },
  {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
);

export const togglePlayground = flutterPlayground(
  'toggle',
  { disabled: false, pressed: false, uiSize: 'md' },
  {
    disabled: { control: 'boolean' },
    pressed: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
);

export const toggleGroupPlayground = flutterPlayground(
  'toggle-group',
  { multiple: false },
  { multiple: { control: 'boolean' } },
);

export const flutterPlaygrounds = {
  accordion: accordionPlayground,
  alert: alertPlayground,
  'alert-dialog': alertDialogPlayground,
  'animated-number': animatedNumberPlayground,
  'app-shell': appShellPlayground,
  autocomplete: autocompletePlayground,
  avatar: avatarPlayground,
  badge: badgePlayground,
  breadcrumbs: breadcrumbsPlayground,
  button: buttonPlayground,
  card: cardPlayground,
  checkbox: checkboxPlayground,
  'checkbox-group': checkboxGroupPlayground,
  code: codePlayground,
  'code-block': codeBlockPlayground,
  collapsible: collapsiblePlayground,
  combobox: comboboxPlayground,
  'context-menu': contextMenuPlayground,
  'copy-button': copyButtonPlayground,
  dialog: dialogPlayground,
  drawer: drawerPlayground,
  field: fieldPlayground,
  fieldset: fieldsetPlayground,
  'file-tree': fileTreePlayground,
  form: formPlayground,
  'icon-button': iconButtonPlayground,
  link: linkPlayground,
  menu: menuPlayground,
  menubar: menubarPlayground,
  meter: meterPlayground,
  'navigation-menu': navigationMenuPlayground,
  'number-field': numberFieldPlayground,
  'otp-field': otpFieldPlayground,
  popover: popoverPlayground,
  'preview-card': previewCardPlayground,
  progress: progressPlayground,
  radio: radioPlayground,
  'radio-group': radioGroupPlayground,
  'scroll-area': scrollAreaPlayground,
  separator: separatorPlayground,
  select: selectPlayground,
  skeleton: skeletonPlayground,
  slider: sliderPlayground,
  spinner: spinnerPlayground,
  steps: stepsPlayground,
  switch: switchPlayground,
  tabs: tabsPlayground,
  text: textPlayground,
  'text-field': textFieldPlayground,
  textarea: textareaPlayground,
  toast: toastPlayground,
  toggle: togglePlayground,
  'toggle-group': toggleGroupPlayground,
  toolbar: toolbarPlayground,
  tooltip: tooltipPlayground,
  'tree-nav': treeNavPlayground,
} as const satisfies Record<FlutterPreviewComponent, DemoMeta>;
