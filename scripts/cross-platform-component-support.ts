export type AdaptedComponentSupport = { flutter: string; reason: string };
export type PlatformOnlyComponentSupport = { reason: string };
export type CrossPlatformParityLevel = 'adapted' | 'contract' | 'geometry';

export type CrossPlatformParitySupport = {
  excluded: readonly string[];
  fixture?: string;
  level: CrossPlatformParityLevel;
  platformExtensions?: { flutter?: readonly string[]; web?: readonly string[] };
  rationale: string;
  sharedContract: readonly string[];
};

type StrictOptions = Pick<
  CrossPlatformParitySupport,
  'excluded' | 'platformExtensions' | 'sharedContract'
>;

const adapted = (
  rationale: string,
  sharedContract: readonly string[],
  excluded: readonly string[],
): CrossPlatformParitySupport => ({
  excluded,
  level: 'adapted',
  rationale,
  sharedContract,
});

const strict = (
  level: 'contract' | 'geometry',
  fixture: string,
  rationale: string,
  options: StrictOptions,
): CrossPlatformParitySupport => ({ fixture, level, rationale, ...options });

const contract = (fixture: string, rationale: string, options: StrictOptions) =>
  strict('contract', fixture, rationale, options);
const geometry = (fixture: string, rationale: string, options: StrictOptions) =>
  strict('geometry', fixture, rationale, options);

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
    reason: 'Flutter navigation actions use the button surface.',
  },
  'native-select': {
    flutter: 'select',
    reason:
      'Flutter uses its select component without promising an HTML-style system picker.',
  },
  'provider-mark': {
    flutter: 'avatar',
    reason:
      'Flutter supplies reviewed provider artwork to its image-backed avatar surface.',
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

const glyphs = ['text width', 'glyph rasterization'];
const placement = ['viewport coordinates', 'collision resolution'];
const visual = ['theme token roles', 'owned part geometry'];

/** Exhaustive public React-to-Flutter parity decisions. */
export const reactComponentParity = {
  accordion: contract('accordion', 'Expansion panels have content-driven height.', {
    excluded: ['content height', 'animation frames'],
    sharedContract: [
      'single and multiple expansion',
      'disabled state',
      'keyboard activation',
    ],
  }),
  alert: geometry('alert', 'The status surface owns a stable visual skeleton.', {
    excluded: glyphs,
    sharedContract: ['status variants', 'content parts', ...visual],
  }),
  'alert-dialog': contract(
    'alert-dialog',
    'Modal placement adapts to the platform viewport.',
    {
      excluded: [...placement, 'software keyboard inset'],
      sharedContract: ['open lifecycle', 'modal focus', 'disabled trigger'],
    },
  ),
  'animated-number': contract(
    'animated-number',
    'Text shaping and rolling columns are renderer-owned.',
    {
      excluded: ['glyph rasterization', 'intermediate glyph positions'],
      sharedContract: ['format presets', 'locale', 'roll direction', 'reduced motion'],
    },
  ),
  'app-shell': adapted(
    'Navigation history, safe areas, and responsive shell ownership are platform integrations.',
    ['layout modes', 'sidebar modes', 'shared shell tokens'],
    [
      'browser history',
      'Flutter routes',
      'safe-area insets',
      'mobile drawer mechanics',
    ],
  ),
  autocomplete: contract(
    'autocomplete',
    'Suggestions depend on native editable text input.',
    {
      excluded: [...placement, 'IME composition', 'platform autofill'],
      sharedContract: [
        'completion modes',
        'availability states',
        'option activation',
        'open lifecycle',
      ],
    },
  ),
  avatar: geometry('avatar', 'Size and shape are entirely token-owned.', {
    excluded: ['decoded image pixels'],
    sharedContract: ['sizes', 'shapes', 'fallback state', ...visual],
  }),
  badge: geometry('badge', 'Badge variants use a fixed capsule recipe.', {
    excluded: glyphs,
    sharedContract: ['status variants', 'sizes', 'icon gap', ...visual],
  }),
  breadcrumbs: geometry('breadcrumbs', 'Spacing and separators form a stable row.', {
    excluded: glyphs,
    sharedContract: ['current item semantics', 'separator composition', ...visual],
  }),
  button: geometry('button', 'Buttons share the complete action-control recipe.', {
    excluded: glyphs,
    platformExtensions: {
      flutter: ['xl size'],
      web: ['legacy variants', 'native form attributes', 'render polymorphism'],
    },
    sharedContract: [
      'intents',
      'appearances',
      'sizes',
      'interaction states',
      ...visual,
    ],
  }),
  card: geometry('card', 'Cards own surface, padding, and section spacing.', {
    excluded: ['content-driven height', ...glyphs],
    sharedContract: ['surface variants', 'padding sizes', 'section parts', ...visual],
  }),
  checkbox: geometry('checkbox', 'Indicator dimensions and state colors are shared.', {
    excluded: ['native form serialization'],
    sharedContract: [
      'checked and indeterminate',
      'availability states',
      'sizes',
      ...visual,
    ],
  }),
  'checkbox-group': contract(
    'checkbox-group',
    'Flutter composes checkboxes while Web owns a group primitive.',
    {
      excluded: ['native form association', 'authored child layout'],
      sharedContract: ['multi-selection', 'availability states', 'parent state'],
    },
  ),
  code: geometry('code', 'Inline code owns typography, padding, color, and radius.', {
    excluded: glyphs,
    sharedContract: ['inline semantics', 'code typography', ...visual],
  }),
  'code-block': contract(
    'code-block',
    'Syntax parsing and scrolling use different engines.',
    {
      excluded: ['tokenization boundaries', 'scrollbars', 'glyph rasterization'],
      sharedContract: ['language', 'wrapping', 'copy action', 'code semantics'],
    },
  ),
  collapsible: contract(
    'collapsible',
    'The component orchestrates arbitrary trigger and panel content.',
    {
      excluded: ['authored content geometry', 'animation frames'],
      sharedContract: ['open state', 'disabled trigger', 'keyboard activation'],
    },
  ),
  combobox: contract(
    'combobox',
    'Filtering and editable popup layout are content-driven.',
    {
      excluded: [...placement, 'IME composition', 'collection height'],
      sharedContract: [
        'filter modes',
        'selection',
        'availability states',
        'keyboard navigation',
      ],
    },
  ),
  'context-menu': adapted(
    'Flutter may delegate presentation and dismissal to the operating system.',
    ['actions', 'disabled items', 'selection items', 'shared menu tokens'],
    ['native menu geometry', 'OS dismissal', 'platform icons', 'invocation gesture'],
  ),
  'copy-button': geometry(
    'copy-button',
    'The visible surface inherits Button geometry.',
    {
      excluded: ['clipboard permission and availability'],
      sharedContract: ['status labels', 'reset delay', 'button states', ...visual],
    },
  ),
  dialog: contract('dialog', 'Dialog size and placement adapt to available space.', {
    excluded: [...placement, 'software keyboard inset'],
    sharedContract: [
      'modal lifecycle',
      'focus restoration',
      'dismissal',
      'placement intent',
    ],
  }),
  drawer: contract('drawer', 'Viewport insets and drag physics are platform-owned.', {
    excluded: ['safe-area insets', 'drag physics', 'absolute viewport geometry'],
    sharedContract: ['directions', 'open lifecycle', 'focus containment', 'dismissal'],
  }),
  field: geometry('field', 'Label and supporting-message spacing use shared tokens.', {
    excluded: ['consumer control width', ...glyphs],
    sharedContract: [
      'label and message parts',
      'invalid and disabled states',
      ...visual,
    ],
  }),
  fieldset: contract('fieldset', 'Fieldset semantics wrap authored child layout.', {
    excluded: ['authored child geometry', 'native form propagation'],
    sharedContract: ['legend semantics', 'disabled propagation', 'composition'],
  }),
  'file-tree': geometry(
    'file-tree',
    'Rows, indentation, rails, and selection are token-owned.',
    {
      excluded: ['file-system integration', ...glyphs],
      sharedContract: ['expansion', 'selection', 'keyboard navigation', ...visual],
    },
  ),
  form: adapted(
    'HTML submission and Flutter FormState expose different lifecycle and value models.',
    ['validation intent', 'reset intent', 'disabled-field omission'],
    ['FormData serialization', 'route-pop guards', 'server actions'],
  ),
  'icon-button': geometry(
    'icon-button',
    'The square action target shares Button tokens.',
    {
      excluded: ['icon glyph paths'],
      platformExtensions: {
        flutter: ['sm/xl sizes', 'info/success/warning intents'],
        web: ['native attributes', 'render polymorphism'],
      },
      sharedContract: [
        'secondary/neutral, primary, and danger semantic variants',
        'appearances',
        'md/lg sizes',
        'availability states',
        ...visual,
      ],
    },
  ),
  input: geometry('input', 'The input surface maps to Flutter text-field geometry.', {
    excluded: ['autofill', 'IME composition', 'Flutter outer label'],
    platformExtensions: {
      flutter: ['sm/xl sizes', 'appearance recipes'],
      web: ['native input attributes'],
    },
    sharedContract: [
      'md/lg sizes',
      'availability states',
      'invalid and focus states',
      ...visual,
    ],
  }),
  link: geometry('link', 'Typography, underline, color, and focus are shared.', {
    excluded: ['router integration', 'visited history'],
    sharedContract: [
      'variants',
      'underline policies',
      'disabled and focus states',
      ...visual,
    ],
  }),
  'link-button': geometry('link-button', 'Navigation actions reuse Button geometry.', {
    excluded: ['router integration', 'native form behavior'],
    platformExtensions: { web: ['href and render polymorphism'] },
    sharedContract: ['intents', 'appearances', 'sizes', 'disabled state', ...visual],
  }),
  menu: geometry(
    'menu',
    'Canonical trigger and popup row metrics exist on both platforms.',
    {
      excluded: placement,
      sharedContract: [
        'item types',
        'disabled state',
        'keyboard navigation',
        'popup parts',
        ...visual,
      ],
    },
  ),
  menubar: geometry('menubar', 'Compact command rows use shared layer metrics.', {
    excluded: placement,
    sharedContract: [
      'orientation',
      'disabled commands',
      'keyboard loop',
      'nested layers',
      ...visual,
    ],
  }),
  meter: geometry('meter', 'Track, fill, range, and colors are stable parts.', {
    excluded: glyphs,
    sharedContract: [
      'range normalization',
      'status variants',
      'label semantics',
      ...visual,
    ],
  }),
  'navigation-menu': contract(
    'navigation-menu',
    'Responsive alternatives and popup placement differ.',
    {
      excluded: [...placement, 'responsive replacement UI'],
      sharedContract: [
        'active and disabled items',
        'orientation',
        'keyboard navigation',
        'open lifecycle',
      ],
    },
  ),
  'native-select': adapted(
    'HTML select form behavior and browser or operating-system picker presentation do not have a direct Flutter equivalent.',
    ['single selection', 'availability states', 'shared closed-control tokens'],
    [
      'HTML form serialization',
      'browser or operating-system picker presentation',
      'native option and optgroup elements',
    ],
  ),
  'number-field': geometry(
    'number-field',
    'Input and step controls share metrics and spacing.',
    {
      excluded: ['locale glyph width', 'native form serialization'],
      sharedContract: [
        'range and step',
        'scrubbing',
        'availability states',
        'sizes',
        ...visual,
      ],
    },
  ),
  'otp-field': geometry(
    'otp-field',
    'Slot size, separators, focus, and error treatment are shared.',
    {
      excluded: ['autofill provider UI', 'per-slot caret implementation'],
      sharedContract: [
        'length',
        'sizes',
        'availability states',
        'input and paste flow',
        ...visual,
      ],
    },
  ),
  pagination: geometry('pagination', 'Range algorithm and action row are shared.', {
    excluded: ['router integration', ...glyphs],
    sharedContract: [
      'boundary and sibling ranges',
      'current page',
      'edge actions',
      ...visual,
    ],
  }),
  popover: contract(
    'popover',
    'Collision and anchor placement are renderer-specific.',
    {
      excluded: placement,
      sharedContract: [
        'open lifecycle',
        'focus behavior',
        'side and alignment intent',
        'dismissal',
      ],
    },
  ),
  'preview-card': contract(
    'preview-card',
    'Hover timing and placement depend on pointer capabilities.',
    {
      excluded: [...placement, 'platform hover availability'],
      sharedContract: [
        'hover and focus opening',
        'side and alignment intent',
        'dismissal',
      ],
    },
  ),
  progress: geometry('progress', 'Progress tracks and fills are fixed token recipes.', {
    excluded: ['animation frame sampling'],
    sharedContract: ['determinate and indeterminate', 'variants', 'sizes', ...visual],
  }),
  'provider-mark': adapted(
    'Web encapsulates inline provider SVGs while Flutter supplies the same reviewed artwork as an image.',
    ['official provider artwork', 'accessible provider identity', 'token-owned size'],
    ['SVG path representation', 'Flutter image decoding'],
  ),
  radio: geometry('radio', 'Indicator dimensions and selected treatment are shared.', {
    excluded: ['native form serialization'],
    sharedContract: ['selected state', 'availability states', 'sizes', ...visual],
  }),
  'radio-group': contract(
    'radio-group',
    'Flutter composes radios without Web form association.',
    {
      excluded: [
        'required validation',
        'native form association',
        'authored option layout',
      ],
      sharedContract: [
        'single selection',
        'availability states',
        'arrow-key navigation',
      ],
    },
  ),
  'scroll-area': adapted(
    'Scroll physics, scrollbar ownership, and accessibility are renderer-native.',
    ['orientation', 'auto-hide intent', 'shared scrollbar colors'],
    ['scroll physics', 'thumb sizing', 'momentum', 'native overlay scrollbars'],
  ),
  select: geometry(
    'select',
    'Trigger and canonical option rows are shared and measurable.',
    {
      excluded: placement,
      sharedContract: [
        'sizes',
        'selection',
        'availability states',
        'keyboard navigation',
        'popup parts',
        ...visual,
      ],
    },
  ),
  separator: geometry(
    'separator',
    'Thickness, color, and orientation are token-owned.',
    {
      excluded: [],
      sharedContract: ['orientations', 'decorative semantics', ...visual],
    },
  ),
  skeleton: geometry(
    'skeleton',
    'Shape, radius, color, and motion tokens are shared.',
    {
      excluded: ['intermediate shimmer pixels'],
      sharedContract: ['shapes', 'reduced motion', ...visual],
    },
  ),
  slider: geometry('slider', 'Track, thumb, range, and focus dimensions are shared.', {
    excluded: ['native pointer sampling'],
    sharedContract: [
      'sizes',
      'orientation',
      'disabled state',
      'single and range values',
      ...visual,
    ],
  }),
  spinner: geometry(
    'spinner',
    'Diameter, stroke, color, and motion tokens are shared.',
    {
      excluded: ['intermediate antialiased pixels'],
      sharedContract: [
        'sizes',
        'variants',
        'status semantics',
        'reduced motion',
        ...visual,
      ],
    },
  ),
  steps: geometry(
    'steps',
    'Markers, connector, indentation, and spacing are design-owned.',
    {
      excluded: ['authored body height', ...glyphs],
      sharedContract: ['ordered semantics', 'marker and connector parts', ...visual],
    },
  ),
  switch: geometry(
    'switch',
    'Track and thumb geometry is a shared binary-control recipe.',
    {
      excluded: ['native form serialization'],
      sharedContract: ['checked, disabled, read-only, and invalid states', ...visual],
    },
  ),
  table: contract(
    'table',
    'Column widths and overflow depend on text layout and viewport.',
    {
      excluded: ['column width', 'text wrapping', 'horizontal scrollbar'],
      sharedContract: ['density', 'striping', 'table semantics', 'empty state'],
    },
  ),
  tabs: geometry('tabs', 'Tab height, gap, indicator, and focus geometry are shared.', {
    excluded: ['label text width'],
    platformExtensions: { web: ['vertical orientation'] },
    sharedContract: [
      'sizes',
      'disabled tabs',
      'keyboard navigation',
      'indicator part',
      ...visual,
    ],
  }),
  text: geometry('text', 'Typography and semantic color tokens are directly shared.', {
    excluded: glyphs,
    sharedContract: [
      'variants',
      'weights',
      'colors',
      'alignment',
      'truncation',
      ...visual,
    ],
  }),
  textarea: geometry(
    'textarea',
    'Surface, typography, padding, and states are shared.',
    {
      excluded: ['Web resize handle', 'content growth', 'IME composition'],
      platformExtensions: { flutter: ['xl size'], web: ['manual resize handle'] },
      sharedContract: [
        'sizes',
        'availability states',
        'invalid and focus states',
        ...visual,
      ],
    },
  ),
  toast: contract('toast', 'Store lifecycle, swipe physics, and stacking differ.', {
    excluded: ['swipe physics', 'absolute viewport position', 'stack reflow frames'],
    sharedContract: [
      'variants',
      'open lifecycle',
      'action and dismissal',
      'reduced motion',
    ],
  }),
  toggle: geometry('toggle', 'Pressed action controls share Button metrics.', {
    excluded: ['native form serialization'],
    sharedContract: [
      'pressed and disabled states',
      'sizes',
      'keyboard activation',
      ...visual,
    ],
  }),
  'toggle-group': geometry(
    'toggle-group',
    'Group spacing and child Toggle geometry are shared.',
    {
      excluded: ['native form serialization'],
      sharedContract: [
        'selection modes',
        'orientation',
        'disabled items',
        'keyboard loop',
        ...visual,
      ],
    },
  ),
  toolbar: geometry('toolbar', 'Command target sizing and gaps are token-owned.', {
    excluded: ['consumer command content'],
    platformExtensions: { web: ['vertical orientation'] },
    sharedContract: [
      'horizontal composition',
      'disabled commands',
      'keyboard navigation',
      ...visual,
    ],
  }),
  tooltip: contract(
    'tooltip',
    'Hover availability, delay, and placement are platform-specific.',
    {
      excluded: [...placement, 'platform hover availability', 'delay precision'],
      sharedContract: [
        'hover and focus opening',
        'accessible label',
        'dismissal',
        'side intent',
      ],
    },
  ),
  'tree-nav': geometry(
    'tree-nav',
    'Rows, rails, indentation, and selection use shared metrics.',
    {
      excluded: ['router integration', ...glyphs],
      sharedContract: [
        'selection',
        'collapsed branches',
        'keyboard navigation',
        ...visual,
      ],
    },
  ),
  'virtual-list': adapted(
    'DOM virtualization and Flutter anchoring expose different lifecycle models.',
    ['axis', 'edge following intent', 'stable item identity'],
    [
      'measurement cache',
      'scroll physics',
      'restoration snapshots',
      'rendered node count',
    ],
  ),
  'window-frame': geometry(
    'window-frame',
    'Decorative chrome and padding are fixed recipes.',
    {
      excluded: ['embedded content geometry', ...glyphs],
      sharedContract: [
        'browser and macOS variants',
        'padding',
        'chrome parts',
        ...visual,
      ],
    },
  ),
} as const satisfies Record<string, CrossPlatformParitySupport>;

export const flutterPlatformOnlyComponents = {
  adaptive_pane: { reason: 'Flutter owns adaptive navigation panes.' },
  chat: { reason: 'Flutter owns native chat transcript composition.' },
  code_block_highlighter: { reason: 'Flutter owns code highlighting.' },
  drop_overlay: { reason: 'Flutter owns pane-wide file-drop targets.' },
  focus_ring: { reason: 'Flutter composites own a modality-aware painter.' },
  inline_suggestions: { reason: 'Inline suggestions are Flutter-only.' },
  pane_header: { reason: 'Flutter adaptive panes own native header chrome.' },
  qr_code: { reason: 'Flutter renders native pairing QR codes.' },
  radial_meter: { reason: 'Flutter owns the compact radial meter.' },
  split_view: { reason: 'Flutter owns native resizable panes.' },
  surface: { reason: 'Flutter transformed routes require an opaque surface.' },
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

export function crossPlatformParityFor(
  reactComponent: string,
): CrossPlatformParitySupport {
  const support = (
    reactComponentParity as Record<string, CrossPlatformParitySupport | undefined>
  )[reactComponent];
  if (support === undefined)
    throw new Error(`Unclassified cross-platform component: ${reactComponent}`);
  return support;
}
