import type { Meta, StoryObj } from '@storybook/react-vite';

function KbdStory() {
  return <kbd className="kbd">Ctrl</kbd>;
}

KbdStory.displayName = 'KbdStory';

const meta = {
  title: 'daisyUI/Kbd',
  component: KbdStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI kbd themed preview',
      },
    },
  },
} satisfies Meta<typeof KbdStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
