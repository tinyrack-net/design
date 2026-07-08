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
  elevated?: boolean;
};

function Hover3dStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';

  return (
    <div className="hover-3d">
      <div
        className={[
          'rounded-box border border-base-300 p-6',
          `bg-${tone}`,
          `text-${tone}-content`,
          (controlValues.elevated ?? true) ? 'shadow-xl' : 'shadow-sm',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        Hover 3D
      </div>
    </div>
  );
}

Hover3dStory.displayName = 'Hover3dStory';

const meta = {
  title: 'daisyUI/Hover3d',
  component: Hover3dStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    elevated: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    elevated: {
      control: 'boolean',
      description: 'Uses a stronger preview shadow.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI hover3d themed preview',
      },
    },
  },
} satisfies Meta<typeof Hover3dStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
