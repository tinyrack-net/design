import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof daisySizeOptions)[number];
};

function KbdStory(controlValues: ComponentStoryProps) {
  return (
    <kbd
      className={['kbd', `kbd-${controlValues.size ?? 'md'}`].filter(Boolean).join(' ')}
    >
      Ctrl K
    </kbd>
  );
}

KbdStory.displayName = 'KbdStory';

const meta = {
  title: 'daisyUI/Kbd',
  component: KbdStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
  argTypes: {
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
        component: 'daisyUI kbd themed preview',
      },
    },
  },
} satisfies Meta<typeof KbdStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
