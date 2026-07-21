import {
  TRDocsSearch,
  type TRDocsSearchResult,
} from '@tinyrack/ui/components/docs-search';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

const results: readonly TRDocsSearchResult[] = [
  {
    excerpt: 'Install the package.',
    id: 'install',
    title: 'Installation',
    url: '/install',
  },
];
type Args = { open: boolean };
export function DocsSearchPreview({ open: initialOpen }: Args) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <TRDocsSearch.Trigger onClick={() => setOpen(true)} />
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
  args: { open: false },
  argTypes: {},
  parameters: { layout: 'centered' },
  render: DocsSearchPreview,
  title: 'Components/DocsSearch',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
