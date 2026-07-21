import {
  TRLink,
  type TRLinkUnderline,
  type TRLinkVariant,
} from '@tinyrack/ui/components/link';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type LinkStoryArgs = {
  children: string;
  disabled: boolean;
  underline: TRLinkUnderline;
  variant: TRLinkVariant;
};

const meta = {
  title: 'Components/Link',
  component: TRLink,
  parameters: { layout: 'centered' },
  args: {
    children: 'Open Tinyrack',
    disabled: false,
    underline: 'always',
    variant: 'default',
  },
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    underline: { control: 'select', options: ['always', 'hover', 'none'] },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'danger'],
    },
  },
  render: ({ children, ...props }) => (
    <TRLink {...props} href="#rack-inventory">
      {children}
    </TRLink>
  ),
} satisfies Meta<LinkStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
