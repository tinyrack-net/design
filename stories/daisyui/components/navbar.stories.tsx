import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyToneOptions = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const;

type ComponentStoryProps = {
  tone?: (typeof daisyToneOptions)[number];
  active?: 'status' | 'logs';
};

function NavbarStory(controlValues: ComponentStoryProps) {
  const tone = controlValues.tone ?? 'primary';
  const active = controlValues.active ?? 'status';

  return (
    <div className="navbar w-[min(100%,24rem)] rounded-box bg-base-200 px-2">
      <div className="navbar-start min-w-0 flex-1 truncate font-semibold">Tinyrack</div>
      <div className="navbar-center flex-none">
        <div className="join">
          {['status', 'logs'].map((item) => (
            <button
              className={[
                'btn join-item btn-sm',
                active === item ? `btn-${tone}` : 'btn-ghost',
              ]
                .filter(Boolean)
                .join(' ')}
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="navbar-end flex-1 justify-end">
        <button className="btn btn-square btn-ghost btn-sm" type="button">
          TR
        </button>
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
    tone: 'primary',
    active: 'status',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: daisyToneOptions,
      description: 'Color modifier class.',
    },
    active: {
      control: 'select',
      options: ['status', 'logs'],
      description: 'Active navbar action.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
