import { TRAlertDialog } from '@tinyrack/ui/components/alert-dialog';
import { TRButton } from '@tinyrack/ui/components/button';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  open: boolean;
  disabled: boolean;
};

type AlertDialogPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function AlertDialogPreview({
  label,
  open,
  disabled,
  onOpenChange,
}: AlertDialogPreviewProps) {
  const [result, setResult] = useState('Rack not deleted');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <div>
      <TRAlertDialog.Root {...stateProps}>
        <TRAlertDialog.Trigger disabled={disabled}>{label}</TRAlertDialog.Trigger>
        <TRAlertDialog.Portal>
          <TRAlertDialog.Backdrop />
          <TRAlertDialog.Viewport>
            <TRAlertDialog.Popup>
              <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
              <TRAlertDialog.Description>
                This action cannot be undone.
              </TRAlertDialog.Description>
              <div className="tr-alert-dialog-actions">
                <TRAlertDialog.Close render={<TRButton variant="secondary" />}>
                  Cancel
                </TRAlertDialog.Close>
                <TRAlertDialog.Close
                  onClick={() => setResult('Rack deleted')}
                  render={<TRButton variant="danger" />}
                >
                  Delete rack
                </TRAlertDialog.Close>
              </div>
            </TRAlertDialog.Popup>
          </TRAlertDialog.Viewport>
        </TRAlertDialog.Portal>
      </TRAlertDialog.Root>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

export const alertDialogBasicSource = `import '@tinyrack/ui/components/alert-dialog.css';
import { TRAlertDialog } from '@tinyrack/ui/components/alert-dialog';
import { TRButton } from '@tinyrack/ui/components/button';
import { useState } from 'react';

export function DeleteRackDialog() {
  const [result, setResult] = useState('Rack not deleted');

  return (
    <div>
      <TRAlertDialog.Root>
        <TRAlertDialog.Trigger render={<TRButton variant="danger" />}>
          Delete rack
        </TRAlertDialog.Trigger>
        <TRAlertDialog.Portal>
          <TRAlertDialog.Backdrop />
          <TRAlertDialog.Viewport>
            <TRAlertDialog.Popup>
              <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
              <TRAlertDialog.Description>
                This action cannot be undone.
              </TRAlertDialog.Description>
              <div className="tr-alert-dialog-actions">
                <TRAlertDialog.Close render={<TRButton variant="secondary" />}>
                  Cancel
                </TRAlertDialog.Close>
                <TRAlertDialog.Close
                  onClick={() => setResult('Rack deleted')}
                  render={<TRButton variant="danger" />}
                >
                  Delete rack
                </TRAlertDialog.Close>
              </div>
            </TRAlertDialog.Popup>
          </TRAlertDialog.Viewport>
        </TRAlertDialog.Portal>
      </TRAlertDialog.Root>
      <output aria-live="polite">{result}</output>
    </div>
  );
}`;

export const alertDialogStatesSource = `import '@tinyrack/ui/components/alert-dialog.css';
import { TRAlertDialog } from '@tinyrack/ui/components/alert-dialog';
import { TRButton } from '@tinyrack/ui/components/button';
import { useState } from 'react';

export function ControlledDeleteRackDialog() {
  const [open, setOpen] = useState(false);

  return (
    <TRAlertDialog.Root onOpenChange={setOpen} open={open}>
      <TRAlertDialog.Trigger render={<TRButton variant="danger" />}>
        Delete a rack with a very long mobile confirmation label
      </TRAlertDialog.Trigger>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup>
            <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>
              This action cannot be undone.
            </TRAlertDialog.Description>
            <div className="tr-alert-dialog-actions">
              <TRAlertDialog.Close render={<TRButton variant="secondary" />}>
                Cancel
              </TRAlertDialog.Close>
              <TRAlertDialog.Close render={<TRButton variant="danger" />}>
                Delete rack
              </TRAlertDialog.Close>
            </div>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>
  );
}`;

const meta = {
  title: 'Components/Alert Dialog',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Delete rack',
    open: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <AlertDialogPreview {...args} onOpenChange={(open) => updateArgs({ open })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
