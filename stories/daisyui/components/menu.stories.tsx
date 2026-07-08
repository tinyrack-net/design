import type { Meta, StoryObj } from '@storybook/react-vite';

function MenuStory() {
  return (
    <ul className="menu bg-base-200 rounded-box w-48">
      <li>
        <a href="#daisyui-menu-item">Menu item</a>
      </li>
      <li>
        <a href="#daisyui-menu-second-item">Second item</a>
      </li>
    </ul>
  );
}

MenuStory.displayName = 'MenuStory';

const meta = {
  title: 'daisyUI/Menu',
  component: MenuStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI menu themed preview',
      },
    },
  },
} satisfies Meta<typeof MenuStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
