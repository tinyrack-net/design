import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

const items: readonly TRDocsNavigationItem[] = [
  {
    children: [
      { label: 'Install', path: '/install', type: 'page' },
      { label: 'Configure', path: '/configure', type: 'page' },
    ],
    label: 'Guides',
    type: 'group',
  },
];
type Args = { currentPath: string };
export function DocsNavigationPreview({ currentPath }: Args) {
  return (
    <div className="w-64">
      <TRDocsNavigation currentPath={currentPath} items={items} />
    </div>
  );
}
const meta = {
  args: { currentPath: '/install' },
  argTypes: { currentPath: { control: 'select', options: ['/install', '/configure'] } },
  parameters: { layout: 'centered' },
  render: DocsNavigationPreview,
  title: 'Components/DocsNavigation',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
