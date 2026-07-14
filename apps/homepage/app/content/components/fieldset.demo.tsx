import { Fieldset } from '@tinyrack/ui/components/fieldset';
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
    <Fieldset.Root className="w-full max-w-80 min-w-0" disabled={disabled}>
      <Fieldset.Legend>{legend}</Fieldset.Legend>
      <label className="flex items-center gap-2" htmlFor={emailId}>
        <input
          checked={emailAlerts}
          defaultChecked={emailAlerts === undefined ? defaultEmailAlerts : undefined}
          id={emailId}
          onChange={(event) => onEmailAlertsChange?.(event.currentTarget.checked)}
          type="checkbox"
        />
        Email alerts
      </label>
      <label className="flex items-center gap-2" htmlFor={incidentId}>
        <input defaultChecked id={incidentId} type="checkbox" />
        Incident summaries
      </label>
    </Fieldset.Root>
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
    emailAlerts: { control: 'boolean' },
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
