import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function BurgerStory() {
  return <Mantine.Burger opened={false} aria-label="Toggle navigation" />;
}

BurgerStory.displayName = 'BurgerStory';

const meta = {
  title: 'Mantine/Burger',
  component: BurgerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Burger themed preview',
      },
    },
  },
} satisfies Meta<typeof BurgerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
