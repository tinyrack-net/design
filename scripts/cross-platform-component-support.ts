export type AdaptedComponentSupport = {
  flutter: string;
  reason: string;
};

export type PlatformOnlyComponentSupport = {
  reason: string;
};

/**
 * Public React components that share a purpose with a differently named or
 * differently composed Flutter component.
 *
 * This is an adaptation contract, not an API or pixel-parity promise. Public
 * components absent from this table are matched by kebab-case/snake_case name.
 */
export const reactComponentAdaptations = {
  'checkbox-group': {
    flutter: 'checkbox',
    reason: 'Flutter composes checkbox groups from the checkbox component.',
  },
  'icon-button': {
    flutter: 'button',
    reason: 'Flutter exposes icon buttons as a button variant.',
  },
  input: {
    flutter: 'text_field',
    reason: 'Flutter uses one text-field component for single-line input.',
  },
  'link-button': {
    flutter: 'button',
    reason: 'Flutter navigation actions are expressed through the button surface.',
  },
  'radio-group': {
    flutter: 'radio',
    reason: 'Flutter composes radio groups from the radio component.',
  },
  'toggle-group': {
    flutter: 'toggle',
    reason: 'Flutter composes toggle groups from the toggle component.',
  },
} as const satisfies Record<string, AdaptedComponentSupport>;

/** Flutter surfaces with no public React component of the same purpose. */
export const flutterPlatformOnlyComponents = {
  code_block_highlighter: {
    reason: 'Flutter owns its code-highlighting widget implementation.',
  },
  inline_suggestions: {
    reason: 'Inline editing suggestions are currently a Flutter-only capability.',
  },
} as const satisfies Record<string, PlatformOnlyComponentSupport>;

export function conventionalFlutterComponentName(reactComponent: string) {
  return reactComponent.replaceAll('-', '_');
}

export function supportedFlutterComponentName(reactComponent: string) {
  const adaptation = (
    reactComponentAdaptations as Record<string, AdaptedComponentSupport>
  )[reactComponent];
  return adaptation?.flutter ?? conventionalFlutterComponentName(reactComponent);
}
