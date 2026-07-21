import { TRCallout, type TRCalloutVariant } from '@tinyrack/ui/components/callout';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = {
  children?: string;
  title?: string;
  variant: TRCalloutVariant;
};
export function CalloutPreview({
  children = 'Keep credentials out of source control.',
  title = '',
  variant,
}: Args) {
  return (
    <TRCallout title={title || undefined} variant={variant}>
      {children}
    </TRCallout>
  );
}
const meta = {
  args: {
    children: 'Keep credentials out of source control.',
    title: '',
    variant: 'note',
  },
  argTypes: {
    children: { control: 'text' },
    title: { control: 'text' },
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
