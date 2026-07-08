import type { Meta, StoryObj } from '@storybook/react-vite';

function AvatarStory() {
  return (
    <div className="avatar avatar-placeholder">
      <div className="bg-primary text-primary-content w-12 rounded-full">
        <span>TR</span>
      </div>
    </div>
  );
}

AvatarStory.displayName = 'AvatarStory';

const meta = {
  title: 'daisyUI/Avatar',
  component: AvatarStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI avatar themed preview',
      },
    },
  },
} satisfies Meta<typeof AvatarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
