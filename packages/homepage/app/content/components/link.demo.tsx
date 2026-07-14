import {
  Link,
  type LinkUnderline,
  type LinkVariant,
} from '@tinyrack/ui/components/link';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type LinkStoryArgs = {
  children: string;
  destination: 'download' | 'external' | 'internal';
  underline: LinkUnderline;
  variant: LinkVariant;
};

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: { layout: 'centered' },
  args: {
    children: 'Open Tinyrack',
    destination: 'external',
    underline: 'always',
    variant: 'primary',
  },
  argTypes: {
    children: { control: 'text' },
    destination: {
      control: 'select',
      options: ['internal', 'external', 'download'],
    },
    underline: { control: 'select', options: ['always', 'hover', 'none'] },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'danger'],
    },
  },
  render: ({ children, destination, ...props }) => (
    <Link
      {...props}
      download={destination === 'download' ? 'rack-inventory.csv' : undefined}
      href={
        destination === 'external'
          ? 'https://tinyrack.net'
          : destination === 'download'
            ? '/rack-inventory.csv'
            : '#rack-inventory'
      }
      rel={destination === 'external' ? 'noreferrer' : undefined}
      target={destination === 'external' ? '_blank' : undefined}
    >
      {children}
      {destination === 'external' ? ' (opens in new tab)' : null}
    </Link>
  ),
} satisfies Meta<LinkStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
