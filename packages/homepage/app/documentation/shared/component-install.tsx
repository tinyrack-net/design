'use client';

import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import { TRCopyButton } from '@tinyrack/ui/components/copy-button';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';
import { TRTabs } from '@tinyrack/ui/components/tabs';
import type { BundledLanguage } from 'shiki/bundle/web';
import { demoCopy, useDemoLocale } from './demo-locale.js';

export type ComponentInstallSurface = {
  codeImports?: readonly string[];
  imports?: readonly string[];
  install: string;
  label: string;
  language?: BundledLanguage;
  note?: string;
  styleImports?: readonly string[];
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

function resolveStyleImports(surface: ComponentInstallSurface) {
  return surface.styleImports ?? [];
}

function resolveCodeImports(surface: ComponentInstallSurface) {
  if (surface.codeImports !== undefined) {
    return surface.codeImports;
  }

  return surface.imports ?? [];
}

type InstallCodeBlockProps = {
  code: string;
  label: string;
  language: BundledLanguage;
  locale: ReturnType<typeof useDemoLocale>;
  copyKey: string;
};

function InstallCodeBlock({
  code,
  copyKey,
  label,
  language,
  locale,
}: InstallCodeBlockProps) {
  const copy = demoCopy[locale];

  return (
    <div className="relative min-w-0">
      <TRCopyButton
        appearance="solid"
        aria-label={copy.copyLabel(label)}
        className="absolute top-2 right-2 z-10"
        copiedLabel={copy.copied}
        data-install-copy={copyKey}
        idleLabel={copy.copy}
        uiSize="sm"
        unavailableLabel={copy.copyUnavailable}
        value={code}
      />
      <TRCodeBlock
        aria-label={label}
        className="m-0 w-full min-w-0 max-w-full pr-32"
        code={code}
        language={language}
        tabIndex={0}
      />
      <p
        className="m-0 mt-1 text-tinyrack-xs text-tinyrack-text-muted sm:hidden"
        data-code-scroll-hint=""
      >
        {copy.scrollHint}
      </p>
    </div>
  );
}

function InstallSectionHeading({ id, label }: { id: string; label: string }) {
  return (
    <h4
      className="m-0 text-tinyrack-xs font-semibold uppercase tracking-tinyrack-wide text-tinyrack-text-muted"
      id={id}
    >
      {label}
    </h4>
  );
}

export function ComponentInstall({ surfaces }: ComponentInstallProps) {
  const locale = useDemoLocale();
  const copy = demoCopy[locale];
  const firstSurface = surfaces[0];

  if (firstSurface === undefined) {
    return null;
  }

  return (
    <TRTabs.Root
      aria-label={copy.installationOptions}
      className="min-w-0"
      data-component-install=""
      data-pagefind-ignore="all"
      defaultValue={surfaceValue(firstSurface.label)}
      uiSize="sm"
    >
      <TRScrollArea.Root variant="plain">
        <TRScrollArea.Viewport aria-label={copy.installationTargets} tabIndex={0}>
          <TRScrollArea.Content className="min-w-max">
            <TRTabs.List aria-label={copy.installationTarget}>
              {surfaces.map((surface) => (
                <TRTabs.Tab
                  key={`${surface.label}-${surface.install}`}
                  value={surfaceValue(surface.label)}
                >
                  {surface.label}
                </TRTabs.Tab>
              ))}
            </TRTabs.List>
          </TRScrollArea.Content>
        </TRScrollArea.Viewport>
        <TRScrollArea.Scrollbar orientation="horizontal">
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
      </TRScrollArea.Root>
      {surfaces.map((surface) => {
        const styleImports = resolveStyleImports(surface);
        const codeImports = resolveCodeImports(surface);
        const styleCode = styleImports.join('\n').replace(/\r\n?/g, '\n').trim();
        const codeCode = codeImports.join('\n').replace(/\r\n?/g, '\n').trim();
        const value = surfaceValue(surface.label);

        return (
          <TRTabs.Panel
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
              <div className="grid min-w-0 gap-2">
                <InstallCodeBlock
                  code={surface.install.trim()}
                  copyKey={`${value}-install`}
                  label={copy.installCommand(surface.label)}
                  language="shellscript"
                  locale={locale}
                />
              </div>
              {styleCode === '' ? null : (
                <div className="grid min-w-0 gap-2" data-install-styles={surface.label}>
                  <InstallSectionHeading
                    id={`${value}-styles-heading`}
                    label={copy.styles}
                  />
                  <InstallCodeBlock
                    code={styleCode}
                    copyKey={`${value}-styles`}
                    label={copy.installStyles(surface.label)}
                    language="css"
                    locale={locale}
                  />
                </div>
              )}
              {codeCode === '' ? null : (
                <div
                  className="grid min-w-0 gap-2"
                  data-install-imports={surface.label}
                >
                  <InstallSectionHeading
                    id={`${value}-imports-heading`}
                    label={copy.imports}
                  />
                  <InstallCodeBlock
                    code={codeCode}
                    copyKey={`${value}-imports`}
                    label={copy.installImports(surface.label)}
                    language="tsx"
                    locale={locale}
                  />
                </div>
              )}
            </div>
          </TRTabs.Panel>
        );
      })}
    </TRTabs.Root>
  );
}
