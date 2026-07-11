import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

const repoRoot = process.cwd();
const expectedJsExports = {
  './components/accordion/dom': {
    types: './dist/components/accordion/dom.d.ts',
    import: './dist/components/accordion/dom.js',
  },
  './components/accordion/react': {
    types: './dist/components/accordion/react.d.ts',
    import: './dist/components/accordion/react.js',
  },
  './components/alert/react': {
    types: './dist/components/alert/react.d.ts',
    import: './dist/components/alert/react.js',
  },
  './components/avatar/react': {
    types: './dist/components/avatar/react.d.ts',
    import: './dist/components/avatar/react.js',
  },
  './core': {
    types: './dist/core/index.d.ts',
    import: './dist/core/index.js',
  },
  './components/badge/react': {
    types: './dist/components/badge/react.d.ts',
    import: './dist/components/badge/react.js',
  },
  './components/button/react': {
    types: './dist/components/button/react.d.ts',
    import: './dist/components/button/react.js',
  },
  './components/card/react': {
    types: './dist/components/card/react.d.ts',
    import: './dist/components/card/react.js',
  },
  './components/code-block/react': {
    types: './dist/components/code-block/react.d.ts',
    import: './dist/components/code-block/react.js',
  },
  './components/code/react': {
    types: './dist/components/code/react.d.ts',
    import: './dist/components/code/react.js',
  },
  './components/divider/react': {
    types: './dist/components/divider/react.d.ts',
    import: './dist/components/divider/react.js',
  },
  './components/form/react': {
    types: './dist/components/form/react.d.ts',
    import: './dist/components/form/react.js',
  },
  './components/link/react': {
    types: './dist/components/link/react.d.ts',
    import: './dist/components/link/react.js',
  },
  './components/progress/react': {
    types: './dist/components/progress/react.d.ts',
    import: './dist/components/progress/react.js',
  },
  './components/skeleton/react': {
    types: './dist/components/skeleton/react.d.ts',
    import: './dist/components/skeleton/react.js',
  },
  './components/overlay/dom': {
    types: './dist/components/overlay/dom.d.ts',
    import: './dist/components/overlay/dom.js',
  },
  './components/overlay/react': {
    types: './dist/components/overlay/react.d.ts',
    import: './dist/components/overlay/react.js',
  },
  './components/table/react': {
    types: './dist/components/table/react.d.ts',
    import: './dist/components/table/react.js',
  },
  './mdx/react': {
    types: './dist/mdx/react.d.ts',
    import: './dist/mdx/react.js',
  },
  './mdx/astro': {
    types: './dist/mdx/astro.d.ts',
    import: './dist/mdx/astro.js',
  },
  './components/tabs/react': {
    types: './dist/components/tabs/react.d.ts',
    import: './dist/components/tabs/react.js',
  },
  './components/combobox/dom': {
    types: './dist/components/combobox/dom.d.ts',
    import: './dist/components/combobox/dom.js',
  },
  './components/combobox/react': {
    types: './dist/components/combobox/react.d.ts',
    import: './dist/components/combobox/react.js',
  },
  './components/disclosure/react': {
    types: './dist/components/disclosure/react.d.ts',
    import: './dist/components/disclosure/react.js',
  },
  './components/menu/dom': {
    types: './dist/components/menu/dom.d.ts',
    import: './dist/components/menu/dom.js',
  },
  './components/menu/react': {
    types: './dist/components/menu/react.d.ts',
    import: './dist/components/menu/react.js',
  },
  './components/pin-input/dom': {
    types: './dist/components/pin-input/dom.d.ts',
    import: './dist/components/pin-input/dom.js',
  },
  './components/pin-input/react': {
    types: './dist/components/pin-input/react.d.ts',
    import: './dist/components/pin-input/react.js',
  },
  './components/spinner/react': {
    types: './dist/components/spinner/react.d.ts',
    import: './dist/components/spinner/react.js',
  },
  './components/tabs/dom': {
    types: './dist/components/tabs/dom.d.ts',
    import: './dist/components/tabs/dom.js',
  },
  './components/toast/dom': {
    types: './dist/components/toast/dom.d.ts',
    import: './dist/components/toast/dom.js',
  },
  './components/toast/react': {
    types: './dist/components/toast/react.d.ts',
    import: './dist/components/toast/react.js',
  },
  './components/tooltip/dom': {
    types: './dist/components/tooltip/dom.d.ts',
    import: './dist/components/tooltip/dom.js',
  },
  './components/tooltip/react': {
    types: './dist/components/tooltip/react.d.ts',
    import: './dist/components/tooltip/react.js',
  },
} as const;

