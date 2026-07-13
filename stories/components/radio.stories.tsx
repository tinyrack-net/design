import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Radio } from '../../src/components/radio/index.js';
import { RadioGroup } from '../../src/components/radio-group/index.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
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
    >
      <div className="flex items-center gap-2">
        <Radio.Root disabled={disabled} id={inputId} value="primary">
          <Radio.Indicator />
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
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RadioPreview disabled={false} label="Selected" selected />
      <RadioPreview disabled={false} label="Unselected" selected={false} />
      <RadioPreview disabled label="Disabled selected" selected />
      <RadioPreview disabled label="Disabled unselected" selected={false} />
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
    selected: true,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
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
