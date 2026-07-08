import { tinyrackDaisyUiThemes } from '../../integrations/daisyui/themes.js';
import {
  tinyrackAvatarContract,
  tinyrackBadgeContract,
  tinyrackControlContract,
  tinyrackControlSizeNames,
  tinyrackIndicatorContract,
  tinyrackKbdContract,
  tinyrackLoaderContract,
  tinyrackMenuContract,
  tinyrackProgressContract,
  tinyrackRadialProgressContract,
  tinyrackRangeContract,
  tinyrackRatingContract,
  tinyrackSelectionControlContract,
  tinyrackStepperContract,
  tinyrackSwitchContract,
  tinyrackTableContract,
  tinyrackTabsContract,
} from '../components.js';
import { tinyrackSpacing } from '../spacing.js';
import { tinyrackTypography } from '../typography.js';
import { createBlock, createFile } from './render.js';
import type { SemanticMode } from './tinyrack-declarations.js';

function createDaisyUiThemeBlock(theme: (typeof tinyrackDaisyUiThemes)[SemanticMode]) {
  return createBlock('@plugin "daisyui/theme"', [
    ['name', `"${theme.name}"`],
    ['default', String(theme.isDefault)],
    ['prefersdark', String(theme.prefersDark)],
    ['color-scheme', theme.colorScheme],
    ...Object.entries(theme.tokens),
  ]);
}

