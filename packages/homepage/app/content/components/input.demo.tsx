import { Button } from '@tinyrack/ui/components/button';
import { Form } from '@tinyrack/ui/components/form';
import { Input } from '@tinyrack/ui/components/input';
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
  disabled: boolean;
  label: string;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  value: string;
};

type InputPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

export function InputPreview({
  defaultValue,
  disabled,
  label,
  onValueChange,
  placeholder,
  readOnly,
  required,
  value,
}: InputPreviewProps) {
  const inputId = useId();
  return (
    <label className="grid w-80 max-w-full gap-2" htmlFor={inputId}>
      {label}
      <Input
        disabled={disabled}
        defaultValue={value === undefined ? defaultValue : undefined}
        id={inputId}
        onChange={(event) => onValueChange?.(event.currentTarget.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        value={value}
      />
    </label>
  );
}

export function InputValidationPreview() {
  const inputId = useId();
  const errorId = useId();
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

  return (
    <Form
      className="grid w-80 max-w-full gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <label className="grid gap-2" htmlFor={inputId}>
        Rack name
        <Input
          aria-describedby={invalid ? errorId : undefined}
          aria-invalid={invalid || undefined}
          id={inputId}
          name="rack"
          onChange={(event) => setValue(event.currentTarget.value)}
          onInvalid={(event) => event.preventDefault()}
          required
          value={value}
        />
      </label>
      {invalid ? (
        <p className="m-0 text-sm" id={errorId} role="alert">
          Rack name is required.
        </p>
      ) : null}
      <Button type="submit">Continue</Button>
      <output aria-live="polite">
        {attempted && !invalid ? `Ready to create ${value}.` : ''}
      </output>
    </Form>
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
    value: '',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return <InputPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
