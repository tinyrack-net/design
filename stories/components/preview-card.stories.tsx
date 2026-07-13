import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { PreviewCard } from '../../src/components/preview-card/index.js';

type StoryArgs = {
  label: string;
  open: boolean;
};

type PreviewCardPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
};

export function PreviewCardPreview({
  label,
  open,
  onOpenChange,
}: PreviewCardPreviewProps) {
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <PreviewCard.Root {...stateProps}>
      <PreviewCard.Trigger href="#rack-alpha">{label}</PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner>
          <PreviewCard.Popup>
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

const meta = {
  title: 'Components/Preview Card',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Rack Alpha',
    open: false,
  },
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
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
