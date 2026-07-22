import { TRToggle } from '@tinyrack/ui/components/toggle';
import { TRToggleGroup } from '@tinyrack/ui/components/toggle-group';
import { useEffect, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type StoryArgs = {
  disabled: boolean;
  disabledItem: boolean;
  loopFocus: boolean;
  multiple: boolean;
  orientation: 'horizontal' | 'vertical';
};

export function ToggleGroupPreview({
  disabled,
  disabledItem,
  loopFocus,
  multiple,
  orientation,
}: StoryArgs) {
  const [value, setValue] = useState<string[]>(['start']);

  useEffect(() => {
    if (!multiple) {
      setValue((currentValue) => currentValue.slice(0, 1));
    }
  }, [multiple]);

  return (
    <div className="grid justify-items-start gap-3" data-docs-example-item="">
      <TRToggleGroup
        aria-label="Text alignment"
        disabled={disabled}
        loopFocus={loopFocus}
        multiple={multiple}
        onValueChange={setValue}
        orientation={orientation}
        value={value}
      >
        <TRToggle value="start">Start</TRToggle>
        <TRToggle value="center">Center</TRToggle>
        <TRToggle disabled={disabledItem} value="end">
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
  const locale = useDemoLocale();
  const labels = locale === 'ko' ? ['시작', '가운데', '끝', '활성'] : locale === 'ja' ? ['先頭', '中央', '末尾', '選択中'] : ['Start', 'Center', 'End', 'Active'];

  return (
    <div className="grid justify-items-start gap-3" data-docs-example-item="">
      <TRToggleGroup
        aria-label="Text alignment"
        defaultValue={['start']}
        onValueChange={setValue}
      >
        <TRToggle value="start">{labels[0]}</TRToggle>
        <TRToggle value="center">{labels[1]}</TRToggle>
        <TRToggle value="end">{labels[2]}</TRToggle>
      </TRToggleGroup>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        {labels[3]}: {value.length === 0 ? '—' : value.join(', ')}
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
      <div className="grid justify-items-start gap-3" data-docs-example-item="">
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

      <div className="grid justify-items-start gap-3" data-docs-example-item="">
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
    disabledItem: false,
    loopFocus: true,
    multiple: false,
    orientation: 'horizontal',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    disabledItem: { control: 'boolean' },
    loopFocus: { control: 'boolean' },
    multiple: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: (args) => <ToggleGroupPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
