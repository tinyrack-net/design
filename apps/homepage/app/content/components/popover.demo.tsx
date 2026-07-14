import { Popover } from '@tinyrack/ui/components/popover';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type PopoverStoryArgs = {
  align: 'start' | 'center' | 'end';
  description: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  title: string;
};

type PopoverExampleProps = Partial<PopoverStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

export function PopoverExample({
  align = 'center',
  description = 'All nodes online.',
  open = false,
  side = 'bottom',
  title = 'Rack A',
  onOpenChange,
}: PopoverExampleProps) {
  const selectId = useId();
  const [theme, setTheme] = useState('system');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <Popover.Root {...stateProps}>
      <Popover.Trigger>Rack details</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align={align} side={side}>
          <Popover.Popup>
            <Popover.Title>{title}</Popover.Title>
            <Popover.Description>{description}</Popover.Description>
            <label htmlFor={selectId}>Dashboard theme</label>
            <select
              id={selectId}
              onChange={(event) => setTheme(event.currentTarget.value)}
              value={theme}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <output aria-live="polite">Theme: {theme}</output>
            <Popover.Close>Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    description: 'All nodes online.',
    open: false,
    side: 'bottom',
    title: 'Rack A',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    description: { control: 'text' },
    open: { control: 'boolean' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    title: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<PopoverStoryArgs>();

    return <PopoverExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
