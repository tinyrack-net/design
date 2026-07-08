import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  active?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
};

function StepperStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Stepper
      active={controlValues.active ?? 1}
      className="w-[min(100%,48rem)] max-w-3xl [&_.mantine-Stepper-steps]:w-full"
      color={controlValues.color ?? 'tinyrack'}
      orientation={controlValues.orientation ?? 'horizontal'}
      size={controlValues.size ?? 'sm'}
    >
      <Mantine.Stepper.Step label="Discover" description="Find nodes" />
      <Mantine.Stepper.Step label="Configure" description="Set routes" />
      <Mantine.Stepper.Step label="Verify" description="Check backups" />
    </Mantine.Stepper>
  );
}

StepperStory.displayName = 'StepperStory';

const meta = {
  title: 'Mantine/Stepper',
  component: StepperStory,
  tags: ['autodocs'],
  args: {
    active: 1,
    orientation: 'horizontal',
    size: 'sm',
    color: 'tinyrack',
  },
  argTypes: {
    active: {
      control: { type: 'number', min: 0, max: 3, step: 1 },
      description: 'Active step index.',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Stepper orientation.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Stepper size token.',
    },
    color: {
      control: 'select',
      options: ['tinyrack', 'blue', 'gray', 'green', 'yellow', 'red'],
      description: 'Active step color token.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Stepper themed preview',
      },
    },
  },
} satisfies Meta<typeof StepperStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
