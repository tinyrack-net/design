import { TRButton } from '@tinyrack/ui/components/button';
import {
  TRSpinner,
  type TRSpinnerUiSize,
  type TRSpinnerVariant,
} from '@tinyrack/ui/components/spinner';
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

type SpinnerTaskState = 'idle' | 'running' | 'complete';

const spinnerCopy = {
  en: {
    start: 'Start task',
    finish: 'Finish task',
    reset: 'Reset',
    idle: 'Task has not started.',
    complete: 'Task complete.',
    deploying: 'Deploying rack',
  },
  ko: {
    start: '작업 시작',
    finish: '작업 완료',
    reset: '초기화',
    idle: '작업을 시작하지 않았어요.',
    complete: '작업이 완료됐어요.',
    deploying: '랙 배포 중',
  },
  ja: {
    start: 'タスクを開始',
    finish: 'タスクを完了',
    reset: 'リセット',
    idle: 'タスクは開始されていません。',
    complete: 'タスクが完了しました。',
    deploying: 'ラックをデプロイ中',
  },
} as const;

type SpinnerStoryArgs = {
  decorative: boolean;
  label: string;
  uiSize: TRSpinnerUiSize;
  taskState: SpinnerTaskState;
  variant: TRSpinnerVariant;
};

function SpinnerTaskPreview({
  decorative,
  label,
  onTaskStateChange,
  taskState,
  uiSize,
  variant,
}: SpinnerStoryArgs & {
  onTaskStateChange: (state: SpinnerTaskState) => void;
}) {
  const locale = useDemoLocale();
  const copy = spinnerCopy[locale];
  return (
    <div className="grid justify-items-start gap-3">
      <div className="flex flex-wrap gap-2">
        <TRButton
          disabled={taskState === 'running'}
          onClick={() => onTaskStateChange('running')}
        >
          {copy.start}
        </TRButton>
        <TRButton
          appearance="outline"
          disabled={taskState !== 'running'}
          onClick={() => onTaskStateChange('complete')}
        >
          {copy.finish}
        </TRButton>
        <TRButton
          appearance="ghost"
          disabled={taskState === 'idle'}
          onClick={() => onTaskStateChange('idle')}
        >
          {copy.reset}
        </TRButton>
      </div>
      {taskState === 'running' && !decorative ? (
        <TRSpinner label={label} uiSize={uiSize} variant={variant} />
      ) : null}
      {taskState === 'running' && decorative ? (
        <output aria-live="polite" className="inline-flex items-center gap-2">
          <TRSpinner decorative uiSize={uiSize} variant={variant} />
          {label}
        </output>
      ) : null}
      {taskState === 'idle' ? <output aria-live="polite">{copy.idle}</output> : null}
      {taskState === 'complete' ? (
        <output aria-live="polite">{copy.complete}</output>
      ) : null}
    </div>
  );
}

export function SpinnerLifecyclePreview() {
  const locale = useDemoLocale();
  const [taskState, setTaskState] = useState<SpinnerTaskState>('idle');
  return (
    <div data-docs-example-item="">
      <SpinnerTaskPreview
        decorative={false}
        label={spinnerCopy[locale].deploying}
        onTaskStateChange={setTaskState}
        taskState={taskState}
        uiSize="md"
        variant="primary"
      />
    </div>
  );
}

function SpinnerPlaygroundPreview(args: SpinnerStoryArgs) {
  const [, updateArgs] = useArgs<SpinnerStoryArgs>();
  return (
    <SpinnerTaskPreview
      {...args}
      onTaskStateChange={(taskState) => updateArgs({ taskState })}
    />
  );
}

const meta = {
  title: 'Components/Spinner',
  component: TRSpinner,
  parameters: { layout: 'centered' },
  args: {
    decorative: false,
    label: 'Loading servers',
    uiSize: 'md',
    taskState: 'running',
    variant: 'primary',
  },
  argTypes: {
    taskState: { control: 'select', options: ['idle', 'running', 'complete'] },
    uiSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      when: (args) => args['taskState'] === 'running',
    },
    variant: {
      control: 'select',
      options: ['current', 'muted', 'primary', 'danger'],
      when: (args) => args['taskState'] === 'running',
    },
    decorative: {
      control: 'boolean',
      when: (args) => args['taskState'] === 'running',
    },
    label: {
      control: 'text',
      when: (args) => args['taskState'] === 'running',
    },
  },
  localizedArgs: {
    ja: { label: 'サーバーを読み込んでいます' },
    ko: { label: '서버 불러오는 중' },
  },
  render: SpinnerPlaygroundPreview,
} satisfies Meta<SpinnerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
