import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function IndicatorStory() {
  return (
    <Mantine.Indicator label="new">
      <Mantine.Avatar radius="sm">TR</Mantine.Avatar>
    </Mantine.Indicator>
  );
}

IndicatorStory.displayName = 'IndicatorStory';

const meta = {
  title: 'Mantine/Indicator',
  component: IndicatorStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Indicator themed preview',
      },
    },
  },
} satisfies Meta<typeof IndicatorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
