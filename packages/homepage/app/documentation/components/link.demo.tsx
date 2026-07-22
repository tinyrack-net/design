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

export const linkBasicSource = `import '@tinyrack/ui/components/link.css';
import { TRLink } from '@tinyrack/ui/components/link';
import { Link as RouterLink } from 'react-router';

export function RackLinks() {
  return (
    <nav aria-label="Rack sections">
      <TRLink aria-current="page" href="/racks">Racks</TRLink>
      <TRLink render={<RouterLink to="/racks/new" />}>Create rack</TRLink>
    </nav>
  );
}`;

export const linkMatrixSource = `import '@tinyrack/ui/components/link.css';
import { TRLink } from '@tinyrack/ui/components/link';

const underlines = ['hover', 'always', 'none'] as const;
const variants = ['default', 'muted', 'danger'] as const;

export function LinkMatrix() {
  return underlines.map((underline) => (
    <div key={underline}>
      {variants.map((variant) => (
        <TRLink href="#destination" key={variant} underline={underline} variant={variant}>
          {variant}
        </TRLink>
      ))}
    </div>
  ));
}`;

export const linkDestinationsSource = `import '@tinyrack/ui/components/link.css';
import { TRLink } from '@tinyrack/ui/components/link';

export function DestinationLinks() {
  return (
    <div>
      <TRLink href="/racks">Rack inventory</TRLink>
      <TRLink href="https://tinyrack.net" rel="noreferrer" target="_blank">
        Tinyrack website (opens in new tab)
      </TRLink>
      <TRLink disabled href="/billing">Billing (disabled)</TRLink>
      <TRLink download="rack-inventory.csv" href="/rack-inventory.csv">
        Download inventory (CSV)
      </TRLink>
    </div>
  );
}`;

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
