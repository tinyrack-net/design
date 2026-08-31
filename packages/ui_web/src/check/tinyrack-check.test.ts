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

  it('enforces strict Tinyrack text, form, rich HTML, and known-token contracts', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";\n.card { --tr-card-size: 2rem; transform: translateY(calc(var(--tinyrack-space-sm) + 2px)); }`,
      'src/app.tsx': `const sizes = { large: { '--tr-avatar-size': '4rem' } }; export const App = () => <form><p>Copy</p><code>id</code><span>Label</span><div className="prose z-tinyrack-raised" dangerouslySetInnerHTML={{ __html: '<b>unsafe</b>' }} /><div style={sizes.large} /></form>;`,
    });
    const rules = (await checkTinyrackProject({ root })).violations.map(
      (violation) => violation.ruleId,
    );
    expect(rules).toContain('components/no-native-equivalent');
    expect(rules).toContain('components/no-native-text');
    expect(rules).toContain('components/no-prose-utility');
    expect(rules).toContain('components/no-raw-html');
    expect(rules).toContain('tokens/no-literal');
    expect(rules).toContain('tokens/no-unknown-utility');
  });

  it('finds nested, translated, conditional, and native field text', async () => {
    const root = project({
      'src/app.tsx': `import { Trans as Translation } from 'react-i18next';
export const App = ({ ready }: { ready: boolean }) => <><span><Translation i18nKey="copy" /></span><div>{ready ? <>Ready</> : null}</div><label htmlFor="name">Name</label><strong>Important</strong></>;`,
    });
    const violations = (await checkTinyrackProject({ root })).violations;
    expect(
      violations.filter(
        (violation) => violation.ruleId === 'components/no-native-text',
      ),
    ).toHaveLength(2);
    expect(
      violations.filter(
        (violation) => violation.ruleId === 'components/no-native-equivalent',
      ),
    ).toHaveLength(2);
  });

  it('rejects TRText as a structural layout element', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";\n@import "@tinyrack/ui/components/text.css";`,
      'src/app.tsx': `import { TRText as Text } from '@tinyrack/ui/components/text'; export const App = () => <Text as="main"><Text>Copy</Text></Text>;`,
    });
    expect(
      (await checkTinyrackProject({ root })).violations.map(
        (violation) => violation.ruleId,
      ),
    ).toEqual(['components/no-structural-text']);
  });

  it('accepts text owned by Tinyrack compound component parts', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";
@import "@tinyrack/ui/components/button.css";
@import "@tinyrack/ui/components/field.css";
@import "@tinyrack/ui/components/menu.css";
@import "@tinyrack/ui/components/select.css";
@import "@tinyrack/ui/components/tabs.css";
@import "@tinyrack/ui/components/text.css";
@import "@tinyrack/ui/components/toast.css";
@import "@tinyrack/ui/components/tooltip.css";`,
      'src/app.tsx': `import { TRButton } from '@tinyrack/ui/components/button'; import { TRField } from '@tinyrack/ui/components/field'; import { TRMenu } from '@tinyrack/ui/components/menu'; import { TRSelect } from '@tinyrack/ui/components/select'; import { TRTabs } from '@tinyrack/ui/components/tabs'; import { TRText } from '@tinyrack/ui/components/text'; import { TRToast } from '@tinyrack/ui/components/toast'; import { TRTooltip } from '@tinyrack/ui/components/tooltip'; export const App = () => <><TRText as="p">Body <TRText as="strong" weight="strong">strong</TRText></TRText><TRButton>Save</TRButton><TRTabs.Tab value="one">Tab</TRTabs.Tab><TRMenu.Item>Menu</TRMenu.Item><TRSelect.ItemText>Option</TRSelect.ItemText><TRField.Label>Name</TRField.Label><TRToast.Title>Saved</TRToast.Title><TRTooltip.Popup>Help</TRTooltip.Popup></>;`,
    });
    expect((await checkTinyrackProject({ root })).violations).toEqual([]);
  });

  it('requires core CSS before component CSS', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/components/text.css";\n@import "@tinyrack/ui/core.css";`,
      'src/app.tsx': `import { TRText } from '@tinyrack/ui/components/text'; export const App = () => <TRText>Copy</TRText>;`,
    });
    expect(
      (await checkTinyrackProject({ root })).violations.map(
        (violation) => violation.ruleId,
      ),
    ).toContain('setup/core-css-order');
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

  it('enforces illustration roles across CSS, aliases, JSX, inline styles, and utilities', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";
.good { fill: var(--tinyrack-illustration-fill-primary); stroke: var(--tinyrack-illustration-stroke); }
.aliased { --face: var(--tinyrack-text-muted); fill: var(--face); }
.transparent-face { fill: var(--tinyrack-illustration-fill-secondary); opacity: var(--tinyrack-opacity-disabled); }`,
      'src/app.tsx': `export const Art = () => <svg className="fill-tinyrack-border stroke-tinyrack-illustration-fill-secondary"><path fill="var(--tinyrack-text)" style={{ stroke: 'var(--tinyrack-surface)' }} /><circle fill="white" /></svg>;`,
    });
    const violations = (await checkTinyrackProject({ root })).violations;
    expect(
      violations.filter(
        (violation) => violation.ruleId === 'tokens/no-cross-role-svg-color',
      ),
    ).toHaveLength(6);
    expect(
      violations.filter((violation) => violation.ruleId === 'tokens/no-literal'),
    ).toHaveLength(1);
  });

  it('allows illustration roles and meaningful status colors in SVGs', async () => {
    const root = project({
      'src/app.css': `@import "@tinyrack/ui/core.css";
.art { --face: var(--tinyrack-illustration-fill-tertiary); fill: var(--face); stroke: var(--tinyrack-success-foreground); }`,
      'src/app.tsx': `export const Art = () => <svg className="fill-tinyrack-illustration-detail stroke-tinyrack-illustration-stroke"><path fill="var(--tinyrack-illustration-shadow)" style={{ stroke: 'var(--tinyrack-success-foreground)' }} /></svg>;`,
    });
    expect((await checkTinyrackProject({ root })).violations).toEqual([]);
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
