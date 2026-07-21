import { TRCallout, type TRCalloutVariant } from '@tinyrack/ui/components/callout';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { variant: TRCalloutVariant };
export function CalloutPreview({ variant }: Args) {
  return (
    <TRCallout variant={variant}>Keep credentials out of source control.</TRCallout>
  );
}
const meta = {
  args: { variant: 'note' },
  argTypes: {
    variant: { control: 'select', options: ['note', 'tip', 'caution', 'danger'] },
  },
  parameters: { layout: 'centered' },
  render: CalloutPreview,
  title: 'Components/Callout',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
