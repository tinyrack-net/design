import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('app-shell documentation', () => {
  it('keeps the playground controlled, reset-safe, and fill-layout aware', () => {
    const demo = readHomepage('app/documentation/components/app-shell.demo.tsx');
    const argTypes = demo.slice(
      demo.indexOf('argTypes: {'),
      demo.indexOf('render: function Render'),
    );

    expect(demo).toContain("playgroundLayout: 'fill'");
    expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');
    expect(demo).toContain(
      'onSidebarModeChange={(sidebarMode) => updateArgs({ sidebarMode })}',
    );
    expect(argTypes).not.toContain('open:');
    expect(argTypes).toContain("breakpoint: { options: ['sm', 'lg']");
    expect(argTypes).toContain("options: ['solid', 'outline', 'ghost']");
    expect(argTypes).toContain("layout: { options: ['header-first', 'sidebar-first']");
    expect(argTypes).toContain("mobileSidebar: { options: ['drawer', 'rail']");
    expect(argTypes).toContain(
      "sidebarMode: { options: ['expanded', 'rail'], control: 'radio' }",
    );
  });

  it('keeps every locale complete, localized, realistic, and paste-ready', () => {
    const anatomy = [
      'Root',
      'Header',
      'Sidebar',
      'SidebarLabel',
      'SidebarToggle',
      'Trigger',
      'Close',
      'Main',
    ];

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/app-shell.mdx`);
      const install = docs.slice(
        docs.indexOf('## Install') >= 0
          ? docs.indexOf('## Install')
          : docs.indexOf('## 설치') >= 0
            ? docs.indexOf('## 설치')
            : docs.indexOf('## インストール'),
        docs.indexOf('<ComponentPlayground'),
      );
      expect(install).toContain("install: 'pnpm add @tinyrack/ui'");
      expect(install).toContain("import '@tinyrack/ui/components/app-shell.css';");
      expect(install).toContain(
        "import { TRAppShell } from '@tinyrack/ui/components/app-shell';",
      );
      expect(install).not.toContain('lucide-react');
      expect(install).not.toContain('components/link');
      expect(docs).toContain("import '@tinyrack/ui/components/app-shell.css';");
      expect(docs).toContain("import '@tinyrack/ui/components/link.css';");
      expect(docs).toContain('export function WorkspaceShell()');
      expect(docs).toContain('useState');
      expect(docs).toContain('open={navigationOpen}');
      expect(docs).toContain('onOpenChange={setNavigationOpen}');
      expect(docs).toContain('SSR');
      expect(docs).toContain('--tr-app-shell-drawer-block-size');
      expect(docs).toContain('--tr-app-shell-background');
      for (const part of anatomy) {
        expect(docs).toContain(`\`${part}\``);
      }
      if (locale !== 'en') {
        expect(docs).not.toContain('Switch sidebar mode and mobile behavior');
      }
    }
  });
});
