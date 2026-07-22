import { TRAlert } from '@tinyrack/ui/components/alert';
import { TRButton } from '@tinyrack/ui/components/button';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AlertRole = 'none' | 'status' | 'alert';
type AlertStoryArgs = {
  description: string;
  role: AlertRole;
  showActions: boolean;
  title: string;
  variant: AlertVariant;
};

const meta = {
  title: 'Components/Alert',
  parameters: { layout: 'centered' },
  args: {
    description: 'The rollout will start shortly.',
    role: 'status',
    showActions: true,
    title: 'Deployment queued',
    variant: 'info',
  },
  argTypes: {
    description: { control: 'text' },
    role: { control: 'select', options: ['none', 'status', 'alert'] },
    showActions: { control: 'boolean' },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ description, role, showActions, title, variant }) => (
    <TRAlert.Root
      className="max-w-md"
      role={role === 'none' ? undefined : role}
      variant={variant}
    >
      <TRAlert.Title render={<h3>{title}</h3>} />
      <TRAlert.Description>{description}</TRAlert.Description>
      {showActions ? (
        <TRAlert.Actions>
          <TRButton appearance="outline" intent={variant} type="button">
            View details
          </TRButton>
        </TRAlert.Actions>
      ) : null}
    </TRAlert.Root>
  ),
} satisfies Meta<AlertStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
