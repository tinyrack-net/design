import { TRPopover } from '@tinyrack/ui/components/popover';
import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
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
  alignOffset: number;
  description: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  sideOffset: number;
  title: string;
};

type PopoverExampleProps = Partial<PopoverStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

export function PopoverExample({
  align = 'center',
  alignOffset = 0,
  description = 'All nodes online.',
  open = false,
  side = 'bottom',
  sideOffset = 8,
  title = 'Rack A',
  onOpenChange,
}: PopoverExampleProps) {
  const [theme, setTheme] = useState('system');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <TRPopover.Root {...stateProps}>
      <TRPopover.Trigger>Rack details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>{title}</TRPopover.Title>
            <TRPopover.Description>{description}</TRPopover.Description>
            <TRSelect.Root
              items={{ system: 'System', light: 'Light', dark: 'Dark' }}
              onValueChange={(value) => setTheme((value as string | null) ?? 'system')}
              value={theme}
            >
              <TRSelect.Label>Dashboard theme</TRSelect.Label>
              <TRSelect.Trigger aria-label="Dashboard theme">
                <TRSelect.Value />
                <TRSelect.Icon aria-hidden="true">
                  <ChevronDown />
                </TRSelect.Icon>
              </TRSelect.Trigger>
              <TRSelect.Portal>
                <TRSelect.Positioner>
                  <TRSelect.Popup>
                    <TRSelect.List>
                      <TRSelect.Item value="system">
                        <TRSelect.ItemText>System</TRSelect.ItemText>
                      </TRSelect.Item>
                      <TRSelect.Item value="light">
                        <TRSelect.ItemText>Light</TRSelect.ItemText>
                      </TRSelect.Item>
                      <TRSelect.Item value="dark">
                        <TRSelect.ItemText>Dark</TRSelect.ItemText>
                      </TRSelect.Item>
                    </TRSelect.List>
                  </TRSelect.Popup>
                </TRSelect.Positioner>
              </TRSelect.Portal>
            </TRSelect.Root>
            <output aria-live="polite">Theme: {theme}</output>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}

export function PopoverControlledLifecycle() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid w-full justify-items-end gap-3">
      <PopoverExample
        align="end"
        alignOffset={12}
        description="Collision handling keeps this long surface inside the viewport."
        onOpenChange={setOpen}
        open={open}
        side="right"
        sideOffset={16}
        title="Controlled edge popover"
      />
      <output aria-live="polite">TRPopover is {open ? 'open' : 'closed'}.</output>
    </div>
  );
}

const meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    alignOffset: 0,
    description: 'All nodes online.',
    open: false,
    side: 'bottom',
    sideOffset: 8,
    title: 'Rack A',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    alignOffset: { control: { type: 'range', min: -24, max: 24, step: 2 } },
    description: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    sideOffset: { control: { type: 'range', min: 0, max: 32, step: 2 } },
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
