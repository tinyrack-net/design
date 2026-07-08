import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  placement?: 'bottom' | 'top' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
};

function DropdownStory(controlValues: ComponentStoryProps) {
  const placement = controlValues.placement ?? 'bottom';
  const align = controlValues.align ?? 'start';

  return (
    <div
      className={[
        'dropdown',
        `dropdown-${placement}`,
        `dropdown-${align}`,
        (controlValues.open ?? true) ? 'dropdown-open' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button tabIndex={0} className="btn btn-primary" type="button">
        Actions
      </button>
      <ul className="dropdown-content menu z-1 w-52 rounded-box bg-base-200 p-2 shadow">
        <li>
          <a href="#top">Restart service</a>
        </li>
        <li>
          <a href="#top">View logs</a>
        </li>
      </ul>
    </div>
  );
}

DropdownStory.displayName = 'DropdownStory';

const meta = {
  title: 'daisyUI/Dropdown',
  component: DropdownStory,
  tags: ['autodocs'],
  args: {
    placement: 'bottom',
    align: 'start',
    open: true,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom', 'top', 'left', 'right'],
      description: 'Dropdown placement class.',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Dropdown alignment class.',
    },
    open: {
      control: 'boolean',
      description: 'Applies dropdown-open state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI dropdown themed preview',
      },
    },
  },
} satisfies Meta<typeof DropdownStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
