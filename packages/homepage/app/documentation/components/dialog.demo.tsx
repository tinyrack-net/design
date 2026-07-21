import { TRButton } from '@tinyrack/ui/components/button';
import { TRDialog, type TRDialogPlacement } from '@tinyrack/ui/components/dialog';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRInput } from '@tinyrack/ui/components/input';
import { TRTextarea } from '@tinyrack/ui/components/textarea';
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
  modal: boolean;
  open: boolean;
  placement: TRDialogPlacement;
  title: string;
};

type DialogExampleProps = Partial<DialogStoryArgs> & {
  description?: string;
  longContent?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DialogExample({
  description = 'This restarts the service.',
  modal = true,
  longContent = false,
  open = false,
  placement = 'middle',
  title = 'Deploy changes',
  onOpenChange,
}: DialogExampleProps) {
  const inputId = useId();
  const notesId = useId();
  const [result, setResult] = useState('No changes saved');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <TRDialog.Root {...stateProps} modal={modal}>
      <TRDialog.Trigger>Open dialog</TRDialog.Trigger>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Viewport>
          <TRDialog.Popup placement={placement}>
            <TRDialog.Title>{title}</TRDialog.Title>
            <TRDialog.Description>{description}</TRDialog.Description>
            <div className="tr-dialog-body grid gap-4" data-dialog-scroll-body="">
              {longContent ? (
                <div className="grid gap-3">
                  <p>
                    Confirm the target environment, maintenance window, and rollback
                    owner before saving this deployment.
                  </p>
                  <p>
                    Changes are reviewed against the current rack inventory. Operators
                    can continue reading this body while the title and actions remain in
                    place.
                  </p>
                  <TRField.Root>
                    <TRField.Label htmlFor={notesId}>Rollback notes</TRField.Label>
                    <TRTextarea
                      defaultValue="Restore the previous deployment and verify rack health."
                      id={notesId}
                      name="notes"
                      rows={8}
                    />
                  </TRField.Root>
                </div>
              ) : null}
              <TRForm
                className="grid gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  setResult(`Saved ${new FormData(event.currentTarget).get('rack')}`);
                }}
              >
                <TRField.Root>
                  <TRField.Label htmlFor={inputId}>Rack name</TRField.Label>
                  <TRInput
                    defaultValue="rack-alpha"
                    id={inputId}
                    name="rack"
                    required
                  />
                </TRField.Root>
                <TRButton type="submit">Save changes</TRButton>
              </TRForm>
              <output aria-live="polite">{result}</output>
            </div>
            <TRDialog.Close>Cancel</TRDialog.Close>
          </TRDialog.Popup>
        </TRDialog.Viewport>
      </TRDialog.Portal>
    </TRDialog.Root>
  );
}

const dialogHandle = TRDialog.createHandle<void>();

export function DialogHandleExample() {
  return (
    <>
      <TRDialog.Trigger handle={dialogHandle}>Open detached dialog</TRDialog.Trigger>
      <TRDialog.Root handle={dialogHandle}>
        <TRDialog.Portal>
          <TRDialog.Backdrop />
          <TRDialog.Viewport>
            <TRDialog.Popup placement="middle">
              <TRDialog.Title>Detached trigger</TRDialog.Title>
              <TRDialog.Description>
                A shared handle connects this root to a trigger outside it.
              </TRDialog.Description>
              <TRDialog.Close render={<TRButton variant="secondary" />}>
                Close
              </TRDialog.Close>
            </TRDialog.Popup>
          </TRDialog.Viewport>
        </TRDialog.Portal>
      </TRDialog.Root>
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  parameters: { layout: 'centered' },
  args: {
    modal: true,
    open: false,
    placement: 'middle',
    title: 'Deploy changes',
  },
  argTypes: {
    modal: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['middle', 'top', 'bottom', 'start', 'end'],
    },
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
