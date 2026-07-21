import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRSlider } from '@tinyrack/ui/components/slider';
import { useId, useRef, useState } from 'react';
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
  orientation: 'horizontal' | 'vertical';
  value: number | null;
};

type SliderPreviewProps = Omit<StoryArgs, 'value'> & {
  defaultValue?: number;
  onValueChange?: (value: readonly number[]) => void;
  value?: number;
};

export function SliderPreview({
  defaultValue,
  disabled,
  label,
  onValueChange,
  orientation,
  value,
}: SliderPreviewProps) {
  const stateProps =
    value === undefined ? { defaultValue: [defaultValue ?? 0] } : { value: [value] };
  return (
    <TRSlider.Root
      {...stateProps}
      disabled={disabled}
      name="volume"
      onValueChange={(nextValue) =>
        onValueChange?.(Array.isArray(nextValue) ? nextValue : [nextValue as number])
      }
      orientation={orientation}
    >
      <TRSlider.Label>{label}</TRSlider.Label>
      <TRSlider.Value />
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb aria-label={label} />
      </TRSlider.Control>
    </TRSlider.Root>
  );
}

export function SliderStateComparison() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SliderPreview
        defaultValue={48}
        disabled={false}
        label="Horizontal volume"
        orientation="horizontal"
      />
      <SliderPreview
        defaultValue={82}
        disabled
        label="Disabled volume"
        orientation="horizontal"
      />
      <SliderPreview
        defaultValue={36}
        disabled={false}
        label="Vertical volume"
        orientation="vertical"
      />
    </div>
  );
}

export function SliderRangePreview() {
  return (
    <TRSlider.Root
      defaultValue={[20, 80]}
      format={{ maximumFractionDigits: 0, style: 'unit', unit: 'percent' }}
      locale="en"
      minStepsBetweenValues={10}
      name="window"
    >
      <TRSlider.Label>Maintenance window</TRSlider.Label>
      <TRSlider.Value />
      <TRSlider.Control>
        <TRSlider.Track>
          <TRSlider.Indicator />
        </TRSlider.Track>
        <TRSlider.Thumb
          aria-label="Start"
          getAriaValueText={(formattedValue) => `Starts at ${formattedValue}`}
          index={0}
        />
        <TRSlider.Thumb
          aria-label="End"
          getAriaValueText={(formattedValue) => `Ends at ${formattedValue}`}
          index={1}
        />
      </TRSlider.Control>
    </TRSlider.Root>
  );
}

export function SliderFormPreview() {
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [value, setValue] = useState(48);
  return (
    <TRForm
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(value);
      }}
    >
      <SliderPreview
        disabled={false}
        label="Volume"
        onValueChange={(values) => setValue(values[0] ?? 0)}
        orientation="horizontal"
        value={value}
      />
      <TRButton type="submit">Save volume</TRButton>
      <output aria-live="polite">
        {submitted === null ? '' : `Saved volume ${submitted}.`}
      </output>
    </TRForm>
  );
}

export function SliderValidationPreview() {
  const errorId = useId();
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [value, setValue] = useState(30);
  const invalid = attempted && value < 60;

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        if (value < 60) {
          setSubmitted(null);
          thumbInputRef.current?.focus();
          return;
        }
        setSubmitted(value);
      }}
    >
      <TRField.Root invalid={invalid}>
        <TRSlider.Root
          name="capacity"
          onValueChange={(nextValue) => {
            setValue(
              Array.isArray(nextValue) ? (nextValue[0] ?? 0) : Number(nextValue),
            );
            setSubmitted(null);
          }}
          value={[value]}
        >
          <TRSlider.Label>Reserved capacity</TRSlider.Label>
          <TRSlider.Value />
          <TRSlider.Control>
            <TRSlider.Track>
              <TRSlider.Indicator />
            </TRSlider.Track>
            <TRSlider.Thumb
              aria-label="Reserved capacity"
              aria-describedby={invalid ? errorId : undefined}
              inputRef={thumbInputRef}
            />
          </TRSlider.Control>
        </TRSlider.Root>
        <TRField.Description>Reserve at least 60% capacity.</TRField.Description>
        {invalid ? (
          <TRField.Error id={errorId} match>
            Increase reserved capacity to 60% or more.
          </TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Reserve capacity</TRButton>
      <output aria-live="polite">
        {submitted === null ? '' : `Reserved ${submitted}% capacity.`}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Slider',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Volume',
    orientation: 'horizontal',
    value: 48,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <SliderPreview
        {...args}
        onValueChange={(values) => updateArgs({ value: values[0] ?? 0 })}
        value={args.value ?? 0}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
