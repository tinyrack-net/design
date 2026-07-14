import { Button } from '@tinyrack/ui/components/button';
import { ContextMenu } from '@tinyrack/ui/components/context-menu';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  open: boolean;
  disabledItem: boolean;
};

type ContextMenuPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function ContextMenuPreview({
  label,
  open,
  disabledItem,
  onOpenChange,
}: ContextMenuPreviewProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const previousOpen = useRef(false);
  const [showLabels, setShowLabels] = useState(true);
  const [destination, setDestination] = useState('production');
  const [result, setResult] = useState('No action selected');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  const openAtTrigger = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    triggerRef.current?.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        button: 2,
        clientX: (rect?.left ?? 0) + 24,
        clientY: (rect?.top ?? 0) + 24,
      }),
    );
  }, []);

  useEffect(() => {
    if (open && !previousOpen.current) {
      openAtTrigger();
    }
    previousOpen.current = open;
  }, [open, openAtTrigger]);

  return (
    <ContextMenu.Root {...stateProps}>
      <ContextMenu.Trigger
        className="block rounded border border-tinyrack-border bg-tinyrack-surface p-6 text-tinyrack-text"
        onClick={openAtTrigger}
        ref={triggerRef}
        render={<Button />}
      >
        {label} — click or right-click
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Group>
              <ContextMenu.GroupLabel>Rack actions</ContextMenu.GroupLabel>
              <ContextMenu.Item
                disabled={disabledItem}
                onClick={() => setResult('Restart selected')}
              >
                Restart
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.CheckboxItem
              checked={showLabels}
              onCheckedChange={setShowLabels}
            >
              <ContextMenu.CheckboxItemIndicator aria-hidden="true">
                ✓
              </ContextMenu.CheckboxItemIndicator>
              Show labels
            </ContextMenu.CheckboxItem>
            <ContextMenu.RadioGroup onValueChange={setDestination} value={destination}>
              <ContextMenu.RadioItem value="production">
                <ContextMenu.RadioItemIndicator aria-hidden="true">
                  ●
                </ContextMenu.RadioItemIndicator>
                Production
              </ContextMenu.RadioItem>
              <ContextMenu.RadioItem value="staging">
                <ContextMenu.RadioItemIndicator aria-hidden="true">
                  ●
                </ContextMenu.RadioItemIndicator>
                Staging
              </ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
            <ContextMenu.Separator />
            <ContextMenu.LinkItem href="#inspect">Inspect</ContextMenu.LinkItem>
            <ContextMenu.SubmenuRoot>
              <ContextMenu.SubmenuTrigger>Move to</ContextMenu.SubmenuTrigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Popup>
                    <ContextMenu.Item onClick={() => setResult('Moved to cluster A')}>
                      Cluster A
                    </ContextMenu.Item>
                    <ContextMenu.Item onClick={() => setResult('Moved to cluster B')}>
                      Cluster B
                    </ContextMenu.Item>
                  </ContextMenu.Popup>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.SubmenuRoot>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}; labels {showLabels ? 'shown' : 'hidden'}; target {destination}
      </output>
    </ContextMenu.Root>
  );
}

const meta = {
  title: 'Components/Context Menu',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Right-click target',
    open: false,
    disabledItem: false,
  },
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
    disabledItem: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <ContextMenuPreview {...args} onOpenChange={(open) => updateArgs({ open })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
