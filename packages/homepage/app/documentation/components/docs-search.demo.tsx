import {
  TRDocsSearch,
  type TRDocsSearchResult,
  type TRDocsSearchTriggerProps,
} from '@tinyrack/ui/components/docs-search';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

const results: readonly TRDocsSearchResult[] = [
  {
    excerpt: 'Install the UI package and import the component stylesheet.',
    excerptMatches: [{ end: 7, start: 0 }],
    id: 'install',
    section: 'Getting started',
    title: 'Installation',
    titleMatches: [{ end: 7, start: 0 }],
    url: '/install',
  },
  {
    excerpt: 'Configure localized messages and keyboard shortcuts.',
    id: 'localization',
    section: 'Guides',
    title: 'Localization',
    url: '/localization',
  },
];
type Args = {
  compact: boolean;
  disabled: boolean;
  label: string;
  shortcutLabel: string;
  uiSize: NonNullable<TRDocsSearchTriggerProps['uiSize']>;
};

export function DocsSearchPreview({
  compact,
  disabled,
  label,
  shortcutLabel,
  uiSize,
}: Args) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TRDocsSearch.Trigger
        aria-label={label}
        compact={compact}
        disabled={disabled}
        label={label}
        onClick={() => setOpen(true)}
        shortcutLabel={shortcutLabel}
        uiSize={uiSize}
      />
      <TRDocsSearch.Dialog
        enableShortcut={false}
        onOpenChange={setOpen}
        onSearch={async (query) => {
          const normalizedQuery = query.toLocaleLowerCase();
          return results.filter((result) =>
            `${result.title} ${result.section ?? ''} ${result.excerpt}`
              .toLocaleLowerCase()
              .includes(normalizedQuery),
          );
        }}
        onSelect={() => setOpen(false)}
        open={open}
      />
    </>
  );
}

export const docsSearchBasicSource = `import '@tinyrack/ui/components/docs-search.css';
import {
  TRDocsSearch,
  type TRDocsSearchResult,
} from '@tinyrack/ui/components/docs-search';
import { useRef, useState } from 'react';

async function searchDocs(query: string, signal: AbortSignal) {
  const response = await fetch(
    \`/api/docs-search?q=\${encodeURIComponent(query)}\`,
    { signal },
  );
  if (!response.ok) throw new Error('Documentation search failed');
  const payload = (await response.json()) as {
    results: readonly TRDocsSearchResult[];
  };
  if (signal.aborted) return [];
  return payload.results;
}

export function DocumentationSearch() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <TRDocsSearch.Trigger
        label="Search docs"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        shortcutLabel="Ctrl / ⌘ K"
      />
      <TRDocsSearch.Dialog
        messages={{ error: 'Search is temporarily unavailable.' }}
        onOpenChange={setOpen}
        onSearch={searchDocs}
        onSelect={(result) => window.location.assign(result.url)}
        open={open}
        returnFocusRef={triggerRef}
      />
    </>
  );
}`;

const meta = {
  args: {
    compact: false,
    disabled: false,
    label: 'Search docs',
    shortcutLabel: 'Ctrl / ⌘ K',
    uiSize: 'md',
  },
  argTypes: {
    compact: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    shortcutLabel: { control: 'text' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'centered' },
  render: DocsSearchPreview,
  title: 'Components/DocsSearch',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
