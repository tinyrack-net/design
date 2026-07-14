import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
import { Switch } from '@tinyrack/ui/components/switch';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  checked: boolean;
  disabled: boolean;
  label: string;
  readOnly: boolean;
  required: boolean;
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
  required,
}: SwitchPreviewProps) {
  const inputId = useId();
  const stateProps = checked === undefined ? { defaultChecked } : { checked };

  return (
    <div className="flex items-center gap-2">
      <Switch.Root
        {...stateProps}
        aria-label={label}
        disabled={disabled}
        id={inputId}
        name="automatic-updates"
        onCheckedChange={onCheckedChange}
        readOnly={readOnly}
        required={required}
      >
        <Switch.Thumb />
      </Switch.Root>
      <label
        className={disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}
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
        required={false}
      />
    </div>
  );
}

export function SwitchStateComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SwitchStateSample title="Enabled · Off" />
      <SwitchStateSample checked title="Enabled · On" />
      <SwitchStateSample checked readOnly title="Read only" />
      <SwitchStateSample disabled title="Disabled · Off" />
      <SwitchStateSample checked disabled title="Disabled · On" />
    </div>
  );
}

export function SwitchValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [checked, setChecked] = useState(false);
  const invalid = attempted && !checked;

  return (
    <Form
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <Field.Root invalid={invalid}>
        <Field.Label className="flex min-w-0 items-start gap-2 whitespace-normal">
          <Switch.Root
            aria-label="Enable health monitoring"
            checked={checked}
            name="monitoring"
            onCheckedChange={setChecked}
            required
          >
            <Switch.Thumb />
          </Switch.Root>
          Enable health monitoring.
        </Field.Label>
        {invalid ? (
          <Field.Error match>Enable health monitoring to continue.</Field.Error>
        ) : null}
      </Field.Root>
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && checked ? 'Health monitoring enabled.' : ''}
      </output>
    </Form>
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
    required: false,
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
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
