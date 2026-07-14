import {
  Dialog,
  type DialogPlacement,
  type DialogSize,
} from '@tinyrack/ui/components/dialog';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type DialogStoryArgs = {
  description: string;
  modal: boolean;
  open: boolean;
  placement: DialogPlacement;
  size: DialogSize;
  title: string;
};

type DialogExampleProps = Partial<DialogStoryArgs> & {
  longContent?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DialogExample({
  description = 'This restarts the service.',
  modal = true,
  longContent = false,
  open = false,
  placement = 'middle',
  size = 'md',
  title = 'Deploy changes',
  onOpenChange,
}: DialogExampleProps) {
  const inputId = useId();
  const notesId = useId();
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
          <div className="tr-dialog-body grid gap-4" data-dialog-scroll-body="">
            {longContent ? (
              <div className="grid gap-3">
                <p>
                  Confirm the target environment, maintenance window, and rollback owner
                  before saving this deployment.
                </p>
                <p>
                  Changes are reviewed against the current rack inventory. Operators can
                  continue reading this body while the title and actions remain in
                  place.
                </p>
                <label htmlFor={notesId}>Rollback notes</label>
                <textarea
                  defaultValue="Restore the previous deployment and verify rack health."
                  id={notesId}
                  name="notes"
                  rows={8}
                />
              </div>
            ) : null}
            <form
              className="grid gap-2"
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
          </div>
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

export const playground = definePlayground(meta);
