import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  variant?:
    | 'filled'
    | 'light'
    | 'outline'
    | 'subtle'
    | 'transparent'
    | 'white'
    | 'default'
    | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'tinyrack' | 'blue' | 'gray' | 'green' | 'yellow' | 'red';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
};

function ActionIconStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.ActionIcon
      aria-label="Rack settings"
      color={controlValues.color ?? 'tinyrack'}
      disabled={controlValues.disabled ?? false}
      loading={controlValues.loading ?? false}
      radius={controlValues.radius ?? 'md'}
      size={controlValues.size ?? 'sm'}
      variant={controlValues.variant ?? 'filled'}
    >
      TR
    </Mantine.ActionIcon>
  );
}

ActionIconStory.displayName = 'ActionIconStory';

const meta = {
  title: 'Mantine/ActionIcon',
  component: ActionIconStory,
  tags: ['autodocs'],
  args: {
    variant: 'filled',
    size: 'sm',
    color: 'tinyrack',
    radius: 'md',
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'filled',
        'light',
        'outline',
        'subtle',
        'transparent',
        'white',
        'default',
        'gradient',
      ],
      description: 'Mantine visual variant.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Component size token.',
    },
    color: {
      control: 'select',
      options: ['tinyrack', 'blue', 'gray', 'green', 'yellow', 'red'],
      description: 'Theme color token.',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius token.',
    },
    disabled: { control: 'boolean', description: 'Disabled state.' },
    loading: { control: 'boolean', description: 'Loading state.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core ActionIcon themed preview',
      },
    },
  },
} satisfies Meta<typeof ActionIconStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
