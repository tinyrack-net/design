import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = process.cwd();

const publicStylePaths = [
  ...readdirSync(join(process.cwd(), 'src/components'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `src/components/${entry.name}/${entry.name}.css`)
    .filter((stylePath) => existsSync(join(process.cwd(), stylePath)))
    .filter((stylePath) => stylePath !== 'src/components/overlay/overlay.css')
    .sort(),
  'src/mdx/mdx.css',
] as const;

function sourceFilesUnder(root: string) {
  return readdirSync(root, { recursive: true })
    .filter(
      (entry): entry is string =>
        typeof entry === 'string' &&
        /\.(?:css|mdx|ts|tsx)$/.test(entry) &&
        statSync(join(root, entry)).isFile(),
    )
    .map((entry) => join(root, entry));
}

const basePaletteForbiddenPaths = [
  ...sourceFilesUnder(join(packageRoot, 'src', 'components')),
];

const forbiddenDeclarations = {
  'shared motion duration': /\b(?:120|160|180)ms\b/,
  'shared numeric radius': /border-radius:\s*(?:0?\.\d|[1-9]\d*(?:px|rem|em))/,
  'shared focus ring': /outline:\s*2px/,
  'shared state opacity': /opacity:\s*0\.(?:5|82)\s*;/,
  'literal box shadow': /box-shadow:\s*(?:#|rgb\(|\d)/,
  'literal font weight': /font-weight:\s*\d/,
  'literal semantic color':
    /^\s*(?:background(?:-color)?|border-color|color):\s*(?:#[0-9a-f]|rgb\()/im,
  'literal default border': /border(?:-(?:top|right|bottom|left))?:\s*1px/,
} as const;

const directDesignLiteral =
  /(?:#[0-9a-f]{3,8}\b|rgb\(|\b\d*\.?\d+(?:px|rem|em|ch|ms|s)\b|\b0?\.\d+(?!%)\b)/i;
const componentTokenDesignLiteral =
  /(?:\b[1-9]\d*(?:\.\d+)?(?:px|rem|em|ch|ms|s)\b|\b0?\.\d+(?!%|turn|deg)\b)/i;

const coreCss = readFileSync(join(process.cwd(), 'src/core/core.css'), 'utf8');
const declaredGlobalTokens = new Set(
  Array.from(coreCss.matchAll(/^\s*(--tinyrack-[a-z0-9-]+):/gm), ([, token]) => token),
);

describe('public CSS token usage', () => {
  it('routes shared visual decisions through global or component tokens', () => {
    for (const stylePath of publicStylePaths) {
      const css = readFileSync(join(process.cwd(), stylePath), 'utf8');

      expect(css, `${stylePath} must consume Tinyrack tokens`).toContain(
        'var(--tinyrack-',
      );

      for (const [label, pattern] of Object.entries(forbiddenDeclarations)) {
        expect(css, `${stylePath} contains ${label}`).not.toMatch(pattern);
      }
    }
  });

  it('keeps design literals inside token declarations', () => {
    for (const stylePath of publicStylePaths) {
      const css = readFileSync(join(process.cwd(), stylePath), 'utf8');

      for (const [index, line] of css.split(/\r?\n/).entries()) {
        const declaration = line.trim();
        if (
          declaration.length === 0 ||
          declaration.startsWith('@') ||
          declaration.startsWith('/*') ||
          declaration.startsWith('*')
        ) {
          continue;
        }

        if (declaration.startsWith('--') && stylePath.startsWith('src/components/')) {
          expect(
            declaration,
            `${stylePath}:${index + 1} component tokens must fall back to foundation tokens`,
          ).not.toMatch(componentTokenDesignLiteral);
          continue;
        }
        if (declaration.startsWith('--')) continue;

        expect(
          declaration,
          `${stylePath}:${index + 1} must use a Tinyrack or component token`,
        ).not.toMatch(directDesignLiteral);
      }
    }
  });

  it('keeps generated theme declarations out of component-owned CSS', () => {
    for (const stylePath of publicStylePaths) {
      const css = readFileSync(join(process.cwd(), stylePath), 'utf8');

      expect(css).not.toContain('@theme static');
      expect(css).not.toContain('[data-theme="tinyrack-light"]');
      expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    }
  });

  it('keeps Base palette imports out of components and product examples', () => {
    for (const sourcePath of basePaletteForbiddenPaths) {
      const source = readFileSync(sourcePath, 'utf8');
      expect(
        source,
        `${relative(packageRoot, sourcePath)} must consume functional colors`,
      ).not.toContain('tinyrackPalettes');
    }
  });

  it('only references global Tinyrack tokens that core.css declares', () => {
    for (const stylePath of publicStylePaths) {
      const css = readFileSync(join(process.cwd(), stylePath), 'utf8');
      const references = Array.from(
        css.matchAll(/var\((--tinyrack-[a-z0-9-]+)/g),
        ([, token]) => token,
      );

      for (const token of references) {
        expect(
          declaredGlobalTokens,
          `${stylePath} references unknown ${token}`,
        ).toContain(token);
      }
    }
  });

  it('maps interaction, status, and inverse roles to their intended tokens', () => {
    const button = readFileSync(
      join(process.cwd(), 'src/components/button/button.css'),
      'utf8',
    );
    const combobox = readFileSync(
      join(process.cwd(), 'src/components/combobox/combobox.css'),
      'utf8',
    );
    const menu = readFileSync(
      join(process.cwd(), 'src/components/menu/menu.css'),
      'utf8',
    );
    const table = readFileSync(
      join(process.cwd(), 'src/components/table/table.css'),
      'utf8',
    );
    const toast = readFileSync(
      join(process.cwd(), 'src/components/toast/toast.css'),
      'utf8',
    );
    const tooltip = readFileSync(
      join(process.cwd(), 'src/components/tooltip/tooltip.css'),
      'utf8',
    );

    expect(button).toContain('--tr-btn-hover-background');
    expect(button).toContain('var(--_tr-btn-variant-surface-hover)');
    expect(button).toContain('--tr-btn-pressed-background');
    expect(button).toContain('var(--_tr-btn-variant-surface-pressed)');
    expect(combobox).toContain('background: var(--tinyrack-surface-hover);');
    expect(menu).toContain('background: var(--tinyrack-surface-hover);');
    expect(table).toContain('var(--tr-table-row-hover, var(--tinyrack-surface-hover))');
    expect(table).toContain(
      'var(--tr-table-row-striped, var(--tinyrack-surface-muted))',
    );
    for (const status of ['info', 'success', 'warning', 'danger']) {
      expect(toast).toContain(`--_tr-toast-accent: var(--tinyrack-${status}-border);`);
    }
    expect(tooltip).toContain(
      '--_tr-tooltip-background: var(--tinyrack-surface-inverse);',
    );
    expect(tooltip).toContain('--_tr-tooltip-color: var(--tinyrack-text-inverse);');

    const alertContract = readFileSync(
      join(process.cwd(), 'src/components/alert/alert-root.tsx'),
      'utf8',
    );
    const alertStyles = readFileSync(
      join(process.cwd(), 'src/components/alert/alert.css'),
      'utf8',
    );
    const badgeContract = readFileSync(
      join(process.cwd(), 'src/components/badge/badge.tsx'),
      'utf8',
    );
    const field = readFileSync(
      join(process.cwd(), 'src/components/field/field.css'),
      'utf8',
    );
    const pinInput = readFileSync(
      join(process.cwd(), 'src/components/otp-field/otp-field.css'),
      'utf8',
    );
    const statusVariants = [
      "'neutral'",
      "'info'",
      "'success'",
      "'warning'",
      "'danger'",
    ];

    for (const contract of [alertContract, badgeContract]) {
      for (const variant of statusVariants) {
        expect(contract).toContain(variant);
      }
      expect(contract).not.toContain("'primary'");
    }
    for (const status of ['info', 'success', 'warning', 'danger']) {
      expect(alertStyles).toContain(
        `--_tr-alert-background: var(--tinyrack-${status}-surface-subtle);`,
      );
    }
    expect(field).toContain('border-color: var(--tinyrack-danger-border);');
    expect(pinInput).toContain('border-color: var(--tinyrack-danger-border);');
  });
});
