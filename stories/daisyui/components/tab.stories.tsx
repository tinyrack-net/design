import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const daisyTabStyleOptions = ['border', 'lift', 'box'] as const;

type ComponentStoryProps = {
  style?: (typeof daisyTabStyleOptions)[number];
  size?: (typeof daisySizeOptions)[number];
  placement?: 'top' | 'bottom';
  active?: 'status' | 'logs' | 'settings';
};

function TabStory(controlValues: ComponentStoryProps) {
  const style = controlValues.style ?? 'border';
  const size = controlValues.size ?? 'md';
  const placement = controlValues.placement ?? 'top';
  const active = controlValues.active ?? 'status';

  return (
    <div
      role="tablist"
      className={['tabs', `tabs-${style}`, `tabs-${size}`, `tabs-${placement}`]
        .filter(Boolean)
        .join(' ')}
    >
      {['status', 'logs', 'settings'].map((item) => (
        <button
          className={['tab', active === item ? 'tab-active' : undefined]
            .filter(Boolean)
            .join(' ')}
          key={item}
          role="tab"
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

TabStory.displayName = 'TabStory';

const meta = {
  title: 'daisyUI/Tab',
  component: TabStory,
  tags: ['autodocs'],
  args: {
    style: 'border',
    size: 'md',
    placement: 'top',
    active: 'status',
  },
  argTypes: {
    style: {
      control: 'select',
      options: daisyTabStyleOptions,
      description: 'Tabs treatment class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Tab placement class.',
    },
    active: {
      control: 'select',
      options: ['status', 'logs', 'settings'],
      description: 'Active tab.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI tab themed preview',
      },
    },
  },
} satisfies Meta<typeof TabStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
