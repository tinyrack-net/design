import { CopyButton } from '@tinyrack/ui/components/copy-button';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = { copiedLabel: string; idleLabel: string; value: string };

export function CopyButtonPreview(args: StoryArgs) {
  return <CopyButton {...args} />;
}

const meta = {
  title: 'Components/CopyButton',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    copiedLabel: 'Copied',
    idleLabel: 'Copy command',
    value: 'pnpm add @tinyrack/ui',
  },
  argTypes: {
    copiedLabel: { control: 'text' },
    idleLabel: { control: 'text' },
    value: { control: 'text' },
  },
  render: (args) => <CopyButtonPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
