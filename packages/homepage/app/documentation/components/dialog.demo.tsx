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
import { useDemoLocale } from '../shared/demo-locale.js';

type DialogStoryArgs = {
  open: boolean;
  placement: TRDialogPlacement;
  title: string;
};

type DialogExampleProps = Partial<DialogStoryArgs> & {
  description?: string;
  longContent?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DialogExample({
  description,
  modal = true,
  longContent = false,
  open = false,
  placement = 'middle',
  title,
  onOpenChange,
}: DialogExampleProps) {
  const locale = useDemoLocale();
  const copy = {
    en: {
      cancel: 'Cancel',
      description: 'This restarts the service.',
      initial: 'No changes saved',
      open: 'Open dialog',
      rack: 'Rack name',
      rollback: 'Rollback notes',
      rollbackValue: 'Restore the previous deployment and verify rack health.',
      save: 'Save changes',
      saved: (rack: FormDataEntryValue | null) => `Saved ${rack}`,
      title: 'Deploy changes',
      paragraph1:
        'Confirm the target environment, maintenance window, and rollback owner before saving this deployment.',
      paragraph2:
        'Changes are reviewed against the current rack inventory. Operators can continue reading this body while the title and actions remain in place.',
    },
    ko: {
      cancel: '취소',
      description: '서비스가 다시 시작돼요.',
      initial: '변경 사항을 저장하지 않았어요',
      open: '대화 상자 열기',
      rack: '랙 이름',
      rollback: '롤백 메모',
      rollbackValue: '이전 배포를 복원하고 랙 상태를 확인하세요.',
      save: '변경 사항 저장',
      saved: (rack: FormDataEntryValue | null) => `${rack} 이름으로 저장했어요.`,
      title: '변경 사항 배포',
      paragraph1:
        '배포를 저장하기 전에 대상 환경, 유지보수 시간, 롤백 담당자를 확인하세요.',
      paragraph2:
        '현재 랙 목록을 기준으로 변경 사항을 검토해요. 제목과 작업을 고정한 채 본문을 계속 읽을 수 있어요.',
    },
    ja: {
      cancel: 'キャンセル',
      description: 'サービスが再起動します。',
      initial: '変更は保存されていません',
      open: 'ダイアログを開く',
      rack: 'ラック名',
      rollback: 'ロールバックメモ',
      rollbackValue: '以前のデプロイを復元し、ラックの状態を確認してください。',
      save: '変更を保存',
      saved: (rack: FormDataEntryValue | null) => `${rack} を保存しました`,
      title: '変更をデプロイ',
      paragraph1:
        '保存する前に対象環境、メンテナンス時間、ロールバック担当者を確認してください。',
      paragraph2:
        '現在のラック一覧に照らして変更を確認します。タイトルと操作を固定したまま本文を読み進められます。',
    },
  }[locale];
  const displayDescription =
    !description || description === 'This restarts the service.'
      ? copy.description
      : description;
  const displayTitle = !title || title === 'Deploy changes' ? copy.title : title;
  const inputId = useId();
  const notesId = useId();
  const [result, setResult] = useState(copy.initial);
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <div data-docs-example-item="">
      <TRDialog.Root {...stateProps} modal={modal}>
        <TRDialog.Trigger>{copy.open}</TRDialog.Trigger>
        <TRDialog.Portal>
          <TRDialog.Backdrop />
          <TRDialog.Viewport>
            <TRDialog.Popup placement={placement}>
              <TRDialog.Title>{displayTitle}</TRDialog.Title>
              <TRDialog.Description>{displayDescription}</TRDialog.Description>
              <div className="tr-dialog-body grid gap-4" data-dialog-scroll-body="">
                {longContent ? (
                  <div className="grid gap-3">
                    <p>{copy.paragraph1}</p>
                    <p>{copy.paragraph2}</p>
                    <TRField.Root>
                      <TRField.Label htmlFor={notesId}>{copy.rollback}</TRField.Label>
                      <TRTextarea
                        defaultValue={copy.rollbackValue}
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
                    setResult(
                      copy.saved(new FormData(event.currentTarget).get('rack')),
                    );
                  }}
                >
                  <TRField.Root>
                    <TRField.Label htmlFor={inputId}>{copy.rack}</TRField.Label>
                    <TRInput
                      defaultValue="rack-alpha"
                      id={inputId}
                      name="rack"
                      required
                    />
                  </TRField.Root>
                  <TRButton type="submit">{copy.save}</TRButton>
                </TRForm>
                <output aria-live="polite">{result}</output>
              </div>
              <TRDialog.Close>{copy.cancel}</TRDialog.Close>
            </TRDialog.Popup>
          </TRDialog.Viewport>
        </TRDialog.Portal>
      </TRDialog.Root>
    </div>
  );
}

const dialogHandle = TRDialog.createHandle<void>();

export function DialogHandleExample() {
  const locale = useDemoLocale();
  const copy = {
    en: [
      'Open detached dialog',
      'Detached trigger',
      'A shared handle connects this root to a trigger outside it.',
      'Close',
    ],
    ko: [
      '분리된 대화 상자 열기',
      '분리된 트리거',
      '공유 핸들이 Root 바깥의 트리거를 연결해요.',
      '닫기',
    ],
    ja: [
      '分離したダイアログを開く',
      '分離したトリガー',
      '共有ハンドルが Root 外のトリガーを接続します。',
      '閉じる',
    ],
  }[locale];
  return (
    <div data-docs-example-item="">
      <TRDialog.Trigger handle={dialogHandle}>{copy[0]}</TRDialog.Trigger>
      <TRDialog.Root handle={dialogHandle}>
        <TRDialog.Portal>
          <TRDialog.Backdrop />
          <TRDialog.Viewport>
            <TRDialog.Popup placement="middle">
              <TRDialog.Title>{copy[1]}</TRDialog.Title>
              <TRDialog.Description>{copy[2]}</TRDialog.Description>
              <TRDialog.Close render={<TRButton variant="secondary" />}>
                {copy[3]}
              </TRDialog.Close>
            </TRDialog.Popup>
          </TRDialog.Viewport>
        </TRDialog.Portal>
      </TRDialog.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Dialog',
  parameters: { layout: 'centered' },
  args: {
    open: false,
    placement: 'middle',
    title: 'Deploy changes',
  },
  argTypes: {
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
