import type { Meta, StoryObj } from '@storybook/react-vite';

function CountdownStory() {
  return (
    <span className="countdown font-tinyrack-mono text-tinyrack-2xl">
      <span className="[--value:42]" aria-live="polite">
        42
      </span>
    </span>
  );
}

CountdownStory.displayName = 'CountdownStory';

const meta = {
  title: 'daisyUI/Countdown',
  component: CountdownStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI countdown themed preview',
      },
    },
  },
} satisfies Meta<typeof CountdownStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
