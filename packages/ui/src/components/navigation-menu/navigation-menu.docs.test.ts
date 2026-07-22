import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('navigation-menu documentation', () => {
  it('keeps controlled open state wired to interaction and reset-safe args', () => {
    const demo = readHomepage('app/documentation/components/navigation-menu.demo.tsx');
    const argTypes = demo.slice(
      demo.indexOf('argTypes: {'),
      demo.indexOf('render: function Render'),
    );

    expect(demo).toContain('value,');
    expect(demo).toContain('onValueChange: (nextValue: unknown)');
    expect(demo).toContain('updateArgs({ openSection })');
    expect(demo).toContain("openSection: 'none'");
    expect(argTypes).not.toContain('openSection:');
    expect(demo).toContain('export function NavigationMenuResponsivePreview({');
    expect(demo).not.toContain('NavigationMenuResponsiveAlternative');
    expect(demo).toContain('className="grid min-h-20 content-center gap-1 px-4 py-3"');
    expect(demo).toContain("import { Menu, X } from 'lucide-react';");
    expect(demo).toContain('className="size-11 min-h-11 justify-center px-0"');
    expect(demo).toContain('href="#access"');
  });

  it('keeps all locales complete, localized, and paste-ready', () => {
    const anatomy = [
      'Root',
      'List',
      'Item',
      'Trigger',
      'Icon',
      'Content',
      'Portal',
      'Backdrop',
      'Positioner',
      'Popup',
      'Arrow',
      'Viewport',
      'Link',
    ];

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/navigation-menu.mdx`);
      expect(docs).toContain("import '@tinyrack/ui/components/drawer.css';");
      expect(docs).toContain("import '@tinyrack/ui/components/link.css';");
      expect(docs).toContain('export function SiteHeader()');
      expect(docs).toContain('export function ControlledNavigation()');
      expect(docs).toContain('export function ResponsiveNavigation()');
      expect(docs).toContain('value={value} onValueChange={setValue}');
      expect(docs).toContain('closeOnClick');
      expect(docs).toContain('SSR');
      expect(docs).toContain('--tr-navigation-menu-popup-max-width');
      expect(docs).toContain('`sideOffset`');
      expect(docs).toContain('`ChevronDown`');
      expect(docs).toContain(`locale="${locale}"`);
      for (const part of anatomy) {
        expect(docs).toContain(`\`${part}\``);
      }
      if (locale !== 'en') {
        expect(docs).not.toContain(
          'Use TRNavigationMenu for a site header with a brand',
        );
      }
    }
  });
});
