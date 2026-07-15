import { Button } from '@tinyrack/ui/components/button';
import { ContextMenu } from '@tinyrack/ui/components/context-menu';
import { Check, ChevronRight, CircleDot, Server } from 'lucide-react';
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

const rackAddress = '10.42.0.18';

export function ContextMenuPreview({
  label,
  open,
  disabledItem,
  onOpenChange,
}: ContextMenuPreviewProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const previousOpen = useRef(false);
  const [result, setResult] = useState('');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  const openAtTrigger = useCallback((anchor?: HTMLElement) => {
    const trigger = triggerRef.current;
    const rect = (anchor ?? trigger)?.getBoundingClientRect();
    if (trigger === null || trigger === undefined || rect === undefined) return;

    trigger.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        button: 2,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      }),
    );
  }, []);

  useEffect(() => {
    if (open && !previousOpen.current) openAtTrigger();
    previousOpen.current = open;
  }, [open, openAtTrigger]);

  return (
    <div className="grid w-full max-w-xl gap-3">
      <p className="m-0 text-sm text-tinyrack-text-muted">
        Right-click the rack row, or focus it and press Shift+F10.
      </p>
      <div className="overflow-hidden rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface">
        <div className="flex items-center justify-between border-b border-tinyrack-border px-4 py-3">
          <span className="font-semibold">Rack inventory</span>
          <span className="text-sm text-tinyrack-text-muted">3 online</span>
        </div>
        <div className="grid gap-2 p-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <ContextMenu.Root {...stateProps}>
            <ContextMenu.Trigger
              aria-label={`${label}, online rack. Open context menu for actions.`}
              className="grid h-auto min-w-0 w-full appearance-none grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-start gap-3 whitespace-normal rounded-tinyrack-md border-0 bg-transparent p-3 text-left text-tinyrack-text hover:bg-tinyrack-surface-hover"
              ref={triggerRef}
              render={<Button appearance="ghost" type="button" />}
            >
              <Server aria-hidden="true" size="1.25em" />
              <span className="grid min-w-0 gap-1">
                <span className="truncate font-medium">{label}</span>
                <span className="truncate text-sm text-tinyrack-text-muted">
                  {rackAddress} · Seoul
                </span>
              </span>
              <span className="text-sm text-tinyrack-success">Online</span>
            </ContextMenu.Trigger>
            <Button
              appearance="outline"
              aria-label={`Open actions for ${label}`}
              onClick={(event) => openAtTrigger(event.currentTarget)}
              size="sm"
              type="button"
            >
              More actions
            </Button>
            <ContextMenu.Portal>
              <ContextMenu.Backdrop />
              <ContextMenu.Positioner>
                <ContextMenu.Popup>
                  <ContextMenu.Arrow />
                  <ContextMenu.Group>
                    <ContextMenu.GroupLabel>{label}</ContextMenu.GroupLabel>
                    <ContextMenu.LinkItem
                      href="#rack-details"
                      onClick={() => setResult(`${label} details opened.`)}
                    >
                      Open details
                    </ContextMenu.LinkItem>
                    <ContextMenu.Item
                      onClick={() => setResult(`${rackAddress} copied.`)}
                    >
                      Copy address
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      disabled={disabledItem}
                      onClick={() => setResult(`Restart requested for ${label}.`)}
                    >
                      Restart
                    </ContextMenu.Item>
                  </ContextMenu.Group>
                  <ContextMenu.Separator />
                  <ContextMenu.SubmenuRoot>
                    <ContextMenu.SubmenuTrigger>
                      Move to
                      <ChevronRight aria-hidden="true" size="1em" />
                    </ContextMenu.SubmenuTrigger>
                    <ContextMenu.Portal>
                      <ContextMenu.Positioner>
                        <ContextMenu.Popup>
                          <ContextMenu.Arrow />
                          <ContextMenu.Item
                            onClick={() => setResult(`${label} moved to Production.`)}
                          >
                            Production
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            onClick={() => setResult(`${label} moved to Staging.`)}
                          >
                            Staging
                          </ContextMenu.Item>
                        </ContextMenu.Popup>
                      </ContextMenu.Positioner>
                    </ContextMenu.Portal>
                  </ContextMenu.SubmenuRoot>
                  <ContextMenu.Separator />
                  <ContextMenu.Item
                    onClick={() => setResult(`${label} removed.`)}
                    variant="danger"
                  >
                    Remove rack
                  </ContextMenu.Item>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.Root>
        </div>
      </div>
      <output aria-live="polite" className="text-sm text-tinyrack-text-muted">
        {result}
      </output>
    </div>
  );
}

export function ContextMenuViewOptionsPreview() {
  const [showLabels, setShowLabels] = useState(true);
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="grid w-full max-w-xl gap-3">
      <p className="m-0 text-sm text-tinyrack-text-muted">
        Right-click the canvas to change how racks are displayed.
      </p>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          aria-label="Rack canvas view options"
          className="grid h-auto min-h-48 w-full appearance-none content-center justify-start gap-4 whitespace-normal rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface p-4 text-left text-tinyrack-text"
          render={<Button appearance="ghost" type="button" />}
        >
          <span className="text-sm font-medium text-tinyrack-text-muted">
            Rack canvas
          </span>
          <span
            className={
              density === 'compact'
                ? 'grid grid-cols-3 gap-1'
                : 'grid grid-cols-3 gap-3'
            }
          >
            {['Alpha', 'Beta', 'Gamma'].map((rack) => (
              <span
                className="grid place-items-center gap-2 rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-canvas p-3"
                key={rack}
              >
                <Server aria-hidden="true" size="1.25em" />
                <span className={showLabels ? 'text-sm' : 'sr-only'}>{rack}</span>
              </span>
            ))}
          </span>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Backdrop />
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Arrow />
              <ContextMenu.Group>
                <ContextMenu.GroupLabel>View</ContextMenu.GroupLabel>
                <ContextMenu.CheckboxItem
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                >
                  <ContextMenu.CheckboxItemIndicator aria-hidden="true">
                    <Check size="1em" />
                  </ContextMenu.CheckboxItemIndicator>
                  Show labels
                </ContextMenu.CheckboxItem>
              </ContextMenu.Group>
              <ContextMenu.Group>
                <ContextMenu.GroupLabel>Density</ContextMenu.GroupLabel>
                <ContextMenu.RadioGroup onValueChange={setDensity} value={density}>
                  <ContextMenu.RadioItem value="comfortable">
                    <ContextMenu.RadioItemIndicator aria-hidden="true">
                      <CircleDot size="1em" />
                    </ContextMenu.RadioItemIndicator>
                    Comfortable
                  </ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="compact">
                    <ContextMenu.RadioItemIndicator aria-hidden="true">
                      <CircleDot size="1em" />
                    </ContextMenu.RadioItemIndicator>
                    Compact
                  </ContextMenu.RadioItem>
                </ContextMenu.RadioGroup>
              </ContextMenu.Group>
              <ContextMenu.Separator />
              <ContextMenu.Item
                onClick={() => {
                  setShowLabels(true);
                  setDensity('comfortable');
                }}
              >
                Reset view
              </ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <output aria-live="polite" className="text-sm text-tinyrack-text-muted">
        Labels {showLabels ? 'shown' : 'hidden'} · {density} density
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Context Menu',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Rack Alpha',
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
