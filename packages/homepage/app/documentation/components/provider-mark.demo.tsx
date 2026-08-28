import { TRProviderMark } from '@tinyrack/ui/components/provider-mark';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Args = Record<string, never>;

export function ProviderMarkPreview() {
  return (
    <div className="flex items-center gap-3" data-docs-example-item="">
      <TRProviderMark provider="google" />
      <TRProviderMark provider="github" />
      <TRProviderMark provider="apple" />
    </div>
  );
}

const meta = {
  args: {},
  argTypes: {},
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  render: ProviderMarkPreview,
  title: 'Components/Provider Mark',
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
