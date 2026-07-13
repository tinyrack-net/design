import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Collapsible } from '../../src/components/collapsible/index.js';

type CollapsibleStoryArgs = { disabled: boolean; open: boolean; trigger: string };

type CollapsiblePreviewProps = CollapsibleStoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function CollapsiblePreview({
  disabled,
  onOpenChange,
  open,
  trigger,
}: CollapsiblePreviewProps) {
  return (
    <div className="grid w-96 max-w-full gap-3">
      <Collapsible.Root
        className="w-full"
        disabled={disabled}
        onOpenChange={onOpenChange}
        open={open}
      >
        <Collapsible.Trigger>{trigger}</Collapsible.Trigger>
        <Collapsible.Panel>Retry and timeout controls.</Collapsible.Panel>
      </Collapsible.Root>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Details: {open ? 'shown' : 'hidden'}
      </output>
    </div>
  );
}

export function CollapsibleInteractiveExample() {
  const [open, setOpen] = useState(false);

  return (
    <CollapsiblePreview
      disabled={false}
      onOpenChange={setOpen}
      open={open}
      trigger="Advanced settings"
    />
  );
}

const meta = {
  title: 'Components/Collapsible',
  excludeStories: /.*(?:Preview|Example)$/,
  parameters: { layout: 'centered' },
  args: { disabled: false, open: false, trigger: 'Advanced settings' },
  argTypes: {
    disabled: { control: 'boolean' },
    open: { control: 'boolean' },
    trigger: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CollapsibleStoryArgs>();

    return (
      <CollapsiblePreview {...args} onOpenChange={(open) => updateArgs({ open })} />
    );
  },
} satisfies Meta<CollapsibleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
