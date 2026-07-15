import { Steps } from '@tinyrack/ui/components/steps';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { count: number };
export function StepsPreview({ count }: Args) {
  return (
    <Steps.Root>
      {['Install the package', 'Create the config', 'Build the site']
        .slice(0, count)
        .map((label) => (
          <Steps.Item key={label}>
            <strong>{label}</strong>
          </Steps.Item>
        ))}
    </Steps.Root>
  );
}
const meta = {
  args: { count: 3 },
  argTypes: { count: { control: 'number' } },
  parameters: { layout: 'centered' },
  render: StepsPreview,
  title: 'Components/Steps',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
