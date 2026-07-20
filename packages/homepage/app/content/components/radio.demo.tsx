import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId } from 'react';
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
  selected: boolean;
};

type RadioPreviewProps = Omit<StoryArgs, 'selected'> & {
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  selected?: boolean;
};

export function RadioPreview({
  defaultSelected,
  disabled,
  label,
  onSelectedChange,
  readOnly,
  selected,
}: RadioPreviewProps) {
  const inputId = useId();
  const stateProps =
    selected === undefined
      ? { defaultValue: defaultSelected ? 'primary' : '' }
      : { value: selected ? 'primary' : '' };
  return (
    <TRRadioGroup
      {...stateProps}
      onValueChange={(value) => onSelectedChange?.(value === 'primary')}
      readOnly={readOnly}
    >
      <div className="flex min-h-6 items-center gap-2">
        <TRRadio.Root disabled={disabled} id={inputId} value="primary">
          <TRRadio.Indicator aria-hidden="true" />
        </TRRadio.Root>
        <label
          className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          htmlFor={inputId}
          style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
        >
          {label}
        </label>
      </div>
    </TRRadioGroup>
  );
}

export function RadioStateComparison() {
  const groupId = useId();

  return (
    <div className="grid gap-4">
      <TRRadioGroup className="grid gap-3" defaultValue="disabled" name="radio-states">
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-selected`}
        >
          <TRRadio.Root id={`${groupId}-selected`} value="selected">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Available unselected
        </label>
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-available`}
        >
          <TRRadio.Root id={`${groupId}-available`} value="available">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Available alternate
        </label>
        <label
          className="flex min-h-6 items-center gap-2 text-tinyrack-text-muted"
          htmlFor={`${groupId}-disabled`}
        >
          <TRRadio.Root disabled id={`${groupId}-disabled`} value="disabled">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Disabled selected
        </label>
      </TRRadioGroup>
      <TRRadioGroup name="readonly-radio" readOnly value="">
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-readonly`}
        >
          <TRRadio.Root id={`${groupId}-readonly`} value="readonly">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Read-only unselected
        </label>
      </TRRadioGroup>
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
    selected: true,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <RadioPreview
        {...args}
        onSelectedChange={(selected) => updateArgs({ selected })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
