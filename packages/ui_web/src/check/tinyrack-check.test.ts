import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkTinyrackProject, formatTinyrackCheckResult } from './tinyrack-check.js';

const roots: string[] = [];

function project(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'tinyrack-web-check-'));
  roots.push(root);
  for (const [path, source] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), source);
  }
  return root;
}

afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  );
});

describe('Tinyrack Web project check', () => {
  it('accepts public components, CSS, tokens, and Tinyrack Tailwind utilities', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";\n@import "@tinyrack/ui/components/button.css";\n.card { padding: var(--tinyrack-space-md); }`,
      'src/app.tsx': `import { TRButton } from '@tinyrack/ui/components/button'; export const App = () => <TRButton className="p-tinyrack-md w-full min-w-0 text-center border-tinyrack">Save</TRButton>;`,
    });
    expect((await checkTinyrackProject({ root })).violations).toEqual([]);
  });

  it('rejects CSS, inline, Tailwind, native component, and private import violations', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";\n.card { padding: 12px; }`,
      'src/app.tsx': `import '@tinyrack/ui/src/private'; export const App = () => <button className="p-4" style={{ marginTop: 12 }}>Save</button>;`,
    });
    const rules = (await checkTinyrackProject({ root })).violations.map(
      (violation) => violation.ruleId,
    );
    expect(rules).toContain('tokens/no-literal');
    expect(rules).toContain('tokens/no-tailwind-default-design-utility');
    expect(rules).toContain('components/no-native-equivalent');
    expect(rules).toContain('imports/no-private-tinyrack');
  });

  it('follows local style constants without treating business fields as styles', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";`,
      'src/app.tsx': `const gap = 12; const business = { width: 12 }; export const App = () => <div style={{ gap }}>{business.width}</div>;`,
    });
    const result = await checkTinyrackProject({ root });
    expect(
      result.violations.filter((violation) => violation.ruleId === 'tokens/no-literal'),
    ).toHaveLength(1);
  });

  it('requires token expressions to originate from the public token module', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";`,
      'src/app.tsx': `const tinyrackSpacing = { md: 12 }; export const App = () => <div style={{ gap: tinyrackSpacing.md }} />;`,
    });
    expect(
      (await checkTinyrackProject({ root })).violations.map(
        (violation) => violation.ruleId,
      ),
    ).toContain('tokens/no-literal');

    const importedRoot = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";`,
      'src/app.tsx': `import { tinyrackSpacing } from '@tinyrack/ui/core'; const gap = tinyrackSpacing.md; export const App = () => <div style={{ gap }} />;`,
    });
    expect((await checkTinyrackProject({ root: importedRoot })).violations).toEqual([]);
  });

  it('requires reasoned next-line suppressions and reports stable machine output', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";\n/* tinyrack-check-ignore-next-line tokens/no-literal -- canvas coordinate owned by the data */\n.plot { width: 12px; }`,
    });
    const result = await checkTinyrackProject({ root });
    expect(result.violations).toEqual([]);
    expect(JSON.parse(formatTinyrackCheckResult(result, 'json'))).toMatchObject({
      platform: 'web',
      schemaVersion: 1,
    });
  });

  it('scans nested production files and excludes nested tests', async () => {
    const root = project({
      'app/features/nested/view.tsx': `export const View = () => <div className="p-4" />;`,
      'app/features/nested/view.test.tsx': `export const Fixture = () => <button />;`,
      'app/styles/app.css': `@import "@tinyrack/ui/core.css";`,
    });
    const result = await checkTinyrackProject({ root });
    expect(result.checkedFiles).toBe(2);
    expect(result.violations.map((violation) => violation.ruleId)).toEqual([
      'tokens/no-tailwind-default-design-utility',
    ]);
  });
});
