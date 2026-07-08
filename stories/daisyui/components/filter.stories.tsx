import type { Meta, StoryObj } from '@storybook/react-vite';

function FilterStory() {
  return (
    <div className="filter">
      <input
        className="btn filter-reset"
        type="radio"
        name="daisy-filter"
        aria-label="All"
      />
      <input className="btn" type="radio" name="daisy-filter" aria-label="Tag" />
    </div>
  );
}

FilterStory.displayName = 'FilterStory';

const meta = {
  title: 'daisyUI/Filter',
  component: FilterStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI filter themed preview',
      },
    },
  },
} satisfies Meta<typeof FilterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
