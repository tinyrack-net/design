import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  indicator?: 'arrow' | 'plus';
  open?: boolean;
};

function CollapseStory(controlValues: ComponentStoryProps) {
  const indicator = controlValues.indicator ?? 'arrow';

  return (
    <div
      className={[
        'collapse w-80 bg-base-200',
        `collapse-${indicator}`,
        (controlValues.open ?? true) ? 'collapse-open' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="collapse-title font-semibold">Maintenance notes</div>
      <div className="collapse-content">
        <p>Router firmware check is scheduled tonight.</p>
      </div>
    </div>
  );
}

CollapseStory.displayName = 'CollapseStory';

const meta = {
  title: 'daisyUI/Collapse',
  component: CollapseStory,
  tags: ['autodocs'],
  args: {
    indicator: 'arrow',
    open: true,
  },
  argTypes: {
    indicator: {
      control: 'select',
      options: ['arrow', 'plus'],
      description: 'Collapse indicator class.',
    },
    open: {
      control: 'boolean',
      description: 'Applies collapse-open state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI collapse themed preview',
      },
    },
  },
} satisfies Meta<typeof CollapseStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
