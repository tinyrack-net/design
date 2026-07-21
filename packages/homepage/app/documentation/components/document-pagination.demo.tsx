import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { direction: 'both' | 'next' | 'previous' };
const previous = { path: '/install', title: 'Installation' };
const next = { path: '/configure', title: 'Configuration' };
export function DocumentPaginationPreview({ direction }: Args) {
  return (
    <TRDocumentPagination
      {...(direction === 'next'
        ? { next }
        : direction === 'previous'
          ? { previous }
          : { next, previous })}
    />
  );
}
const meta = {
  args: { direction: 'both' },
  argTypes: { direction: { control: 'select', options: ['both', 'previous', 'next'] } },
  parameters: { layout: 'centered' },
  render: DocumentPaginationPreview,
  title: 'Components/DocumentPagination',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
