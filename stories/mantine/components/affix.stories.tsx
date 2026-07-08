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

type ComponentStoryProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: (typeof mantineColorOptions)[number];
};

function AffixStory(controlValues: ComponentStoryProps) {
  const position = controlValues.position ?? 'bottom-right';
  const [vertical, horizontal] = position.split('-') as [
    'top' | 'bottom',
    'left' | 'right',
  ];

  return (
    <Mantine.Box className="relative h-40 w-80 rounded-md border border-neutral-700">
      <Mantine.Affix
        position={{ [vertical]: 16, [horizontal]: 16 }}
        style={{ position: 'absolute' }}
        withinPortal={false}
      >
        <Mantine.Button color={controlValues.color ?? 'tinyrack'} size="xs">
          Affix
        </Mantine.Button>
      </Mantine.Affix>
    </Mantine.Box>
  );
}

AffixStory.displayName = 'AffixStory';

const meta = {
  title: 'Mantine/Affix',
  component: AffixStory,
  tags: ['autodocs'],
  args: {
    position: 'bottom-right',
    color: 'tinyrack',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Affix corner position.',
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
        component: '@mantine/core Affix themed preview',
      },
    },
  },
} satisfies Meta<typeof AffixStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
