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

function ButtonStory(controlValues: ComponentStoryProps) {
  const color = controlValues.color ?? 'tinyrack';
  const disabled = controlValues.disabled ?? false;
  const loading = controlValues.loading ?? false;
  const radius = controlValues.radius ?? 'md';
  const size = controlValues.size ?? 'sm';
  const variant = controlValues.variant ?? 'filled';

  return (
    <Mantine.Stack
      className="grid w-[min(100%,42rem)] max-w-full min-w-0 box-border gap-3"
      gap="sm"
    >
      <Mantine.Group className="flex min-w-0 flex-wrap items-center gap-2" gap="xs">
        <Mantine.Button
          color={color}
          disabled={disabled}
          loading={loading}
          radius={radius}
          size={size}
          variant={variant}
        >
          Apply config
        </Mantine.Button>
        <Mantine.Button color={color} radius={radius} size={size} variant="default">
          Open logs
        </Mantine.Button>
        <Mantine.Button
          color={color}
          disabled
          radius={radius}
          size={size}
          variant={variant}
        >
          Paused
        </Mantine.Button>
        <Mantine.Button
          color={color}
          loading
          radius={radius}
          size={size}
          variant={variant}
        >
          Applying
        </Mantine.Button>
      </Mantine.Group>
    </Mantine.Stack>
  );
}

ButtonStory.displayName = 'ButtonStory';

const meta = {
  title: 'Mantine/Button',
  component: ButtonStory,
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
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Button themed preview',
      },
    },
  },
} satisfies Meta<typeof ButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
