import type { Meta, StoryObj } from '@storybook/react-vite';

function CollapseStory() {
  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title">Collapse</div>
      <div className="collapse-content">Content</div>
    </div>
  );
}

CollapseStory.displayName = 'CollapseStory';

const meta = {
  title: 'daisyUI/Collapse',
  component: CollapseStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI collapse themed preview',
      },
    },
  },
} satisfies Meta<typeof CollapseStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
