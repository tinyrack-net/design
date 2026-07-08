import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

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
  const expanded = controlValues.expanded ?? true;
  const expandedActionStyle: CSSProperties | undefined = expanded
    ? { opacity: 1, scale: '1', visibility: 'visible' }
    : undefined;

  return (
    <div className="relative h-40 w-40 rounded-box border border-base-300 bg-base-200">
      <div
        className={['fab', expanded ? 'fab-flower' : undefined]
          .filter(Boolean)
          .join(' ')}
        style={{ bottom: '1rem', position: 'absolute', right: '1rem' }}
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
        {expanded ? (
          <>
            <button
              className="btn btn-circle btn-sm"
              type="button"
              style={expandedActionStyle}
            >
              L
            </button>
            <button
              className="btn btn-circle btn-sm"
              type="button"
              style={expandedActionStyle}
            >
              S
            </button>
          </>
        ) : null}
      </div>
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
    layout: 'fullscreen',
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
