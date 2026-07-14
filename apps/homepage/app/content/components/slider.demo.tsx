import { Button } from '@tinyrack/ui/components/button';
import { Field } from '@tinyrack/ui/components/field';
import { Form } from '@tinyrack/ui/components/form';
import { Slider } from '@tinyrack/ui/components/slider';
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
    <Slider.Root
      {...stateProps}
      disabled={disabled}
      name="volume"
      onValueChange={(nextValue) =>
        onValueChange?.(Array.isArray(nextValue) ? nextValue : [nextValue as number])
      }
      orientation={orientation}
    >
      <Slider.Label>{label}</Slider.Label>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb aria-label={label} />
      </Slider.Control>
    </Slider.Root>
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
    <Slider.Root
      defaultValue={[20, 80]}
      format={{ maximumFractionDigits: 0, style: 'unit', unit: 'percent' }}
      locale="en"
      minStepsBetweenValues={10}
      name="window"
    >
      <Slider.Label>Maintenance window</Slider.Label>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb
          aria-label="Start"
          getAriaValueText={(formattedValue) => `Starts at ${formattedValue}`}
          index={0}
        />
        <Slider.Thumb
          aria-label="End"
          getAriaValueText={(formattedValue) => `Ends at ${formattedValue}`}
          index={1}
        />
      </Slider.Control>
    </Slider.Root>
  );
}

export function SliderFormPreview() {
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [value, setValue] = useState(48);
  return (
    <Form
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
      <Button type="submit">Save volume</Button>
      <output aria-live="polite">
        {submitted === null ? '' : `Saved volume ${submitted}.`}
      </output>
    </Form>
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
    <Form
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
      <Field.Root invalid={invalid}>
        <Slider.Root
          name="capacity"
          onValueChange={(nextValue) => {
            setValue(
              Array.isArray(nextValue) ? (nextValue[0] ?? 0) : Number(nextValue),
            );
            setSubmitted(null);
          }}
          value={[value]}
        >
          <Slider.Label>Reserved capacity</Slider.Label>
          <Slider.Value />
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb
              aria-label="Reserved capacity"
              aria-describedby={invalid ? errorId : undefined}
              inputRef={thumbInputRef}
            />
          </Slider.Control>
        </Slider.Root>
        <Field.Description>Reserve at least 60% capacity.</Field.Description>
        {invalid ? (
          <Field.Error id={errorId} match>
            Increase reserved capacity to 60% or more.
          </Field.Error>
        ) : null}
      </Field.Root>
      <Button type="submit">Reserve capacity</Button>
      <output aria-live="polite">
        {submitted === null ? '' : `Reserved ${submitted}% capacity.`}
      </output>
    </Form>
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
    value: { control: { type: 'number', min: 0, max: 100 } },
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
