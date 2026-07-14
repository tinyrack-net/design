'use client';

import { Button } from '@tinyrack/ui/components/button';
import { CodeBlock } from '@tinyrack/ui/components/code-block';
import { Tabs } from '@tinyrack/ui/components/tabs';
import { useEffect, useState } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { copyDocsSource } from './copy-docs-source.js';

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

const copyStatusLabels = {
  copied: 'Copied',
  idle: 'Copy',
  unavailable: 'Copy unavailable',
} as const;

type CopyStatus = keyof typeof copyStatusLabels;

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
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (copyStatus === 'idle') {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setCopyStatus('idle');
    }, 2000);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [copyStatus]);

  async function copyCode() {
    setCopyStatus((await copyDocsSource(code)) ? 'copied' : 'unavailable');
  }

  const copyLabel = copyStatusLabels[copyStatus];

  return (
    <div className="relative min-w-0">
      <Button
        appearance="solid"
        aria-label={`Copy ${label}`}
        className="absolute top-2 right-2 z-10"
        data-install-copy={label}
        onClick={() => void copyCode()}
        size="sm"
      >
        {copyLabel}
      </Button>
      <CodeBlock
        className="m-0 max-w-full overflow-x-auto pr-32"
        code={code}
        language={language}
      />
      <span
        aria-atomic="true"
        aria-live="polite"
        className="sr-only"
        data-install-copy-status={copyStatus}
        role="status"
      >
        {copyStatus === 'idle' ? '' : `${label}: ${copyLabel}`}
      </span>
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
      defaultValue={surfaceValue(firstSurface.label)}
      size="sm"
    >
      <Tabs.List
        aria-label="Installation target"
        className="!overflow-x-auto !overflow-y-hidden"
      >
        {surfaces.map((surface) => (
          <Tabs.Tab
            key={`${surface.label}-${surface.install}`}
            value={surfaceValue(surface.label)}
          >
            {surface.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
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
