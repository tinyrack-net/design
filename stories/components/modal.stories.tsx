import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src/components/button/react.js';
import {
  type ModalPlacement,
  type ModalSize,
  modalPlacements,
  modalSizes,
} from '../../src/components/modal/contract.js';
import {
  Modal,
  ModalAction,
  ModalBody,
  ModalBox,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../../src/components/modal/react.js';

type ModalStoryProps = {
  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
  placement: ModalPlacement;
  size: ModalSize;
};

function ModalStory({
  closeOnBackdrop,
  closeOnEscape,
  placement,
  size,
}: ModalStoryProps) {
  return (
    <Modal
      closeOnBackdrop={closeOnBackdrop}
      closeOnEscape={closeOnEscape}
      key={`${closeOnBackdrop}-${closeOnEscape}-${placement}-${size}`}
    >
      <ModalTrigger asChild>
        <Button>Open rack settings</Button>
      </ModalTrigger>
      <ModalContent placement={placement}>
        <ModalBox size={size}>
          <ModalHeader>
            <ModalTitle>Rack settings</ModalTitle>
            <ModalClose>Close</ModalClose>
          </ModalHeader>
          <ModalDescription>
            Update this rack without leaving the current task.
          </ModalDescription>
          <ModalBody>
            Node name, region, and maintenance settings belong here.
          </ModalBody>
          <ModalAction>
            <ModalClose asChild>
              <Button appearance="ghost">Cancel</Button>
            </ModalClose>
            <Button variant="primary">Save</Button>
          </ModalAction>
        </ModalBox>
      </ModalContent>
    </Modal>
  );
}

ModalStory.displayName = 'ModalStory';

const meta = {
  title: 'Components/Modal',
  component: ModalStory,
  args: {
    closeOnBackdrop: true,
    closeOnEscape: true,
    placement: 'middle',
    size: 'md',
  },
  argTypes: {
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Allows the generated visual backdrop to dismiss the Modal.',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Allows Escape to dismiss the topmost Modal.',
    },
    placement: {
      control: 'select',
      options: modalPlacements,
      description: 'Viewport placement, including logical start and end sheets.',
    },
    size: {
      control: 'select',
      options: modalSizes,
      description: 'Convenience maximum width applied to the Modal box.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native dialog primitive with a zero-JavaScript HTML baseline and optional managed coordination.',
      },
    },
  },
} satisfies Meta<typeof ModalStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
