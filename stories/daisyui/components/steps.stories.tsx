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

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  orientation?: (typeof daisyOrientationOptions)[number];
  tone?: (typeof daisyToneOptions)[number];
  activeStep?: number;
};

function StepsStory(controlValues: ComponentStoryProps) {
  const activeStep = controlValues.activeStep ?? 2;
  const tone = controlValues.tone ?? 'primary';
  const orientation = controlValues.orientation ?? 'horizontal';

  return (
    <ul className={['steps', `steps-${orientation}`].filter(Boolean).join(' ')}>
      {[1, 2, 3].map((step) => (
        <li
          className={['step', step <= activeStep ? `step-${tone}` : undefined]
            .filter(Boolean)
            .join(' ')}
          key={step}
        >
          Step {step}
        </li>
      ))}
    </ul>
  );
}

StepsStory.displayName = 'StepsStory';

const meta = {
  title: 'daisyUI/Steps',
  component: StepsStory,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    tone: 'primary',
    activeStep: 2,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Steps orientation class.',
    },
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    activeStep: {
      control: {
        type: 'number',
        min: 1,
        max: 3,
        step: 1,
      },
      description: 'Last active step.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI steps themed preview',
      },
    },
  },
} satisfies Meta<typeof StepsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
