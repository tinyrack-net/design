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

type PreviewCardPreviewProps = Partial<StoryArgs> & {
  defaultOpen?: boolean;
};

export function PreviewCardPreview({
  align = 'center',
  defaultOpen = false,
  description = 'Healthy · 12 services',
  label = 'Rack Alpha',
  side = 'bottom',
  title = 'Rack Alpha',
}: PreviewCardPreviewProps) {
  const [open, setOpen] = useState(defaultOpen);

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

const rackBetaPreview = TRPreviewCard.createHandle();

export function PreviewCardHandlePreview() {
  return (
    <>
      <TRPreviewCard.Trigger
        handle={rackBetaPreview}
        href="#rack-beta"
        id="rack-beta-trigger"
      >
        Rack Beta
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Root handle={rackBetaPreview}>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner sideOffset={8}>
            <TRPreviewCard.Popup>
              <strong>Rack Beta</strong>
              <p>Degraded · 8 of 10 services healthy</p>
              <TRPreviewCard.Arrow />
            </TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
    </>
  );
}

export const previewCardBasicSource = `import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';

export function RackPreview() {
  return (
    <TRPreviewCard.Root>
      <TRPreviewCard.Trigger href="#rack-alpha">Rack Alpha</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>
  );
}`;

export const previewCardHandleSource = `import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';

const rackBetaPreview = TRPreviewCard.createHandle();

export function DetachedRackPreview() {
  return (
    <>
      <TRPreviewCard.Trigger handle={rackBetaPreview} href="#rack-beta">
        Rack Beta
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Root handle={rackBetaPreview}>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner sideOffset={8}>
            <TRPreviewCard.Popup>
              <strong>Rack Beta</strong>
              <p>Degraded · 8 of 10 services healthy</p>
              <TRPreviewCard.Arrow />
            </TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
    </>
  );
}`;

export const previewCardPositioningSource = `import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';

export function EdgeRackPreview() {
  return (
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger href="#edge-rack">Edge rack</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner align="end" side="top">
          <TRPreviewCard.Popup>
            <TRPreviewCard.Arrow />
            <strong>Edge rack</strong>
            <p>Collision-aware preview content remains inside the viewport.</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>
  );
}`;

const meta = {
  title: 'Components/Preview Card',
  excludeStories: /.*(Preview|Source)$/,
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
