import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  value?: number;
  size?: (typeof daisySizeOptions)[number];
};

function CountdownStory(controlValues: ComponentStoryProps) {
  const value = controlValues.value ?? 42;
  const size = controlValues.size ?? 'md';

  return (
    <span
      className={[
        'countdown font-tinyrack-mono',
        size === 'md' ? 'text-2xl' : `text-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span style={{ '--value': value } as React.CSSProperties} />
    </span>
  );
}

CountdownStory.displayName = 'CountdownStory';

const meta = {
  title: 'daisyUI/Countdown',
  component: CountdownStory,
  tags: ['autodocs'],
  args: {
    value: 42,
    size: 'md',
  },
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 99,
        step: 1,
      },
      description: 'Countdown value custom property.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI countdown themed preview',
      },
    },
  },
} satisfies Meta<typeof CountdownStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
