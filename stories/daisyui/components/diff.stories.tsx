import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  split?: number;
};

function DiffStory(controlValues: ComponentStoryProps) {
  const split = controlValues.split ?? 55;

  return (
    <figure className="diff aspect-video w-80 rounded-box">
      <div className="diff-item-1 bg-primary text-primary-content">
        <div className="grid h-full place-content-center text-lg font-semibold">
          Before
        </div>
      </div>
      <div className="diff-item-2 bg-base-300 text-base-content">
        <div className="grid h-full place-content-center text-lg font-semibold">
          After
        </div>
      </div>
      <div className="diff-resizer" style={{ left: `${String(split)}%` }} />
    </figure>
  );
}

DiffStory.displayName = 'DiffStory';

const meta = {
  title: 'daisyUI/Diff',
  component: DiffStory,
  tags: ['autodocs'],
  args: {
    split: 55,
  },
  argTypes: {
    split: {
      control: {
        type: 'range',
        min: 10,
        max: 90,
        step: 5,
      },
      description: 'Diff split position.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI diff themed preview',
      },
    },
  },
} satisfies Meta<typeof DiffStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
