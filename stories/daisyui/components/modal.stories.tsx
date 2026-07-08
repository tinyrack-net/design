import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  placement?: 'top' | 'middle' | 'bottom' | 'start' | 'end';
  open?: boolean;
};

function ModalStory(controlValues: ComponentStoryProps) {
  const placement = controlValues.placement ?? 'middle';

  return (
    <div
      className={[
        'modal relative h-56 w-96 rounded-box bg-base-200',
        `modal-${placement}`,
        (controlValues.open ?? true) ? 'modal-open' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="modal-box">
        <h3 className="font-bold">Restart service?</h3>
        <p className="py-2">This will restart the selected container.</p>
        <div className="modal-action">
          <button className="btn btn-primary btn-sm" type="button">
            Confirm
          </button>
        </div>
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
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'middle', 'bottom', 'start', 'end'],
      description: 'Modal placement class.',
    },
    open: {
      control: 'boolean',
      description: 'Applies modal-open state.',
    },
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
