import type { Meta, StoryObj } from '@storybook/react-vite';

function FileinputStory() {
  return (
    <input
      aria-label="File input"
      type="file"
      className="file-input file-input-primary"
    />
  );
}

FileinputStory.displayName = 'FileinputStory';

const meta = {
  title: 'daisyUI/Fileinput',
  component: FileinputStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI fileinput themed preview',
      },
    },
  },
} satisfies Meta<typeof FileinputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
