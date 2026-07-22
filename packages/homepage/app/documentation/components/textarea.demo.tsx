import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRTextarea, type TRTextareaUiSize } from '@tinyrack/ui/components/textarea';
import { useId, useState } from 'react';
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
  uiSize: TRTextareaUiSize;
};

export function TextareaPreview({
  label,
  initialValue = '',
  showValue = false,
  ...args
}: StoryArgs & { initialValue?: string; showValue?: boolean }) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  return (
    <label className="grid w-80 max-w-full gap-2" htmlFor={id}>
      {label}
      <TRTextarea
        {...args}
        id={id}
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      />
      {showValue ? (
        <output className="text-tinyrack-sm text-tinyrack-text-muted">
          Current value: {value || 'Empty'}
        </output>
      ) : null}
    </label>
  );
}

export function TextareaSizeComparison() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <div className="grid min-w-0 gap-2" key={uiSize}>
          <span>{uiSize}</span>
          <TRTextarea
            aria-label={`${uiSize} rack notes`}
            defaultValue="Rack notes"
            rows={3}
            uiSize={uiSize}
          />
        </div>
      ))}
    </div>
  );
}

export function TextareaStateComparison() {
  const invalidId = useId();
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <TextareaPreview
        disabled={false}
        label="Default"
        placeholder="Operational notes"
        readOnly={false}
        required={false}
        uiSize="md"
      />
      <TextareaPreview
        disabled
        label="Disabled"
        placeholder="Unavailable"
        readOnly={false}
        required={false}
        uiSize="md"
      />
      <TextareaPreview
        disabled={false}
        initialValue="Locked note"
        label="Read only"
        placeholder=""
        readOnly
        required={false}
        uiSize="md"
      />
      <label className="grid min-w-0 gap-2" htmlFor={invalidId}>
        Invalid
        <TRTextarea aria-invalid="true" defaultValue="Incomplete note" id={invalidId} />
      </label>
    </div>
  );
}

export function TextareaValidationPreview() {
  const id = useId();
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;
  return (
    <TRForm
      className="grid w-full max-w-md gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        const valid = value.trim().length > 0;
        setSubmitted(valid);
        if (!valid) document.getElementById(id)?.focus();
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRField.Label htmlFor={id}>Change reason</TRField.Label>
        <TRTextarea
          aria-invalid={invalid}
          id={id}
          name="reason"
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setSubmitted(false);
          }}
          required
          value={value}
        />
        <TRField.Error match>
          {invalid ? 'Add a reason before submitting.' : null}
        </TRField.Error>
      </TRField.Root>
      <TRButton type="submit">Submit change</TRButton>
      <output aria-live="polite">{submitted ? 'Change submitted.' : ''}</output>
    </TRForm>
  );
}

export function TextareaFormPreview() {
  const id = useId();
  const [result, setResult] = useState('Not submitted.');

  return (
    <TRForm
      className="grid w-full max-w-md gap-3"
      onReset={() => setResult('Reset to the scheduled maintenance note.')}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`Submitted: ${String(data.get('notes'))}`);
      }}
    >
      <label className="grid gap-2" htmlFor={id}>
        Maintenance notes
        <TRTextarea
          defaultValue="Scheduled maintenance"
          id={id}
          name="notes"
          required
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">Submit</TRButton>
        <TRButton appearance="outline" type="reset">
          Reset
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Textarea',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack notes',
    placeholder: 'Operational notes',
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
    return <TextareaPreview {...args} showValue />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
