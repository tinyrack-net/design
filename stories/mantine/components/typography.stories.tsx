import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function TypographyStory() {
  return (
    <Mantine.Typography>
      <h3>Typography</h3>
      <p>Document content preview.</p>
    </Mantine.Typography>
  );
}

TypographyStory.displayName = 'TypographyStory';

const meta = {
  title: 'Mantine/Typography',
  component: TypographyStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Typography themed preview',
      },
    },
  },
} satisfies Meta<typeof TypographyStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
