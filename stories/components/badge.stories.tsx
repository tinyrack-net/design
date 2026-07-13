import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheck } from 'lucide-react';
import {
  Badge,
  type BadgeSize,
  type BadgeVariant,
} from '../../src/components/badge/index.js';

type BadgeStoryArgs = {
  children: string;
  icon: boolean;
  size: BadgeSize;
  variant: BadgeVariant;
};

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: { children: 'Healthy', icon: true, size: 'md', variant: 'success' },
  argTypes: {
    children: { control: 'text' },
    icon: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ children, icon, ...args }) => (
    <div className="max-w-64">
      <Badge {...args}>
        {icon ? <CircleCheck aria-hidden size="1em" /> : null}
        {children}
      </Badge>
    </div>
  ),
} satisfies Meta<BadgeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
