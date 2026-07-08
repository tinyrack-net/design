import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  ratio?: '16/9' | '4/3' | '1/1';
};

function AspectRatioStory(controlValues: ComponentStoryProps) {
  const ratios = { '16/9': 16 / 9, '4/3': 4 / 3, '1/1': 1 } as const;
  const ratio = controlValues.ratio ?? '16/9';

  return (
    <Mantine.AspectRatio
      ratio={ratios[ratio]}
      className="w-80 rounded-md bg-neutral-800"
    >
      <div className="grid place-content-center text-white">{ratio}</div>
    </Mantine.AspectRatio>
  );
}

AspectRatioStory.displayName = 'AspectRatioStory';

const meta = {
  title: 'Mantine/AspectRatio',
  component: AspectRatioStory,
  tags: ['autodocs'],
  args: {
    ratio: '16/9',
  },
  argTypes: {
    ratio: {
      control: 'select',
      options: ['16/9', '4/3', '1/1'],
      description: 'Aspect ratio value.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core AspectRatio themed preview',
      },
    },
  },
} satisfies Meta<typeof AspectRatioStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
