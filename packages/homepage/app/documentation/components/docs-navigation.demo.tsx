import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const getItems = (locale: 'en' | 'ko' | 'ja'): readonly TRDocsNavigationItem[] => {
  const copy = {
    en: ['Install', 'Configure', 'Command line', 'Configuration', 'Guides'],
    ko: ['설치', '구성', '명령줄', '설정', '가이드'],
    ja: ['インストール', '設定', 'コマンドライン', '構成', 'ガイド'],
  }[locale];
  return [
    {
      children: [
        { label: copy[0] ?? '', path: '/install', type: 'page' },
        { label: copy[1] ?? '', path: '/configure', type: 'page' },
        {
          children: [
            { label: copy[2] ?? '', path: '/api/cli', type: 'page' },
            { label: copy[3] ?? '', path: '/api/configuration', type: 'page' },
          ],
          label: 'API',
          type: 'group',
        },
      ],
      label: copy[4] ?? '',
      type: 'group',
    },
    {
      external: true,
      label: 'GitHub',
      path: 'https://github.com/tinyrack-net',
      type: 'link',
    },
  ];
};

export function DocsNavigationPreview() {
  const locale = useDemoLocale();
  const items = getItems(locale);
  const label = { en: 'Documentation', ko: '문서 탐색', ja: 'ドキュメント' }[locale];
  return (
    <div className="w-64 max-w-full" data-docs-example-item="">
      <TRDocsNavigation
        currentPath="/install"
        defaultGroupsOpen
        items={items}
        label={label}
      />
    </div>
  );
}

export function DocsNavigationPendingPreview() {
  const locale = useDemoLocale();
  const items = getItems(locale);
  const label = { en: 'Documentation', ko: '문서 탐색', ja: 'ドキュメント' }[locale];
  return (
    <div className="w-64 max-w-full" data-docs-example-item="">
      <TRDocsNavigation
        currentPath="/install"
        items={items}
        label={label}
        pendingPath="/api/cli"
      />
    </div>
  );
}

export const docsNavigationBasicSource = `import '@tinyrack/ui/components/docs-navigation.css';
import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';

const navigation: readonly TRDocsNavigationItem[] = [
  {
    type: 'group',
    label: 'Guides',
    children: [
      { type: 'page', label: 'Install', path: '/install' },
      { type: 'page', label: 'Configure', path: '/configure' },
    ],
  },
  {
    type: 'link',
    label: 'GitHub',
    path: 'https://github.com/tinyrack-net',
    external: true,
  },
];

export function DocumentationNavigation() {
  return (
    <TRDocsNavigation currentPath="/install" defaultGroupsOpen items={navigation} />
  );
}`;

export const docsNavigationRouterSource = `import '@tinyrack/ui/components/docs-navigation.css';
import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import { NavLink, useLocation, useNavigation } from 'react-router';

const navigation: readonly TRDocsNavigationItem[] = [
  {
    type: 'group',
    label: 'Guides',
    children: [
      { type: 'page', label: 'Install', path: '/install' },
      { type: 'page', label: 'Configure', path: '/configure' },
    ],
  },
];

export function RouterDocumentationNavigation() {
  const location = useLocation();
  const navigationState = useNavigation();

  return (
    <TRDocsNavigation
      currentPath={location.pathname}
      items={navigation}
      pendingPath={navigationState.location?.pathname}
      renderLink={(item) => <NavLink to={item.path} />}
    />
  );
}`;

type Args = Record<string, never>;
const meta = {
  args: {},
  argTypes: {},
  parameters: { layout: 'centered' },
  render: DocsNavigationPreview,
  title: 'Components/DocsNavigation',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
