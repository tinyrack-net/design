import { TRCode } from '@tinyrack/ui/components/code';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type CodeStoryArgs = { children: string };

const meta = {
  title: 'Components/Code',
  component: TRCode,
  parameters: { layout: 'centered' },
  args: { children: 'pnpm verify' },
  argTypes: {
    children: { control: 'textarea' },
  },
  render: ({ children }) => (
    <p className="m-0 max-w-80">
      Run <TRCode>{children}</TRCode> before publishing.
    </p>
  ),
} satisfies Meta<CodeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
