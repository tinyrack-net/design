import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof daisySizeOptions)[number];
  active?: 'hosts' | 'logs' | 'settings';
};

function DockStory(controlValues: ComponentStoryProps) {
  const active = controlValues.active ?? 'hosts';
  const size = controlValues.size ?? 'md';

  return (
    <nav
      className={['dock static w-80 rounded-box border border-base-300', `dock-${size}`]
        .filter(Boolean)
        .join(' ')}
    >
      {['hosts', 'logs', 'settings'].map((item) => (
        <button
          className={active === item ? 'dock-active' : undefined}
          key={item}
          type="button"
        >
          <span>{item.slice(0, 2).toUpperCase()}</span>
          <span className="dock-label">{item}</span>
        </button>
      ))}
    </nav>
  );
}

DockStory.displayName = 'DockStory';

const meta = {
  title: 'daisyUI/Dock',
  component: DockStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    active: 'hosts',
  },
  argTypes: {
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    active: {
      control: 'select',
      options: ['hosts', 'logs', 'settings'],
      description: 'Active dock item.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI dock themed preview',
      },
    },
  },
} satisfies Meta<typeof DockStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
