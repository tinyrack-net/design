import { TRTable, type TRTableDensity } from '@tinyrack/ui/components/table';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type TableStoryArgs = { caption: string; density: TRTableDensity; striped: boolean };

const rackRows = [
  ['Rack A', 'Seoul · Zone 1', 12, '42%', 'Healthy'],
  ['Rack B', 'Seoul · Zone 2', 10, '67%', 'Healthy'],
  ['Rack C', 'Busan · Zone 1', 8, '81%', 'Degraded'],
  ['Rack D', 'Daejeon · Zone 1', 6, '28%', 'Healthy'],
  ['Rack E', 'Seoul · Zone 3', 12, '—', 'Maintenance'],
] as const;

export function TableOverflowAndEmptyStates() {
  return (
    <div className="grid gap-6">
      <div className="grid min-w-0 gap-2">
        <p className="m-0 text-tinyrack-sm text-tinyrack-muted">
          Scroll horizontally inside the named region to inspect every column.
        </p>
        <TRTable.Root
          className="min-w-3xl"
          containerProps={{ 'aria-label': 'Long deployment records', tabIndex: 0 }}
        >
          <TRTable.Caption>Long deployment records</TRTable.Caption>
          <TRTable.Header>
            <TRTable.Row>
              <TRTable.Head scope="col">Service</TRTable.Head>
              <TRTable.Head scope="col">Artifact</TRTable.Head>
              <TRTable.Head scope="col">Owner</TRTable.Head>
            </TRTable.Row>
          </TRTable.Header>
          <TRTable.Body>
            <TRTable.Row>
              <TRTable.Head scope="row">Gateway</TRTable.Head>
              <TRTable.Cell>
                registry.example.internal/platform/gateway:2026.07.14-release-candidate
              </TRTable.Cell>
              <TRTable.Cell>Platform reliability</TRTable.Cell>
            </TRTable.Row>
          </TRTable.Body>
        </TRTable.Root>
      </div>
      <TRTable.Root>
        <TRTable.Caption>Queued deployments</TRTable.Caption>
        <TRTable.Header>
          <TRTable.Row>
            <TRTable.Head scope="col">Service</TRTable.Head>
            <TRTable.Head scope="col">Status</TRTable.Head>
          </TRTable.Row>
        </TRTable.Header>
        <TRTable.Body>
          <TRTable.Row>
            <TRTable.Cell colSpan={2}>No deployments are queued.</TRTable.Cell>
          </TRTable.Row>
        </TRTable.Body>
      </TRTable.Root>
    </div>
  );
}

const meta = {
  title: 'Components/Table',
  parameters: { layout: 'centered' },
  args: { caption: 'Rack status', density: 'comfortable', striped: true },
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
      className="min-w-3xl"
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
