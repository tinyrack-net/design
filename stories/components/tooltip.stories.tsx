import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Tooltip } from '../../src/components/tooltip/index.js';

type TooltipStoryArgs = {
  align: 'start' | 'center' | 'end';
  content: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  trigger: string;
};

type TooltipExampleProps = Partial<TooltipStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

export function TooltipExample({
  align = 'center',
  content = 'Rack temperature: 24°C',
  open = false,
  side = 'top',
  trigger = 'Hover for details',
  onOpenChange,
}: TooltipExampleProps) {
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <Tooltip.Provider>
      <Tooltip.Root {...stateProps}>
        <Tooltip.Trigger>{trigger}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner align={align} side={side}>
            <Tooltip.Popup>
              {content}
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const meta = {
  title: 'Components/Tooltip',
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    content: 'Rack temperature: 24°C',
    open: false,
    side: 'top',
    trigger: 'Hover for details',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    content: { control: 'text' },
    open: { control: 'boolean' },
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
