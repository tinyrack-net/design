import type { Meta, StoryObj } from '@storybook/react-vite';

function IndicatorStory() {
  return (
    <div className="indicator">
      <span className="indicator-item badge badge-secondary">new</span>
      <button className="btn" type="button">
        Inbox
      </button>
    </div>
  );
}

IndicatorStory.displayName = 'IndicatorStory';

const meta = {
  title: 'daisyUI/Indicator',
  component: IndicatorStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI indicator themed preview',
      },
    },
  },
} satisfies Meta<typeof IndicatorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
