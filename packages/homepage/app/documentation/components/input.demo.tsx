import { TRButton } from '@tinyrack/ui/components/button';
import { TRForm } from '@tinyrack/ui/components/form';
import type { TRInputUiSize } from '@tinyrack/ui/components/input';
import { TRInput } from '@tinyrack/ui/components/input';
import { useId, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  uiSize: TRInputUiSize;
};

type InputPreviewProps = Omit<StoryArgs, 'uiSize'> & {
  defaultValue?: string;
  invalid?: boolean;
  uiSize?: TRInputUiSize;
};

export function InputPreview({
  defaultValue,
  disabled,
  invalid = false,
  label,
  placeholder,
  readOnly,
  required,
  uiSize = 'md',
}: InputPreviewProps) {
  const inputId = useId();
  return (
    <label className="grid w-80 max-w-full gap-2" htmlFor={inputId}>
      {label}
      <TRInput
        aria-invalid={invalid || undefined}
        defaultValue={defaultValue}
        disabled={disabled}
        id={inputId}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        uiSize={uiSize}
      />
    </label>
  );
}

export function InputSizeComparison() {
  return (
    <div className="grid w-80 max-w-full gap-4">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <InputPreview
          disabled={false}
          key={uiSize}
          label={`${uiSize.toUpperCase()} input`}
          placeholder="rack-alpha"
          readOnly={false}
          required={false}
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}

export function InputStateComparison() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <InputPreview
        defaultValue="rack-alpha"
        disabled={false}
        label="Default"
        placeholder="rack-alpha"
        readOnly={false}
        required={false}
      />
      <InputPreview
        defaultValue="rack-disabled"
        disabled
        label="Disabled"
        placeholder="rack-alpha"
        readOnly={false}
        required={false}
      />
      <InputPreview
        defaultValue="rack-locked"
        disabled={false}
        label="Read only"
        placeholder="rack-alpha"
        readOnly
        required={false}
      />
      <InputPreview
        defaultValue="rack duplicate"
        disabled={false}
        invalid
        label="Invalid"
        placeholder="rack-alpha"
        readOnly={false}
        required
      />
    </div>
  );
}

export function InputValidationPreview() {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

  return (
    <TRForm
      className="grid w-80 max-w-full gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const valid = event.currentTarget.checkValidity();
        setAttempted(true);
        setSubmitted(valid);
        if (!valid) inputRef.current?.focus();
      }}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        Rack name
        <TRInput
          aria-describedby={invalid ? errorId : undefined}
          aria-invalid={invalid || undefined}
          id={inputId}
          name="rack"
          onValueChange={(nextValue) => {
            setValue(nextValue);
            setSubmitted(false);
          }}
          onInvalid={(event) => event.preventDefault()}
          ref={inputRef}
          required
          value={value}
        />
      </label>
      {invalid ? (
        <p className="m-0 text-sm" id={errorId} role="alert">
          Rack name is required.
        </p>
      ) : null}
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">{submitted ? `Ready to create ${value}.` : ''}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Input',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack name',
    placeholder: 'rack-alpha',
    readOnly: false,
    required: false,
    uiSize: 'md',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    return <InputPreview {...args} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
