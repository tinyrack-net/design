import { Radio } from '@tinyrack/ui/components/radio';
import { RadioGroup } from '@tinyrack/ui/components/radio-group';
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
    <RadioGroup
      {...stateProps}
      onValueChange={(value) => onSelectedChange?.(value === 'primary')}
      readOnly={readOnly}
    >
      <div className="flex items-center gap-2">
        <Radio.Root disabled={disabled} id={inputId} value="primary">
          <Radio.Indicator aria-hidden="true" />
        </Radio.Root>
        <label
          className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          htmlFor={inputId}
          style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
        >
          {label}
        </label>
      </div>
    </RadioGroup>
  );
}

export function RadioStateComparison() {
  const groupId = useId();

  return (
    <div className="grid gap-4">
      <RadioGroup className="grid gap-3" defaultValue="selected" name="radio-states">
        <label className="flex items-center gap-2" htmlFor={`${groupId}-selected`}>
          <Radio.Root id={`${groupId}-selected`} value="selected">
            <Radio.Indicator aria-hidden="true" />
          </Radio.Root>
          Selected
        </label>
        <label className="flex items-center gap-2" htmlFor={`${groupId}-available`}>
          <Radio.Root id={`${groupId}-available`} value="available">
            <Radio.Indicator aria-hidden="true" />
          </Radio.Root>
          Available
        </label>
        <label
          className="flex items-center gap-2 text-tinyrack-text-muted"
          htmlFor={`${groupId}-disabled`}
        >
          <Radio.Root disabled id={`${groupId}-disabled`} value="disabled">
            <Radio.Indicator aria-hidden="true" />
          </Radio.Root>
          Disabled
        </label>
      </RadioGroup>
      <RadioGroup defaultValue="readonly" name="readonly-radio" readOnly>
        <label className="flex items-center gap-2" htmlFor={`${groupId}-readonly`}>
          <Radio.Root id={`${groupId}-readonly`} value="readonly">
            <Radio.Indicator aria-hidden="true" />
          </Radio.Root>
          Read only
        </label>
      </RadioGroup>
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
