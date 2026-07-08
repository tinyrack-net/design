import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyMaskShapeOptions = [
  'squircle',
  'decagon',
  'diamond',
  'heart',
  'hexagon',
  'hexagon-2',
  'circle',
  'pentagon',
  'star',
  'star-2',
  'triangle',
  'triangle-2',
  'triangle-3',
  'triangle-4',
] as const;

type ComponentStoryProps = {
  shape?: (typeof daisyMaskShapeOptions)[number];
  half?: 'none' | 'half-1' | 'half-2';
};

function MaskStory(controlValues: ComponentStoryProps) {
  const shape = controlValues.shape ?? 'squircle';
  const half = controlValues.half ?? 'none';

  return (
    <div
      className={[
        'mask h-28 w-28 bg-primary',
        `mask-${shape}`,
        half === 'none' ? undefined : `mask-${half}`,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

MaskStory.displayName = 'MaskStory';

const meta = {
  title: 'daisyUI/Mask',
  component: MaskStory,
  tags: ['autodocs'],
  args: {
    shape: 'squircle',
    half: 'none',
  },
  argTypes: {
    shape: {
      control: 'select',
      options: daisyMaskShapeOptions,
      description: 'Mask shape class.',
    },
    half: {
      control: 'select',
      options: ['none', 'half-1', 'half-2'],
      description: 'Mask half clipping class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI mask themed preview',
      },
    },
  },
} satisfies Meta<typeof MaskStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
