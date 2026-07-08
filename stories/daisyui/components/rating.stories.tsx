import type { Meta, StoryObj } from '@storybook/react-vite';

function RatingStory() {
  return (
    <div className="rating">
      <input
        type="radio"
        name="rating-preview"
        className="mask mask-star-2 bg-orange-400"
        aria-label="1 star"
      />
      <input
        type="radio"
        name="rating-preview"
        className="mask mask-star-2 bg-orange-400"
        aria-label="2 stars"
        defaultChecked
      />
    </div>
  );
}

RatingStory.displayName = 'RatingStory';

const meta = {
  title: 'daisyUI/Rating',
  component: RatingStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI rating themed preview',
      },
    },
  },
} satisfies Meta<typeof RatingStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
