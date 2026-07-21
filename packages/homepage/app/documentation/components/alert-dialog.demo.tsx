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
  handleMode: boolean;
};

const alertDialogHandle = TRAlertDialog.createHandle<void>();

type AlertDialogPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function AlertDialogPreview({
  label,
  open,
  disabled,
  handleMode,
  onOpenChange,
}: AlertDialogPreviewProps) {
  const [result, setResult] = useState('Rack not deleted');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <div>
      <TRAlertDialog.Root
        {...stateProps}
        handle={handleMode ? alertDialogHandle : undefined}
      >
        <TRAlertDialog.Trigger
          disabled={disabled}
          handle={handleMode ? alertDialogHandle : undefined}
        >
          {label}
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
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Alert Dialog',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Delete rack',
    open: false,
    disabled: false,
    handleMode: false,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    handleMode: { control: 'boolean' },
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
