import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  value?: number;
  thousandSeparator?: boolean;
  decimalScale?: number;
  prefix?: '$' | '';
};

function NumberFormatterStory(controlValues: ComponentStoryProps) {
  return (
    <Mantine.Text size="xl" fw={700}>
      <Mantine.NumberFormatter
        decimalScale={controlValues.decimalScale ?? 0}
        prefix={controlValues.prefix ?? ''}
        thousandSeparator={controlValues.thousandSeparator ?? true}
        value={controlValues.value ?? 12800}
      />
    </Mantine.Text>
  );
}

NumberFormatterStory.displayName = 'NumberFormatterStory';

const meta = {
  title: 'Mantine/NumberFormatter',
  component: NumberFormatterStory,
  tags: ['autodocs'],
  args: {
    value: 12800,
    thousandSeparator: true,
    decimalScale: 0,
    prefix: '',
  },
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 100000,
        step: 100,
      },
      description: 'Formatted numeric value.',
    },
    thousandSeparator: {
      control: 'boolean',
      description: 'Uses thousand separators.',
    },
    decimalScale: {
      control: {
        type: 'number',
        min: 0,
        max: 3,
        step: 1,
      },
      description: 'Decimal places.',
    },
    prefix: {
      control: 'select',
      options: ['', '$'],
      description: 'Number prefix.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core NumberFormatter themed preview',
      },
    },
  },
} satisfies Meta<typeof NumberFormatterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
