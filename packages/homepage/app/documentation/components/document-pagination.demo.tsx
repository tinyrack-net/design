import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';
import { TRLink } from '@tinyrack/ui/components/link';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { direction: 'both' | 'next' | 'previous' };
const previous = {
  description: 'Add Tinyrack UI and its component styles to your application.',
  label: 'Guide',
  path: '/install',
  title: 'Installation',
};
const next = {
  description: 'Choose the defaults and tokens for your documentation site.',
  label: 'Guide',
  path: '/configure',
  title: 'Configuration',
};
export function DocumentPaginationPreview({ direction }: Args) {
  return (
    <TRDocumentPagination
      {...(direction === 'next'
        ? { next }
        : direction === 'previous'
          ? { previous }
          : { next, previous })}
      renderLink={(destination) => (
        <TRLink href={destination.path} onClick={(event) => event.preventDefault()} />
      )}
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
