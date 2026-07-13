import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Switch } from '../../src/components/switch/index.js';

type StoryArgs = {
  label: string;
  checked: boolean;
  disabled: boolean;
};

type SwitchPreviewProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function SwitchPreview({
  label,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
}: SwitchPreviewProps) {
  const inputId = useId();
  const stateProps =
    checked === undefined ? { defaultChecked: defaultChecked ?? false } : { checked };

  return (
    <div className="flex items-center gap-2">
      <Switch.Root
        {...stateProps}
        {...(onCheckedChange === undefined ? {} : { onCheckedChange })}
        disabled={disabled}
        id={inputId}
      >
        <Switch.Thumb />
      </Switch.Root>
      <label
        className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        htmlFor={inputId}
        style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
      >
        {label}
      </label>
    </div>
  );
}

function SwitchStateSample({
  title,
  defaultChecked,
  disabled,
}: {
  title: string;
  defaultChecked: boolean;
  disabled: boolean;
}) {
  return (
    <div className="grid gap-2">
      <strong>{title}</strong>
      <SwitchPreview
        defaultChecked={defaultChecked}
        disabled={disabled}
        label="Automatic updates"
      />
    </div>
  );
}

export function SwitchStateComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SwitchStateSample
        defaultChecked={false}
        disabled={false}
        title="Enabled · Off"
      />
      <SwitchStateSample defaultChecked disabled={false} title="Enabled · On" />
      <SwitchStateSample defaultChecked={false} disabled title="Disabled · Off" />
      <SwitchStateSample defaultChecked disabled title="Disabled · On" />
    </div>
  );
}

const meta = {
  title: 'Components/Switch',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Automatic updates',
    checked: true,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <SwitchPreview {...args} onCheckedChange={(checked) => updateArgs({ checked })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
