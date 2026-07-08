import type { Meta, StoryObj } from '@storybook/react-vite';

function SelectStory() {
  return (
    <select className="select select-primary" defaultValue="theme">
      <option value="theme">Theme</option>
    </select>
  );
}

SelectStory.displayName = 'SelectStory';

const meta = {
  title: 'daisyUI/Select',
  component: SelectStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI select themed preview',
      },
    },
  },
} satisfies Meta<typeof SelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
