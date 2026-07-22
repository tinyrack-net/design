import {
  TRDocsNavigation,
  type TRDocsNavigationItem,
} from '@tinyrack/ui/components/docs-navigation';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

const items: readonly TRDocsNavigationItem[] = [
  {
    children: [
      { label: 'Install', path: '/install', type: 'page' },
      { label: 'Configure', path: '/configure', type: 'page' },
      {
        children: [
          { label: 'Command line', path: '/api/cli', type: 'page' },
          { label: 'Configuration', path: '/api/configuration', type: 'page' },
        ],
        label: 'API',
        type: 'group',
      },
    ],
    label: 'Guides',
    type: 'group',
  },
  {
    external: true,
    label: 'GitHub',
    path: 'https://github.com/tinyrack-net',
    type: 'link',
  },
];

export function DocsNavigationPreview() {
  return (
    <div className="w-64 max-w-full">
      <TRDocsNavigation currentPath="/install" defaultGroupsOpen items={items} />
    </div>
  );
}

export function DocsNavigationPendingPreview() {
  return (
    <div className="w-64 max-w-full">
      <TRDocsNavigation currentPath="/install" items={items} pendingPath="/api/cli" />
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
