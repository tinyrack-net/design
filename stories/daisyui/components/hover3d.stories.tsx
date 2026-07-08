import type { Meta, StoryObj } from '@storybook/react-vite';

function Hover3dStory() {
  return (
    <div className="hover-3d">
      <div className="bg-base-200 border border-base-300 rounded-box p-4">Hover 3D</div>
    </div>
  );
}

Hover3dStory.displayName = 'Hover3dStory';

const meta = {
  title: 'daisyUI/Hover3d',
  component: Hover3dStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI hover3d themed preview',
      },
    },
  },
} satisfies Meta<typeof Hover3dStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
