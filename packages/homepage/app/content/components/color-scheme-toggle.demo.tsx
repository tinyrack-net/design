import {
  type ColorScheme,
  ColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { value: ColorScheme };
export function ColorSchemeTogglePreview({ value: initialValue }: Args) {
  const [value, setValue] = useState(initialValue);
  return <ColorSchemeToggle onValueChange={setValue} value={value} />;
}
const meta = {
  args: { value: 'light' },
  argTypes: { value: { control: 'select', options: ['light', 'dark'] } },
  parameters: { layout: 'centered' },
  render: ColorSchemeTogglePreview,
  title: 'Components/ColorSchemeToggle',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
