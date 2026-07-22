import type { TRRadioUiSize } from '@tinyrack/ui/components/radio';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
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
  readOnly: boolean;
  uiSize: TRRadioUiSize;
  value: string;
};

type RadioPreviewProps = Omit<StoryArgs, 'uiSize' | 'value'> & {
  alternateLabel?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  uiSize?: TRRadioUiSize;
  value?: string;
};

export function RadioPreview({
  alternateLabel = 'Secondary rack',
  defaultValue = 'primary',
  disabled,
  label,
  onValueChange,
  readOnly,
  uiSize = 'md',
  value,
}: RadioPreviewProps) {
  const inputId = useId();
  const alternateId = `${inputId}-alternate`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const stateProps = value === undefined ? { defaultValue } : { value };

  return (
    <div className="grid gap-3">
      <TRRadioGroup
        {...stateProps}
        aria-label="Deployment rack"
        className="grid gap-2"
        name={`rack-${inputId}`}
        onValueChange={(nextValue) => {
          const nextStringValue = String(nextValue);
          setUncontrolledValue(nextStringValue);
          onValueChange?.(nextStringValue);
        }}
        readOnly={readOnly}
      >
        <label className="flex min-h-6 items-center gap-2" htmlFor={inputId}>
          <TRRadio.Root
            disabled={disabled}
            id={inputId}
            uiSize={uiSize}
            value="primary"
          >
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          <span className={disabled ? 'text-tinyrack-text-muted' : undefined}>
            {label}
          </span>
        </label>
        <label className="flex min-h-6 items-center gap-2" htmlFor={alternateId}>
          <TRRadio.Root id={alternateId} uiSize={uiSize} value="alternate">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          {alternateLabel}
        </label>
      </TRRadioGroup>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Selected: {selectedValue === 'alternate' ? alternateLabel : label}
      </output>
    </div>
  );
}

function RadioStateSample({
  disabled = false,
  label,
  readOnly = false,
  selected,
}: {
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
  selected: boolean;
}) {
  const id = useId();

  return (
    <TRRadioGroup aria-label={label} value={selected ? 'sample' : 'other'}>
      <label className="flex min-h-6 items-center gap-2" htmlFor={id}>
        <TRRadio.Root disabled={disabled} id={id} readOnly={readOnly} value="sample">
          <TRRadio.Indicator aria-hidden="true" />
        </TRRadio.Root>
        <span className={disabled ? 'text-tinyrack-text-muted' : undefined}>
          {label}
        </span>
      </label>
    </TRRadioGroup>
  );
}

export function RadioStateComparison() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RadioStateSample label="Available · Unselected" selected={false} />
      <RadioStateSample label="Available · Selected" selected />
      <RadioStateSample label="Read only · Unselected" readOnly selected={false} />
      <RadioStateSample label="Read only · Selected" readOnly selected />
      <RadioStateSample disabled label="Disabled · Unselected" selected={false} />
      <RadioStateSample disabled label="Disabled · Selected" selected />
    </div>
  );
}

export function RadioSizeComparison() {
  const groupId = useId();

  return (
    <TRRadioGroup aria-label="Radio sizes" className="flex items-end gap-6" value="sm">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <label
          className="grid min-h-10 place-items-center gap-1"
          htmlFor={`${groupId}-${uiSize}`}
          key={uiSize}
        >
          <TRRadio.Root id={`${groupId}-${uiSize}`} uiSize={uiSize} value={uiSize}>
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          <span className="text-tinyrack-sm">{uiSize}</span>
        </label>
      ))}
    </TRRadioGroup>
  );
}

export function RadioPlanExample() {
  const [value, setValue] = useState('standard');
  const groupId = useId();

  return (
    <div className="grid gap-3">
      <TRRadioGroup
        aria-label="Support plan"
        className="grid gap-2"
        name="support-plan"
        onValueChange={(nextValue) => setValue(String(nextValue))}
        value={value}
      >
        {[
          ['standard', 'Standard · Community support'],
          ['priority', 'Priority · 4-hour response'],
          ['critical', 'Critical · 24/7 response'],
        ].map(([optionValue, optionLabel]) => (
          <label
            className="flex min-h-6 items-center gap-2"
            htmlFor={`${groupId}-${optionValue}`}
            key={optionValue}
          >
            <TRRadio.Root id={`${groupId}-${optionValue}`} value={optionValue}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            {optionLabel}
          </label>
        ))}
      </TRRadioGroup>
      <output aria-live="polite">Selected plan: {value}</output>
    </div>
  );
}

const meta = {
  title: 'Components/Radio',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Primary rack',
    readOnly: false,
    uiSize: 'md',
    value: 'primary',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return <RadioPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
