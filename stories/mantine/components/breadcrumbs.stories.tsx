import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof mantineSizeOptions)[number];
  separator?: '/' | '>' | '-';
};

function BreadcrumbsStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Breadcrumbs separator={controlValues.separator ?? '/'}>
      <Mantine.Anchor size={controlValues.size ?? 'sm'}>Rack</Mantine.Anchor>
      <Mantine.Anchor size={controlValues.size ?? 'sm'}>Services</Mantine.Anchor>
      <Mantine.Text size={controlValues.size ?? 'sm'}>nas-01</Mantine.Text>
    </Mantine.Breadcrumbs>
  );
}

BreadcrumbsStory.displayName = 'BreadcrumbsStory';

const meta = {
  title: 'Mantine/Breadcrumbs',
  component: BreadcrumbsStory,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    separator: '/',
  },
  argTypes: {
    size: {
      control: 'select',
      options: mantineSizeOptions,
      description: 'Mantine size token.',
    },
    separator: {
      control: 'select',
      options: ['/', '>', '-'],
      description: 'Breadcrumb separator.',
    },
  },
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
