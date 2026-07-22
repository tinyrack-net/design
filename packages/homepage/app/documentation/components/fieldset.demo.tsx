import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { useId } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  emailAlerts: boolean;
  legend: string;
};

type FieldsetPreviewProps = Omit<StoryArgs, 'emailAlerts'> & {
  defaultEmailAlerts?: boolean;
  emailAlerts?: boolean;
  onEmailAlertsChange?: (checked: boolean) => void;
};

export function FieldsetPreview({
  defaultEmailAlerts,
  disabled,
  emailAlerts,
  legend,
  onEmailAlertsChange,
}: FieldsetPreviewProps) {
  const emailId = useId();
  const incidentId = useId();

  return (
    <TRFieldset.Root className="w-full max-w-80 min-w-0" disabled={disabled}>
      <TRFieldset.Legend>{legend}</TRFieldset.Legend>
      <label className="flex items-center gap-2" htmlFor={emailId}>
        <TRCheckbox.Root
          checked={emailAlerts}
          defaultChecked={emailAlerts === undefined ? defaultEmailAlerts : undefined}
          id={emailId}
          onCheckedChange={(checked) => onEmailAlertsChange?.(checked)}
        >
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        Email alerts
      </label>
      <label className="flex items-center gap-2" htmlFor={incidentId}>
        <TRCheckbox.Root defaultChecked id={incidentId}>
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        Incident summaries
      </label>
    </TRFieldset.Root>
  );
}

export function FieldsetStateComparison() {
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <FieldsetPreview defaultEmailAlerts disabled={false} legend="Editable settings" />
      <FieldsetPreview defaultEmailAlerts disabled legend="Managed settings" />
    </div>
  );
}

export function FieldsetCompositionExample() {
  const enabledId = useId();
  const emailId = useId();
  const smsId = useId();

  return (
    <TRFieldset.Root className="w-full max-w-md min-w-0">
      <TRFieldset.Legend>Incident notifications</TRFieldset.Legend>
      <label className="flex items-center gap-2" htmlFor={enabledId}>
        <TRCheckbox.Root defaultChecked id={enabledId}>
          <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
        Enable incident notifications
      </label>
      <TRFieldset.Root>
        <TRFieldset.Legend>Delivery channels</TRFieldset.Legend>
        <label className="flex items-center gap-2" htmlFor={emailId}>
          <TRCheckbox.Root defaultChecked id={emailId}>
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          Email
        </label>
        <label className="flex items-center gap-2" htmlFor={smsId}>
          <TRCheckbox.Root id={smsId}>
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          SMS
        </label>
      </TRFieldset.Root>
    </TRFieldset.Root>
  );
}

const meta = {
  title: 'Components/Fieldset',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    emailAlerts: true,
    legend: 'Notifications',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    legend: { control: 'text' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <FieldsetPreview
        {...args}
        onEmailAlertsChange={(emailAlerts) => updateArgs({ emailAlerts })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
