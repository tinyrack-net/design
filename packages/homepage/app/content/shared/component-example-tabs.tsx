'use client';

import { CodeBlock } from '@tinyrack/ui/components/code-block';
import { CopyButton } from '@tinyrack/ui/components/copy-button';
import { Link } from '@tinyrack/ui/components/link';
import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import { Tabs } from '@tinyrack/ui/components/tabs';
import { LinkIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';

function mergeClassNames(...classNames: Array<false | null | string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

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

const sourceOrder = new Map([['React', 0]]);
const formattableSourceLanguages = new Set<BundledLanguage>(['html', 'jsx', 'tsx']);
const previewLayoutClassNames = {
  center: 'content-center items-center justify-items-center',
  start: 'content-start items-start justify-items-start',
  stretch: 'content-start items-start justify-items-stretch',
} as const;
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
  return (
    <div
      className="relative min-w-0"
      data-component-example-source={label.toLowerCase()}
    >
      <CopyButton
        appearance="solid"
        aria-label={`Copy ${label} source for ${title}`}
        className="absolute top-2 right-2 z-10"
        data-copy-source={label}
        idleLabel="Copy"
        size="sm"
        value={normalizedCode}
      />
      <CodeBlock
        aria-label={`${label} source for ${title}`}
        className="m-0 w-full min-w-0 max-w-full pr-32"
        code={normalizedCode}
        language={language}
        tabIndex={0}
      />
      <p
        className="m-0 mt-1 text-tinyrack-xs text-tinyrack-text-muted sm:hidden"
        data-code-scroll-hint=""
      >
        Scroll inside the code area to read long lines.
      </p>
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
      className="my-6 grid min-w-0 scroll-mt-20 gap-3 lg:scroll-mt-4"
      data-component-example=""
      data-component-example-id={id}
      id={id}
    >
      <div className="grid gap-1">
        <h3
          className="m-0 text-tinyrack-lg font-semibold leading-tinyrack-sm"
          id={headingId}
        >
          <Link
            className="group inline-flex items-center gap-2 text-inherit no-underline"
            href={`#${id}`}
            underline="none"
          >
            {title}
            <LinkIcon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
            <span className="sr-only" data-pagefind-ignore="all">
              {' '}
              permalink
            </span>
          </Link>
        </h3>
        {description === undefined ? null : (
          <p className="m-0 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted">
            {description}
          </p>
        )}
      </div>
      <Tabs.Root
        aria-label={ariaLabel ?? `${title} example`}
        className="min-w-0"
        data-component-example-tabs=""
        data-pagefind-ignore="all"
        defaultValue="preview"
        size="sm"
      >
        <Tabs.List
          aria-label={ariaLabel ?? `${title} example tabs`}
          className="!overflow-hidden"
        >
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
          {sortedSources.map((source) => (
            <Tabs.Tab key={source.label} value={sourceValue(source.label)}>
              {source.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="preview">
          <ScrollArea.Root variant="plain">
            <ScrollArea.Viewport aria-label={`${title} preview`} tabIndex={0}>
              <ScrollArea.Content
                className="min-h-40 min-w-0"
                style={{ minWidth: '100%' }}
              >
                <div
                  className={mergeClassNames(
                    'grid min-h-40 min-w-0 gap-4 bg-tinyrack-canvas p-4 text-tinyrack-text sm:p-6',
                    previewLayoutClassNames[previewLayout],
                    previewClassName,
                  )}
                  data-component-example-preview-frame=""
                  data-preview-layout={previewLayout}
                >
                  {preview}
                </div>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Panel>
        {sortedSources.map((source) => (
          <Tabs.Panel key={source.label} value={sourceValue(source.label)}>
            <ComponentExampleSourcePanel {...source} title={title} />
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}
