import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  align: 'start' | 'center' | 'end';
  description: string;
  label: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  title: string;
};

export function PreviewCardPreview({
  align,
  description,
  label,
  side,
  title,
}: StoryArgs) {
  const [open, setOpen] = useState(false);

  return (
    <TRPreviewCard.Root onOpenChange={setOpen} open={open}>
      <TRPreviewCard.Trigger href="#rack-alpha">{label}</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner align={align} side={side}>
          <TRPreviewCard.Popup>
            <TRPreviewCard.Arrow />
            <strong>{title}</strong>
            <p>{description}</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>
  );
}

const meta = {
  title: 'Components/Preview Card',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    description: 'Healthy · 12 services',
    label: 'Rack Alpha',
    side: 'bottom',
    title: 'Rack Alpha',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    description: { control: 'text' },
    label: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    title: { control: 'text' },
  },
  render: (args) => <PreviewCardPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
