import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentNames } from '../scripts/component-catalog.js';
import { baseUiExampleSources } from '../stories/shared/base-ui-example-sources.js';
import { componentDocsManifest } from '../stories/shared/component-docs-manifest.js';

const repoRoot = process.cwd();

function readText(path: string) {
  return readFileSync(join(repoRoot, path), 'utf8');
}

describe('React-only Storybook contract', () => {
  it('documents every public component exactly once', () => {
    expect(componentDocsManifest).toHaveLength(componentNames.length);
    expect(new Set(componentDocsManifest.map((entry) => entry.id)).size).toBe(
      componentNames.length,
    );
    expect(componentDocsManifest.map((entry) => entry.id).sort()).toEqual(
      [...componentNames].sort(),
    );

    for (const entry of componentDocsManifest) {
      expect(existsSync(join(repoRoot, entry.file))).toBe(true);
      expect(
        existsSync(join(repoRoot, `stories/components/${entry.id}.stories.tsx`)),
      ).toBe(true);
    }
  });

  it.each(
    componentDocsManifest,
  )('$title uses suffix-free React and CSS imports', (entry) => {
    const docs = readText(entry.file);
    const story = readText(`stories/components/${entry.id}.stories.tsx`);

    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}`);
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}.css`);
    expect(docs).toContain("label: 'React'");
    expect(story).toContain(`../../src/components/${entry.id}/index.js`);
    expect(docs).not.toContain('/react');
    expect(docs).not.toContain('/dom');
    expect(docs).not.toContain('Astro');
  });

  it.each(
    componentDocsManifest,
  )('$title publishes rich examples with paste-ready React tabs', (entry) => {
    const docs = readText(entry.file);
    const sectionOffsets = ['Contract', 'Install', 'Usage', 'Examples', 'API'].map(
      (section) => docs.indexOf(`## ${section}`),
    );

    expect(sectionOffsets.every((offset) => offset >= 0)).toBe(true);
    expect(sectionOffsets).toEqual([...sectionOffsets].sort((a, b) => a - b));
    expect(docs).toContain('ComponentExampleTabs');
    expect(docs).toContain("label: 'React'");
    expect(docs).not.toContain("label: 'HTML'");
    expect(docs).not.toContain('Use Controls above');
    expect(docs).not.toMatch(/>\s*(?:\.{3}|…+)\s*</);

    for (const example of entry.requiredExamples) {
      expect(docs).toContain(`id="${example}"`);
    }
  });

  it.each(
    componentDocsManifest.filter((entry) =>
      (entry.capabilities as readonly string[]).includes('stateful'),
    ),
  )('$title synchronizes user interaction back to Storybook args', (entry) => {
    const story = readText(`stories/components/${entry.id}.stories.tsx`);

    expect(story).toContain("from 'storybook/preview-api'");
    expect(story).toContain('useArgs<');
    expect(story).toContain('updateArgs({');
    expect(story).not.toMatch(/key=\{?`?\$\{/);
  });

  it.each(
    componentDocsManifest,
  )('$title exposes every supported story control', (entry) => {
    const story = readText(`stories/components/${entry.id}.stories.tsx`);

    expect(story).toContain('args:');
    expect(story).toContain('argTypes:');

    for (const control of entry.requiredControls) {
      expect(story).toContain(`${control}: {`);
    }
  });

  it('keeps React source first and provides copy feedback in shared docs tabs', () => {
    const exampleTabs = readText('stories/shared/component-example-tabs.tsx');

    expect(exampleTabs).toContain("new Map([['React', 0]])");
    expect(exampleTabs).toContain('copyDocsSource(normalizedCode)');
    expect(exampleTabs).toContain('data-copy-source={label}');
    expect(exampleTabs).toContain('defaultValue="preview"');
    expect(exampleTabs).toContain('min-w-0');
    expect(exampleTabs).toContain('overflow-x-auto');
  });

  it('keeps the Switch story interactive and its docs state-complete', () => {
    const story = readText('stories/components/switch.stories.tsx');
    const docs = readText('stories/components/switch.docs.mdx');

    expect(story).toContain('useArgs<StoryArgs>()');
    expect(story).toContain('onCheckedChange={(checked) => updateArgs({ checked })}');
    expect(story).toContain('id={inputId}');
    expect(story).toContain('htmlFor={inputId}');
    expect(docs).toContain('<Stories.SwitchStateComparison />');
    expect(docs).toContain('id="switch-validation"');
    expect(docs).not.toContain('Use Controls above');
  });

  it('keeps shared Base UI fallback examples paste-ready', () => {
    for (const source of Object.values(baseUiExampleSources)) {
      expect(source).toContain('<');
      expect(source).not.toContain('placeholder=Content');
      expect(source).not.toMatch(/<\w+\.Root\s+>/);
    }
  });

  it('teaches only the React-only package map on the welcome page', () => {
    const welcome = readText('stories/welcome.mdx');

    expect(welcome).toContain('@tinyrack/ui/components/button');
    expect(welcome).toContain('@tinyrack/ui/components/button.css');
    expect(welcome).toContain('@tinyrack/ui/mdx');
    expect(welcome).not.toContain('@tinyrack/ui/mdx/astro');
    expect(welcome).not.toContain('@tinyrack/ui/mdx/react');
  });

  it('uses the React MDX entry in the Storybook docs container', () => {
    const container = readText('.storybook/tinyrack-docs-container.tsx');

    expect(container).toContain("from '../src/mdx/index.js'");
    expect(container).toContain("from '../src/mdx/mdx-markup.js'");
  });

  it('loads every component stylesheet and no removed overlay stylesheet', () => {
    const previewCss = readText('.storybook/preview.css');

    for (const entry of componentDocsManifest) {
      expect(previewCss).toContain(`../src/components/${entry.id}/${entry.id}.css`);
    }
    expect(previewCss).not.toContain('components/overlay');
  });

  it('contains no legacy framework import in authored stories', () => {
    const authoredFiles = [
      'stories/welcome.mdx',
      'stories/integrations/mdx-renderer.docs.mdx',
      ...componentDocsManifest.flatMap((entry) => [
        entry.file,
        `stories/components/${entry.id}.stories.tsx`,
      ]),
    ];

    for (const file of authoredFiles) {
      const source = readText(file);
      expect(source).not.toMatch(/components\/.+\/(react|dom)/);
      expect(source).not.toContain('mdx/astro');
      expect(source).not.toContain('mdx/react');
    }
  });

  it('publishes dedicated open-state stories for portal components', () => {
    for (const component of [
      'alert-dialog',
      'autocomplete',
      'combobox',
      'context-menu',
      'drawer',
      'menu',
      'dialog',
      'popover',
      'preview-card',
      'select',
      'toast',
      'tooltip',
    ]) {
      expect(readText(`stories/components/${component}.stories.tsx`)).toContain(
        'export const Open',
      );
    }
  });
});
