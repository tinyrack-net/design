import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tinyrackBreakpoints } from '../../ui/src/core/tokens/breakpoints.js';
import {
  type TailwindTokenGroupId,
  tailwindTokenBridge,
  tailwindTokenGroups,
} from '../app/documentation/shared/tailwind-token-catalog.js';

const homepageRoot = process.cwd();
const coreCss = readFileSync(join(homepageRoot, '../ui/src/core/core.css'), 'utf8');
const docs = (['en', 'ko', 'ja'] as const).map((locale) => ({
  content: readFileSync(
    join(homepageRoot, `app/content/${locale}/foundations/tailwind.mdx`),
    'utf8',
  ),
  locale,
}));

function groupForThemeVariable(themeVariable: string): TailwindTokenGroupId {
  if (themeVariable.startsWith('--breakpoint-')) return 'breakpoint';
  if (themeVariable.startsWith('--color-')) return 'color';
  if (/^--(?:text-decoration-|text-underline-)/.test(themeVariable)) {
    return 'decoration';
  }
  if (/^--(?:font-|text-|leading-|tracking-|font-weight-)/.test(themeVariable)) {
    return 'typography';
  }
  if (themeVariable.startsWith('--spacing-')) return 'spacing';
  if (themeVariable.startsWith('--container-')) return 'container';
  if (/^--(?:border-width-|outline-)/.test(themeVariable)) return 'border-focus';
  if (/^--(?:radius-|shadow-)/.test(themeVariable)) return 'radius-shadow';
  if (/^--(?:transition-duration-|ease-)/.test(themeVariable)) return 'motion';
  if (/^--(?:opacity-|z-index-|scale-)/.test(themeVariable)) return 'visual-state';
  throw new Error(`Unclassified Tailwind theme variable: ${themeVariable}`);
}

function themeBridgeFromCss() {
  const theme = coreCss.match(
    /@theme static\s*\{([\s\S]*?)\r?\n\s*\}\r?\n\r?\n:root/,
  )?.[1];
  if (!theme) throw new Error('Could not find the @theme static block in core.css.');

  const declarations = [...theme.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map(
    ([, themeVariable]) => themeVariable,
  );
  const mappings = [...theme.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gm)].map(
    ([, themeVariable = '', value = '']) => {
      const group = groupForThemeVariable(themeVariable);
      if (group === 'breakpoint') {
        return {
          group,
          themeVariable,
          value,
        };
      }
      const runtimeVariable = /var\(\s*(--tinyrack-[a-z0-9-]+)\s*\)/.exec(value)?.[1];
      if (!runtimeVariable) {
        throw new Error(`Missing runtime variable for ${themeVariable}`);
      }
      return { group, runtimeVariable, themeVariable };
    },
  );

  return { declarations, mappings };
}

describe('Tailwind token documentation catalog', () => {
  it('documents every core.css Tailwind bridge declaration exactly once', () => {
    const { declarations, mappings } = themeBridgeFromCss();
    const documentedVariables = tailwindTokenBridge.map((entry) => entry.themeVariable);

    expect(new Set(declarations).size).toBe(declarations.length);
    expect(new Set(documentedVariables).size).toBe(documentedVariables.length);
    expect(mappings).toHaveLength(declarations.length);
    expect(tailwindTokenBridge).toEqual(mappings);
  });

  it('assigns every bridge entry to one unique documented group', () => {
    const groupIds = tailwindTokenGroups.map((group) => group.id);

    expect(new Set(groupIds).size).toBe(groupIds.length);
    expect(new Set(tailwindTokenGroups.map((group) => group.anchor)).size).toBe(
      tailwindTokenGroups.length,
    );
    expect(new Set(tailwindTokenBridge.map((entry) => entry.group))).toEqual(
      new Set(groupIds),
    );
    for (const entry of tailwindTokenBridge) {
      expect(entry.group).toBe(groupForThemeVariable(entry.themeVariable));
    }
  });

  it('matches breakpoint catalog values to public metadata', () => {
    expect(
      Object.fromEntries(
        tailwindTokenBridge.flatMap((entry) =>
          entry.group === 'breakpoint'
            ? [[entry.themeVariable.replace('--breakpoint-', ''), entry.value]]
            : [],
        ),
      ),
    ).toEqual(tinyrackBreakpoints);
  });

  it('keeps stable locale-parity headings derived from the catalog groups', () => {
    const expectedGroupAnchors = tailwindTokenGroups.map(({ anchor }) => anchor);

    for (const { content } of docs) {
      const declaredGroupAnchors = [
        ...content.matchAll(/\{ depth: 3, id: ([a-z-]+), label:/g),
      ].map(([, anchor]) => anchor);
      expect(declaredGroupAnchors).toEqual(expectedGroupAnchors);
      expect(content).toContain('order: 10');
    }
  });

  it('does not author fictitious responsive contracts or aliases', () => {
    for (const { content, locale } of docs) {
      expect(content, locale).not.toMatch(/@custom-media\b/);
      expect(content, locale).not.toMatch(/--tinyrack-breakpoint-[a-z0-9-]+-min\b/);
      expect(content, locale).not.toMatch(/\b(?:xs|sm|md|lg|xl)-at-most:/);
      expect(content, locale).not.toContain('--tr-layer-anchor-width');
    }
  });
});
