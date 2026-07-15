import { TableOfContents } from '@tinyrack/ui/components/table-of-contents';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

const items = [
  { depth: 2 as const, id: 'install', label: 'Install' },
  { depth: 3 as const, id: 'configure', label: 'Configure' },
];
type Args = { currentHeading: string };
export function TableOfContentsPreview({ currentHeading }: Args) {
  return <TableOfContents currentHeading={currentHeading} items={items} />;
}
const meta = {
  args: { currentHeading: 'install' },
  argTypes: {
    currentHeading: { control: 'select', options: ['install', 'configure'] },
  },
  parameters: { layout: 'centered' },
  render: TableOfContentsPreview,
  title: 'Components/TableOfContents',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
