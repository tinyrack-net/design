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
    excerpt: 'Install the package.',
    id: 'install',
    title: 'Installation',
    url: '/install',
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
        onSearch={async () => results}
        onSelect={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
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
