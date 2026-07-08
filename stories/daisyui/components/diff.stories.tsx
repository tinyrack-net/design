import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  split?: number;
};

function DiffStory(controlValues: ComponentStoryProps) {
  const split = controlValues.split ?? 55;
  const leadingPaneWidth = `${String(split)}cqi`;
  const trailingPaneWidth = `${String(100 - split)}cqi`;

  return (
    <figure className="diff aspect-video w-[min(100%,24rem)] rounded-box">
      <div className="diff-item-1">
        <div
          className="grid h-full place-content-center bg-primary text-lg font-semibold text-primary-content"
          style={{ width: leadingPaneWidth }}
        >
          Before
        </div>
      </div>
      <div className="diff-item-2">
        <div
          className="grid h-full place-content-center bg-base-300 text-lg font-semibold text-base-content"
          style={{ left: leadingPaneWidth, width: trailingPaneWidth }}
        >
          After
        </div>
      </div>
      <div className="diff-resizer" style={{ width: leadingPaneWidth }} />
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
    layout: 'fullscreen',
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
