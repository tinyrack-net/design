import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  placement?: 'bottom' | 'top' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  hover?: boolean;
};

function DropdownStory(controlValues: ComponentStoryProps) {
  const placement = controlValues.placement ?? 'bottom';
  const align = controlValues.align ?? 'start';
  const open = controlValues.open ?? true;
  const hover = controlValues.hover ?? false;

  return (
    <div
      className={[
        'dropdown',
        `dropdown-${placement}`,
        align === 'start' ? undefined : `dropdown-${align}`,
        open && 'dropdown-open',
        hover && 'dropdown-hover',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button tabIndex={0} className="btn btn-sm" type="button">
        Dropdown
      </button>
      <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow">
        <li>
          <a href="#daisyui-dropdown-item">Item</a>
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
    hover: false,
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
      description: 'Dropdown horizontal alignment class.',
    },
    open: { control: 'boolean', description: 'Applies the dropdown-open state class.' },
    hover: {
      control: 'boolean',
      description: 'Applies the dropdown-hover trigger class.',
    },
  },
  parameters: {
    layout: 'centered',
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