const expectedCssExports = {
  './components/accordion/accordion.css': './dist/components/accordion/accordion.css',
  './components/alert/alert.css': './dist/components/alert/alert.css',
  './components/avatar/avatar.css': './dist/components/avatar/avatar.css',
  './components/badge/badge.css': './dist/components/badge/badge.css',
  './components/button/button.css': './dist/components/button/button.css',
  './components/card/card.css': './dist/components/card/card.css',
  './components/code-block/code-block.css':
    './dist/components/code-block/code-block.css',
  './components/code/code.css': './dist/components/code/code.css',
  './components/divider/divider.css': './dist/components/divider/divider.css',
  './components/form/form.css': './dist/components/form/form.css',
  './components/link/link.css': './dist/components/link/link.css',
  './components/progress/progress.css': './dist/components/progress/progress.css',
  './components/skeleton/skeleton.css': './dist/components/skeleton/skeleton.css',
  './components/overlay/overlay.css': './dist/components/overlay/overlay.css',
  './components/table/table.css': './dist/components/table/table.css',
  './components/tabs/tabs.css': './dist/components/tabs/tabs.css',
  './mdx/mdx.css': './dist/mdx/mdx.css',
  './core/core.css': './dist/core/core.css',
  './components/combobox/combobox.css': './dist/components/combobox/combobox.css',
  './components/disclosure/disclosure.css':
    './dist/components/disclosure/disclosure.css',
  './components/menu/menu.css': './dist/components/menu/menu.css',
  './components/pin-input/pin-input.css': './dist/components/pin-input/pin-input.css',
  './components/spinner/spinner.css': './dist/components/spinner/spinner.css',
  './components/toast/toast.css': './dist/components/toast/toast.css',
  './components/tooltip/tooltip.css': './dist/components/tooltip/tooltip.css',
} as const;

