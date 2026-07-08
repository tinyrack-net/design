import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  side?: 'start' | 'end';
  open?: boolean;
};

function DrawerStory(controlValues: ComponentStoryProps) {
  const side = controlValues.side ?? 'start';

  return (
    <div
      className={[
        'drawer h-56 w-[min(100%,24rem)] overflow-hidden rounded-box bg-base-200',
        side === 'end' ? 'drawer-end' : undefined,
        (controlValues.open ?? true) ? 'drawer-open' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        className="drawer-toggle"
        readOnly
        type="checkbox"
        checked={controlValues.open ?? true}
      />
      <div className="drawer-content grid place-content-center">
        <button className="btn btn-primary" type="button">
          Content
        </button>
      </div>
      <div className="drawer-side absolute inset-y-0">
        <div className="min-h-full w-32 bg-base-300 p-4 sm:w-36">Drawer</div>
      </div>
    </div>
  );
}

DrawerStory.displayName = 'DrawerStory';

const meta = {
  title: 'daisyUI/Drawer',
  component: DrawerStory,
  tags: ['autodocs'],
  args: {
    side: 'start',
    open: true,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Drawer side class.',
    },
    open: {
      control: 'boolean',
      description: 'Applies drawer-open state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI drawer themed preview',
      },
    },
  },
} satisfies Meta<typeof DrawerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
