import { TRLink } from '@tinyrack/ui/components/link';
import { TRTreeNav, type TRTreeNavItem } from '@tinyrack/ui/components/tree-nav';
import { useDemoLocale } from '../shared/demo-locale.js';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Leaf = { href: string; label: string };

const getItems = (
  locale: 'en' | 'ko' | 'ja',
): readonly TRTreeNavItem<Leaf>[] => {
  const copy = {
    en: ['Getting started', 'Install', 'Advanced', 'Plugins', 'Theming'],
    ko: ['시작하기', '설치', '고급', '플러그인', '테마'],
    ja: ['はじめに', 'インストール', '高度な設定', 'プラグイン', 'テーマ'],
  }[locale];
  return [
    {
      activeBranch: true,
      children: [
        { data: { href: '#install', label: copy[1] ?? '' }, key: 'install', type: 'leaf' },
        {
          activeBranch: true,
          children: [
            { data: { href: '#plugins', label: copy[3] ?? '' }, key: 'plugins', type: 'leaf' },
            { data: { href: '#theming', label: copy[4] ?? '' }, key: 'theming', type: 'leaf' },
          ],
          forceOpen: true,
          key: 'advanced',
          label: copy[2] ?? '',
          type: 'group',
        },
      ],
      forceOpen: true,
      key: 'getting-started',
      label: copy[0] ?? '',
      type: 'group',
    },
  ];
};

export function TreeNavPreview() {
  const locale = useDemoLocale();
  const label = { en: 'Documentation', ko: '문서 탐색', ja: 'ドキュメント' }[locale];
  return (
    <div className="w-64 max-w-full" data-docs-example-item="">
      <TRTreeNav
        items={getItems(locale)}
        label={label}
        renderLeaf={({ data }) => (
          <TRLink
            className="tr-docs-navigation-link"
            data-active={data.href === '#theming' || undefined}
            href={data.href}
            underline="none"
          >
            <span>{data.label}</span>
          </TRLink>
        )}
      />
    </div>
  );
}

export const treeNavBasicSource = `import '@tinyrack/ui/components/tree-nav.css';
import { TRLink } from '@tinyrack/ui/components/link';
import { TRTreeNav, type TRTreeNavItem } from '@tinyrack/ui/components/tree-nav';

type Leaf = { href: string; label: string };

const items: readonly TRTreeNavItem<Leaf>[] = [
  {
    type: 'group',
    key: 'guides',
    label: 'Guides',
    forceOpen: true,
    children: [
      { type: 'leaf', key: 'install', data: { label: 'Install', href: '/install' } },
      {
        type: 'group',
        key: 'advanced',
        label: 'Advanced',
        children: [
          { type: 'leaf', key: 'plugins', data: { label: 'Plugins', href: '/plugins' } },
        ],
      },
    ],
  },
];

export function DocsTree() {
  return (
    <TRTreeNav
      items={items}
      renderLeaf={({ data }) => (
        <TRLink href={data.href} underline="none">
          <span>{data.label}</span>
        </TRLink>
      )}
    />
  );
}`;

type Args = Record<string, never>;
const meta = {
  args: {},
  argTypes: {},
  parameters: { layout: 'centered' },
  render: TreeNavPreview,
  title: 'Components/TreeNav',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
