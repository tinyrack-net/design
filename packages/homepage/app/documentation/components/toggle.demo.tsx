import { TRToggle } from '@tinyrack/ui/components/toggle';
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
  label: string;
  pressed: boolean;
  disabled: boolean;
};

type TogglePreviewProps = StoryArgs & {
  onPressedChange?: (pressed: boolean) => void;
};

export function TogglePreview({
  disabled,
  label,
  onPressedChange,
  pressed,
}: TogglePreviewProps) {
  const visibleLabel = label.trim() || 'Toggle';

  return (
    <div className="grid justify-items-start gap-3">
      <TRToggle disabled={disabled} onPressedChange={onPressedChange} pressed={pressed}>
        {visibleLabel}
      </TRToggle>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        {visibleLabel}: {pressed ? 'on' : 'off'}
      </output>
    </div>
  );
}

export function ToggleInteractiveExample() {
  const [pressed, setPressed] = useState(false);

  return (
    <TogglePreview
      disabled={false}
      label="Bold"
      onPressedChange={setPressed}
      pressed={pressed}
    />
  );
}

export function ToggleStateComparison() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TRToggle>Bold</TRToggle>
      <TRToggle>Italic</TRToggle>
      <TRToggle disabled>Disabled</TRToggle>
      <TRToggle defaultPressed>Pressed</TRToggle>
    </div>
  );
}

const meta = {
  title: 'Components/Toggle',
  excludeStories: /.*(?:Preview|Example|Comparison)$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Bold',
    pressed: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <TogglePreview {...args} onPressedChange={(pressed) => updateArgs({ pressed })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
