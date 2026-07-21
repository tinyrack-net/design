import { TRAlert } from '@tinyrack/ui/components/alert';
import { TRButton } from '@tinyrack/ui/components/button';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AlertStoryArgs = {
  description: string;
  title: string;
  variant: AlertVariant;
};

const meta = {
  title: 'Components/Alert',
  parameters: { layout: 'centered' },
  args: {
    description: 'The rollout will start shortly.',
    title: 'Deployment queued',
    variant: 'info',
  },
  argTypes: {
    description: { control: 'text' },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ description, title, variant }) => (
    <TRAlert.Root className="max-w-md" role="status" variant={variant}>
      <TRAlert.Title render={<h3>{title}</h3>} />
      <TRAlert.Description>{description}</TRAlert.Description>
      <TRAlert.Actions>
        <TRButton appearance="outline" uiSize="sm">
          View details
        </TRButton>
      </TRAlert.Actions>
    </TRAlert.Root>
  ),
} satisfies Meta<AlertStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
