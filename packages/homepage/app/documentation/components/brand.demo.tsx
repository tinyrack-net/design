import { TRBadge } from '@tinyrack/ui/components/badge';
import { TRBrand } from '@tinyrack/ui/components/brand';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

function BrandMark() {
  return (
    <svg aria-hidden="true" height="24" role="img" viewBox="0 0 24 24" width="24">
      <rect
        fill="var(--tinyrack-primary)"
        height="24"
        rx="6"
        width="24"
      />
    </svg>
  );
}

export function BrandPreview() {
  return (
    <div data-docs-example-item="">
      <TRBrand href="#home" logo={<BrandMark />} title="Tinyrack">
        <TRBadge>v1.0</TRBadge>
      </TRBrand>
    </div>
  );
}

export const brandBasicSource = `import '@tinyrack/ui/components/badge.css';
import '@tinyrack/ui/components/brand.css';
import { TRBadge } from '@tinyrack/ui/components/badge';
import { TRBrand } from '@tinyrack/ui/components/brand';

export function SiteBrand() {
  return (
    <TRBrand
      href="/"
      logo={<img alt="Acme" height={24} src="/logo.svg" width={96} />}
      title="Acme"
    >
      <TRBadge>v1.0</TRBadge>
    </TRBrand>
  );
}`;

type Args = Record<string, never>;
const meta = {
  args: {},
  argTypes: {},
  parameters: { layout: 'centered' },
  render: BrandPreview,
  title: 'Components/Brand',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
