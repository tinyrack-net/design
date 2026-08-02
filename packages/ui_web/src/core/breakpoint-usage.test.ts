import { readdirSync, readFileSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageRoot = resolve(import.meta.dirname, '../..');
const sourceRoots = [resolve(packageRoot, 'src')];
const sourceExtensions = new Set(['.css', '.mdx', '.ts', '.tsx']);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (!sourceExtensions.has(extname(entry.name))) return [];
    if (/\.(?:browser\.)?test\.[cm]?[jt]sx?$/.test(entry.name)) return [];
    return [path];
  });
}

describe('breakpoint token usage', () => {
  it('keeps first-party responsive conditions on named tokens', () => {
    const violations: string[] = [];

    for (const file of sourceRoots.flatMap(sourceFiles)) {
      const source = readFileSync(file, 'utf8');
      if (
        file.endsWith('.css') &&
        source.includes('@variant') &&
        !source.includes('@reference')
      ) {
        violations.push(`${relative(packageRoot, file)}: missing @reference`);
      }
      const checks = [
        /@custom-media\b/g,
        /@media\s*\(\s*--tinyrack-breakpoint-/g,
        /@media\s*\(\s*(?:width|min-width|max-width)\s*[:<>=]/g,
        /matchMedia\(\s*['"][^'"]*(?:width|min-width|max-width)[^'"]*['"]\s*\)/g,
        /(?:min|max)-\[[^\]]+\]:/g,
        /\[@media[^\]]+\]:/g,
      ];

      for (const match of source.matchAll(/@variant\s+([^\s{]+)\s*\{/g)) {
        if (!/^(?:xs|sm|md|lg|xl|max-(?:xs|sm|md|lg|xl))$/.test(match[1] ?? '')) {
          violations.push(`${relative(packageRoot, file)}: ${match[0]}`);
        }
      }

      for (const pattern of checks) {
        for (const match of source.matchAll(pattern)) {
          violations.push(`${relative(packageRoot, file)}: ${match[0]}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
