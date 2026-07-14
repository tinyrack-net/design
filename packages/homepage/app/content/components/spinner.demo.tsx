import {
  Spinner,
  type SpinnerSize,
  type SpinnerVariant,
} from '@tinyrack/ui/components/spinner';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type SpinnerStoryArgs = {
  decorative: boolean;
  label: string;
  size: SpinnerSize;
  variant: SpinnerVariant;
};

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  args: {
    decorative: false,
    label: 'Loading servers',
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    decorative: { control: 'boolean' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['current', 'muted', 'primary', 'danger'],
    },
  },
  render: (args) => <Spinner {...args} />,
} satisfies Meta<SpinnerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
