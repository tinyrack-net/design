import type { Meta, StoryObj } from '@storybook/react-vite';

function CarouselStory() {
  return (
    <div className="carousel w-full max-w-xs">
      <div className="carousel-item w-full">
        <div className="bg-primary text-primary-content p-6 w-full text-center">
          Slide
        </div>
      </div>
    </div>
  );
}

CarouselStory.displayName = 'CarouselStory';

const meta = {
  title: 'daisyUI/Carousel',
  component: CarouselStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI carousel themed preview',
      },
    },
  },
} satisfies Meta<typeof CarouselStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
