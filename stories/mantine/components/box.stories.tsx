import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mantineColorOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;

const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineSpacingOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  padding?: (typeof mantineSpacingOptions)[number];
  radius?: (typeof mantineRadiusOptions)[number];
  color?: (typeof mantineColorOptions)[number];
};

function BoxStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Box
      bg={controlValues.color ?? 'tinyrack'}
      c="white"
      className="w-72 text-center"
      p={controlValues.padding ?? 'md'}
      style={{
        borderRadius: `var(--mantine-radius-${controlValues.radius ?? 'md'})`,
      }}
    >
      Token backed surface
    </Mantine.Box>
  );
}

BoxStory.displayName = 'BoxStory';

const meta = {
  title: 'Mantine/Box',
  component: BoxStory,
  tags: ['autodocs'],
  args: {
    padding: 'md',
    radius: 'md',
    color: 'tinyrack',
  },
  argTypes: {
    padding: {
      control: 'select',
      options: mantineSpacingOptions,
      description: 'Mantine padding token.',
    },
    radius: {
      control: 'select',
      options: mantineRadiusOptions,
      description: 'Mantine radius token.',
    },
    color: {
      control: 'select',
      options: mantineColorOptions,
      description: 'Mantine theme color token.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Box themed preview',
      },
    },
  },
} satisfies Meta<typeof BoxStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
