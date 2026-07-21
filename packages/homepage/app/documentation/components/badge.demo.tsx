import {
  TRBadge,
  type TRBadgeUiSize,
  type TRBadgeVariant,
} from '@tinyrack/ui/components/badge';
import { CircleCheck } from 'lucide-react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type BadgeStoryArgs = {
  children: string;
  icon: boolean;
  uiSize: TRBadgeUiSize;
  variant: TRBadgeVariant;
};

const meta = {
  title: 'Components/Badge',
  component: TRBadge,
  parameters: { layout: 'centered' },
  args: { children: 'Healthy', icon: true, uiSize: 'md', variant: 'success' },
  argTypes: {
    children: { control: 'text' },
    icon: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ children, icon, ...args }) => (
    <div className="max-w-64">
      <TRBadge {...args}>
        {icon ? <CircleCheck aria-hidden size="1em" /> : null}
        {children}
      </TRBadge>
    </div>
  ),
} satisfies Meta<BadgeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
