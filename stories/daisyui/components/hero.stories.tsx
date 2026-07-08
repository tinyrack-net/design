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
  overlay?: boolean;
  tone?: (typeof daisyToneOptions)[number];
};

function HeroStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';

  return (
    <section
      className={[
        'hero min-h-56 w-[min(100%,24rem)] overflow-hidden rounded-box',
        `bg-${tone}`,
        `text-${tone}-content`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(controlValues.overlay ?? true) ? (
        <div className="hero-overlay bg-black/30" />
      ) : null}
      <div className="hero-content text-center">
        <div>
          <h1 className="text-2xl font-bold">Rack console</h1>
          <p>Cluster status is healthy.</p>
        </div>
      </div>
    </section>
  );
}

HeroStory.displayName = 'HeroStory';

const meta = {
  title: 'daisyUI/Hero',
  component: HeroStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    overlay: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    overlay: {
      control: 'boolean',
      description: 'Shows hero-overlay layer.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI hero themed preview',
      },
    },
  },
} satisfies Meta<typeof HeroStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
