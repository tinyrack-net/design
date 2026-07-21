import { TRButton } from '@tinyrack/ui/components/button';
import {
  TRContextMenu,
  type TRContextMenuItemVariant,
} from '@tinyrack/ui/components/context-menu';
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
  variant: TRContextMenuItemVariant;
};

type ContextMenuPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

const rackAddress = '10.42.0.18';

export function ContextMenuPreview({
  label,
  open,
  disabledItem,
  variant,
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
          <TRContextMenu.Root {...stateProps}>
            <TRContextMenu.Trigger
              aria-label={`${label}, online rack. Open context menu for actions.`}
              className="grid h-auto min-w-0 w-full appearance-none grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-start gap-3 whitespace-normal rounded-tinyrack-md border-0 bg-transparent p-3 text-left text-tinyrack-text hover:bg-tinyrack-surface-hover"
              ref={triggerRef}
              render={<TRButton appearance="ghost" type="button" />}
            >
              <Server aria-hidden="true" size="1.25em" />
              <span className="grid min-w-0 gap-1">
                <span className="truncate font-medium">{label}</span>
                <span className="truncate text-sm text-tinyrack-text-muted">
                  {rackAddress} · Seoul
                </span>
              </span>
              <span className="text-sm text-tinyrack-success">Online</span>
            </TRContextMenu.Trigger>
            <TRButton
              appearance="outline"
              aria-label={`Open actions for ${label}`}
              onClick={(event) => openAtTrigger(event.currentTarget)}
              uiSize="sm"
              type="button"
            >
              More actions
            </TRButton>
            <TRContextMenu.Portal>
              <TRContextMenu.Backdrop />
              <TRContextMenu.Positioner>
                <TRContextMenu.Popup>
                  <TRContextMenu.Arrow />
                  <TRContextMenu.Group>
                    <TRContextMenu.GroupLabel>{label}</TRContextMenu.GroupLabel>
                    <TRContextMenu.LinkItem
                      href="#rack-details"
                      onClick={() => setResult(`${label} details opened.`)}
                    >
                      Open details
                    </TRContextMenu.LinkItem>
                    <TRContextMenu.Item
                      onClick={() => setResult(`${rackAddress} copied.`)}
                    >
                      Copy address
                    </TRContextMenu.Item>
                    <TRContextMenu.Item
                      disabled={disabledItem}
                      onClick={() => setResult(`Restart requested for ${label}.`)}
                    >
                      Restart
                    </TRContextMenu.Item>
                  </TRContextMenu.Group>
                  <TRContextMenu.Separator />
                  <TRContextMenu.SubmenuRoot>
                    <TRContextMenu.SubmenuTrigger>
                      Move to
                      <ChevronRight aria-hidden="true" size="1em" />
                    </TRContextMenu.SubmenuTrigger>
                    <TRContextMenu.Portal>
                      <TRContextMenu.Positioner>
                        <TRContextMenu.Popup>
                          <TRContextMenu.Arrow />
                          <TRContextMenu.Item
                            onClick={() => setResult(`${label} moved to Production.`)}
                          >
                            Production
                          </TRContextMenu.Item>
                          <TRContextMenu.Item
                            onClick={() => setResult(`${label} moved to Staging.`)}
                          >
                            Staging
                          </TRContextMenu.Item>
                        </TRContextMenu.Popup>
                      </TRContextMenu.Positioner>
                    </TRContextMenu.Portal>
                  </TRContextMenu.SubmenuRoot>
                  <TRContextMenu.Separator />
                  <TRContextMenu.Item
                    onClick={() => setResult(`${label} removed.`)}
                    variant={variant}
                  >
                    Remove rack
                  </TRContextMenu.Item>
                </TRContextMenu.Popup>
              </TRContextMenu.Positioner>
            </TRContextMenu.Portal>
          </TRContextMenu.Root>
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
      <TRContextMenu.Root>
        <TRContextMenu.Trigger
          aria-label="Rack canvas view options"
          className="grid h-auto min-h-48 w-full appearance-none content-center justify-start gap-4 whitespace-normal rounded-tinyrack-lg border border-tinyrack-border bg-tinyrack-surface p-4 text-left text-tinyrack-text"
          render={<TRButton appearance="ghost" type="button" />}
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
        </TRContextMenu.Trigger>
        <TRContextMenu.Portal>
          <TRContextMenu.Backdrop />
          <TRContextMenu.Positioner>
            <TRContextMenu.Popup>
              <TRContextMenu.Arrow />
              <TRContextMenu.Group>
                <TRContextMenu.GroupLabel>View</TRContextMenu.GroupLabel>
                <TRContextMenu.CheckboxItem
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                >
                  <TRContextMenu.CheckboxItemIndicator aria-hidden="true">
                    <Check size="1em" />
                  </TRContextMenu.CheckboxItemIndicator>
                  Show labels
                </TRContextMenu.CheckboxItem>
              </TRContextMenu.Group>
              <TRContextMenu.Group>
                <TRContextMenu.GroupLabel>Density</TRContextMenu.GroupLabel>
                <TRContextMenu.RadioGroup onValueChange={setDensity} value={density}>
                  <TRContextMenu.RadioItem value="comfortable">
                    <TRContextMenu.RadioItemIndicator aria-hidden="true">
                      <CircleDot size="1em" />
                    </TRContextMenu.RadioItemIndicator>
                    Comfortable
                  </TRContextMenu.RadioItem>
                  <TRContextMenu.RadioItem value="compact">
                    <TRContextMenu.RadioItemIndicator aria-hidden="true">
                      <CircleDot size="1em" />
                    </TRContextMenu.RadioItemIndicator>
                    Compact
                  </TRContextMenu.RadioItem>
                </TRContextMenu.RadioGroup>
              </TRContextMenu.Group>
              <TRContextMenu.Separator />
              <TRContextMenu.Item
                onClick={() => {
                  setShowLabels(true);
                  setDensity('comfortable');
                }}
              >
                Reset view
              </TRContextMenu.Item>
            </TRContextMenu.Popup>
          </TRContextMenu.Positioner>
        </TRContextMenu.Portal>
      </TRContextMenu.Root>
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
    variant: 'default',
  },
  argTypes: {
    label: { control: 'text' },
    disabledItem: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'danger'] },
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
