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
  expanded?: boolean;
};

function FabStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';

  return (
    <div
      className={[
        'fab static',
        (controlValues.expanded ?? true) ? 'fab-flower' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        className={['btn btn-circle fab-main-action', `btn-${tone}`]
          .filter(Boolean)
          .join(' ')}
        type="button"
        aria-label="Floating action"
      >
        +
      </button>
      {(controlValues.expanded ?? true) ? (
        <>
          <button className="btn btn-circle btn-sm" type="button">
            L
          </button>
          <button className="btn btn-circle btn-sm" type="button">
            S
          </button>
        </>
      ) : null}
    </div>
  );
}

FabStory.displayName = 'FabStory';

const meta = {
  title: 'daisyUI/Fab',
  component: FabStory,
  tags: ['autodocs'],
  args: {
    tone: 'primary',
    expanded: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    expanded: {
      control: 'boolean',
      description: 'Shows secondary FAB actions.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI fab themed preview',
      },
    },
  },
} satisfies Meta<typeof FabStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
