import { TRCallout, type TRCalloutVariant } from '@tinyrack/ui/components/callout';
import { TRCode } from '@tinyrack/ui/components/code';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = {
  children: string;
  title: string;
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

const variants = ['note', 'tip', 'caution', 'danger'] as const;

export function CalloutVariantMatrix() {
  return (
    <div className="grid w-full gap-4">
      {variants.map((variant) => (
        <TRCallout key={variant} variant={variant}>
          {variant === 'note' && 'Background information that helps explain the task.'}
          {variant === 'tip' && 'An optional technique that can make the task easier.'}
          {variant === 'caution' && 'A condition that may cause an unexpected result.'}
          {variant === 'danger' && 'An action that can cause data loss or an outage.'}
        </TRCallout>
      ))}
    </div>
  );
}

export function CalloutRichContentPreview() {
  return (
    <TRCallout title="Before you deploy" variant="caution">
      <p>Confirm the production environment is selected, then:</p>
      <ul>
        <li>review the pending migrations;</li>
        <li>create a database backup.</li>
      </ul>
      <p>
        Run <TRCode>pnpm deploy</TRCode> only after both checks pass.
      </p>
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
