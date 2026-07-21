import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { TRTooltip } from '@tinyrack/ui/components/tooltip';
import { Info } from 'lucide-react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type TooltipStoryArgs = {
  align: 'start' | 'center' | 'end';
  content: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  trigger: string;
};

type TooltipExampleProps = Partial<TooltipStoryArgs> & {
  closeDelay?: number;
  delay?: number;
  onOpenChange?: (open: boolean) => void;
  triggerMode?: 'text' | 'icon';
};

export function TooltipExample({
  align = 'center',
  closeDelay = 0,
  content = 'Rack temperature: 24°C',
  delay = 400,
  open = false,
  side = 'top',
  trigger = 'Hover for details',
  triggerMode = 'text',
  onOpenChange,
}: TooltipExampleProps) {
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <TRTooltip.Provider closeDelay={closeDelay} delay={delay}>
      <TRTooltip.Root {...stateProps}>
        {triggerMode === 'icon' ? (
          <TRTooltip.Trigger
            render={
              <TRIconButton aria-label={trigger}>
                <Info aria-hidden="true" />
              </TRIconButton>
            }
          />
        ) : (
          <TRTooltip.Trigger>{trigger}</TRTooltip.Trigger>
        )}
        <TRTooltip.Portal>
          <TRTooltip.Positioner align={align} side={side}>
            <TRTooltip.Popup>
              {content}
              <TRTooltip.Arrow />
            </TRTooltip.Popup>
          </TRTooltip.Positioner>
        </TRTooltip.Portal>
      </TRTooltip.Root>
    </TRTooltip.Provider>
  );
}

const delayGroupItems = [
  ['CPU status', '42% utilization'],
  ['Memory status', '68% utilization'],
  ['Storage status', '2.4 TB available'],
] as const;

export function TooltipDelayGroupExample() {
  return (
    <TRTooltip.Provider closeDelay={100} delay={500}>
      <div className="flex flex-wrap gap-3">
        {delayGroupItems.map(([label, content]) => (
          <TRTooltip.Root key={label}>
            <TRTooltip.Trigger
              render={
                <TRIconButton aria-label={label}>
                  <Info aria-hidden="true" />
                </TRIconButton>
              }
            />
            <TRTooltip.Portal>
              <TRTooltip.Positioner side="top">
                <TRTooltip.Popup>
                  {content}
                  <TRTooltip.Arrow />
                </TRTooltip.Popup>
              </TRTooltip.Positioner>
            </TRTooltip.Portal>
          </TRTooltip.Root>
        ))}
      </div>
    </TRTooltip.Provider>
  );
}

const meta = {
  title: 'Components/Tooltip',
  excludeStories: /.*Example$/,
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    content: 'Rack temperature: 24°C',
    open: true,
    side: 'top',
    trigger: 'Rack temperature details',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    content: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    trigger: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TooltipStoryArgs>();

    return <TooltipExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
