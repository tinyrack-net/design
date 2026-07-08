import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  active?: 'one' | 'two' | 'three';
};

function HovergalleryStory(controlValues: ComponentStoryProps) {
  const active = controlValues.active ?? 'two';
  const columns = {
    one: 'minmax(7rem, 2.8fr) minmax(4.25rem, 1fr) minmax(4.25rem, 1fr)',
    two: 'minmax(4.25rem, 1fr) minmax(7rem, 2.8fr) minmax(4.25rem, 1fr)',
    three: 'minmax(4.25rem, 1fr) minmax(4.25rem, 1fr) minmax(7rem, 2.8fr)',
  }[active];

  return (
    <div
      className="hovergallery grid w-[min(100%,22rem)] gap-2"
      style={{ gridTemplateColumns: columns }}
    >
      {['one', 'two', 'three'].map((item) => (
        <div
          className={[
            'grid min-h-16 min-w-0 place-items-center overflow-hidden rounded-box bg-base-200 p-4 text-center transition-all',
            active === item ? 'bg-primary text-primary-content' : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
          key={item}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

HovergalleryStory.displayName = 'HovergalleryStory';

const meta = {
  title: 'daisyUI/Hovergallery',
  component: HovergalleryStory,
  tags: ['autodocs'],
  args: {
    active: 'two',
  },
  argTypes: {
    active: {
      control: 'select',
      options: ['one', 'two', 'three'],
      description: 'Expanded gallery item.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
