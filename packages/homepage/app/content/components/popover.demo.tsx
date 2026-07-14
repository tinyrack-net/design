import { Popover } from '@tinyrack/ui/components/popover';
import { Select } from '@tinyrack/ui/components/select';
import { useState } from 'react';
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
            <Select.Root
              items={{ system: 'System', light: 'Light', dark: 'Dark' }}
              onValueChange={(value) => setTheme((value as string | null) ?? 'system')}
              value={theme}
            >
              <Select.Label>Dashboard theme</Select.Label>
              <Select.Trigger aria-label="Dashboard theme">
                <Select.Value />
                <Select.Icon aria-hidden="true">⌄</Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner>
                  <Select.Popup>
                    <Select.List>
                      <Select.Item value="system">
                        <Select.ItemText>System</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="light">
                        <Select.ItemText>Light</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="dark">
                        <Select.ItemText>Dark</Select.ItemText>
                      </Select.Item>
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
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
