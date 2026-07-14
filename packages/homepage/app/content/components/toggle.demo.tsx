import { Toggle } from '@tinyrack/ui/components/toggle';
import { Bold, Italic } from 'lucide-react';
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
  const accessibleLabel = label.trim() || 'Toggle';

  return (
    <div className="grid justify-items-start gap-3">
      <Toggle
        aria-label={label.trim() ? undefined : accessibleLabel}
        disabled={disabled}
        onPressedChange={onPressedChange}
        pressed={pressed}
      >
        <Bold aria-hidden="true" className="h-4 w-4" />
        {label}
      </Toggle>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        {accessibleLabel}: {pressed ? 'on' : 'off'}
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
      <Toggle aria-label="Bold" defaultPressed>
        <Bold aria-hidden="true" className="h-4 w-4" />
      </Toggle>
      <Toggle>
        <Italic aria-hidden="true" className="h-4 w-4" />
        Italic
      </Toggle>
      <Toggle disabled>Disabled</Toggle>
      <Toggle defaultPressed>Pressed</Toggle>
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
    pressed: { control: 'boolean' },
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
