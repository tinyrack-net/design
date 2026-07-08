import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  placement?: 'top' | 'middle' | 'bottom' | 'start' | 'end';
  open?: boolean;
  actions?: boolean;
};

function ModalStory(controlValues: ComponentStoryProps) {
  const placement = controlValues.placement ?? 'middle';
  const open = controlValues.open ?? true;
  const actions = controlValues.actions ?? true;

  return (
    <div
      className={['modal relative', open && 'modal-open', `modal-${placement}`]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="modal-box">
        <h3 className="font-bold">Restart service</h3>
        <p>Restarting reverse-proxy will briefly interrupt local routing.</p>
        {actions ? (
          <div className="modal-action">
            <button className="btn btn-ghost btn-sm" type="button">
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" type="button">
              Restart
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

ModalStory.displayName = 'ModalStory';

const meta = {
  title: 'daisyUI/Modal',
  component: ModalStory,
  tags: ['autodocs'],
  args: {
    placement: 'middle',
    open: true,
    actions: true,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'middle', 'bottom', 'start', 'end'],
      description: 'Modal placement class.',
    },
    open: { control: 'boolean', description: 'Applies the modal-open state class.' },
    actions: { control: 'boolean', description: 'Shows modal-action buttons.' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI modal themed preview',
      },
    },
  },
} satisfies Meta<typeof ModalStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
