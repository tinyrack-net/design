import type { Meta, StoryObj } from '@storybook/react-vite';

function TextrotateStory() {
  return (
    <span className="text-rotate">
      <span>Rotate</span>
    </span>
  );
}

TextrotateStory.displayName = 'TextrotateStory';

const meta = {
  title: 'daisyUI/Textrotate',
  component: TextrotateStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI textrotate themed preview',
      },
    },
  },
} satisfies Meta<typeof TextrotateStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
