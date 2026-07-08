import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  orientation?: 'horizontal' | 'vertical';
  tone?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  currentStep?: number;
};

function StepsStory(controlValues: ComponentStoryProps) {
  const orientation = controlValues.orientation ?? 'horizontal';
  const tone = controlValues.tone ?? 'primary';
  const currentStep = controlValues.currentStep ?? 2;
  const stepLabels = ['Discover', 'Configure', 'Verify'];

  return (
    <ul
      className={['steps w-[min(100%,40rem)]', `steps-${orientation}`]
        .filter(Boolean)
        .join(' ')}
    >
      {stepLabels.map((label, index) => (
        <li
          className={['step', index < currentStep && `step-${tone}`]
            .filter(Boolean)
            .join(' ')}
          key={label}
        >
          {label}
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
    currentStep: 2,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Steps orientation class.',
    },
    tone: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'accent',
        'neutral',
        'info',
        'success',
        'warning',
        'error',
      ],
      description: 'Color modifier class such as primary, success, or error.',
    },
    currentStep: {
      control: { type: 'number', min: 1, max: 3, step: 1 },
      description: 'Number of active steps.',
    },
  },
  parameters: {
    layout: 'centered',
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
