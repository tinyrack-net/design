import type { Meta, StoryObj } from '@storybook/react-vite';

function HovergalleryStory() {
  return (
    <div className="hovergallery">
      <img
        alt="gallery"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 48'%3E%3Crect width='80' height='48' fill='%231762ae'/%3E%3C/svg%3E"
      />
    </div>
  );
}

HovergalleryStory.displayName = 'HovergalleryStory';

const meta = {
  title: 'daisyUI/Hovergallery',
  component: HovergalleryStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI hovergallery themed preview',
      },
    },
  },
} satisfies Meta<typeof HovergalleryStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
