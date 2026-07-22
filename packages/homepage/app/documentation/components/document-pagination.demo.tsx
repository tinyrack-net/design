import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';
import { TRLink } from '@tinyrack/ui/components/link';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type Args = { direction: 'both' | 'next' | 'previous' };
const previous = {
  description: 'Add Tinyrack UI and its component styles to your application.',
  label: 'Guide',
  path: '/install',
  title: 'Installation',
};
const next = {
  description: 'Choose the defaults and tokens for your documentation site.',
  label: 'Guide',
  path: '/configure',
  title: 'Configuration',
};

export const documentPaginationBasicSource = `import '@tinyrack/ui/components/document-pagination.css';
import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';

const previous = {
  description: 'Add Tinyrack UI and its component styles to your application.',
  label: 'Guide',
  path: '/install',
  title: 'Installation',
};
const next = {
  description: 'Choose the defaults and tokens for your documentation site.',
  label: 'Guide',
  path: '/configure',
  title: 'Configuration',
};

export function DocumentPaginationExample() {
  return <TRDocumentPagination previous={previous} next={next} />;
}`;

export const documentPaginationStatesSource = `import '@tinyrack/ui/components/document-pagination.css';
import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';

const previous = { path: '/install', title: 'Installation' };
const next = { path: '/configure', title: 'Configuration' };

export function DocumentPaginationStates() {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <TRDocumentPagination previous={previous} />
      <TRDocumentPagination previous={previous} next={next} />
      <TRDocumentPagination next={next} />
    </div>
  );
}`;

export const documentPaginationDisabledSource = `import '@tinyrack/ui/components/document-pagination.css';
import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';

export function DisabledDestination() {
  return (
    <TRDocumentPagination
      next={{ disabled: true, path: '/configure', title: 'Configuration' }}
    />
  );
}`;

export function DocumentPaginationPreview({ direction }: Args) {
  const locale = useDemoLocale();
  const localizedPrevious = { ...previous, description: locale === 'ko' ? '애플리케이션에 Tinyrack UI와 컴포넌트 스타일을 추가해요.' : locale === 'ja' ? 'アプリケーションに Tinyrack UI とコンポーネントスタイルを追加します。' : previous.description, label: locale === 'ko' ? '가이드' : locale === 'ja' ? 'ガイド' : previous.label, title: locale === 'ko' ? '설치' : locale === 'ja' ? 'インストール' : previous.title };
  const localizedNext = { ...next, description: locale === 'ko' ? '문서 사이트의 기본값과 토큰을 선택해요.' : locale === 'ja' ? 'ドキュメントサイトのデフォルトとトークンを選びます。' : next.description, label: locale === 'ko' ? '가이드' : locale === 'ja' ? 'ガイド' : next.label, title: locale === 'ko' ? '설정' : locale === 'ja' ? '設定' : next.title };
  return (
    <TRDocumentPagination
      data-docs-example-item=""
      {...(direction === 'next'
        ? { next: localizedNext }
        : direction === 'previous'
          ? { previous: localizedPrevious }
          : { next: localizedNext, previous: localizedPrevious })}
      renderLink={(destination) => (
        <TRLink href={destination.path} onClick={(event) => event.preventDefault()} />
      )}
    />
  );
}

export function DocumentPaginationStatesPreview() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-3">
      <DocumentPaginationPreview direction="previous" />
      <DocumentPaginationPreview direction="both" />
      <DocumentPaginationPreview direction="next" />
    </div>
  );
}

export function DocumentPaginationDisabledPreview() {
  return <TRDocumentPagination data-docs-example-item="" next={{ ...next, disabled: true }} />;
}
const meta = {
  args: { direction: 'both' },
  argTypes: { direction: { control: 'select', options: ['both', 'previous', 'next'] } },
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  render: DocumentPaginationPreview,
  title: 'Components/DocumentPagination',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
