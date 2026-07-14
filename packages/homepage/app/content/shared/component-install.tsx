'use client';

import { CodeBlock } from '@tinyrack/ui/components/code-block';
import { CopyButton } from '@tinyrack/ui/components/copy-button';
import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import { Tabs } from '@tinyrack/ui/components/tabs';
import type { BundledLanguage } from 'shiki/bundle/web';

export type ComponentInstallSurface = {
  imports: readonly string[];
  install: string;
  label: string;
  language?: BundledLanguage;
  note?: string;
};

export type ComponentInstallProps = {
  surfaces: readonly ComponentInstallSurface[];
};

function surfaceValue(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function languageForImports(
  imports: readonly string[],
  language: BundledLanguage | undefined,
): BundledLanguage {
  if (language !== undefined) {
    return language;
  }

  const source = imports.join('\n').trim();

  if (source.startsWith('@import') || source.includes('.css";')) {
    return 'css';
  }

  if (source.startsWith('<')) {
    return 'html';
  }

  return 'tsx';
}

type InstallCodeBlockProps = {
  code: string;
  label: string;
  language: BundledLanguage;
};

function InstallCodeBlock({ code, label, language }: InstallCodeBlockProps) {
  return (
    <div className="relative min-w-0">
      <CopyButton
        appearance="solid"
        aria-label={`Copy ${label}`}
        className="absolute top-2 right-2 z-10"
        data-install-copy={label}
        idleLabel="Copy"
        size="sm"
        value={code}
      />
      <CodeBlock className="m-0 max-w-full pr-32" code={code} language={language} />
    </div>
  );
}

export function ComponentInstall({ surfaces }: ComponentInstallProps) {
  const firstSurface = surfaces[0];

  if (firstSurface === undefined) {
    return null;
  }

  return (
    <Tabs.Root
      aria-label="Installation options"
      className="min-w-0"
      data-component-install=""
      data-pagefind-ignore="all"
      defaultValue={surfaceValue(firstSurface.label)}
      size="sm"
    >
      <ScrollArea.Root variant="plain">
        <ScrollArea.Viewport>
          <ScrollArea.Content className="min-w-max">
            <Tabs.List aria-label="Installation target">
              {surfaces.map((surface) => (
                <Tabs.Tab
                  key={`${surface.label}-${surface.install}`}
                  value={surfaceValue(surface.label)}
                >
                  {surface.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      {surfaces.map((surface) => {
        const importCode = surface.imports.join('\n').replace(/\r\n?/g, '\n').trim();
        const value = surfaceValue(surface.label);

        return (
          <Tabs.Panel
            className="!border-0 !bg-transparent !p-0"
            key={`${surface.label}-${surface.install}`}
            value={value}
          >
            <div className="grid min-w-0 gap-5 pt-5">
              {surface.note === undefined ? null : (
                <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted">
                  {surface.note}
                </p>
              )}
              <section className="grid min-w-0 gap-2">
                <h3 className="m-0 text-tinyrack-sm font-semibold leading-tinyrack-sm">
                  1. Install dependencies
                </h3>
                <InstallCodeBlock
                  code={surface.install.trim()}
                  label={`${surface.label} install command`}
                  language="shellscript"
                />
              </section>
              <section className="grid min-w-0 gap-2">
                <h3 className="m-0 text-tinyrack-sm font-semibold leading-tinyrack-sm">
                  2. Add to your app
                </h3>
                <InstallCodeBlock
                  code={importCode}
                  label={`${surface.label} usage code`}
                  language={languageForImports(surface.imports, surface.language)}
                />
              </section>
            </div>
          </Tabs.Panel>
        );
      })}
    </Tabs.Root>
  );
}
