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
import { definePlayground } from '../../playground/demo.js';

type SpinnerStoryArgs = {
  decorative: boolean;
  label: string;
  uiSize: TRSpinnerUiSize;
  taskState: 'idle' | 'running' | 'complete';
  variant: TRSpinnerVariant;
};

export function SpinnerLifecyclePreview() {
  const [state, setState] = useState<'idle' | 'running' | 'complete'>('idle');
  return (
    <div className="grid justify-items-start gap-3">
      <div className="flex flex-wrap gap-2">
        <TRButton onClick={() => setState('running')}>Start task</TRButton>
        <TRButton
          appearance="outline"
          disabled={state !== 'running'}
          onClick={() => setState('complete')}
        >
          Finish task
        </TRButton>
        <TRButton appearance="ghost" onClick={() => setState('idle')}>
          Reset
        </TRButton>
      </div>
      <output aria-live="polite">
        {state === 'running' ? (
          <TRSpinner label="Deploying rack" variant="primary" />
        ) : null}
        {state === 'idle' ? 'Task has not started.' : null}
        {state === 'complete' ? 'Deployment complete.' : null}
      </output>
    </div>
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
      when: (args) => args['taskState'] === 'running' && args['decorative'] !== true,
    },
  },
  render: ({ taskState, ...args }) => (
    <output aria-live="polite">
      {taskState === 'running' ? <TRSpinner {...args} /> : null}
      {taskState === 'idle' ? 'Task has not started.' : null}
      {taskState === 'complete' ? 'Task complete.' : null}
    </output>
  ),
} satisfies Meta<SpinnerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
