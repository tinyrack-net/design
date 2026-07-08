import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  orientation?: (typeof daisyOrientationOptions)[number];
  size?: (typeof daisySizeOptions)[number];
  selected?: 'status' | 'logs' | 'settings';
};

function MenuStory(controlValues: ComponentStoryProps) {
  const orientation = controlValues.orientation ?? 'vertical';
  const selected = controlValues.selected ?? 'status';
  const size = controlValues.size ?? 'md';

  return (
    <ul
      className={[
        'menu rounded-box bg-base-200',
        `menu-${orientation}`,
        `menu-${size}`,
        orientation === 'vertical' ? 'w-56' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {['status', 'logs', 'settings'].map((item) => (
        <li key={item}>
          <a className={selected === item ? 'menu-active' : undefined} href="#top">
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
}

MenuStory.displayName = 'MenuStory';

const meta = {
  title: 'daisyUI/Menu',
  component: MenuStory,
  tags: ['autodocs'],
  args: {
    orientation: 'vertical',
    size: 'md',
    selected: 'status',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Menu orientation class.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    selected: {
      control: 'select',
      options: ['status', 'logs', 'settings'],
      description: 'Active menu item.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI menu themed preview',
      },
    },
  },
} satisfies Meta<typeof MenuStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
