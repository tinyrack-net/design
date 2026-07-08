import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  orientation?: (typeof daisyOrientationOptions)[number];
  snap?: 'start' | 'center' | 'end';
};

function CarouselStory(controlValues: ComponentStoryProps) {
  const orientation = controlValues.orientation ?? 'horizontal';
  const snap = controlValues.snap ?? 'center';

  return (
    <div
      className={[
        'carousel w-80 rounded-box bg-base-200',
        `carousel-${orientation}`,
        orientation === 'horizontal' ? 'h-32' : 'h-56',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {['Router', 'NAS', 'UPS'].map((item) => (
        <div
          className={['carousel-item w-full place-content-center', `carousel-${snap}`]
            .filter(Boolean)
            .join(' ')}
          key={item}
        >
          <div className="grid h-full w-full place-content-center bg-base-300 text-lg font-semibold">
            {item}
          </div>
        </div>
      ))}
    </div>
  );
}

CarouselStory.displayName = 'CarouselStory';

const meta = {
  title: 'daisyUI/Carousel',
  component: CarouselStory,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    snap: 'center',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Carousel direction class.',
    },
    snap: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Carousel item snap alignment class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
