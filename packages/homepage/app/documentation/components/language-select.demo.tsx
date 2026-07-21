import {
  TRLanguageSelect,
  type TRLanguageSelectProps,
} from '@tinyrack/ui/components/language-select';
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
type Args = { uiSize: NonNullable<TRLanguageSelectProps['uiSize']> };
export function LanguageSelectPreview({ uiSize }: Args) {
  const [value, setValue] = useState('en');
  return (
    <TRLanguageSelect
      onValueChange={setValue}
      options={options}
      uiSize={uiSize}
      value={value}
    />
  );
}
const meta = {
  args: { uiSize: 'md' },
  argTypes: {
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'centered' },
  render: LanguageSelectPreview,
  title: 'Components/LanguageSelect',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