function createTinyrackDaisyUiButtonParityCss() {
  const blocks = [
    createBlock('.btn', [
      [
        'border-radius',
        `var(--tinyrack-control-radius, ${tinyrackControlContract.radius})`,
      ],
      [
        'font-weight',
        `var(--tinyrack-control-font-weight, ${tinyrackControlContract.fontWeight})`,
      ],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackControlContract.sizes[size];

      return createBlock(`.btn-${size}`, [
        ['--size', `var(--tinyrack-control-height-${size}, ${tokens.height})`],
        ['--btn-p', `var(--tinyrack-control-padding-x-${size}, ${tokens.paddingX})`],
        ['--fontsize', `var(--tinyrack-control-font-size-${size}, ${tokens.fontSize})`],
        ['height', `var(--tinyrack-control-height-${size}, ${tokens.height})`],
        [
          'padding-inline',
          `var(--tinyrack-control-padding-x-${size}, ${tokens.paddingX})`,
        ],
        ['font-size', `var(--tinyrack-control-font-size-${size}, ${tokens.fontSize})`],
        ['gap', `var(--tinyrack-control-gap-${size}, ${tokens.gap})`],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiFormControlParityCss() {
  const formControlSelector = '.input, .select, .textarea, .file-input';
  const focusSelector =
    '.input:focus, .input:focus-within, .select:focus, .select:focus-within, .textarea:focus, .textarea:focus-within, .file-input:focus, .file-input:focus-within';

  const blocks = [
    createBlock(formControlSelector, [
      ['--input-color', 'var(--tinyrack-border, var(--color-base-300))'],
      ['background-color', 'var(--tinyrack-surface, var(--color-base-100))'],
      ['border-color', 'var(--tinyrack-border, var(--color-base-300))'],
      [
        'border-radius',
        `var(--tinyrack-control-radius, ${tinyrackControlContract.radius})`,
      ],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
    ]),
    createBlock(focusSelector, [
      ['--input-color', 'var(--tinyrack-focus, var(--color-base-content))'],
      ['border-color', 'var(--tinyrack-focus, var(--color-base-content))'],
      ['outline-color', 'var(--tinyrack-focus, var(--color-base-content))'],
    ]),
    createBlock('.file-input::file-selector-button', [
      [
        'border-radius',
        `var(--tinyrack-control-radius, ${tinyrackControlContract.radius})`,
      ],
      [
        'font-weight',
        `var(--tinyrack-control-font-weight, ${tinyrackControlContract.fontWeight})`,
      ],
    ]),
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackControlContract.sizes[size];
      const height = `var(--tinyrack-control-height-${size}, ${tokens.height})`;
      const fontSize = `var(--tinyrack-control-font-size-${size}, ${tokens.fontSize})`;
      const paddingX = `var(--tinyrack-control-padding-x-${size}, ${tokens.paddingX})`;
      const paddingY = `var(--tinyrack-control-padding-y-${size}, ${tokens.paddingY})`;

      return [
        createBlock(`.input-${size}, .select-${size}, .file-input-${size}`, [
          ['--font-size-min', fontSize],
          ['--size', height],
          ['font-size', fontSize],
          ['height', height],
        ]),
        createBlock(`.input-${size}, .textarea-${size}, .file-input-${size}`, [
          ['padding-inline', paddingX],
        ]),
        createBlock(`.select-${size}`, [
          ['padding-inline-start', paddingX],
          ['padding-inline-end', `calc(${paddingX} + 1.75rem)`],
        ]),
        createBlock(`.textarea-${size}`, [
          ['--font-size-min', fontSize],
          ['font-size', fontSize],
          ['min-height', height],
          ['padding-block', paddingY],
          ['padding-inline', paddingX],
        ]),
        createBlock(`.file-input-${size}::file-selector-button`, [
          ['font-size', fontSize],
        ]),
      ];
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiBadgeParityCss() {
  const blocks = [
    createBlock('.badge', [
      [
        'border-radius',
        `var(--tinyrack-badge-radius, ${tinyrackBadgeContract.radius})`,
      ],
      [
        'border-width',
        `var(--tinyrack-badge-border-width, ${tinyrackBadgeContract.borderWidth})`,
      ],
      [
        'font-weight',
        `var(--tinyrack-badge-font-weight, ${tinyrackBadgeContract.fontWeight})`,
      ],
      ['letter-spacing', '0'],
      ['text-transform', 'none'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackBadgeContract.sizes[size];
      const height = `var(--tinyrack-badge-height-${size}, ${tokens.height})`;
      const fontSize = `var(--tinyrack-badge-font-size-${size}, ${tokens.fontSize})`;

      return createBlock(`.badge-${size}`, [
        ['--size', height],
        ['height', height],
        ['font-size', fontSize],
        [
          'padding-inline',
          `calc(${height} / 2 - var(--tinyrack-badge-border-width, ${tinyrackBadgeContract.borderWidth}))`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiKbdParityCss() {
  const blocks = [
    createBlock('.kbd', [
      ['align-items', 'center'],
      ['background-color', 'var(--tinyrack-kbd-background, var(--color-base-200))'],
      [
        'border-color',
        'var(--tinyrack-border, color-mix(in srgb, var(--color-base-content) 20%, transparent))',
      ],
      [
        'border-bottom-color',
        'var(--tinyrack-border-strong, var(--tinyrack-border, color-mix(in srgb, var(--color-base-content) 20%, transparent)))',
      ],
      ['border-radius', `var(--tinyrack-kbd-radius, ${tinyrackKbdContract.radius})`],
      [
        'border-width',
        `var(--tinyrack-kbd-border-width, ${tinyrackKbdContract.borderWidth})`,
      ],
      [
        'border-bottom-width',
        `var(--tinyrack-kbd-border-bottom-width, ${tinyrackKbdContract.borderBottomWidth})`,
      ],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['font-family', 'var(--tinyrack-font-mono)'],
      [
        'font-weight',
        `var(--tinyrack-kbd-font-weight, ${tinyrackKbdContract.fontWeight})`,
      ],
      ['justify-content', 'center'],
      ['line-height', '1'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackKbdContract.sizes[size];
      const height = `var(--tinyrack-kbd-height-${size}, ${tokens.height})`;
      const fontSize = `var(--tinyrack-kbd-font-size-${size}, ${tokens.fontSize})`;

      return createBlock(`.kbd-${size}`, [
        ['--size', height],
        ['font-size', fontSize],
        ['height', height],
        ['min-width', height],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiSelectionControlParityCss() {
  const selectionSelector = '.checkbox, .radio';
  const checkedSelector =
    '.checkbox:checked, .checkbox[aria-checked="true"], .radio:checked, .radio[aria-checked="true"]';

  const blocks = [
    createBlock(selectionSelector, [
      ['--input-color', 'var(--tinyrack-border, currentColor)'],
      ['background-color', 'var(--tinyrack-surface, transparent)'],
      ['border-color', 'var(--tinyrack-border, currentColor)'],
      [
        'border-width',
        `var(--tinyrack-selection-control-border-width, ${tinyrackSelectionControlContract.borderWidth})`,
      ],
      ['box-shadow', 'none'],
    ]),
    createBlock('.checkbox', [
      [
        'border-radius',
        `var(--tinyrack-selection-control-checkbox-radius, ${tinyrackSelectionControlContract.checkboxRadius})`,
      ],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    createBlock('.radio', [
      [
        'border-radius',
        `var(--tinyrack-selection-control-radio-radius, ${tinyrackSelectionControlContract.radioRadius})`,
      ],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    createBlock('.checkbox-primary, .radio-primary', [
      ['--input-color', 'var(--tinyrack-primary, var(--color-primary))'],
    ]),
    createBlock(checkedSelector, [
      ['--input-color', 'var(--tinyrack-primary, currentColor)'],
      ['background-color', 'var(--tinyrack-primary, currentColor)'],
      ['border-color', 'var(--tinyrack-primary, currentColor)'],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackSelectionControlContract.sizes[size];
      const controlSize = `var(--tinyrack-selection-control-size-${size}, ${tokens.size})`;
      const padding = `var(--tinyrack-selection-control-padding-${size}, ${tokens.padding})`;

      return createBlock(`.checkbox-${size}, .radio-${size}`, [
        ['--size', controlSize],
        ['height', controlSize],
        ['padding', padding],
        ['width', controlSize],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiSwitchParityCss() {
  const checkedSelector =
    '.toggle:checked, .toggle[aria-checked="true"], .toggle:has(> input:checked)';

  const blocks = [
    createBlock('.toggle', [
      ['--input-color', 'var(--tinyrack-surface-raised, currentColor)'],
      ['background-color', 'var(--tinyrack-surface, transparent)'],
      ['border-color', 'var(--tinyrack-border, currentColor)'],
      [
        'border-width',
        `var(--tinyrack-switch-border-width, ${tinyrackSwitchContract.borderWidth})`,
      ],
      [
        'border-radius',
        `var(--tinyrack-switch-radius, ${tinyrackSwitchContract.radius})`,
      ],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-surface-raised, currentColor)'],
    ]),
    createBlock(checkedSelector, [
      ['--input-color', 'var(--tinyrack-primary, currentColor)'],
      ['background-color', 'var(--tinyrack-primary, currentColor)'],
      ['border-color', 'var(--tinyrack-primary, currentColor)'],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackSwitchContract.sizes[size];
      const height = `var(--tinyrack-switch-height-${size}, ${tokens.height})`;

      return createBlock(`.toggle-${size}`, [
        ['--size', height],
        ['--toggle-p', `calc(${height} * 0.125)`],
        ['height', height],
        [
          'width',
          `calc((${height} * 2) - (var(--tinyrack-switch-border-width, ${tinyrackSwitchContract.borderWidth}) + var(--toggle-p)) * 2)`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiSurfaceParityCss() {
  const blocks = [
    createBlock('.alert', [
      ['background-color', 'var(--tinyrack-surface-muted, var(--color-base-200))'],
      ['border-color', 'var(--tinyrack-border, var(--color-base-200))'],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['font-size', `var(--tinyrack-text-sm, ${tinyrackTypography.fontSize.sm})`],
      [
        'line-height',
        `var(--tinyrack-leading-md, ${tinyrackTypography.lineHeight.md})`,
      ],
      ['padding', `${tinyrackSpacing.md} ${tinyrackSpacing.lg}`],
    ]),
    createBlock('.card', [
      ['background-color', 'var(--tinyrack-surface, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-border)',
      ],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
    ]),
    createBlock('.card-body', [
      ['gap', tinyrackSpacing.sm],
      ['padding', tinyrackSpacing.lg],
    ]),
    createBlock('.divider', [
      ['--divider-color', 'var(--tinyrack-border, var(--color-base-content))'],
      ['color', 'var(--tinyrack-text-muted, var(--color-base-content))'],
      ['font-size', `var(--tinyrack-text-xs, ${tinyrackTypography.fontSize.xs})`],
    ]),
    createBlock('.fieldset', [
      ['background-color', 'var(--tinyrack-surface, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-border)',
      ],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['padding', tinyrackSpacing.lg],
    ]),
    createBlock('.fieldset-legend', [
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
    ]),
    createBlock('.progress', [
      ['background-color', 'var(--tinyrack-surface-muted, var(--color-base-300))'],
      ['border-radius', 'var(--tinyrack-progress-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-primary, var(--color-primary))'],
      ['height', 'var(--tinyrack-progress-size-md, 0.5rem)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackProgressContract.sizes[size];

      return createBlock(`.progress-${size}`, [
        ['height', `var(--tinyrack-progress-size-${size}, ${tokens.size})`],
      ]);
    }),
    createBlock('.skeleton', [
      ['background-color', 'var(--tinyrack-surface-muted, var(--color-base-300))'],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
    ]),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiVisualStatusParityCss() {
  const blocks = [
    createBlock('.avatar > div', [
      ['background-color', 'var(--tinyrack-avatar-background, var(--color-base-200))'],
      [
        'border',
        'var(--tinyrack-avatar-border-width, 1px) solid var(--tinyrack-border)',
      ],
      ['border-radius', 'var(--tinyrack-avatar-radius, 9999px)'],
      ['color', 'var(--tinyrack-avatar-color, var(--color-base-content))'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackAvatarContract.sizes[size];
      const avatarSize = `var(--tinyrack-avatar-size-${size}, ${tokens.size})`;

      return createBlock(`.avatar-${size} > div`, [
        ['font-size', `calc(${avatarSize} / 2.5)`],
        ['height', avatarSize],
        ['width', avatarSize],
      ]);
    }),
    createBlock('.indicator .indicator-item', [
      ['align-items', 'center'],
      [
        'background-color',
        'var(--tinyrack-indicator-background, var(--color-primary))',
      ],
      ['border-radius', 'var(--tinyrack-indicator-radius, 9999px)'],
      ['color', 'var(--tinyrack-indicator-color, var(--color-primary-content))'],
      ['display', 'flex'],
      ['font-size', `var(--tinyrack-text-xs, ${tinyrackTypography.fontSize.xs})`],
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
      ['justify-content', 'center'],
      ['line-height', '1'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackIndicatorContract.sizes[size];
      const indicatorSize = `var(--tinyrack-indicator-size-${size}, ${tokens.size})`;

      return createBlock(`.indicator-${size} .indicator-item`, [
        ['height', indicatorSize],
        ['min-width', indicatorSize],
        ['padding-inline', `calc(${indicatorSize} / 3)`],
      ]);
    }),
    createBlock('.loading', [
      ['background-color', 'var(--tinyrack-loader-color, currentColor)'],
      ['color', 'var(--tinyrack-loader-color, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackLoaderContract.sizes[size];
      const loaderSize = `var(--tinyrack-loader-size-${size}, ${tokens.height})`;

      return createBlock(`.loading-${size}`, [
        ['height', loaderSize],
        ['width', loaderSize],
      ]);
    }),
    createBlock('.rating', [
      ['color', 'var(--tinyrack-rating-color, var(--color-primary))'],
    ]),
    createBlock('.rating > *', [
      ['background-color', 'var(--tinyrack-rating-color, var(--color-primary))'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRatingContract.sizes[size];
      const ratingSize = `var(--tinyrack-rating-size-${size}, ${tokens.height})`;

      return createBlock(`.rating-${size}`, [['--size', ratingSize]]);
    }),
    createBlock('.radial-progress', [
      ['color', 'var(--tinyrack-radial-progress-color, var(--color-primary))'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRadialProgressContract.sizes[size];

      return createBlock(`.radial-progress-${size}`, [
        ['--size', `var(--tinyrack-radial-progress-size-${size}, ${tokens.size})`],
        [
          '--thickness',
          `var(--tinyrack-radial-progress-thickness-${size}, ${tokens.thickness})`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiNavigationDataParityCss() {
  const blocks = [
    createBlock('.breadcrumbs', [
      ['color', 'var(--tinyrack-breadcrumbs-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-breadcrumbs-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
      [
        'line-height',
        `var(--tinyrack-leading-md, ${tinyrackTypography.lineHeight.md})`,
      ],
    ]),
    createBlock('.breadcrumbs > :is(menu, ul, ol) > li > *', [
      ['color', 'inherit'],
      ['gap', `var(--tinyrack-breadcrumbs-gap, ${tinyrackSpacing.sm})`],
    ]),
    createBlock('.breadcrumbs > :is(menu, ul, ol) > li + li::before', [
      ['border-color', 'var(--tinyrack-breadcrumbs-separator-color)'],
      ['color', 'var(--tinyrack-breadcrumbs-separator-color)'],
      ['margin-inline-start', `var(--tinyrack-breadcrumbs-gap, ${tinyrackSpacing.sm})`],
      ['margin-inline-end', `var(--tinyrack-breadcrumbs-gap, ${tinyrackSpacing.sm})`],
      ['opacity', '1'],
    ]),
    createBlock('.list', [
      ['background-color', 'var(--tinyrack-list-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-list-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-list-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-list-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-list-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
      [
        'line-height',
        `var(--tinyrack-list-line-height, ${tinyrackTypography.lineHeight.md})`,
      ],
      ['padding', 'var(--tinyrack-list-gap, 0.5rem)'],
    ]),
    createBlock('.list .list-row', [
      ['border-radius', 'var(--tinyrack-control-radius, var(--radius-field))'],
      ['gap', 'var(--tinyrack-list-gap, 0.5rem)'],
      ['padding', 'var(--tinyrack-list-padding, 0.75rem)'],
    ]),
    createBlock('.list > .list-row:not(:last-child)::after', [
      ['border-color', 'var(--tinyrack-list-divider-color)'],
    ]),
    createBlock('.table', [
      ['--table-border-color', 'var(--tinyrack-table-border-color)'],
      ['--table-hover-color', 'var(--tinyrack-table-hover-color)'],
      ['--table-striped-color', 'var(--tinyrack-table-striped-color)'],
      ['border-color', 'var(--tinyrack-table-border-color)'],
      ['border-radius', 'var(--tinyrack-table-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-table-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-table-font-size-md, ${tinyrackTableContract.sizes.md.fontSize})`,
      ],
    ]),
    createBlock('.table :where(th, td)', [
      [
        'padding-inline',
        `var(--tinyrack-table-padding-x-md, ${tinyrackTableContract.sizes.md.paddingX})`,
      ],
      [
        'padding-block',
        `var(--tinyrack-table-padding-y-md, ${tinyrackTableContract.sizes.md.paddingY})`,
      ],
    ]),
    createBlock('.table :where(thead, tfoot)', [
      ['color', 'var(--tinyrack-table-header-color, var(--color-base-content))'],
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
    ]),
    createBlock('.table-zebra tbody tr:nth-child(even)', [
      ['background-color', 'var(--tinyrack-table-striped-color)'],
    ]),
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackTableContract.sizes[size];

      return [
        createBlock(`.table-${size} :not(thead, tfoot) tr`, [
          ['font-size', `var(--tinyrack-table-font-size-${size}, ${tokens.fontSize})`],
        ]),
        createBlock(`.table-${size} :where(th, td)`, [
          [
            'padding-inline',
            `var(--tinyrack-table-padding-x-${size}, ${tokens.paddingX})`,
          ],
          [
            'padding-block',
            `var(--tinyrack-table-padding-y-${size}, ${tokens.paddingY})`,
          ],
        ]),
      ];
    }),
    createBlock('.tabs', [
      ['color', 'var(--tinyrack-tabs-color, var(--color-base-content))'],
    ]),
    createBlock('.tabs-box', [
      ['background-color', 'var(--tinyrack-tabs-background, var(--color-base-200))'],
      ['border-radius', 'calc(var(--tinyrack-tabs-radius) + 0.25rem)'],
      ['box-shadow', 'none'],
    ]),
    createBlock('.tabs > .tab', [
      ['--tab-bg', 'var(--tinyrack-tabs-active-background)'],
      ['--tab-border-color', 'var(--tinyrack-tabs-border-color)'],
      ['border-radius', 'var(--tinyrack-tabs-radius, var(--radius-field))'],
      ['color', 'var(--tinyrack-tabs-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-tabs-font-size-md, ${tinyrackTabsContract.sizes.md.fontSize})`,
      ],
      [
        'height',
        `var(--tinyrack-tabs-height-md, ${tinyrackTabsContract.sizes.md.height})`,
      ],
      [
        'padding-inline',
        `var(--tinyrack-tabs-padding-x-md, ${tinyrackTabsContract.sizes.md.paddingX})`,
      ],
    ]),
    createBlock(
      '.tabs > .tab:is(.tab-active, [aria-selected="true"], [aria-current="true"], [aria-current="page"])',
      [
        ['background-color', 'var(--tinyrack-tabs-active-background)'],
        ['color', 'var(--tinyrack-tabs-active-color)'],
      ],
    ),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackTabsContract.sizes[size];

      return createBlock(`.tabs-${size}`, [
        ['--tab-height', `var(--tinyrack-tabs-height-${size}, ${tokens.height})`],
        ['--tab-p', `var(--tinyrack-tabs-padding-x-${size}, ${tokens.paddingX})`],
      ]);
    }),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackTabsContract.sizes[size];

      return createBlock(`.tabs-${size} > .tab`, [
        ['font-size', `var(--tinyrack-tabs-font-size-${size}, ${tokens.fontSize})`],
        ['height', `var(--tinyrack-tabs-height-${size}, ${tokens.height})`],
        [
          'padding-inline',
          `var(--tinyrack-tabs-padding-x-${size}, ${tokens.paddingX})`,
        ],
      ]);
    }),
    createBlock('.timeline :where(hr)', [
      [
        'background-color',
        'var(--tinyrack-timeline-line-color, var(--color-base-300))',
      ],
      ['height', 'var(--tinyrack-timeline-line-width, 0.375rem)'],
    ]),
    createBlock('.timeline .timeline-middle', [
      ['color', 'var(--tinyrack-timeline-active-color, var(--color-primary))'],
    ]),
    createBlock('.timeline-box', [
      [
        'background-color',
        'var(--tinyrack-timeline-bullet-background, var(--color-base-100))',
      ],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-timeline-line-color)',
      ],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['box-shadow', 'none'],
      [
        'font-size',
        `var(--tinyrack-timeline-title-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
    ]),
    createBlock('.steps', [
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-stepper-font-size-md, ${tinyrackStepperContract.sizes.md.fontSize})`,
      ],
    ]),
    createBlock('.steps .step', [
      ['--step-bg', 'var(--tinyrack-stepper-inactive-color, var(--color-base-300))'],
      [
        '--step-fg',
        'var(--tinyrack-stepper-inactive-text-color, var(--color-base-content))',
      ],
    ]),
    createBlock('.steps .step::before', [
      [
        'height',
        `var(--tinyrack-stepper-line-width-md, ${tinyrackStepperContract.sizes.md.lineWidth})`,
      ],
    ]),
    createBlock(
      '.steps .step > .step-icon, .steps .step:not(:has(.step-icon))::after',
      [
        [
          'border-radius',
          `var(--tinyrack-stepper-radius, ${tinyrackStepperContract.radius})`,
        ],
        [
          'height',
          `var(--tinyrack-stepper-icon-size-md, ${tinyrackStepperContract.sizes.md.iconSize})`,
        ],
        [
          'width',
          `var(--tinyrack-stepper-icon-size-md, ${tinyrackStepperContract.sizes.md.iconSize})`,
        ],
      ],
    ),
    createBlock('.steps .step-primary', [
      ['--step-bg', 'var(--tinyrack-stepper-active-color, var(--color-primary))'],
      [
        '--step-fg',
        'var(--tinyrack-stepper-active-text-color, var(--color-primary-content))',
      ],
    ]),
    createBlock('.range', [
      ['--range-bg', 'var(--tinyrack-range-track-color, var(--color-base-300))'],
      ['--range-progress', 'var(--tinyrack-range-color, currentColor)'],
      ['--range-thumb', 'var(--tinyrack-range-thumb-color, var(--color-base-100))'],
      [
        '--range-thumb-size',
        `var(--tinyrack-range-thumb-size-md, ${tinyrackRangeContract.sizes.md.thumbSize})`,
      ],
      ['border-radius', 'var(--tinyrack-range-radius, var(--radius-selector))'],
      ['color', 'var(--tinyrack-range-color, var(--color-primary))'],
    ]),
    createBlock('.range:focus-visible', [
      ['outline-color', 'var(--tinyrack-range-focus-color, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRangeContract.sizes[size];

      return createBlock(`.range-${size}`, [
        [
          '--range-thumb-size',
          `var(--tinyrack-range-thumb-size-${size}, ${tokens.thumbSize})`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiOverlayParityCss() {
  const menuItemSelector =
    '.menu :where(li:not(.menu-title) > *:not(ul, menu, details, .menu-title, .btn)), .menu :where(li:not(.menu-title) > details > summary:not(.menu-title))';
  const menuActiveSelector =
    '.menu :where(li > *:not(ul, menu, .menu-title, details, .btn):active, li > *:not(ul, menu, .menu-title, details, .btn).menu-active, li > details > summary:active), :where(:not(ul, menu, details, .menu-title, .btn)).menu-active';

  const blocks = [
    createBlock('.menu, .dropdown-content.menu', [
      ['--menu-active-bg', 'var(--tinyrack-menu-active-background)'],
      ['--menu-active-fg', 'var(--tinyrack-menu-active-color)'],
      ['background-color', 'var(--tinyrack-menu-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-menu-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-menu-radius, var(--radius-box))'],
      ['box-shadow', 'var(--tinyrack-menu-shadow, none)'],
      ['color', 'var(--tinyrack-menu-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-menu-font-size-md, ${tinyrackMenuContract.sizes.md.fontSize})`,
      ],
      ['padding', 'var(--tinyrack-menu-padding, 0.5rem)'],
    ]),
    createBlock(menuItemSelector, [
      ['border-radius', 'var(--tinyrack-menu-item-radius, var(--radius-field))'],
      [
        'padding-inline',
        `var(--tinyrack-menu-padding-x-md, ${tinyrackMenuContract.sizes.md.paddingX})`,
      ],
      [
        'padding-block',
        `var(--tinyrack-menu-padding-y-md, ${tinyrackMenuContract.sizes.md.paddingY})`,
      ],
      [
        'font-size',
        `var(--tinyrack-menu-font-size-md, ${tinyrackMenuContract.sizes.md.fontSize})`,
      ],
    ]),
    createBlock(`${menuItemSelector}:hover, ${menuItemSelector}:focus-visible`, [
      ['background-color', 'var(--tinyrack-menu-hover-background)'],
      ['color', 'var(--tinyrack-menu-color)'],
    ]),
    createBlock(menuActiveSelector, [
      ['background-color', 'var(--tinyrack-menu-active-background)'],
      ['color', 'var(--tinyrack-menu-active-color)'],
    ]),
    createBlock('.menu li:empty, .menu .menu-divider', [
      ['background-color', 'var(--tinyrack-menu-divider-color)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackMenuContract.sizes[size];

      return createBlock(`.menu-${size}`, [
        ['font-size', `var(--tinyrack-menu-font-size-${size}, ${tokens.fontSize})`],
      ]);
    }),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackMenuContract.sizes[size];

      return createBlock(
        `.menu-${size} :where(li:not(.menu-title) > *:not(ul, menu, details, .menu-title)), .menu-${size} :where(li:not(.menu-title) > details > summary:not(.menu-title))`,
        [
          ['font-size', `var(--tinyrack-menu-font-size-${size}, ${tokens.fontSize})`],
          [
            'padding-inline',
            `var(--tinyrack-menu-padding-x-${size}, ${tokens.paddingX})`,
          ],
          [
            'padding-block',
            `var(--tinyrack-menu-padding-y-${size}, ${tokens.paddingY})`,
          ],
        ],
      );
    }),
    createBlock('.modal.modal-open, .modal[open], .modal:target', [
      ['background-color', 'var(--tinyrack-overlay-scrim-color)'],
    ]),
    createBlock('.modal-box', [
      ['background-color', 'var(--tinyrack-overlay-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-overlay-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-overlay-radius, var(--radius-box))'],
      ['box-shadow', 'var(--tinyrack-overlay-shadow, none)'],
      ['color', 'var(--tinyrack-overlay-color, var(--color-base-content))'],
      ['padding', 'var(--tinyrack-overlay-padding, 1rem)'],
    ]),
    createBlock('.drawer-side > .drawer-overlay', [
      ['background-color', 'var(--tinyrack-overlay-scrim-color)'],
    ]),
    createBlock('.drawer-side > :not(.drawer-overlay)', [
      ['background-color', 'var(--tinyrack-overlay-background, var(--color-base-100))'],
      [
        'border-inline-end',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-overlay-border-color)',
      ],
      ['box-shadow', 'var(--tinyrack-overlay-shadow, none)'],
      ['color', 'var(--tinyrack-overlay-color, var(--color-base-content))'],
    ]),
    createBlock('.collapse', [
      ['background-color', 'var(--tinyrack-overlay-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-overlay-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-overlay-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-overlay-color, var(--color-base-content))'],
    ]),
    createBlock('.collapse-title', [
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
    ]),
    createBlock('.tooltip', [
      ['--tt-bg', 'var(--tinyrack-tooltip-background, var(--color-primary))'],
    ]),
    createBlock('.tooltip > .tooltip-content, .tooltip[data-tip]::before', [
      ['background-color', 'var(--tinyrack-tooltip-background, var(--color-primary))'],
      ['border-radius', 'var(--tinyrack-tooltip-radius, var(--radius-field))'],
      ['color', 'var(--tinyrack-tooltip-color, var(--color-primary-content))'],
      [
        'font-size',
        `var(--tinyrack-tooltip-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
      [
        'line-height',
        `var(--tinyrack-tooltip-line-height, ${tinyrackTypography.lineHeight.sm})`,
      ],
      ['padding-inline', `var(--tinyrack-tooltip-padding-x, ${tinyrackSpacing.sm})`],
      ['padding-block', `var(--tinyrack-tooltip-padding-y, ${tinyrackSpacing.xs})`],
    ]),
    createBlock('.tooltip::after', [
      ['background-color', 'var(--tinyrack-tooltip-background, var(--color-primary))'],
    ]),
  ];

  return blocks.join('\n\n');
}

export function createTinyrackDaisyUiThemeCss() {
  return createFile(
    createDaisyUiThemeBlock(tinyrackDaisyUiThemes.light),
    createDaisyUiThemeBlock(tinyrackDaisyUiThemes.dark),
    createTinyrackDaisyUiButtonParityCss(),
    createTinyrackDaisyUiFormControlParityCss(),
    createTinyrackDaisyUiBadgeParityCss(),
    createTinyrackDaisyUiKbdParityCss(),
    createTinyrackDaisyUiSelectionControlParityCss(),
    createTinyrackDaisyUiSwitchParityCss(),
    createTinyrackDaisyUiSurfaceParityCss(),
    createTinyrackDaisyUiVisualStatusParityCss(),
    createTinyrackDaisyUiNavigationDataParityCss(),
    createTinyrackDaisyUiOverlayParityCss(),
  );
}

function createDaisyUiPluginThemeLine(
  theme: (typeof tinyrackDaisyUiThemes)[SemanticMode],
  index: number,
  total: number,
) {
  const flags = [
    theme.isDefault ? '--default' : undefined,
    theme.prefersDark ? '--prefersdark' : undefined,
  ].filter(Boolean);
  const suffix = flags.length > 0 ? ` ${flags.join(' ')}` : '';
  const terminator = index === total - 1 ? ';' : ',';

  return `    ${theme.name}${suffix}${terminator}`;
}

export function createTinyrackTailwindDaisyUiCss() {
  const themes = Object.values(tinyrackDaisyUiThemes);

  return createFile(
    '@import "./theme.css";',
    '@import "../daisyui/theme.css";',
    `@plugin "daisyui" {\n  themes:\n${themes
      .map((theme, index) => createDaisyUiPluginThemeLine(theme, index, themes.length))
      .join('\n')}\n}`,
    createTinyrackDaisyUiButtonParityCss(),
    createTinyrackDaisyUiFormControlParityCss(),
    createTinyrackDaisyUiBadgeParityCss(),
    createTinyrackDaisyUiKbdParityCss(),
    createTinyrackDaisyUiSelectionControlParityCss(),
    createTinyrackDaisyUiSwitchParityCss(),
    createTinyrackDaisyUiSurfaceParityCss(),
    createTinyrackDaisyUiVisualStatusParityCss(),
    createTinyrackDaisyUiNavigationDataParityCss(),
    createTinyrackDaisyUiOverlayParityCss(),
  );
}
