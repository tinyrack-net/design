import type { DemoMeta } from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { FlutterPreview } from './flutter-preview.js';
import type { FlutterPreviewComponent } from './preview-registry.generated.js';

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'];
const statusVariants = ['neutral', 'info', 'success', 'warning', 'danger'];
const sizes = ['md', 'lg'];

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
    appearance: 'solid',
  },
  {
    disabled: { control: 'boolean' },
    errorText: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
    value: { control: 'text' },
    appearance: { control: 'select', options: ['solid', 'ghost', 'plain'] },
  },
);

export const cardPlayground = flutterPlayground(
  'card',
  { focused: false, padding: 'md', variant: 'default' },
  {
    focused: { control: 'boolean' },
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

export const alertDialogPlayground = flutterPlayground(
  'alert-dialog',
  { disabled: false, label: 'Delete rack', open: false },
  {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
  {
    ja: { label: 'ラックを削除' },
    ko: { label: '랙 삭제' },
  },
);
export const appShellPlayground = definePlayground<Record<string, unknown>>({
  args: {
    breakpoint: 'sm',
    controlAppearance: 'ghost',
    layout: 'sidebar-first',
    mobileSidebar: 'drawer',
    open: false,
    sidebarCollapsed: false,
    sidebarMode: 'expanded',
  },
  argTypes: {
    breakpoint: { control: 'radio', options: ['sm', 'lg'] },
    controlAppearance: {
      control: 'radio',
      options: ['solid', 'outline', 'ghost'],
    },
    layout: {
      control: 'radio',
      options: ['header-first', 'sidebar-first'],
    },
    mobileSidebar: { control: 'radio', options: ['drawer', 'rail'] },
    open: { control: 'boolean' },
    sidebarCollapsed: { control: 'boolean' },
    sidebarMode: { control: 'radio', options: ['expanded', 'rail'] },
  },
  parameters: { playgroundLayout: 'fill-block-wide' },
  render: (args) => <FlutterPreview args={args} component="app-shell" />,
  title: 'Flutter/app-shell',
});
export const autocompletePlayground = flutterPlayground(
  'autocomplete',
  {
    completionMode: 'list',
    disabled: false,
    errorText: '',
    placeholder: 'Search regions',
    readOnly: false,
    uiSize: 'md',
  },
  {
    completionMode: {
      control: 'select',
      options: ['manual', 'list', 'inline', 'both'],
    },
    disabled: { control: 'boolean' },
    errorText: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
  {
    ja: { placeholder: '地域を検索' },
    ko: { placeholder: '지역 검색' },
  },
);
export const comboboxPlayground = flutterPlayground(
  'combobox',
  {
    autoHighlight: true,
    clearable: false,
    disabled: false,
    disabledOption: false,
    filterMode: 'contains',
    layout: 'list',
    placeholder: 'Choose a channel',
    readOnly: false,
    uiSize: 'md',
  },
  {
    autoHighlight: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    disabledOption: { control: 'boolean' },
    filterMode: {
      control: 'select',
      options: ['contains', 'startsWith', 'none'],
    },
    layout: { control: 'select', options: ['list', 'grid'] },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
  {
    ja: { placeholder: 'チャンネルを選択' },
    ko: { placeholder: '채널 선택' },
  },
);
export const inlineSuggestionsPlayground = flutterPlayground(
  'inline-suggestions',
  { disabledOption: false, open: true, status: 'ready' },
  {
    disabledOption: { control: 'boolean' },
    open: { control: 'boolean' },
    status: { control: 'select', options: ['ready', 'loading', 'error'] },
  },
);
export const contextMenuPlayground = flutterPlayground('context-menu', {}, {});
export const drawerPlayground = flutterPlayground('drawer', {}, {});

export const dropOverlayPlayground = flutterPlayground(
  'drop-overlay',
  { visible: true },
  { visible: { control: 'boolean' } },
);

export const focusRingPlayground = flutterPlayground(
  'focus-ring',
  { focused: true },
  { focused: { control: 'boolean' } },
);
export const fileTreePlayground = flutterPlayground('file-tree', {}, {});
export const formPlayground = flutterPlayground(
  'form',
  { label: 'Rack name', required: true, submitLabel: 'Save' },
  {
    label: { control: 'text' },
    required: { control: 'boolean' },
    submitLabel: { control: 'text' },
  },
  {
    ja: { label: 'ラック名', submitLabel: '保存' },
    ko: { label: '랙 이름', submitLabel: '저장' },
  },
);
export const menubarPlayground = flutterPlayground('menubar', {}, {});
export const navigationMenuPlayground = flutterPlayground('navigation-menu', {}, {});
export const numberFieldPlayground = flutterPlayground('number-field', {}, {});
export const otpFieldPlayground = flutterPlayground(
  'otp-field',
  {
    disabled: false,
    errorText: '',
    helperText: 'Enter the code we sent to your device.',
    length: 6,
    obscureText: false,
    readOnly: false,
    uiSize: 'md',
    value: '',
  },
  {
    disabled: { control: 'boolean' },
    errorText: { control: 'text' },
    helperText: { control: 'text' },
    length: { control: { max: 8, min: 3, step: 1, type: 'range' } },
    obscureText: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
    value: { control: 'text' },
  },
  {
    ja: { helperText: 'お使いのデバイスに送信したコードを入力してください。' },
    ko: { helperText: '기기로 보낸 코드를 입력하세요.' },
  },
);
export const popoverPlayground = flutterPlayground('popover', {}, {});
export const previewCardPlayground = flutterPlayground('preview-card', {}, {});
export const qrCodePlayground = flutterPlayground(
  'qr-code',
  { data: 'https://tinyrack.net', uiSize: 'md' },
  {
    data: { control: 'text' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
);
export const radialMeterPlayground = flutterPlayground(
  'radial-meter',
  { uiSize: 'md', value: 72, variant: 'neutral' },
  {
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { max: 100, min: 0, step: 1, type: 'range' } },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
);
export const chatPlayground = flutterPlayground(
  'chat',
  { open: false, status: 'succeeded' },
  {
    open: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['running', 'succeeded', 'failed', 'denied'],
    },
  },
);
export const scrollAreaPlayground = flutterPlayground(
  'scroll-area',
  { autoHide: false },
  { autoHide: { control: 'boolean' } },
);
export const sliderPlayground = flutterPlayground(
  'slider',
  {
    disabled: false,
    label: 'Traffic',
    orientation: 'horizontal',
    uiSize: 'md',
  },
  {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    uiSize: { control: 'select', options: sizes },
  },
  { ja: { label: 'トラフィック' }, ko: { label: '트래픽' } },
);
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
  { disabledItem: false, multiple: false },
  {
    disabledItem: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
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

export const codePlayground = flutterPlayground(
  'code',
  { data: 'pnpm verify' },
  { data: { control: 'textarea' } },
);

export const codeBlockPlayground = flutterPlayground(
  'code-block',
  {
    code: "const status = 'healthy';",
    language: 'dart',
    wrap: false,
  },
  {
    code: { control: 'textarea' },
    language: { control: 'select', options: ['plain', 'dart', 'json'] },
    wrap: { control: 'boolean' },
  },
);

export const collapsiblePlayground = flutterPlayground(
  'collapsible',
  { disabled: false },
  { disabled: { control: 'boolean' } },
);

export const copyButtonPlayground = flutterPlayground(
  'copy-button',
  {
    appearance: 'solid',
    copiedLabel: 'Copied',
    idleLabel: 'Copy',
    intent: 'neutral',
    resetDelay: 2000,
    uiSize: 'md',
    value: 'flutter pub add tinyrack_ui',
  },
  {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    copiedLabel: { control: 'text' },
    idleLabel: { control: 'text' },
    intent: { control: 'select', options: intents },
    resetDelay: { control: { type: 'range', min: 500, max: 5000, step: 250 } },
    uiSize: { control: 'select', options: sizes },
    value: { control: 'text' },
  },
  {
    ja: { copiedLabel: 'コピー済み', idleLabel: 'コピー' },
    ko: { copiedLabel: '복사됨', idleLabel: '복사' },
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
  { disabled: false, legend: 'Contact' },
  { disabled: { control: 'boolean' }, legend: { control: 'text' } },
  {
    ja: { legend: '連絡先' },
    ko: { legend: '연락처' },
  },
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
  { checked: false, disabled: false, readOnly: false, uiSize: 'md' },
  {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
  },
);

export const radioGroupPlayground = flutterPlayground(
  'radio-group',
  { disabled: false, readOnly: false, selectedValue: 'start' },
  { disabled: { control: 'boolean' }, readOnly: { control: 'boolean' } },
);

export const separatorPlayground = flutterPlayground(
  'separator',
  { orientation: 'horizontal', variant: 'defaultVariant' },
  {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['defaultVariant', 'muted'] },
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
  { checked: false, disabled: false, invalid: false, readOnly: false },
  {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
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
  {
    disabled: false,
    placeholder: 'Rack alpha',
    readOnly: false,
    uiSize: 'md',
    appearance: 'solid',
  },
  {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: sizes },
    appearance: { control: 'select', options: ['solid', 'ghost'] },
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
  {
    disabled: false,
    disabledItem: false,
    loopFocus: true,
    multiple: false,
    orientation: 'horizontal',
    selectedValues: ['start'],
  },
  {
    disabled: { control: 'boolean' },
    disabledItem: { control: 'boolean' },
    loopFocus: { control: 'boolean' },
    multiple: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
);

export const paginationPlayground = flutterPlayground(
  'pagination',
  { boundaryCount: 1, currentPage: 3, siblingCount: 1, totalPages: 12 },
  {
    boundaryCount: { control: 'number' },
    currentPage: { control: 'number' },
    siblingCount: { control: 'number' },
    totalPages: { control: 'number' },
  },
);

export const tablePlayground = flutterPlayground(
  'table',
  { density: 'comfortable', striped: false },
  {
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
    striped: { control: 'boolean' },
  },
);

export const windowFramePlayground = flutterPlayground(
  'window-frame',
  { padding: 'md', variant: 'macos' },
  {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['macos', 'browser'] },
  },
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
  chat: chatPlayground,
  checkbox: checkboxPlayground,
  'checkbox-group': checkboxGroupPlayground,
  code: codePlayground,
  'code-block': codeBlockPlayground,
  collapsible: collapsiblePlayground,
  combobox: comboboxPlayground,
  'inline-suggestions': inlineSuggestionsPlayground,
  'context-menu': contextMenuPlayground,
  'copy-button': copyButtonPlayground,
  dialog: dialogPlayground,
  drawer: drawerPlayground,
  'drop-overlay': dropOverlayPlayground,
  field: fieldPlayground,
  fieldset: fieldsetPlayground,
  'file-tree': fileTreePlayground,
  'focus-ring': focusRingPlayground,
  form: formPlayground,
  'icon-button': iconButtonPlayground,
  link: linkPlayground,
  menu: menuPlayground,
  menubar: menubarPlayground,
  meter: meterPlayground,
  'navigation-menu': navigationMenuPlayground,
  'number-field': numberFieldPlayground,
  'otp-field': otpFieldPlayground,
  pagination: paginationPlayground,
  popover: popoverPlayground,
  'preview-card': previewCardPlayground,
  progress: progressPlayground,
  'qr-code': qrCodePlayground,
  'radial-meter': radialMeterPlayground,
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
  table: tablePlayground,
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
  'window-frame': windowFramePlayground,
} as const satisfies Record<FlutterPreviewComponent, DemoMeta>;
