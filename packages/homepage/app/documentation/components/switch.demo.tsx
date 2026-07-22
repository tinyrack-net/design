import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRSwitch } from '@tinyrack/ui/components/switch';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    automatic: 'Automatic updates',
    states: ['Off', 'On'],
    availability: ['Editable', 'Read only', 'Disabled'],
    monitoring: 'Enable health monitoring.',
    error: 'Enable health monitoring to continue.',
    continue: 'Continue',
    enabled: 'Health monitoring enabled.',
  },
  ko: {
    automatic: '자동 업데이트 사용',
    states: ['꺼짐', '켜짐'],
    availability: ['편집 가능', '읽기 전용', '사용 불가'],
    monitoring: '상태 모니터링 사용',
    error: '계속하려면 상태 모니터링을 켜세요.',
    continue: '계속',
    enabled: '상태 모니터링을 켰어요.',
  },
  ja: {
    automatic: '自動更新を有効にする',
    states: ['オフ', 'オン'],
    availability: ['編集可能', '読み取り専用', '無効'],
    monitoring: 'ヘルスモニタリングを有効にする',
    error: '続行するにはヘルスモニタリングを有効にしてください。',
    continue: '続行',
    enabled: 'ヘルスモニタリングを有効にしました。',
  },
} as const;

import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  checked: boolean;
  disabled: boolean;
  label: string;
  readOnly: boolean;
};

type SwitchPreviewProps = Omit<StoryArgs, 'checked'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function SwitchPreview({
  checked,
  defaultChecked,
  disabled,
  label,
  onCheckedChange,
  readOnly,
}: SwitchPreviewProps) {
  const inputId = useId();
  const stateProps = checked === undefined ? { defaultChecked } : { checked };

  return (
    <div className="flex items-center gap-2" data-docs-example-item="">
      <TRSwitch.Root
        {...stateProps}
        disabled={disabled}
        id={inputId}
        name="automatic-updates"
        onCheckedChange={onCheckedChange}
        readOnly={readOnly}
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      <label
        className={
          disabled
            ? 'cursor-not-allowed'
            : readOnly
              ? 'cursor-default'
              : 'cursor-pointer'
        }
        htmlFor={inputId}
        style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
      >
        {label}
      </label>
    </div>
  );
}

function SwitchStateSample({
  checked = false,
  disabled = false,
  readOnly = false,
  title,
}: {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  title: string;
}) {
  return (
    <div className="grid gap-2">
      <strong>{title}</strong>
      <SwitchPreview
        defaultChecked={checked}
        disabled={disabled}
        label="Automatic updates"
        readOnly={readOnly}
      />
    </div>
  );
}

export function SwitchStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SwitchStateSample title={text.states[0]} />
      <SwitchStateSample checked title={text.states[1]} />
    </div>
  );
}

export function SwitchAvailabilityComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SwitchStateSample checked title={text.availability[0]} />
      <SwitchStateSample checked readOnly title={text.availability[1]} />
      <SwitchStateSample checked disabled title={text.availability[2]} />
    </div>
  );
}

export function SwitchValidationPreview() {
  const text = copy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const invalid = attempted && !checked;

  return (
    <TRForm
      data-docs-example-item=""
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label className="flex min-w-0 items-start gap-2 whitespace-normal">
          <TRSwitch.Root
            checked={checked}
            name="monitoring"
            onCheckedChange={setChecked}
            required
          >
            <TRSwitch.Thumb />
          </TRSwitch.Root>
          {text.monitoring}
        </TRField.Label>
        {invalid ? <TRField.Error match>{text.error}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{text.continue}</TRButton>
      <output aria-live="polite">{attempted && checked ? text.enabled : ''}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Switch',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    checked: true,
    disabled: false,
    label: 'Automatic updates',
    readOnly: false,
  },
  localizedArgs: {
    ja: { label: copy.ja.automatic },
    ko: { label: copy.ko.automatic },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <SwitchPreview {...args} onCheckedChange={(checked) => updateArgs({ checked })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);

export const switchBasicSource = `import { TRSwitch } from '@tinyrack/ui/components/switch';

export function AutomaticBackupsSwitch() {
  return (
    <label htmlFor="automatic-backups" className="flex items-center gap-3">
      <TRSwitch.Root
        defaultChecked
        id="automatic-backups"
        name="automaticBackups"
      >
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      Automatic backups
    </label>
  );
}`;

export const switchStateComparisonSource = `import { TRSwitch } from '@tinyrack/ui/components/switch';
import { useId } from 'react';

function SwitchStateSample({
  checked = false,
  disabled = false,
  readOnly = false,
  title,
}: {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  title: string;
}) {
  const inputId = useId();

  return (
    <div className="grid gap-2">
      <strong>{title}</strong>
      <div className="flex items-center gap-2">
        <TRSwitch.Root
          defaultChecked={checked}
          disabled={disabled}
          id={inputId}
          name="automatic-updates"
          readOnly={readOnly}
        >
          <TRSwitch.Thumb />
        </TRSwitch.Root>
        <label
          className={
            disabled
              ? 'cursor-not-allowed'
              : readOnly
                ? 'cursor-default'
                : 'cursor-pointer'
          }
          htmlFor={inputId}
          style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
        >
          Automatic updates
        </label>
      </div>
    </div>
  );
}

export function SwitchStates() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SwitchStateSample title="Off" />
      <SwitchStateSample checked title="On" />
    </div>
  );
}`;

export const switchValidationSource = `import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRSwitch } from '@tinyrack/ui/components/switch';
import { useState } from 'react';

export function RequiredSwitch() {
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const invalid = attempted && !checked;

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label className="flex min-w-0 items-start gap-2 whitespace-normal">
          <TRSwitch.Root
            checked={checked}
            name="monitoring"
            onCheckedChange={setChecked}
            required
          >
            <TRSwitch.Thumb />
          </TRSwitch.Root>
          Enable health monitoring.
        </TRField.Label>
        {invalid ? (
          <TRField.Error match>
            Enable health monitoring to continue.
          </TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">
        {attempted && checked ? 'Health monitoring enabled.' : ''}
      </output>
    </TRForm>
  );
}`;
