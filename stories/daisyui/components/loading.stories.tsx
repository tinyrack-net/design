import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const daisyLoadingStyleOptions = [
  'spinner',
  'dots',
  'ring',
  'ball',
  'bars',
  'infinity',
] as const;

type ComponentStoryProps = {
  style?: (typeof daisyLoadingStyleOptions)[number];
  size?: (typeof daisySizeOptions)[number];
};

function LoadingStory(controlValues: ComponentStoryProps) {
  const style = controlValues.style ?? 'spinner';
  const size = controlValues.size ?? 'md';

  return (
    <span
      className={['loading', `loading-${style}`, `loading-${size}`]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

LoadingStory.displayName = 'LoadingStory';

const meta = {
  title: 'daisyUI/Loading',
  component: LoadingStory,
  tags: ['autodocs'],
  args: {
    style: 'spinner',
    size: 'md',
  },
  argTypes: {
    style: {
      control: 'select',
      options: daisyLoadingStyleOptions,
      description: 'Loading animation class.',
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
        component: 'daisyUI loading themed preview',
      },
    },
  },
} satisfies Meta<typeof LoadingStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
