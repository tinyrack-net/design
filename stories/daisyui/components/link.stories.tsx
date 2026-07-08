import type { Meta, StoryObj } from '@storybook/react-vite';

function LinkStory() {
  return (
    <a className="link link-primary" href="#daisyui-link-preview">
      Tinyrack link
    </a>
  );
}

LinkStory.displayName = 'LinkStory';

const meta = {
  title: 'daisyUI/Link',
  component: LinkStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI link themed preview',
      },
    },
  },
} satisfies Meta<typeof LinkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
