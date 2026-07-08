import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  layout?: 'brand-action' | 'centered' | 'menu';
  action?: boolean;
};

function NavbarStory(controlValues: ComponentStoryProps) {
  const layout = controlValues.layout ?? 'brand-action';
  const action = controlValues.action ?? true;

  return (
    <div className="navbar bg-base-200 rounded-box">
      <div className={layout === 'centered' ? 'navbar-start' : 'flex-1'}>
        <a className="btn btn-ghost text-tinyrack-xl" href="#daisyui-navbar-home">
          Tinyrack
        </a>
      </div>
      {layout === 'centered' ? (
        <div className="navbar-center">
          <a className="btn btn-ghost btn-sm" href="#daisyui-navbar-docs">
            Docs
          </a>
        </div>
      ) : null}
      {layout === 'menu' ? (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="#daisyui-navbar-dashboard">Dashboard</a>
            </li>
          </ul>
        </div>
      ) : null}
      <div className={layout === 'centered' ? 'navbar-end' : 'flex-none'}>
        {action ? (
          <button className="btn btn-primary btn-sm" type="button">
            Apply config
          </button>
        ) : (
          <button className="btn btn-square btn-ghost" type="button">
            Menu
          </button>
        )}
      </div>
    </div>
  );
}

NavbarStory.displayName = 'NavbarStory';

const meta = {
  title: 'daisyUI/Navbar',
  component: NavbarStory,
  tags: ['autodocs'],
  args: {
    layout: 'brand-action',
    action: true,
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['brand-action', 'centered', 'menu'],
      description: 'Navbar content arrangement.',
    },
    action: { control: 'boolean', description: 'Shows the primary navbar action.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI navbar themed preview',
      },
    },
  },
} satisfies Meta<typeof NavbarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
