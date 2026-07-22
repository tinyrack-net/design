import { TRTable, type TRTableDensity } from '@tinyrack/ui/components/table';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const tableCopy = {
  en: {
    artifact: 'Artifact',
    empty: 'No deployments are queued.',
    emptyCaption: 'Queued deployments',
    longCaption: 'Long deployment records',
    owner: 'Owner',
    ownerValue: 'Platform reliability',
    scroll: 'Scroll horizontally inside the named region to inspect every column.',
    service: 'Service',
  },
  ja: {
    artifact: '成果物',
    empty: '待機中のデプロイはありません。',
    emptyCaption: '待機中のデプロイ',
    longCaption: '長いデプロイ記録',
    owner: '担当',
    ownerValue: 'プラットフォーム信頼性',
    scroll: '名前付き領域内を横にスクロールすると、すべての列を確認できます。',
    service: 'サービス',
  },
  ko: {
    artifact: '아티팩트',
    empty: '대기 중인 배포가 없어요.',
    emptyCaption: '대기 중인 배포',
    longCaption: '긴 배포 기록',
    owner: '담당',
    ownerValue: '플랫폼 안정성',
    scroll: '이름이 있는 영역 안에서 가로로 스크롤해 모든 열을 확인하세요.',
    service: '서비스',
  },
} as const;

type TableStoryArgs = { caption: string; density: TRTableDensity; striped: boolean };

const rackRows = [
  ['Rack A', 'Seoul · Zone 1', 12, '42%', 'Healthy'],
  ['Rack B', 'Seoul · Zone 2', 10, '67%', 'Healthy'],
  ['Rack C', 'Busan · Zone 1', 8, '81%', 'Degraded'],
  ['Rack D', 'Daejeon · Zone 1', 6, '28%', 'Healthy'],
  ['Rack E', 'Seoul · Zone 3', 12, '—', 'Maintenance'],
] as const;

export function TableOverflowState() {
  const copy = tableCopy[useDemoLocale()];
  return (
    <div className="grid min-w-0 gap-2" data-docs-example-item="">
      <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">{copy.scroll}</p>
      <TRTable.Root
        style={{ minWidth: '48rem' }}
        containerProps={{ 'aria-label': copy.longCaption, tabIndex: 0 }}
      >
        <TRTable.Caption>{copy.longCaption}</TRTable.Caption>
        <TRTable.Header>
          <TRTable.Row>
            <TRTable.Head scope="col">{copy.service}</TRTable.Head>
            <TRTable.Head scope="col">{copy.artifact}</TRTable.Head>
            <TRTable.Head scope="col">{copy.owner}</TRTable.Head>
          </TRTable.Row>
        </TRTable.Header>
        <TRTable.Body>
          <TRTable.Row>
            <TRTable.Head scope="row">Gateway</TRTable.Head>
            <TRTable.Cell>
              registry.example.internal/platform/gateway:2026.07.14-release-candidate
            </TRTable.Cell>
            <TRTable.Cell>{copy.ownerValue}</TRTable.Cell>
          </TRTable.Row>
        </TRTable.Body>
      </TRTable.Root>
    </div>
  );
}

export function TableEmptyState() {
  const copy = tableCopy[useDemoLocale()];
  return (
    <TRTable.Root data-docs-example-item="">
      <TRTable.Caption>{copy.emptyCaption}</TRTable.Caption>
      <TRTable.Header>
        <TRTable.Row>
          <TRTable.Head scope="col">Service</TRTable.Head>
          <TRTable.Head scope="col">Status</TRTable.Head>
        </TRTable.Row>
      </TRTable.Header>
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell colSpan={2}>{copy.empty}</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>
  );
}

export const tableEmptySource = `import '@tinyrack/ui/components/table.css';
import { TRTable } from '@tinyrack/ui/components/table';

<TRTable.Root>
  <TRTable.Caption>Queued deployments</TRTable.Caption>
  <TRTable.Body>
    <TRTable.Row>
      <TRTable.Cell colSpan={2}>No deployments are queued.</TRTable.Cell>
    </TRTable.Row>
  </TRTable.Body>
</TRTable.Root>`;

const meta = {
  title: 'Components/Table',
  parameters: { layout: 'centered' },
  args: { caption: 'Rack status', density: 'comfortable', striped: true },
  localizedArgs: {
    ja: { caption: 'ラックの状態' },
    ko: { caption: '랙 상태' },
  },
  argTypes: {
    caption: { control: 'text' },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
    striped: { control: 'boolean' },
  },
  render: ({ caption, ...rootProps }) => (
    <TRTable.Root
      data-docs-example-item=""
      style={{ minWidth: '48rem' }}
      containerProps={{
        'aria-label': `${caption} scroll region`,
        tabIndex: 0,
      }}
      {...rootProps}
    >
      <TRTable.Caption>{caption}</TRTable.Caption>
      <TRTable.Header>
        <TRTable.Row>
          <TRTable.Head scope="col">Rack</TRTable.Head>
          <TRTable.Head scope="col">Location</TRTable.Head>
          <TRTable.Head align="right" scope="col">
            Nodes
          </TRTable.Head>
          <TRTable.Head align="right" scope="col">
            Load
          </TRTable.Head>
          <TRTable.Head scope="col">Status</TRTable.Head>
        </TRTable.Row>
      </TRTable.Header>
      <TRTable.Body>
        {rackRows.map(([rack, location, nodes, load, status]) => (
          <TRTable.Row key={rack}>
            <TRTable.Head scope="row">{rack}</TRTable.Head>
            <TRTable.Cell>{location}</TRTable.Cell>
            <TRTable.Cell align="right">{nodes}</TRTable.Cell>
            <TRTable.Cell align="right">{load}</TRTable.Cell>
            <TRTable.Cell>{status}</TRTable.Cell>
          </TRTable.Row>
        ))}
      </TRTable.Body>
    </TRTable.Root>
  ),
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
