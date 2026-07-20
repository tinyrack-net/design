import { TRLanguageSelect } from '@tinyrack/ui/components/language-select';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

const options = [
  { label: 'English', value: 'en' },
  { label: '한국어', value: 'ko' },
  { label: '日本語', value: 'ja' },
];
type Args = { value: string };
export function LanguageSelectPreview({ value: initialValue }: Args) {
  const [value, setValue] = useState(initialValue);
  return <TRLanguageSelect onValueChange={setValue} options={options} value={value} />;
}
const meta = {
  args: { value: 'en' },
  argTypes: { value: { control: 'select', options: ['en', 'ko', 'ja'] } },
  parameters: { layout: 'centered' },
  render: LanguageSelectPreview,
  title: 'Components/LanguageSelect',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
