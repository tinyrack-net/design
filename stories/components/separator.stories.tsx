import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Separator,
  type SeparatorOrientation,
} from '../../src/components/separator/index.js';

type SeparatorStoryArgs = { decorative: boolean; orientation: SeparatorOrientation };

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  args: { decorative: false, orientation: 'horizontal' },
  argTypes: {
    decorative: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  render: ({ decorative, orientation }) =>
    orientation === 'vertical' ? (
      <div className="flex h-16 items-center gap-4">
        <span>CPU</span>
        <Separator
          orientation="vertical"
          role={decorative ? 'presentation' : 'separator'}
        />
        <span>Memory</span>
      </div>
    ) : (
      <div className="grid w-80 gap-3">
        <span>Overview</span>
        <Separator role={decorative ? 'presentation' : 'separator'} />
        <span>Network</span>
      </div>
    ),
} satisfies Meta<SeparatorStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
