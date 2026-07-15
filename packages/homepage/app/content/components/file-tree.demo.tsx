import { FileTree } from '@tinyrack/ui/components/file-tree';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { open: boolean };
export function FileTreePreview({ open }: Args) {
  return (
    <FileTree.Root>
      <FileTree.Directory defaultOpen={open} name="src">
        <FileTree.Root>
          <FileTree.File>index.ts</FileTree.File>
        </FileTree.Root>
      </FileTree.Directory>
      <FileTree.File>package.json</FileTree.File>
    </FileTree.Root>
  );
}
const meta = {
  args: { open: true },
  argTypes: { open: { control: 'boolean' } },
  parameters: { layout: 'centered' },
  render: FileTreePreview,
  title: 'Components/FileTree',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
