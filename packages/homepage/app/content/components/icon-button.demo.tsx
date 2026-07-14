import { IconButton } from '@tinyrack/ui/components/icon-button';
import { SettingsIcon } from 'lucide-react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  appearance: 'solid' | 'outline' | 'ghost';
  disabled: boolean;
  label: string;
  size: 'sm' | 'md' | 'lg';
  variant: 'secondary' | 'primary' | 'danger';
};

export function IconButtonPreview({ label, ...args }: StoryArgs) {
  return (
    <IconButton {...args} aria-label={label}>
      <SettingsIcon aria-hidden="true" />
    </IconButton>
  );
}

const meta = {
  title: 'Components/IconButton',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'outline',
    disabled: false,
    label: 'Settings',
    size: 'md',
    variant: 'secondary',
  },
  argTypes: {
    appearance: { options: ['solid', 'outline', 'ghost'], control: 'radio' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    size: { options: ['sm', 'md', 'lg'], control: 'radio' },
    variant: { options: ['secondary', 'primary', 'danger'], control: 'radio' },
  },
  render: (args) => <IconButtonPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
