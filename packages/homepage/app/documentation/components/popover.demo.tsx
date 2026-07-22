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

export const popoverBasicSource = `import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

export function PopoverExample() {
  return (
    <TRPopover.Root>
      <TRPopover.Trigger>Rack details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner sideOffset={8}>
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>Rack A</TRPopover.Title>
            <TRPopover.Description>All nodes online.</TRPopover.Description>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}`;

export const popoverSidesSource = `import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

const sides = ['top', 'right', 'bottom', 'left'] as const;

export function PopoverSides() {
  return sides.map((side) => (
    <TRPopover.Root key={side}>
      <TRPopover.Trigger>{side}</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner side={side} sideOffset={8}>
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>{side}</TRPopover.Title>
            <TRPopover.Description>Anchored content.</TRPopover.Description>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  ));
}`;

export const popoverCollisionSource = `import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';
import { useState } from 'react';

export function ControlledPopover() {
  const [open, setOpen] = useState(false);

  return (
    <TRPopover.Root onOpenChange={setOpen} open={open}>
      <TRPopover.Trigger>Rack details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner
          align="end"
          alignOffset={12}
          collisionAvoidance={{ align: 'flip', side: 'flip' }}
          side="right"
          sideOffset={16}
        >
          <TRPopover.Popup>
            <TRPopover.Arrow />
            <TRPopover.Title>Controlled edge popover</TRPopover.Title>
            <TRPopover.Description>Collision-aware content.</TRPopover.Description>
            <TRPopover.Close>Close</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}`;

export const popoverHandleSource = `import '@tinyrack/ui/components/popover.css';
import { TRPopover } from '@tinyrack/ui/components/popover';

const popoverHandle = TRPopover.createHandle<{ rack: string }>();

export function DetachedPopover() {
  return (
    <>
      <TRPopover.Trigger handle={popoverHandle} payload={{ rack: 'Rack Delta' }}>
        Detached rack details
      </TRPopover.Trigger>
      <TRPopover.Root handle={popoverHandle}>
        {({ payload }) => (
          <TRPopover.Portal>
            <TRPopover.Positioner sideOffset={8}>
              <TRPopover.Popup>
                <TRPopover.Title>{payload?.rack}</TRPopover.Title>
                <TRPopover.Description>
                  Opened by an external trigger.
                </TRPopover.Description>
                <TRPopover.Close>Close</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        )}
      </TRPopover.Root>
    </>
  );
}`;

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
          collisionAvoidance={{ align: 'flip', side: 'flip' }}
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

const popoverHandle = TRPopover.createHandle<{ rack: string }>();

export function PopoverHandleExample() {
  return (
    <div className="grid justify-items-start gap-3">
      <TRPopover.Trigger handle={popoverHandle} payload={{ rack: 'Rack Delta' }}>
        Detached rack details
      </TRPopover.Trigger>
      <TRPopover.Root handle={popoverHandle}>
        {({ payload }) => (
          <TRPopover.Portal>
            <TRPopover.Positioner sideOffset={8}>
              <TRPopover.Popup>
                <TRPopover.Title>{payload?.rack}</TRPopover.Title>
                <TRPopover.Description>
                  Opened by an external trigger.
                </TRPopover.Description>
                <TRPopover.Close>Close</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        )}
      </TRPopover.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Popover',
  excludeStories: /.*(?:Example|Source)$/,
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
