import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof daisySizeOptions)[number];
  value?: number;
  half?: boolean;
};

function RatingStory(controlValues: ComponentStoryProps) {
  const value = controlValues.value ?? 4;
  const size = controlValues.size ?? 'md';
  const half = controlValues.half ?? false;

  return (
    <div
      className={['rating', `rating-${size}`, half ? 'rating-half' : undefined]
        .filter(Boolean)
        .join(' ')}
    >
      {[1, 2, 3, 4, 5].map((item) => (
        <input
          aria-label={`${String(item)} star`}
          checked={value === item}
          className="mask mask-star-2 bg-warning"
          key={item}
          name="rating-preview"
          readOnly
          type="radio"
        />
      ))}
    </div>
  );
}

RatingStory.displayName = 'RatingStory';

const meta = {
  title: 'daisyUI/Rating',
  component: RatingStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    value: 4,
    half: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    value: {
      control: {
        type: 'number',
        min: 1,
        max: 5,
        step: 1,
      },
      description: 'Selected rating value.',
    },
    half: {
      control: 'boolean',
      description: 'Applies rating-half class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
