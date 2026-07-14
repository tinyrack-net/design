import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentNames } from '../../../packages/ui/scripts/component-catalog.js';
import { componentDocsManifest } from '../app/content/shared/component-docs-manifest.js';
import {
  homepageHighlightLanguages,
  homepageHighlightThemes,
} from '../app/highlighting/homepage-highlighter.js';

const homepageRoot = process.cwd();
const workspaceRoot = join(homepageRoot, '../..');

function readText(path: string) {
  return readFileSync(join(homepageRoot, path), 'utf8');
}

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (
      statSync(path).isDirectory() &&
      ['.git', '.react-router', 'build', 'node_modules'].includes(name)
    ) {
      return [];
    }
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe('React Router documentation contract', () => {
  it('documents every public component exactly once', () => {
    expect(componentDocsManifest).toHaveLength(componentNames.length);
    expect(new Set(componentDocsManifest.map((entry) => entry.id)).size).toBe(
      componentNames.length,
    );
    expect(componentDocsManifest.map((entry) => entry.id).sort()).toEqual(
      [...componentNames].sort(),
    );

    for (const entry of componentDocsManifest) {
      expect(existsSync(join(homepageRoot, entry.file))).toBe(true);
      expect(
        existsSync(join(homepageRoot, `app/content/components/${entry.id}.demo.tsx`)),
      ).toBe(true);
    }
  });

  it.each(
    componentDocsManifest,
  )('$title keeps the required page sections, examples, and controls', (entry) => {
    const docs = readText(entry.file);
    const demo = readText(`app/content/components/${entry.id}.demo.tsx`);
    const sectionOffsets = [
      'Contract',
      'Install',
      'Playground',
      'Usage',
      'Examples',
      'API',
    ].map((section) => docs.indexOf(`## ${section}`));

    expect(sectionOffsets.every((offset) => offset >= 0)).toBe(true);
    expect(sectionOffsets).toEqual([...sectionOffsets].sort((a, b) => a - b));
    expect(docs).toContain('ComponentPlayground');
    expect(docs).toContain('definition={Stories.playground}');
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}`);
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}.css`);
    expect(demo).toContain('definePlayground(meta)');
    expect(demo).toContain(`@tinyrack/ui/components/${entry.id}`);

    for (const control of entry.requiredControls) {
      expect(demo).toContain(`${control}: {`);
    }
    for (const example of entry.requiredExamples) {
      expect(docs).toContain(`id="${example}"`);
    }
  });

  it('loads every component stylesheet through its public package path', () => {
    const stylesheet = readText('app/styles/app.css');
    for (const component of componentNames) {
      expect(stylesheet).toContain(`@tinyrack/ui/components/${component}.css`);
    }
  });

  it('contains no removed documentation runtime residue', () => {
    const removedRuntimeName = ['story', 'book'].join('');
    const removedRuntimePattern = new RegExp(removedRuntimeName, 'i');
    expect(existsSync(join(workspaceRoot, `.${removedRuntimeName}`))).toBe(false);

    const authoredFiles = filesUnder(workspaceRoot).filter(
      (path) => !path.endsWith('pnpm-lock.yaml'),
    );
    const legacyDemoSuffix = ['.stori', 'es.tsx'].join('');
    const legacyFiles = authoredFiles.filter(
      (path) => path.endsWith(legacyDemoSuffix) || removedRuntimePattern.test(path),
    );
    expect(legacyFiles).toEqual([]);

    const legacySources = authoredFiles
      .filter((path) => /\.(?:json|md|mdx|ts|tsx|ya?ml)$/.test(path))
      .filter((path) => removedRuntimePattern.test(readFileSync(path, 'utf8')));
    expect(legacySources).toEqual([]);
  });

  it('defines all 58 content routes as static route modules', () => {
    const routes = readText('app/routes.ts');
    expect(componentDocsManifest).toHaveLength(47);
    expect(routes).not.toContain(':slug');
    expect(routes).toContain("index('content/welcome.mdx')");
    expect(routes).toContain("route('foundations',");
    expect(routes).toContain("route('integrations/mdx-renderer',");
    expect(readText('react-router.config.ts')).toContain('prerender: true');
    expect(readText('react-router.config.ts')).toContain("mode: 'initial'");
  });

  it('pins the warning-free React Router v8 framework toolchain', () => {
    const packageJson = JSON.parse(readText('package.json')) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(packageJson.dependencies['react-router']).toBe('8.2.0');
    expect(packageJson.dependencies['@react-router/node']).toBe('8.2.0');
    expect(packageJson.devDependencies['@react-router/dev']).toBe('8.2.0');
    expect(readText('react-router.config.ts')).not.toContain('future:');
  });

  it('keeps authored syntax highlighting inside the homepage bundle allowlist', () => {
    const contentFiles = filesUnder(join(homepageRoot, 'app/content')).filter((path) =>
      /\.(?:mdx|tsx)$/.test(path),
    );
    const authoredLanguages = new Set<string>();
    for (const path of contentFiles) {
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(/```([A-Za-z0-9_-]+)/g)) {
        if (match[1] !== undefined) authoredLanguages.add(match[1]);
      }
      for (const match of source.matchAll(/\blanguage\s*(?:=|:)\s*['"]([^'"]+)['"]/g)) {
        if (match[1] !== undefined) authoredLanguages.add(match[1]);
      }
    }

    const supportedLanguages = new Set<string>(homepageHighlightLanguages);
    expect(
      [...authoredLanguages].filter((language) => !supportedLanguages.has(language)),
    ).toEqual([]);
    expect(homepageHighlightThemes).toEqual(['github-dark', 'github-light']);
  });

  it('loads only IBM Plex Sans Latin, Korean, and Japanese web-font subsets', () => {
    const root = readText('app/root.tsx');
    const fontImports = [...root.matchAll(/@fontsource\/[^'"]+/g)].map(
      ([specifier]) => specifier,
    );
    expect(fontImports).toEqual([
      '@fontsource/ibm-plex-sans/latin-400.css',
      '@fontsource/ibm-plex-sans/latin-500.css',
      '@fontsource/ibm-plex-sans/latin-600.css',
      '@fontsource/ibm-plex-sans/latin-700.css',
    ]);

    const cjkFonts = readText('app/styles/fonts.css');
    expect(cjkFonts.match(/ibm-plex-sans-kr-korean-/g)).toHaveLength(4);
    expect(cjkFonts.match(/ibm-plex-sans-jp-japanese-/g)).toHaveLength(4);
    expect(cjkFonts.match(/font-family: "IBM Plex Sans"/g)).toHaveLength(8);
  });

  it('uses native documentation routes for foundation cross-links', () => {
    const overview = readText('app/content/foundations/overview.mdx');
    expect(overview).not.toContain('/?path=/docs/');
    for (const path of [
      'colors',
      'typography',
      'spacing',
      'radius',
      'controls',
      'motion',
      'elevation',
    ]) {
      expect(overview).toContain(`href="/foundations/${path}"`);
    }
  });

  it('keeps audited advanced examples copy-ready and their integration guidance complete', () => {
    const previewCard = readText('app/content/components/preview-card.docs.mdx');
    expect(previewCard).toContain('`delay` and `closeDelay`');
    expect(previewCard).toContain('tapping it follows its');

    const radioGroupDocs = readText('app/content/components/radio-group.docs.mdx');
    const radioGroupDemo = readText('app/content/components/radio-group.demo.tsx');
    expect(radioGroupDocs).toContain('code: Stories.radioGroupStatesSource');
    expect(radioGroupDocs).toContain('code: Stories.radioGroupValidationSource');
    expect(radioGroupDemo).toContain(
      "import { RadioGroup } from '@tinyrack/ui/components/radio-group';",
    );
    expect(radioGroupDemo).toContain('export function RequiredRack()');

    const selectDocs = readText('app/content/components/select.docs.mdx');
    const selectDemo = readText('app/content/components/select.demo.tsx');
    expect(selectDocs).toContain('code: Stories.selectStatesSource');
    expect(selectDemo).toContain(
      "import { Select } from '@tinyrack/ui/components/select';",
    );
    expect(selectDemo).toContain('function AvailabilitySelect({');

    const switchDocs = readText('app/content/components/switch.docs.mdx');
    const sharedSources = readText('app/content/shared/base-ui-example-sources.ts');
    expect(switchDocs).toContain('code: switchStateComparisonSource');
    expect(sharedSources).toContain('function SwitchStateSample({');
    expect(sharedSources).toContain(
      '<SwitchStateSample checked readOnly title="Read only" />',
    );

    const slider = readText('app/content/components/slider.docs.mdx');
    expect(slider).toContain('a single slider accepts a number or one-item array');
    expect(slider).toContain('getAriaValueText');
    expect(slider).toContain('`onValueCommitted`');

    const providers = readText('app/content/integrations/base-ui-providers.docs.mdx');
    expect(providers).toContain('createRequestCsp');
    expect(providers).toContain('disableStyleElements');
    expect(providers).toContain('<html dir={direction}');

    const mdx = readText('app/content/integrations/mdx-renderer.docs.mdx');
    expect(mdx).toContain("import Content from './content.mdx';");
    expect(mdx).toContain('export function MdxArticle()');
    expect(mdx).toContain('function CustomHeading({ children, ...props }');
    expect(mdx).toContain('### Rendered GFM check');
  });
});
