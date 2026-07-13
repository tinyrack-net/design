import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src/components/button/react.js';
import {
  type PopoverMode,
  type PopoverPlacement,
  popoverModes,
  popoverPlacements,
} from '../../src/components/popover/contract.js';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../../src/components/popover/react.js';

type PopoverStoryProps = { mode: PopoverMode; placement: PopoverPlacement };

function PopoverStory({ mode, placement }: PopoverStoryProps) {
  return (
    <Popover mode={mode} placement={placement}>
      <PopoverTrigger asChild>
        <Button>Open rack actions</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Restart or inspect this rack.</p>
        <PopoverClose asChild>
          <Button appearance="ghost">Close</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

const meta = {
  title: 'Components/Popover',
  component: PopoverStory,
  args: { mode: 'manual', placement: 'bottom-start' },
  argTypes: {
    mode: { control: 'select', options: popoverModes },
    placement: { control: 'select', options: popoverPlacements },
  },
} satisfies Meta<typeof PopoverStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
