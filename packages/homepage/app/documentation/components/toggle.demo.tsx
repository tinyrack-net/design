import { TRToggle } from '@tinyrack/ui/components/toggle';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';
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
    <div className="grid justify-items-start gap-3" data-docs-example-item="">
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
  const locale = useDemoLocale();

  return (
    <TogglePreview
      disabled={false}
      label={locale === 'ko' ? '굵게' : locale === 'ja' ? '太字' : 'Bold'}
      onPressedChange={setPressed}
      pressed={pressed}
    />
  );
}

export function ToggleStateComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2" data-docs-example-item="">
        <strong>Enabled · Off</strong>
        <TRToggle>Bold</TRToggle>
      </div>
      <div className="grid gap-2" data-docs-example-item="">
        <strong>Enabled · On</strong>
        <TRToggle defaultPressed>Italic</TRToggle>
      </div>
      <div className="grid gap-2" data-docs-example-item="">
        <strong>Disabled · Off</strong>
        <TRToggle disabled>Underline</TRToggle>
      </div>
      <div className="grid gap-2" data-docs-example-item="">
        <strong>Disabled · On</strong>
        <TRToggle defaultPressed disabled>
          Strikethrough
        </TRToggle>
      </div>
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
  localizedArgs: { ja: { label: '太字' }, ko: { label: '굵게' } },
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
