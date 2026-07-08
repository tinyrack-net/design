import type { Meta, StoryObj } from '@storybook/react-vite';

function TextareaStory() {
  return (
    <textarea
      className="textarea textarea-primary"
      defaultValue="Check backup-sync before restarting nas-01."
    />
  );
}

TextareaStory.displayName = 'TextareaStory';

const meta = {
  title: 'daisyUI/Textarea',
  component: TextareaStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI textarea themed preview',
      },
    },
  },
} satisfies Meta<typeof TextareaStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
