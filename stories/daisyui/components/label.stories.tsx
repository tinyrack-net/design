import type { Meta, StoryObj } from '@storybook/react-vite';

function LabelStory() {
  return (
    <label className="label">
      <span>Label</span>
      <input className="input" placeholder="Value" />
    </label>
  );
}

LabelStory.displayName = 'LabelStory';

const meta = {
  title: 'daisyUI/Label',
  component: LabelStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI label themed preview',
      },
    },
  },
} satisfies Meta<typeof LabelStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
