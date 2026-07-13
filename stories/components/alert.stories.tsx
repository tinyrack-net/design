import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../../src/components/alert/index.js';
import { Button } from '../../src/components/button/index.js';

type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AlertStoryArgs = {
  action: boolean;
  description: string;
  role: 'none' | 'status' | 'alert';
  title: string;
  variant: AlertVariant;
};

const meta = {
  title: 'Components/Alert',
  parameters: { layout: 'centered' },
  args: {
    action: true,
    description: 'The rollout will start shortly.',
    role: 'status',
    title: 'Deployment queued',
    variant: 'info',
  },
  argTypes: {
    action: { control: 'boolean' },
    description: { control: 'text' },
    role: { control: 'select', options: ['none', 'status', 'alert'] },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ action, description, role, title, variant }) => (
    <Alert.Root
      className="max-w-md"
      role={role === 'none' ? undefined : role}
      variant={variant}
    >
      <Alert.Title>{title}</Alert.Title>
      <Alert.Description>{description}</Alert.Description>
      {action ? (
        <Alert.Actions>
          <Button appearance="outline" size="sm">
            View details
          </Button>
        </Alert.Actions>
      ) : null}
    </Alert.Root>
  ),
} satisfies Meta<AlertStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
