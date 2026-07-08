import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  wrap?: boolean;
  selected?: 'nas' | 'router' | 'ups';
};

function ListStory(controlValues: ComponentStoryProps) {
  const selected = controlValues.selected ?? 'nas';

  return (
    <ul className="list w-96 rounded-box bg-base-100 shadow-sm">
      {['nas', 'router', 'ups'].map((item) => (
        <li
          className={['list-row', selected === item ? 'bg-base-200' : undefined]
            .filter(Boolean)
            .join(' ')}
          key={item}
        >
          <div className="avatar placeholder">
            <div className="w-10 rounded-box bg-neutral text-neutral-content">
              <span>{item.slice(0, 2).toUpperCase()}</span>
            </div>
          </div>
          <div
            className={
              (controlValues.wrap ?? false) ? 'list-col-wrap' : 'list-col-grow'
            }
          >
            {item}
          </div>
        </li>
      ))}
    </ul>
  );
}

ListStory.displayName = 'ListStory';

const meta = {
  title: 'daisyUI/List',
  component: ListStory,
  tags: ['autodocs'],
  args: {
    selected: 'nas',
    wrap: false,
  },
  argTypes: {
    selected: {
      control: 'select',
      options: ['nas', 'router', 'ups'],
      description: 'Highlighted list row.',
    },
    wrap: {
      control: 'boolean',
      description: 'Uses list-col-wrap for row content.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI list themed preview',
      },
    },
  },
} satisfies Meta<typeof ListStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
