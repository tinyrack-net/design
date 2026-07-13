import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src/components/button/react.js';
import {
  type PopoverPlacement,
  popoverPlacements,
} from '../../src/components/popover/contract.js';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../src/components/tooltip/react.js';

function TooltipStory({ placement }: { placement: PopoverPlacement }) {
  return (
    <Tooltip openDelay={0} placement={placement}>
      <TooltipTrigger>
        <Button>Rack status</Button>
      </TooltipTrigger>
      <TooltipContent>All health checks passed</TooltipContent>
    </Tooltip>
  );
}

const meta = {
  title: 'Components/Tooltip',
  component: TooltipStory,
  args: { placement: 'top' },
  argTypes: { placement: { control: 'select', options: popoverPlacements } },
} satisfies Meta<typeof TooltipStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
