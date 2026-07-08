import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  style?: 'default' | 'border' | 'lift' | 'box';
  placement?: 'top' | 'bottom';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  activeTab?: 'first' | 'second';
  disabled?: boolean;
};

function TabStory(controlValues: ComponentStoryProps) {
  const style = controlValues.style ?? 'box';
  const placement = controlValues.placement ?? 'top';
  const size = controlValues.size ?? 'md';
  const activeTab = controlValues.activeTab ?? 'first';
  const disabled = controlValues.disabled ?? false;

  return (
    <div
      role="tablist"
      className={[
        'tabs',
        style === 'default' ? undefined : `tabs-${style}`,
        `tabs-${placement}`,
        `tabs-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        aria-selected={activeTab === 'first'}
        role="tab"
        className={['tab', activeTab === 'first' && 'tab-active']
          .filter(Boolean)
          .join(' ')}
        type="button"
      >
        Overview
      </button>
      <button
        aria-selected={activeTab === 'second'}
        role="tab"
        className={[
          'tab',
          activeTab === 'second' && 'tab-active',
          disabled && 'tab-disabled',
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        type="button"
      >
        Logs
      </button>
    </div>
  );
}

TabStory.displayName = 'TabStory';

const meta = {
  title: 'daisyUI/Tab',
  component: TabStory,
  tags: ['autodocs'],
  args: {
    style: 'box',
    placement: 'top',
    size: 'md',
    activeTab: 'first',
    disabled: false,
  },
  argTypes: {
    style: {
      control: 'select',
      options: ['default', 'border', 'lift', 'box'],
      description: 'Tabs container treatment class.',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Tabs placement class.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
    activeTab: {
      control: 'select',
      options: ['first', 'second'],
      description: 'Moves the tab-active state class.',
    },
    disabled: {
      control: 'boolean',
      description: 'Applies tab-disabled to the second tab.',
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
