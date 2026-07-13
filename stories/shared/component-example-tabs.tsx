'use client';

import { LinkIcon } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { Button } from '../../src/components/button/react.js';
import { CodeBlock } from '../../src/components/code-block/react.js';
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from '../../src/components/tabs/react.js';
import { mergeClassNames } from '../../src/mdx/shared.js';

export type ComponentExampleSource = {
  code: string;
  label: string;
  language: BundledLanguage;
};

export type ComponentExampleTabsProps = {
  ariaLabel?: string;
  description?: ReactNode;
  id: string;
  preview: ReactNode;
  previewClassName?: string;
  previewLayout?: 'center' | 'start' | 'stretch';
  sources: readonly ComponentExampleSource[];
  title: string;
};

const sourceOrder = new Map([
  ['HTML', 0],
  ['React', 1],
]);
const formattableSourceLanguages = new Set<BundledLanguage>(['html', 'jsx', 'tsx']);
const previewLayoutClassNames = {
  center: 'content-center items-center justify-items-center',
  start: 'content-start items-start justify-items-start',
  stretch: 'content-start items-start justify-items-stretch',
} as const;
const copyStatusLabels = {
  copied: 'Copied',
  idle: 'Copy',
  unavailable: 'Copy unavailable',
} as const;

type CopyStatus = keyof typeof copyStatusLabels;

function sourceValue(label: string) {
  return `source-${label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`;
}

function orderedSources(sources: readonly ComponentExampleSource[]) {
  return [...sources].sort((firstSource, secondSource) => {
    const firstOrder = sourceOrder.get(firstSource.label) ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = sourceOrder.get(secondSource.label) ?? Number.MAX_SAFE_INTEGER;

    return firstOrder - secondOrder;
  });
}

function closesBlock(line: string) {
  return line.startsWith('</') || /^\)+\}?;?$/.test(line);
}

function opensExpressionBlock(line: string) {
  return /\bmap\([^)]*\)\s*=>\s*\($/.test(line) || /=>\s*\($/.test(line);
}

function opensMarkupBlock(line: string) {
  if (!line.startsWith('<') || line.startsWith('</') || line.startsWith('<!')) {
    return false;
  }

  if (/\/>\s*;?$/.test(line)) {
    return false;
  }

  const tagName = line.match(/^<([A-Za-z][\w.:]*)\b/)?.[1];

  if (tagName === undefined) {
    return false;
  }

  return !line.includes(`</${tagName}>`);
}

function formatNestedMarkupSource(code: string) {
  let depth = 0;

  return code
    .split('\n')
    .map((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.length === 0) {
        return '';
      }

      if (trimmedLine === '>') {
        return `${'  '.repeat(Math.max(0, depth - 1))}${trimmedLine}`;
      }

      if (trimmedLine === '/>') {
        depth = Math.max(0, depth - 1);
        return `${'  '.repeat(depth)}${trimmedLine}`;
      }

      if (closesBlock(trimmedLine)) {
        depth = Math.max(0, depth - 1);
      }

      const formattedLine = `${'  '.repeat(depth)}${trimmedLine}`;

      if (opensExpressionBlock(trimmedLine) || opensMarkupBlock(trimmedLine)) {
        depth += 1;
      }

      return formattedLine;
    })
    .join('\n');
}

function normalizeCode(code: string, language: BundledLanguage) {
  const trimmedCode = code.replace(/^\n+|\n+$/g, '');

  if (!formattableSourceLanguages.has(language)) {
    return trimmedCode;
  }

  return formatNestedMarkupSource(trimmedCode);
}

type ComponentExampleSourcePanelProps = ComponentExampleSource & {
  normalizedCode: string;
  title: string;
};

function ComponentExampleSourcePanel({
  label,
  language,
  normalizedCode,
  title,
}: ComponentExampleSourcePanelProps) {
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

  async function copySource() {
    try {
      if (navigator.clipboard?.writeText === undefined) {
        throw new Error('Clipboard API is unavailable.');
      }

      await navigator.clipboard.writeText(normalizedCode);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('unavailable');
    }
  }

  const copyLabel = copyStatusLabels[copyStatus];

  return (
    <div
      className="relative min-w-0"
      data-component-example-source={label.toLowerCase()}
    >
      <Button
        appearance="solid"
        aria-label={`Copy ${label} source for ${title}`}
        className="absolute top-2 right-2 z-10"
        data-copy-source={label}
        onClick={() => void copySource()}
        size="sm"
      >
        {copyLabel}
      </Button>
      <CodeBlock
        className="m-0 max-w-full overflow-x-auto pr-32"
        code={normalizedCode}
        language={language}
      />
      <span
        aria-atomic="true"
        aria-live="polite"
        className="sr-only"
        data-copy-status={copyStatus}
        role="status"
      >
        {copyStatus === 'idle' ? '' : `${label} source: ${copyLabel}`}
      </span>
    </div>
  );
}

export function ComponentExampleTabs({
  ariaLabel,
  description,
  id,
  preview,
  previewClassName,
  previewLayout = 'center',
  sources,
  title,
}: ComponentExampleTabsProps) {
  const sortedSources = orderedSources(sources).map((source) => ({
    ...source,
    normalizedCode: normalizeCode(source.code, source.language),
  }));
  const headingId = `${id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="my-6 grid min-w-0 scroll-mt-4 gap-3"
      data-component-example=""
      data-component-example-id={id}
      id={id}
    >
      <div className="grid gap-1">
        <h3
          className="m-0 text-tinyrack-lg font-semibold leading-tinyrack-sm"
          id={headingId}
        >
          <a
            className="group inline-flex items-center gap-2 text-inherit no-underline"
            href={`#${id}`}
          >
            {title}
            <LinkIcon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
            <span className="sr-only"> permalink</span>
          </a>
        </h3>
        {description === undefined ? null : (
          <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted">
            {description}
          </p>
        )}
      </div>
      <Tabs
        aria-label={ariaLabel ?? `${title} example`}
        className="min-w-0"
        data-component-example-tabs=""
        defaultValue="preview"
        size="sm"
      >
        <TabsList
          aria-label={ariaLabel ?? `${title} example tabs`}
          className="!overflow-hidden"
        >
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {sortedSources.map((source) => (
            <TabsTrigger key={source.label} value={sourceValue(source.label)}>
              {source.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsPanel value="preview">
          <div
            className={mergeClassNames(
              'grid min-h-40 min-w-0 gap-4 overflow-x-auto p-4 sm:p-6',
              previewLayoutClassNames[previewLayout],
              previewClassName,
            )}
            data-preview-layout={previewLayout}
          >
            {preview}
          </div>
        </TabsPanel>
        {sortedSources.map((source) => (
          <TabsPanel key={source.label} value={sourceValue(source.label)}>
            <ComponentExampleSourcePanel {...source} title={title} />
          </TabsPanel>
        ))}
      </Tabs>
    </section>
  );
}
