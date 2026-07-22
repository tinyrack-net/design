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

type SpinnerTaskState = 'idle' | 'running' | 'complete';

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
  return (
    <div className="grid justify-items-start gap-3">
      <div className="flex flex-wrap gap-2">
        <TRButton
          disabled={taskState === 'running'}
          onClick={() => onTaskStateChange('running')}
        >
          Start task
        </TRButton>
        <TRButton
          appearance="outline"
          disabled={taskState !== 'running'}
          onClick={() => onTaskStateChange('complete')}
        >
          Finish task
        </TRButton>
        <TRButton
          appearance="ghost"
          disabled={taskState === 'idle'}
          onClick={() => onTaskStateChange('idle')}
        >
          Reset
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
      {taskState === 'idle' ? (
        <output aria-live="polite">Task has not started.</output>
      ) : null}
      {taskState === 'complete' ? (
        <output aria-live="polite">Task complete.</output>
      ) : null}
    </div>
  );
}

export function SpinnerLifecyclePreview() {
  const [taskState, setTaskState] = useState<SpinnerTaskState>('idle');
  return (
    <SpinnerTaskPreview
      decorative={false}
      label="Deploying rack"
      onTaskStateChange={setTaskState}
      taskState={taskState}
      uiSize="md"
      variant="primary"
    />
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
  render: SpinnerPlaygroundPreview,
} satisfies Meta<SpinnerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
