import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { AlertDialog } from '../../src/components/alert-dialog/index.js';

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
      <AlertDialog.Root {...stateProps}>
        <AlertDialog.Trigger disabled={disabled}>{label}</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Viewport>
            <AlertDialog.Popup>
              <AlertDialog.Title>Delete rack?</AlertDialog.Title>
              <AlertDialog.Description>
                This action cannot be undone.
              </AlertDialog.Description>
              <AlertDialog.Close>Cancel</AlertDialog.Close>
              <AlertDialog.Close onClick={() => setResult('Rack deleted')}>
                Delete rack
              </AlertDialog.Close>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>
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
  },
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
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
