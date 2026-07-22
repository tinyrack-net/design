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
import { useDemoLocale } from '../shared/demo-locale.js';

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
  const locale = useDemoLocale();
  const copy = {
    en: {
      cancel: 'Cancel',
      deleted: 'Rack deleted',
      description: 'This action cannot be undone.',
      initial: 'Rack not deleted',
      remove: 'Delete rack',
      title: 'Delete rack?',
    },
    ko: {
      cancel: '취소',
      deleted: '랙을 삭제했어요',
      description: '이 작업은 되돌릴 수 없어요.',
      initial: '랙을 삭제하지 않았어요',
      remove: '랙 삭제',
      title: '랙을 삭제할까요?',
    },
    ja: {
      cancel: 'キャンセル',
      deleted: 'ラックを削除しました',
      description: 'この操作は取り消せません。',
      initial: 'ラックは削除されていません',
      remove: 'ラックを削除',
      title: 'ラックを削除しますか？',
    },
  }[locale];
  const [result, setResult] = useState(copy.initial);
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <div data-docs-example-item="">
      <TRAlertDialog.Root {...stateProps}>
        <TRAlertDialog.Trigger disabled={disabled}>{label}</TRAlertDialog.Trigger>
        <TRAlertDialog.Portal>
          <TRAlertDialog.Backdrop />
          <TRAlertDialog.Viewport>
            <TRAlertDialog.Popup>
              <TRAlertDialog.Title>{copy.title}</TRAlertDialog.Title>
              <TRAlertDialog.Description>{copy.description}</TRAlertDialog.Description>
              <div className="tr-alert-dialog-actions">
                <TRAlertDialog.Close render={<TRButton variant="secondary" />}>
                  {copy.cancel}
                </TRAlertDialog.Close>
                <TRAlertDialog.Close
                  onClick={() => setResult(copy.deleted)}
                  render={<TRButton variant="danger" />}
                >
                  {copy.remove}
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

export const alertDialogBasicSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/alert-dialog.css';
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

export const alertDialogBasicSourceKo = alertDialogBasicSource
  .replaceAll('Rack not deleted', '랙을 삭제하지 않았어요')
  .replaceAll('Delete rack?', '랙을 삭제할까요?')
  .replaceAll('Delete rack', '랙 삭제')
  .replaceAll('This action cannot be undone.', '이 작업은 되돌릴 수 없어요.')
  .replaceAll('Cancel', '취소')
  .replaceAll('Rack deleted', '랙을 삭제했어요');
export const alertDialogBasicSourceJa = alertDialogBasicSource
  .replaceAll('Rack not deleted', 'ラックは削除されていません')
  .replaceAll('Delete rack?', 'ラックを削除しますか？')
  .replaceAll('Delete rack', 'ラックを削除')
  .replaceAll('This action cannot be undone.', 'この操作は取り消せません。')
  .replaceAll('Cancel', 'キャンセル')
  .replaceAll('Rack deleted', 'ラックを削除しました');

export const alertDialogStatesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/alert-dialog.css';
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

export const alertDialogStatesSourceKo = alertDialogStatesSource
  .replaceAll(
    'Delete a rack with a very long mobile confirmation label',
    '모바일에서도 읽기 쉬운 긴 확인 레이블로 랙을 삭제하세요',
  )
  .replaceAll('Delete rack?', '랙을 삭제할까요?')
  .replaceAll('Delete rack', '랙 삭제')
  .replaceAll('This action cannot be undone.', '이 작업은 되돌릴 수 없어요.')
  .replaceAll('Cancel', '취소');
export const alertDialogStatesSourceJa = alertDialogStatesSource
  .replaceAll(
    'Delete a rack with a very long mobile confirmation label',
    'モバイルでも読みやすい長い確認ラベルでラックを削除',
  )
  .replaceAll('Delete rack?', 'ラックを削除しますか？')
  .replaceAll('Delete rack', 'ラックを削除')
  .replaceAll('This action cannot be undone.', 'この操作は取り消せません。')
  .replaceAll('Cancel', 'キャンセル');

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
