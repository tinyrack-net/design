import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function BreadcrumbsStory() {
  return (
    <Mantine.Breadcrumbs>
      <Mantine.Anchor href="#">Home</Mantine.Anchor>
      <Mantine.Anchor href="#">Themes</Mantine.Anchor>
    </Mantine.Breadcrumbs>
  );
}

BreadcrumbsStory.displayName = 'BreadcrumbsStory';

const meta = {
  title: 'Mantine/Breadcrumbs',
  component: BreadcrumbsStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Breadcrumbs themed preview',
      },
    },
  },
} satisfies Meta<typeof BreadcrumbsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
