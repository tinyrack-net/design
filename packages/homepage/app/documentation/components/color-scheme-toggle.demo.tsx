import {
  type TRColorScheme,
  TRColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Args = { value: TRColorScheme };
export function ColorSchemeTogglePreview({ value: initialValue }: Args) {
  const [value, setValue] = useState(initialValue);
  return <TRColorSchemeToggle onValueChange={setValue} value={value} />;
}
const meta = {
  args: { value: 'light' },
  argTypes: {},
  parameters: { layout: 'centered' },
  render: ColorSchemeTogglePreview,
  title: 'Components/ColorSchemeToggle',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
