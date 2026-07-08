import type { Meta, StoryObj } from '@storybook/react-vite';

function StatStory() {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">Themes</div>
        <div className="stat-value">3</div>
      </div>
    </div>
  );
}

StatStory.displayName = 'StatStory';

const meta = {
  title: 'daisyUI/Stat',
  component: StatStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI stat themed preview',
      },
    },
  },
} satisfies Meta<typeof StatStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
