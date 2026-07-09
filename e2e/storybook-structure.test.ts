import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readText(path: string) {
  return readFileSync(join(repoRoot, path), 'utf8');
}

describe('Storybook structure', () => {
  it('keeps the Storybook preview bound to Tinyrack CSS tokens only', () => {
    const mainSource = readText('.storybook/main.ts');
    const previewSource = readText('.storybook/preview.tsx');
    const previewCss = readText('.storybook/preview.css');

    expect(mainSource).toContain('backgrounds: false');
    expect(mainSource).toContain("'@storybook/addon-themes'");
    expect(previewSource).toContain("from '@storybook/addon-themes'");
    expect(previewSource).toContain('withThemeByDataAttribute({');
    expect(previewSource).toContain("defaultTheme: 'tinyrack-dark'");
    expect(previewSource).toContain("attributeName: 'data-theme'");
    expect(previewSource).toContain("'tinyrack-light': 'tinyrack-light'");
    expect(previewSource).toContain("'tinyrack-dark': 'tinyrack-dark'");
    expect(previewSource).toContain("context.title.startsWith('Components/')");
    expect(previewSource).toContain('!isDocs && isComponentStory');
    expect(previewSource).not.toContain('globalTypes');
    expect(previewSource).not.toContain('context.globals.theme');
    expect(previewSource).not.toContain('document.documentElement.dataset');
    expect(previewSource).not.toContain('data-theme={theme}');
    expect(previewSource).not.toContain('MantineProvider');
    expect(previewSource).not.toContain('daisyUI/');
    expect(previewSource).not.toContain('Mantine/');
    expect(previewCss).toContain('@import "../src/core/core.css";');
    expect(previewCss).toContain('@import "../src/components/button/button.css";');
    expect(previewCss).toContain(':root[data-theme="tinyrack-light"]');
    expect(previewCss).toContain(':root[data-theme="tinyrack-dark"]');
    expect(previewCss).not.toContain('@import "../src/integrations/styles.css";');
    expect(previewCss).not.toContain('@plugin "daisyui"');
    expect(previewCss).not.toContain('@mantine');
  });

  it('keeps only the Button component story in the component gallery', () => {
    expect(existsSync(join(repoRoot, 'stories/components/button.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/mantine'))).toBe(false);
    expect(existsSync(join(repoRoot, 'stories/daisyui'))).toBe(false);
    expect(existsSync(join(repoRoot, 'stories/adapters/mantine.stories.tsx'))).toBe(
      false,
    );
    expect(existsSync(join(repoRoot, 'stories/adapters/daisyui.stories.tsx'))).toBe(
      false,
    );
    expect(
      existsSync(join(repoRoot, 'stories/adapters/astro-starlight.stories.tsx')),
    ).toBe(false);

    expect(readdirSync(join(repoRoot, 'stories/components')).sort()).toEqual([
      'button.stories.tsx',
    ]);
  });

  it('exposes Button story controls for the supported public API', () => {
    const source = readText('stories/components/button.stories.tsx');

    expect(source).toContain("title: 'Components/Button'");
    expect(source).toContain("tags: ['autodocs']");
    expect(source).toContain('function ButtonDocsPage');
    expect(source).toContain('page: ButtonDocsPage');
    expect(source).toContain('@tinyrack/ui/components/button/react');
    expect(source).toContain('@tinyrack/ui/components/button/button.css');
    expect(source).toContain('class="tr-btn"');
    expect(source).toContain('ComponentStoryProps');
    expect(source).toContain('controlValues');
    expect(source).toContain('args:');
    expect(source).toContain('argTypes:');
    expect(source).toContain('buttonAppearances');
    expect(source).toContain('buttonSizes');
    expect(source).toContain('buttonVariants');
    expect(source).not.toContain('buttonTones');
    expect(source).not.toContain('@mantine/core');
    expect(source).not.toContain('daisyui');
  });

  it('keeps README focused on the Button-first package instead of docs pages', () => {
    const readme = readText('README.md');

    expect(existsSync(join(repoRoot, 'docs'))).toBe(false);
    expect(readme).toContain('@tinyrack/ui/components/button/react');
    expect(readme).toContain('@tinyrack/ui/components/button/button.css');
    expect(readme).toContain('https://design.tinyrack.net');
    expect(readme).not.toContain('docs/');
    expect(readme).not.toContain('@tinyrack/themes');
    expect(readme).not.toContain('@tinyrack/ui/styles.css');
  });
});