describe('package exports', () => {
  it('exposes only the domain-owned public surface', () => {
    expect(packageJson.name).toBe('@tinyrack/ui');
    expect(packageJson.version).toBe('0.1.0');
    expect(packageJson.exports).toEqual({
      ...expectedJsExports,
      ...expectedCssExports,
      './package.json': './package.json',
    });
  });

  it('does not expose removed root, token, aggregate, or adapter subpaths', () => {
    for (const subpath of [
      '.',
      './tokens',
      './styles.css',
      './tailwind.css',
      './react/button',
      './react/feedback',
      './react/form',
      './react/link',
      './react/table',
      './react/tabs',
      './components/badge/contract',
      './components/alert/contract',
      './components/avatar/contract',
      './components/card/contract',
      './components/table/contract',
      './components/tabs/contract',
      './components/code-block/contract',
      './components/code/contract',
      './components/divider/contract',
      './components/feedback/contract',
      './components/feedback/react',
      './components/feedback/feedback.css',
      './components/form/contract',
      './components/form/input',
      './components/input/react',
      './components/textarea/react',
      './components/select/react',
      './components/checkbox/react',
      './components/radio/react',
      './components/switch/react',
      './components/link/contract',
      './components/progress/contract',
      './components/skeleton/contract',
      './components/overlay/contract',
      './components/layout/react',
      './components/layout/layout.css',
      './components/layout/contract',
      './icons',
      './icons/react',
      './icons/icons.css',
      './mdx/shared',
      './mdx/astro-code',
      './mdx/astro-components/props',
      './mdx/astro-components/Code.astro',
      './mdx/react-components/Code',
      './mantine',
      './mantine.css',
      './daisyui',
      './daisyui.css',
      './astro/starlight',
      './astro/starlight.css',
      './tailwind/mantine.css',
      './tailwind/daisyui.css',
    ]) {
      expect(Object.hasOwn(packageJson.exports, subpath)).toBe(false);
    }
  });

  it('marks css files as side effects', () => {
    expect(packageJson.sideEffects).toContain('**/*.css');
  });

  it('ships Shiki as the CodeBlock runtime dependency', () => {
    expect(packageJson.dependencies.shiki).toBe('4.3.1');
    expect(packageJson.peerDependencies).not.toHaveProperty('shiki');
    expect(packageJson.peerDependenciesMeta).not.toHaveProperty('shiki');
    expect(packageJson.devDependencies).not.toHaveProperty('shiki');
  });

  it('keeps the DOM Overlay runtime independent from optional React peers', () => {
    expect(packageJson.dependencies['@floating-ui/dom']).toBe('1.7.6');
    expect(packageJson.peerDependenciesMeta?.react?.optional).toBe(true);
    expect(packageJson.peerDependenciesMeta?.['react-dom']?.optional).toBe(true);
  });

  it('keeps Lucide as a Storybook-only documentation dependency', () => {
    expect(packageJson.devDependencies['lucide-react']).toMatch(/^\^1\./);
    expect(packageJson.peerDependencies).not.toHaveProperty('lucide-react');
    expect(packageJson.peerDependenciesMeta).not.toHaveProperty('lucide-react');
  });

  it('keeps Astro optional for the MDX adapter and validates it explicitly', () => {
    expect(packageJson.peerDependencies.astro).toBe('^7.0.0');
    expect(packageJson.peerDependencies['@astrojs/mdx']).toBe('^7.0.0');
    expect(packageJson.peerDependenciesMeta?.astro?.optional).toBe(true);
    expect(packageJson.peerDependenciesMeta?.['@astrojs/mdx']?.optional).toBe(true);
    expect(packageJson.devDependencies.astro).toBe('7.0.7');
    expect(packageJson.devDependencies['@astrojs/mdx']).toBe('7.0.2');
    expect(packageJson.devDependencies['@astrojs/check']).toBe('0.9.9');
    expect(packageJson.devDependencies['@astrojs/ts-plugin']).toBe('1.10.10');
    expect(packageJson.scripts['check:astro']).toBe(
      'astro check --root . --tsconfig tsconfig.astro.json',
    );
    expect(packageJson.scripts['check:types']).toContain('pnpm check:astro');
    expect(packageJson.files).toContain('dist/mdx/astro-components/props.*');
  });

  it('keeps source modules owned by their domains', () => {
    expect(existsSync(join(repoRoot, 'src/exports'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/index.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/tokens.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/react'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/button'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/theme'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/integrations'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/core/css'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/tailwind.css'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/package-exports.test.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/core/index.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/core/core.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/badge/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/badge/badge.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/alert/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/alert/alert.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/avatar/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/avatar/avatar.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/button/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/button/button.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/card/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/card/card.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/code-block/react.tsx'))).toBe(
      true,
    );
    expect(
      existsSync(join(repoRoot, 'src/components/code-block/shiki-react.tsx')),
    ).toBe(false);
    expect(existsSync(join(repoRoot, 'src/components/code-block/code-block.css'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'src/components/code/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/code/code.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/divider/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/divider/divider.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/feedback'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/components/form/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/form/form.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/layout'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/components/link/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/link/link.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/progress/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/progress/progress.css'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'src/components/skeleton/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/skeleton/skeleton.css'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'src/components/overlay/dom.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/overlay/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/overlay/overlay.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/accordion/dom.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/accordion/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/accordion/accordion.css'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'src/components/table/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/table/table.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/tabs/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/tabs/dom.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/tabs/tabs.css'))).toBe(true);
    for (const component of ['combobox', 'menu', 'pin-input', 'toast', 'tooltip']) {
      expect(existsSync(join(repoRoot, `src/components/${component}/dom.ts`))).toBe(
        true,
      );
      expect(existsSync(join(repoRoot, `src/components/${component}/react.tsx`))).toBe(
        true,
      );
      expect(
        existsSync(join(repoRoot, `src/components/${component}/${component}.css`)),
      ).toBe(true);
    }
    for (const component of ['disclosure', 'spinner']) {
      expect(existsSync(join(repoRoot, `src/components/${component}/react.tsx`))).toBe(
        true,
      );
      expect(
        existsSync(join(repoRoot, `src/components/${component}/${component}.css`)),
      ).toBe(true);
    }
    expect(existsSync(join(repoRoot, 'src/mdx/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/mdx/astro.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/mdx/mdx.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/mdx/astro-components/Code.astro'))).toBe(
      true,
    );
    expect(packageJson.exports).not.toHaveProperty('./components/badge/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/accordion/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/alert/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/avatar/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/button/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/code-block/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/code/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/card/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/divider/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/feedback/react');
    expect(packageJson.exports).not.toHaveProperty(
      './components/feedback/feedback.css',
    );
    expect(packageJson.exports).not.toHaveProperty('./components/feedback/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/form/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/layout/react');
    expect(packageJson.exports).not.toHaveProperty('./components/layout/layout.css');
    expect(packageJson.exports).not.toHaveProperty('./components/layout/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/link/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/progress/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/skeleton/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/overlay/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/table/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/tabs/contract');
    expect(packageJson.exports).not.toHaveProperty('./mdx/shared');
    expect(packageJson.exports).not.toHaveProperty('./mdx/astro-code');
    expect(packageJson.exports).not.toHaveProperty('./mdx/astro-components/props');
    expect(packageJson.exports).not.toHaveProperty('./mdx/react-components/Code');
    expect(packageJson.files).toContain('dist/mdx/react-components/*');

    expect(
      readdirSync(join(repoRoot, 'src/components/badge'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/button'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/code-block'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/code'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/form'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual([
      'choice-controls.tsx',
      'contract.ts',
      'field.tsx',
      'input-group.tsx',
      'react.tsx',
      'text-controls.tsx',
    ]);
    expect(
      readdirSync(join(repoRoot, 'src/components/link'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/table'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/overlay'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'dom.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/tabs'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'dom.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/accordion'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'dom.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/mdx'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['astro-code.ts', 'astro.ts', 'react.tsx', 'shared.ts']);
    expect(
      readdirSync(join(repoRoot, 'src/mdx/astro-components'))
        .filter((file) => file.endsWith('.astro'))
        .sort(),
    ).toEqual([
      'Anchor.astro',
      'Blockquote.astro',
      'Break.astro',
      'Code.astro',
      'Delete.astro',
      'Emphasis.astro',
      'FootnoteReference.astro',
      'Heading1.astro',
      'Heading2.astro',
      'Heading3.astro',
      'Heading4.astro',
      'Heading5.astro',
      'Heading6.astro',
      'Image.astro',
      'Input.astro',
      'List.astro',
      'ListItem.astro',
      'OrderedList.astro',
      'Paragraph.astro',
      'Pre.astro',
      'Rule.astro',
      'Section.astro',
      'Strong.astro',
      'Table.astro',
      'TableBody.astro',
      'TableCell.astro',
      'TableHead.astro',
      'TableHeaderCell.astro',
      'TableRow.astro',
      'Wrapper.astro',
    ]);
    expect(existsSync(join(repoRoot, 'src/mdx/astro-components/props.ts'))).toBe(true);
    expect(
      readdirSync(join(repoRoot, 'src/mdx/react-components'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual([
      'Anchor.tsx',
      'Blockquote.tsx',
      'Break.tsx',
      'Code.tsx',
      'Delete.tsx',
      'Emphasis.tsx',
      'FootnoteReference.tsx',
      'Heading1.tsx',
      'Heading2.tsx',
      'Heading3.tsx',
      'Heading4.tsx',
      'Heading5.tsx',
      'Heading6.tsx',
      'Image.tsx',
      'Input.tsx',
      'List.tsx',
      'ListItem.tsx',
      'OrderedList.tsx',
      'Paragraph.tsx',
      'Pre.tsx',
      'Rule.tsx',
      'Section.tsx',
      'Strong.tsx',
      'Table.tsx',
      'TableBody.tsx',
      'TableCell.tsx',
      'TableHead.tsx',
      'TableHeaderCell.tsx',
      'TableRow.tsx',
      'Wrapper.tsx',
      'utils.ts',
    ]);
  });

  it('keeps root executable checks out of scripts', () => {
    expect(existsSync(join(repoRoot, 'scripts/test-dist-package.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'e2e/dist-package-smoke.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'scripts/audit-storybook-scenarios.ts'))).toBe(
      false,
    );
  });
});
