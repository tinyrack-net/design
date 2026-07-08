import type { Meta, StoryObj } from '@storybook/react-vite';

function ListStory() {
  return (
    <ul className="list bg-base-100 rounded-box shadow">
      <li className="list-row">List item</li>
    </ul>
  );
}

ListStory.displayName = 'ListStory';

const meta = {
  title: 'daisyUI/List',
  component: ListStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI list themed preview',
      },
    },
  },
} satisfies Meta<typeof ListStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
