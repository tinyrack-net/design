import type { Meta, StoryObj } from '@storybook/react-vite';

function DividerStory() {
  return <div className="divider">Divider</div>;
}

DividerStory.displayName = 'DividerStory';

const meta = {
  title: 'daisyUI/Divider',
  component: DividerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI divider themed preview',
      },
    },
  },
} satisfies Meta<typeof DividerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
