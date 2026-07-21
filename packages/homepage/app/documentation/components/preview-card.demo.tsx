import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  align: 'start' | 'center' | 'end';
  closeDelay: number;
  delay: number;
  label: string;
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
};

type PreviewCardPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function PreviewCardPreview({
  align,
  closeDelay,
  delay,
  label,
  open,
  onOpenChange,
  side,
}: PreviewCardPreviewProps) {
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <TRPreviewCard.Root {...stateProps}>
      <TRPreviewCard.Trigger closeDelay={closeDelay} delay={delay} href="#rack-alpha">
        {label}
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner align={align} side={side}>
          <TRPreviewCard.Popup>
            <TRPreviewCard.Arrow />
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
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
    closeDelay: 300,
    delay: 600,
    label: 'Rack Alpha',
    open: false,
    side: 'bottom',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    closeDelay: { control: { type: 'range', min: 0, max: 1000, step: 50 } },
    delay: { control: { type: 'range', min: 0, max: 1500, step: 50 } },
    label: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <PreviewCardPreview {...args} onOpenChange={(open) => updateArgs({ open })} />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
