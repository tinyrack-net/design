import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  tinyrackBorders,
  tinyrackControlMetrics,
  tinyrackMotion,
  tinyrackOpacity,
  tinyrackRadii,
  tinyrackSemanticColors,
  tinyrackShadows,
  tinyrackSpacing,
  tinyrackTypography,
} from './index.js';

const repoRoot = process.cwd();
const coreCss = readFileSync(join(repoRoot, 'src/core/core.css'), 'utf8');

const textLineHeights = {
  '2xs': 'sm',
  xs: 'sm',
  sm: 'md',
  md: 'md',
  lg: 'md',
  xl: 'sm',
  '2xl': 'sm',
  '3xl': 'sm',
  '4xl': 'sm',
  '5xl': 'sm',
} as const satisfies Record<
  keyof typeof tinyrackTypography.fontSize,
  keyof typeof tinyrackTypography.lineHeight
>;

function camelToKebab(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function tokenDeclarations(values: Record<string, string | number>, prefix: string) {
  return Object.fromEntries(
    Object.entries(values).map(([name, value]) => [
      `--${prefix}-${camelToKebab(name)}`,
      String(value),
    ]),
  );
}

function tokenReferences(
  names: readonly string[],
  publicPrefix: string,
  runtimePrefix: string,
) {
  return Object.fromEntries(
    names.map((name) => [
      `--${publicPrefix}-${camelToKebab(name)}`,
      `var(--${runtimePrefix}-${camelToKebab(name)})`,
    ]),
  );
}

function parseCssBlocks(css: string) {
  const source = css.replaceAll(/\/\*[\s\S]*?\*\//g, '').trim();
  const blocks = new Map<string, string>();
  let cursor = 0;

  while (cursor < source.length) {
    const openBrace = source.indexOf('{', cursor);
    if (openBrace === -1) {
      throw new Error(`Unexpected CSS after the final block: ${source.slice(cursor)}`);
    }

    const header = source.slice(cursor, openBrace).trim();
    let depth = 1;
    let closeBrace = openBrace + 1;

    while (closeBrace < source.length && depth > 0) {
      if (source[closeBrace] === '{') {
        depth += 1;
      } else if (source[closeBrace] === '}') {
        depth -= 1;
      }
      closeBrace += 1;
    }

    if (depth !== 0) {
      throw new Error(`Unclosed CSS block: ${header}`);
    }
    if (blocks.has(header)) {
      throw new Error(`Duplicate CSS block: ${header}`);
    }

    blocks.set(header, source.slice(openBrace + 1, closeBrace - 1));
    cursor = closeBrace;
    while (/\s/.test(source[cursor] ?? '')) {
      cursor += 1;
    }
  }

  return blocks;
}

function parseDeclarations(block: string, header: string) {
  const declarations = new Map<string, string>();

  for (const line of block.split(/\r?\n/)) {
    const declaration = line.trim();
    if (declaration.length === 0) {
      continue;
    }

    const match = /^(--[a-z0-9-]+):\s*(.+);$/.exec(declaration);
    if (!match) {
      throw new Error(`Unexpected declaration in ${header}: ${declaration}`);
    }

    const [, name, value] = match;
    if (!name || !value) {
      throw new Error(`Invalid declaration in ${header}: ${declaration}`);
    }
    if (declarations.has(name)) {
      throw new Error(`Duplicate declaration in ${header}: ${name}`);
    }

    declarations.set(name, value);
  }

  return Object.fromEntries(declarations);
}

const cssBlocks = parseCssBlocks(coreCss);

function declarationsFor(header: string) {
  const block = cssBlocks.get(header);
  if (block === undefined) {
    throw new Error(`Missing CSS block: ${header}`);
  }
  return parseDeclarations(block, header);
}

describe('core.css source contract', () => {
  it('is a source-owned core stylesheet with only the public token blocks', () => {
    expect(coreCss).not.toContain('Generated from');
    expect(coreCss).not.toContain('.tr-btn');
    expect(coreCss).not.toContain('.tr-table');
    expect(coreCss).not.toContain('daisyui');
    expect(coreCss).not.toContain('mantine');
    expect(coreCss).not.toContain('starlight');
    expect([...cssBlocks.keys()]).toEqual([
      '@theme static',
      ':root',
      '[data-theme="tinyrack-light"]',
      '[data-theme="tinyrack-dark"]',
    ]);
  });

  it('matches every root foundation variable to its TypeScript token', () => {
    const controlDeclarations = Object.fromEntries(
      Object.entries(tinyrackControlMetrics).flatMap(([size, metrics]) => [
        [`--tinyrack-control-height-${size}`, metrics.height],
        [`--tinyrack-control-padding-inline-${size}`, metrics.paddingInline],
        [`--tinyrack-control-gap-${size}`, metrics.gap],
        [
          `--tinyrack-control-font-size-${size}`,
          `var(--tinyrack-text-${metrics.fontSize})`,
        ],
        [`--tinyrack-control-line-height-${size}`, metrics.lineHeight],
      ]),
    );

    expect(declarationsFor(':root')).toEqual({
      ...tokenDeclarations(tinyrackTypography.fontStack, 'tinyrack-font'),
      ...tokenDeclarations(tinyrackTypography.fontSize, 'tinyrack-text'),
      ...tokenDeclarations(tinyrackTypography.lineHeight, 'tinyrack-leading'),
      ...tokenDeclarations(tinyrackTypography.letterSpacing, 'tinyrack-tracking'),
      ...tokenDeclarations(tinyrackTypography.fontWeight, 'tinyrack-weight'),
      ...tokenDeclarations(tinyrackSpacing, 'tinyrack-space'),
      ...tokenDeclarations(tinyrackRadii, 'tinyrack-radius'),
      ...tokenDeclarations(tinyrackBorders.width, 'tinyrack-border-width'),
      '--tinyrack-focus-width': tinyrackBorders.focus.width,
      '--tinyrack-focus-offset': tinyrackBorders.focus.offset,
      ...tokenDeclarations(tinyrackShadows, 'tinyrack-shadow'),
      ...tokenDeclarations(tinyrackMotion.duration, 'tinyrack-duration'),
      '--tinyrack-ease-standard': tinyrackMotion.easing.standard,
      '--tinyrack-ease-out': tinyrackMotion.easing.easeOut,
      '--tinyrack-ease-linear': tinyrackMotion.easing.linear,
      ...tokenDeclarations(tinyrackOpacity, 'tinyrack-opacity'),
      ...controlDeclarations,
    });
  });

  it('matches every light and dark semantic variable to TypeScript', () => {
    for (const theme of ['light', 'dark'] as const) {
      expect(declarationsFor(`[data-theme="tinyrack-${theme}"]`)).toEqual(
        tokenDeclarations(tinyrackSemanticColors[theme], 'tinyrack'),
      );
    }
  });

  it('matches the complete Tailwind token bridge to TypeScript', () => {
    const textDeclarations = Object.fromEntries(
      Object.keys(tinyrackTypography.fontSize).flatMap((name) => [
        [`--text-tinyrack-${name}`, `var(--tinyrack-text-${name})`],
        [
          `--text-tinyrack-${name}--line-height`,
          `var(--tinyrack-leading-${textLineHeights[name as keyof typeof textLineHeights]})`,
        ],
      ]),
    );

    expect(declarationsFor('@theme static')).toEqual({
      ...tokenDeclarations(tinyrackTypography.fontFamily, 'font-tinyrack'),
      ...textDeclarations,
      ...tokenReferences(
        Object.keys(tinyrackTypography.lineHeight),
        'leading-tinyrack',
        'tinyrack-leading',
      ),
      ...tokenReferences(
        Object.keys(tinyrackTypography.letterSpacing),
        'tracking-tinyrack',
        'tinyrack-tracking',
      ),
      ...tokenReferences(
        Object.keys(tinyrackTypography.fontWeight),
        'font-weight-tinyrack',
        'tinyrack-weight',
      ),
      ...tokenReferences(
        Object.keys(tinyrackSpacing),
        'spacing-tinyrack',
        'tinyrack-space',
      ),
      ...tokenReferences(
        Object.keys(tinyrackRadii),
        'radius-tinyrack',
        'tinyrack-radius',
      ),
      ...tokenReferences(
        Object.keys(tinyrackShadows),
        'shadow-tinyrack',
        'tinyrack-shadow',
      ),
      ...tokenReferences(
        Object.keys(tinyrackSemanticColors.light),
        'color-tinyrack',
        'tinyrack',
      ),
    });
    expect(declarationsFor('@theme static')).not.toHaveProperty(
      '--color-tinyrack-blue-700',
    );
    expect(coreCss).not.toMatch(/--tinyrack-(?:neutral|blue|green|amber|red)-\d+/);
  });
});
