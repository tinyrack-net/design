export const baseUiComponentNames = [
  'accordion',
  'alert-dialog',
  'autocomplete',
  'avatar',
  'button',
  'checkbox',
  'checkbox-group',
  'collapsible',
  'combobox',
  'context-menu',
  'dialog',
  'drawer',
  'field',
  'fieldset',
  'form',
  'input',
  'menu',
  'menubar',
  'meter',
  'navigation-menu',
  'number-field',
  'otp-field',
  'popover',
  'preview-card',
  'progress',
  'radio',
  'radio-group',
  'scroll-area',
  'select',
  'separator',
  'slider',
  'switch',
  'tabs',
  'toast',
  'toggle',
  'toggle-group',
  'toolbar',
  'tooltip',
] as const;

export const baseUiSingleComponentNames = [
  'button',
  'checkbox-group',
  'form',
  'input',
  'menubar',
  'radio-group',
  'separator',
  'toggle',
  'toggle-group',
] as const satisfies readonly BaseUiComponentName[];

export const tinyrackComponentNames = [
  'alert',
  'app-shell',
  'badge',
  'card',
  'code',
  'code-block',
  'copy-button',
  'callout',
  'color-scheme-toggle',
  'docs-navigation',
  'docs-search',
  'docs-shell',
  'document-pagination',
  'file-tree',
  'icon-button',
  'language-select',
  'link',
  'skeleton',
  'spinner',
  'steps',
  'table',
  'table-of-contents',
  'textarea',
] as const;

export const componentNames = [
  ...baseUiComponentNames,
  ...tinyrackComponentNames,
].sort() as readonly string[];

export const providerNames = ['csp', 'direction'] as const;

export type BaseUiComponentName = (typeof baseUiComponentNames)[number];
export type ComponentName =
  | BaseUiComponentName
  | (typeof tinyrackComponentNames)[number];
export type ProviderName = (typeof providerNames)[number];
