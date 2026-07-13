import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import {
  Dialog,
  type DialogPlacement,
  type DialogSize,
} from '../../src/components/dialog/index.js';

type DialogStoryArgs = {
  description: string;
  modal: boolean;
  open: boolean;
  placement: DialogPlacement;
  size: DialogSize;
  title: string;
};

type DialogExampleProps = Partial<DialogStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

export function DialogExample({
  description = 'This restarts the service.',
  modal = true,
  open = false,
  placement = 'middle',
  size = 'md',
  title = 'Deploy changes',
  onOpenChange,
}: DialogExampleProps) {
  const inputId = useId();
  const [result, setResult] = useState('No changes saved');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <Dialog.Root {...stateProps} modal={modal}>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup placement={placement} size={size}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setResult(`Saved ${new FormData(event.currentTarget).get('rack')}`);
            }}
          >
            <label htmlFor={inputId}>Rack name</label>
            <input defaultValue="rack-alpha" id={inputId} name="rack" required />
            <button type="submit">Save changes</button>
          </form>
          <output aria-live="polite">{result}</output>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const meta = {
  title: 'Components/Dialog',
  parameters: { layout: 'centered' },
  args: {
    description: 'This restarts the service.',
    modal: true,
    open: false,
    placement: 'middle',
    size: 'md',
    title: 'Deploy changes',
  },
  argTypes: {
    description: { control: 'text' },
    modal: { control: 'boolean' },
    open: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['middle', 'top', 'bottom', 'start', 'end'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    title: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DialogStoryArgs>();

    return <DialogExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<DialogStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
