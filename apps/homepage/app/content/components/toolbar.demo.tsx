import { Toolbar } from '@tinyrack/ui/components/toolbar';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  disabled: boolean;
  loopFocus: boolean;
  orientation: 'horizontal' | 'vertical';
};

export function ToolbarPreview({ label, disabled, loopFocus, orientation }: StoryArgs) {
  const [result, setResult] = useState('No formatting command selected');

  return (
    <div>
      <Toolbar.Root
        aria-label={label}
        className="max-w-full flex-wrap"
        disabled={disabled}
        loopFocus={loopFocus}
        orientation={orientation}
      >
        <Toolbar.Group aria-label="Text style">
          <Toolbar.Button onClick={() => setResult('Bold selected')}>
            Bold
          </Toolbar.Button>
          <Toolbar.Button onClick={() => setResult('Italic selected')}>
            Italic
          </Toolbar.Button>
          <Toolbar.Button
            aria-label="Underline unavailable"
            disabled
            focusableWhenDisabled
          >
            Underline
          </Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Input
          aria-label="Document title"
          className="min-w-0 w-32 max-w-full"
          placeholder="Document title"
        />
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Toolbar',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Editor controls',
    disabled: false,
    loopFocus: true,
    orientation: 'horizontal',
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    loopFocus: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: (args) => <ToolbarPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
