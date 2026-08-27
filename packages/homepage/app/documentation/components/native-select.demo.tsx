import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import {
  TRNativeSelect,
  type TRNativeSelectAppearance,
  type TRNativeSelectUiSize,
} from '@tinyrack/ui/components/native-select';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const nativeSelectCopy = {
  en: {
    alpha: 'Rack Alpha',
    beta: 'Rack Beta',
    choose: 'Choose a rack',
    current: 'Current value',
    default: 'Default',
    disabled: 'Disabled',
    ghost: 'Ghost',
    invalid: 'Invalid',
    preview: 'Preview rack',
    production: 'Production',
    rack: 'Deployment rack',
    reset: 'Reset',
    resetResult: 'Reset to Rack Alpha.',
    staging: 'Staging rack',
    submit: 'Submit',
    submitted: 'Submitted rack',
  },
  ja: {
    alpha: 'ラック Alpha',
    beta: 'ラック Beta',
    choose: 'ラックを選択',
    current: '現在の値',
    default: 'デフォルト',
    disabled: '無効',
    ghost: 'ゴースト',
    invalid: '無効な値',
    preview: 'プレビューラック',
    production: '本番環境',
    rack: 'デプロイ先ラック',
    reset: 'リセット',
    resetResult: 'ラック Alpha に戻しました。',
    staging: 'ステージングラック',
    submit: '送信',
    submitted: '送信したラック',
  },
  ko: {
    alpha: '랙 Alpha',
    beta: '랙 Beta',
    choose: '랙 선택',
    current: '현재 값',
    default: '기본',
    disabled: '비활성',
    ghost: '고스트',
    invalid: '잘못된 값',
    preview: '프리뷰 랙',
    production: '프로덕션',
    rack: '배포 랙',
    reset: '초기화',
    resetResult: '랙 Alpha로 되돌렸어요.',
    staging: '스테이징 랙',
    submit: '제출',
    submitted: '제출한 랙',
  },
} as const;

type StoryArgs = {
  appearance: TRNativeSelectAppearance;
  disabled: boolean;
  label: string;
  required: boolean;
  uiSize: TRNativeSelectUiSize;
};

function NativeRackOptions() {
  const copy = nativeSelectCopy[useDemoLocale()];
  return (
    <>
      <option value="">{copy.choose}</option>
      <optgroup label={copy.production}>
        <option value="alpha">{copy.alpha}</option>
        <option value="beta">{copy.beta}</option>
      </optgroup>
      <option value="staging">{copy.staging}</option>
      <option value="preview">{copy.preview}</option>
    </>
  );
}

export function NativeSelectPreview({ label, ...args }: StoryArgs) {
  const copy = nativeSelectCopy[useDemoLocale()];
  const [value, setValue] = useState('alpha');
  return (
    <TRField.Root
      className="w-80 max-w-full"
      data-docs-example-item=""
      disabled={args.disabled}
    >
      <TRField.Label>{label}</TRField.Label>
      <TRNativeSelect
        {...args}
        name="rack"
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      >
        <NativeRackOptions />
      </TRNativeSelect>
      <output className="text-tinyrack-sm text-tinyrack-text-muted">
        {copy.current}: {value || copy.choose}
      </output>
    </TRField.Root>
  );
}

export function NativeSelectSizeComparison() {
  const copy = nativeSelectCopy[useDemoLocale()];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <TRField.Root data-docs-example-item="" key={uiSize}>
          <TRField.Label>{uiSize}</TRField.Label>
          <TRNativeSelect aria-label={`${uiSize} ${copy.rack}`} uiSize={uiSize}>
            <NativeRackOptions />
          </TRNativeSelect>
        </TRField.Root>
      ))}
    </div>
  );
}

export function NativeSelectStateComparison() {
  const copy = nativeSelectCopy[useDemoLocale()];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <TRField.Root data-docs-example-item="">
        <TRField.Label>{copy.default}</TRField.Label>
        <TRNativeSelect defaultValue="alpha">
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
      <TRField.Root data-docs-example-item="" disabled>
        <TRField.Label>{copy.disabled}</TRField.Label>
        <TRNativeSelect defaultValue="alpha">
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
      <TRField.Root data-docs-example-item="" invalid>
        <TRField.Label>{copy.invalid}</TRField.Label>
        <TRNativeSelect defaultValue="">
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
      <TRField.Root data-docs-example-item="">
        <TRField.Label>{copy.ghost}</TRField.Label>
        <TRNativeSelect appearance="ghost" defaultValue="alpha">
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
    </div>
  );
}

export function NativeSelectListboxComparison() {
  const copy = nativeSelectCopy[useDemoLocale()];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <TRField.Root data-docs-example-item="">
        <TRField.Label>{copy.rack}</TRField.Label>
        <TRNativeSelect defaultValue="alpha" size={4}>
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
      <TRField.Root data-docs-example-item="">
        <TRField.Label>{copy.production}</TRField.Label>
        <TRNativeSelect defaultValue={['alpha', 'beta']} multiple size={4}>
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
    </div>
  );
}

export function NativeSelectFormPreview() {
  const copy = nativeSelectCopy[useDemoLocale()];
  const [result, setResult] = useState('');
  return (
    <TRForm
      className="grid w-full max-w-md gap-3"
      data-docs-example-item=""
      onReset={() => setResult(copy.resetResult)}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`${copy.submitted}: ${String(data.get('rack'))}`);
      }}
    >
      <TRField.Root>
        <TRField.Label>{copy.rack}</TRField.Label>
        <TRNativeSelect defaultValue="alpha" name="rack" required>
          <NativeRackOptions />
        </TRNativeSelect>
      </TRField.Root>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">{copy.submit}</TRButton>
        <TRButton appearance="outline" type="reset">
          {copy.reset}
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/NativeSelect',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'solid',
    disabled: false,
    label: 'Deployment rack',
    required: false,
    uiSize: 'md',
  },
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'ghost'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  localizedArgs: {
    ja: { label: 'デプロイ先ラック' },
    ko: { label: '배포 랙' },
  },
  render: function Render(args) {
    return <NativeSelectPreview {...args} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
