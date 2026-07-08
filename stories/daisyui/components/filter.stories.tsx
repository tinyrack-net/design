import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  active?: 'all' | 'network' | 'storage';
  size?: (typeof daisySizeOptions)[number];
};

function FilterStory(controlValues: ComponentStoryProps) {
  const active = controlValues.active ?? 'network';
  const size = controlValues.size ?? 'md';

  return (
    <div className="filter">
      {['all', 'network', 'storage'].map((item) => (
        <input
          aria-label={item}
          checked={active === item}
          className={['btn', item === 'all' ? 'filter-reset' : undefined, `btn-${size}`]
            .filter(Boolean)
            .join(' ')}
          key={item}
          name="daisy-filter"
          readOnly
          type="radio"
        />
      ))}
    </div>
  );
}

FilterStory.displayName = 'FilterStory';

const meta = {
  title: 'daisyUI/Filter',
  component: FilterStory,
  tags: ['autodocs'],
  args: {
    active: 'network',
    size: 'md',
  },
  argTypes: {
    active: {
      control: 'select',
      options: ['all', 'network', 'storage'],
      description: 'Active filter option.',
    },
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI filter themed preview',
      },
    },
  },
} satisfies Meta<typeof FilterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
