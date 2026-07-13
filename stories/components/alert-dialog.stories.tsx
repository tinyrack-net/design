import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog } from '../../src/components/alert-dialog/index.js';

type StoryArgs = {
  label: string;
  open: boolean;
  disabled: boolean;
};

export function AlertDialogPreview({ label, open, disabled }: StoryArgs) {
  return (
    <AlertDialog.Root defaultOpen={open} key={String(open)}>
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
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
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
  render: (args) => <AlertDialogPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
