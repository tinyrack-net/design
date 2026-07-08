import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyToneOptions = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  hover?: boolean;
};

function LinkStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';

  return (
    <a
      className={[
        'link',
        `link-${tone}`,
        (controlValues.hover ?? false) ? 'link-hover' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      href="#top"
    >
      Open node details
    </a>
  );
}

LinkStory.displayName = 'LinkStory';

const meta = {
  title: 'daisyUI/Link',
  component: LinkStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    hover: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    hover: {
      control: 'boolean',
      description: 'Applies link-hover behavior.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI link themed preview',
      },
    },
  },
} satisfies Meta<typeof LinkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
