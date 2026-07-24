import { TRBreadcrumbs } from '@tinyrack/ui/components/breadcrumbs';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type Args = { separator: string };

const items = [
  { href: '/', label: 'Home' },
  { href: '/components', label: 'Components' },
  { label: 'Breadcrumbs' },
];

export const breadcrumbsBasicSource = `import '@tinyrack/ui/components/breadcrumbs.css';
import { TRBreadcrumbs } from '@tinyrack/ui/components/breadcrumbs';

const items = [
  { href: '/', label: 'Home' },
  { href: '/components', label: 'Components' },
  { label: 'Breadcrumbs' },
];

export function BreadcrumbsExample() {
  return <TRBreadcrumbs items={items} />;
}`;

export const breadcrumbsCustomSeparatorSource = `import '@tinyrack/ui/components/breadcrumbs.css';
import { TRBreadcrumbs } from '@tinyrack/ui/components/breadcrumbs';

const items = [
  { href: '/', label: 'Home' },
  { href: '/components', label: 'Components' },
  { label: 'Breadcrumbs' },
];

export function BreadcrumbsCustomSeparator() {
  return <TRBreadcrumbs items={items} separator="›" />;
}`;

export function BreadcrumbsPreview({ separator }: Args) {
  const locale = useDemoLocale();
  const localizedItems =
    locale === 'ko'
      ? [
          { href: '/', label: '홈' },
          { href: '/components', label: '컴포넌트' },
          { label: '브레드크럼' },
        ]
      : locale === 'ja'
        ? [
            { href: '/', label: 'ホーム' },
            { href: '/components', label: 'コンポーネント' },
            { label: 'パンくずリスト' },
          ]
        : items;

  return (
    <TRBreadcrumbs
      data-docs-example-item=""
      items={localizedItems}
      separator={separator}
    />
  );
}

export function BreadcrumbsCustomSeparatorPreview() {
  return <BreadcrumbsPreview separator="›" />;
}

const meta = {
  args: { separator: '/' },
  argTypes: { separator: { control: 'text' } },
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  render: BreadcrumbsPreview,
  title: 'Components/Breadcrumbs',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
