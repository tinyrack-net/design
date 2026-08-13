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
  adaptive_pane: {
    reason:
      'Flutter native applications use canonical one, two, and three-pane navigation tied to logical window width.',
  },
  chat: {
    reason:
      'Flutter native applications compose chat transcripts from shared message, tool, and status primitives.',
  },
  code_block_highlighter: {
    reason: 'Flutter owns its code-highlighting widget implementation.',
  },
  drop_overlay: {
    reason:
      'Flutter native applications own pane-wide file-drop targets and their drag lifecycle.',
  },
  focus_ring: {
    reason:
      'Flutter product composites use a painter that follows the package input-modality source.',
  },
  inline_suggestions: {
    reason: 'Inline editing suggestions are currently a Flutter-only capability.',
  },
  pane_header: {
    reason:
      'Flutter native applications share density-aware title, description, navigation, and action chrome between adaptive panes.',
  },
  qr_code: {
    reason:
      'Flutter native applications render pairing QR codes without a React surface.',
  },
  radial_meter: {
    reason:
      'Flutter native applications use a compact circular measurement in icon toolbars.',
  },
  split_view: {
    reason:
      'Flutter currently owns the resizable pane interaction used by native applications.',
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
