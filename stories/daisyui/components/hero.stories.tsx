import type { Meta, StoryObj } from '@storybook/react-vite';

function HeroStory() {
  return (
    <div className="hero bg-base-200 min-h-32">
      <div className="hero-content text-center">
        <div>
          <h3 className="text-tinyrack-xl font-bold">Rack console</h3>
          <p>Node status preview</p>
        </div>
      </div>
    </div>
  );
}

HeroStory.displayName = 'HeroStory';

const meta = {
  title: 'daisyUI/Hero',
  component: HeroStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI hero themed preview',
      },
    },
  },
} satisfies Meta<typeof HeroStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
