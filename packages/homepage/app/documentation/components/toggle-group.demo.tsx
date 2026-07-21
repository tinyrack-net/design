import { TRToggle } from '@tinyrack/ui/components/toggle';
import { TRToggleGroup } from '@tinyrack/ui/components/toggle-group';
import { useState } from 'react';
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
  itemDisabled: boolean;
  loopFocus: boolean;
  multiple: boolean;
  orientation: 'horizontal' | 'vertical';
  value: string[];
};

type ToggleGroupPreviewProps = StoryArgs & {
  onValueChange?: (value: string[]) => void;
};

export function ToggleGroupPreview({
  disabled,
  itemDisabled,
  loopFocus,
  multiple,
  onValueChange,
  orientation,
  value,
}: ToggleGroupPreviewProps) {
  return (
    <div className="grid justify-items-start gap-3">
      <TRToggleGroup
        aria-label="Text alignment"
        disabled={disabled}
        loopFocus={loopFocus}
        multiple={multiple}
        onValueChange={onValueChange}
        orientation={orientation}
        value={value}
      >
        <TRToggle value="start">Start</TRToggle>
        <TRToggle value="center">Center</TRToggle>
        <TRToggle disabled={itemDisabled} value="end">
          End
        </TRToggle>
      </TRToggleGroup>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Active: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

export function ToggleGroupInteractiveExample() {
  const [value, setValue] = useState<string[]>(['start']);

  return (
    <div className="grid justify-items-start gap-3">
      <TRToggleGroup
        aria-label="Text alignment"
        defaultValue={['start']}
        onValueChange={setValue}
      >
        <TRToggle value="start">Start</TRToggle>
        <TRToggle value="center">Center</TRToggle>
        <TRToggle value="end">End</TRToggle>
      </TRToggleGroup>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Active: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

export function ToggleGroupMultipleExample() {
  const [value, setValue] = useState<string[]>(['bold', 'underline']);

  return (
    <div className="grid justify-items-start gap-3">
      <TRToggleGroup
        aria-label="Text formatting"
        multiple
        onValueChange={setValue}
        value={value}
      >
        <TRToggle value="bold">Bold</TRToggle>
        <TRToggle value="italic">Italic</TRToggle>
        <TRToggle value="underline">Underline</TRToggle>
      </TRToggleGroup>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Formatting: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

export function ToggleGroupAvailabilityExample() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="grid justify-items-start gap-3">
        <p className="text-tinyrack-sm font-semibold">Group disabled</p>
        <TRToggleGroup
          aria-label="Unavailable panel placement"
          defaultValue={['top']}
          disabled
          loopFocus={false}
          orientation="vertical"
        >
          <TRToggle value="top">Top</TRToggle>
          <TRToggle value="middle">Middle</TRToggle>
          <TRToggle value="bottom">Bottom</TRToggle>
        </TRToggleGroup>
      </div>

      <div className="grid justify-items-start gap-3">
        <p className="text-tinyrack-sm font-semibold">One item disabled</p>
        <TRToggleGroup
          aria-label="Available panel placement"
          defaultValue={['top']}
          loopFocus={false}
          orientation="vertical"
        >
          <TRToggle value="top">Top</TRToggle>
          <TRToggle value="middle">Middle</TRToggle>
          <TRToggle disabled value="bottom">
            Bottom unavailable
          </TRToggle>
        </TRToggleGroup>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Toggle Group',
  excludeStories: /.*(?:Preview|Example)$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    itemDisabled: false,
    loopFocus: true,
    multiple: false,
    orientation: 'horizontal',
    value: ['start'],
  },
  argTypes: {
    disabled: { control: 'boolean' },
    itemDisabled: { control: 'boolean' },
    loopFocus: { control: 'boolean' },
    multiple: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <ToggleGroupPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
