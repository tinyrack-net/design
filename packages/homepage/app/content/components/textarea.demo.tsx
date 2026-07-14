import { Textarea } from '@tinyrack/ui/components/textarea';
import { useId } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  placeholder: string;
  readOnly: boolean;
  required: boolean;
  value: string;
};

export function TextareaPreview({
  label,
  value,
  ...args
}: StoryArgs & { onValueChange?: (value: string) => void }) {
  const id = useId();
  const { onValueChange, ...textareaProps } = args;
  return (
    <label className="grid w-80 max-w-full gap-2" htmlFor={id}>
      {label}
      <Textarea
        {...textareaProps}
        id={id}
        onChange={(event) => onValueChange?.(event.currentTarget.value)}
        value={value}
      />
    </label>
  );
}

const meta = {
  title: 'Components/Textarea',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Rack notes',
    placeholder: 'Operational notes',
    readOnly: false,
    required: false,
    value: '',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <TextareaPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
