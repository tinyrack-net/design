import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageRoot = process.cwd();

function readHomepage(path: string) {
  const resolved = join(homepageRoot, path);
  if (existsSync(resolved)) return readFileSync(resolved, 'utf8');
  return readFileSync(
    join(homepageRoot, path.replace('app/content/', 'app/content/en/')),
    'utf8',
  );
}

describe('reports 00-29 closure contracts', () => {
  it('publishes valid foundation references and visual semantics', () => {
    const spacing = readHomepage('app/content/en/foundations/spacing.mdx');
    const motionCss = readHomepage('app/documentation/foundations/motion-demo.css');
    const motionDemo = readHomepage('app/documentation/foundations/motion-demo.tsx');
    const elevation = readHomepage('app/content/en/foundations/elevation.mdx');

    expect(spacing).not.toContain('tinyrackSpacing.{token}');
    expect(spacing).toContain(`tinyrackSpacing['\${token}']`);
    expect(motionCss).not.toContain('opacity: 0.45');
    expect(motionDemo).not.toContain('bg-tinyrack-surface-raised');
    expect(elevation).not.toContain('overlay</TRCode> · blocking');
    expect(elevation).not.toContain("purpose: 'Blocking focused task'");
    expect(elevation).toContain('Modality is communicated by behavior and a backdrop');
    expect(elevation).toContain('Navigation TRMenu, and Preview TRCard');
  });

  it('keeps TRCard headings in document order and TRCode Block source paste-ready', () => {
    const card = readHomepage('app/content/components/card.mdx');
    const codeBlock = readHomepage('app/content/components/code-block.mdx');

    expect(card).not.toMatch(/<TRCard\.Title>(?:Rack A|Default|Outlined|Elevated)/);
    expect(card).toContain('render={<h4>Rack A</h4>}');
    expect(card).toContain('render={<h4 id="rack-card-title">Rack A health</h4>}');
    expect(codeBlock).toContain("import { useState } from 'react';");
    expect(codeBlock).toContain(
      "import { TRButton } from '@tinyrack/ui/components/button';",
    );
    expect(codeBlock).toContain("import '@tinyrack/ui/components/button.css';");
  });

  it('documents real TRMenu anatomy and a bounded TRDialog scroll body', () => {
    const menu = readHomepage('app/content/components/menu.mdx');
    const dialogDocs = readHomepage('app/content/components/dialog.mdx');
    const dialogDemo = readHomepage('app/documentation/components/dialog.demo.tsx');

    expect(menu).not.toContain('or `Submenu` inside it');
    expect(menu).toContain('`SubmenuRoot` and `SubmenuTrigger`');
    expect(dialogDocs).toContain('longContent');
    expect(dialogDocs).toContain('className="tr-dialog-body grid gap-4"');
    expect(dialogDemo).toContain('data-dialog-scroll-body=""');
  });

  it('keeps OTP preview/source/API parity and shrink-safe slots', () => {
    const docs = readHomepage('app/content/components/otp-field.mdx');
    const demo = readHomepage('app/documentation/components/otp-field.demo.tsx');
    const css = readFileSync(
      join(homepageRoot, '../ui/dist/components/otp-field/otp-field.css'),
      'utf8',
    );

    for (const value of ['1234', '123456']) {
      expect(docs).toContain(`defaultValue="${value}"`);
      expect(demo).toContain(`defaultValue="${value}"`);
    }
    expect(docs).not.toContain('defaultValue="482901"');
    expect(docs).toContain(
      'it does not export bare `Root`, `TRInput`, or `TRSeparator`',
    );
    expect(css).toContain('flex: 1 1 var(--tr-otp-field-size');
    expect(css).toContain('min-width: 0;');
  });

  it('names TRProgress uiSize variants and keeps TRSkeleton controls visual', () => {
    const progress = readHomepage('app/content/components/progress.mdx');
    const skeletonDemo = readHomepage('app/documentation/components/skeleton.demo.tsx');
    const skeletonDocs = readHomepage('app/content/components/skeleton.mdx');

    expect(progress).toContain(
      "<TRProgress.Label>{uiSize + ' ' + variant}</TRProgress.Label>",
    );
    expect(skeletonDemo).not.toContain('announced:');
    expect(skeletonDocs).toContain('title="Decorative loading placeholder"');
    expect(skeletonDocs).not.toContain(
      '<TRSkeleton aria-label="Loading server" style={{ height: 48, width: \'100%\' }} />',
    );
  });

  it('renders visible labels for every decorative TRSpinner variant', () => {
    const spinner = readHomepage('app/content/components/spinner.mdx');

    expect(spinner).toContain("['current', 'muted', 'primary', 'danger']");
    expect(spinner).toContain('<span>{variant}</span>');
  });

  it('makes every wide TRTable scroller focusable and every header scoped', () => {
    const table = readHomepage('app/content/components/table.mdx');
    const rootTags = [...table.matchAll(/<TRTable\.Root\b[\s\S]*?>/g)]
      .map(([tag]) => tag)
      .filter((tag) => tag.includes('className="min-w'));
    const headTags = [...table.matchAll(/<TRTable\.Head(?:\s|>)[^>]*>/g)].map(
      ([tag]) => tag,
    );

    expect(rootTags.length).toBeGreaterThan(0);
    expect(rootTags.every((tag) => tag.includes('containerProps='))).toBe(true);
    expect(headTags.length).toBeGreaterThan(0);
    expect(headTags.every((tag) => tag.includes('scope='))).toBe(true);
    expect(table).toContain(
      '<TRTable.Head colSpan={3} scope="row">Total</TRTable.Head>',
    );
  });
});
