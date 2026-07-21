import {
  type TRColorScheme,
  TRColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = {
  disabled: boolean;
  uiSize: 'sm' | 'md' | 'lg';
  value: TRColorScheme;
};
type PreviewProps = Omit<Args, 'disabled' | 'uiSize'> &
  Partial<Pick<Args, 'disabled' | 'uiSize'>>;
export function ColorSchemeTogglePreview({
  disabled = false,
  uiSize = 'md',
  value: initialValue,
}: PreviewProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <TRColorSchemeToggle
      disabled={disabled}
      onValueChange={setValue}
      uiSize={uiSize}
      value={value}
    />
  );
}
const meta = {
  args: { disabled: false, uiSize: 'md', value: 'light' },
  argTypes: {
    disabled: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'centered' },
  render: ColorSchemeTogglePreview,
  title: 'Components/ColorSchemeToggle',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
