import { TRCollapsible } from '@tinyrack/ui/components/collapsible';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type CollapsibleStoryArgs = {
  disabled: boolean;
  lifecycle: 'unmount' | 'keepMounted' | 'hiddenUntilFound';
  open: boolean;
  trigger: string;
};

type CollapsiblePreviewProps = CollapsibleStoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function CollapsiblePreview({
  disabled,
  lifecycle,
  onOpenChange,
  open,
  trigger,
}: CollapsiblePreviewProps) {
  return (
    <div className="grid w-full min-w-0 max-w-96 gap-3">
      <TRCollapsible.Root
        className="w-full"
        disabled={disabled}
        onOpenChange={onOpenChange}
        open={open}
      >
        <TRCollapsible.Trigger>{trigger}</TRCollapsible.Trigger>
        <TRCollapsible.Panel
          hiddenUntilFound={lifecycle === 'hiddenUntilFound'}
          keepMounted={lifecycle === 'keepMounted'}
        >
          Retry and timeout controls.
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Details: {open ? 'shown' : 'hidden'}
        {' · '}DOM: {open || lifecycle !== 'unmount' ? 'mounted' : 'unmounted'}
      </output>
    </div>
  );
}

export function CollapsibleInteractiveExample() {
  const [open, setOpen] = useState(false);

  return (
    <CollapsiblePreview
      disabled={false}
      lifecycle="hiddenUntilFound"
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
  args: {
    disabled: false,
    lifecycle: 'unmount',
    open: false,
    trigger: 'Advanced settings',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    lifecycle: {
      control: 'select',
      options: ['unmount', 'keepMounted', 'hiddenUntilFound'],
    },
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

export const playground = definePlayground(meta);
