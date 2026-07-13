import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableDensity } from '../../src/components/table/index.js';

type TableStoryArgs = { caption: string; density: TableDensity; striped: boolean };

const rackRows = [
  ['Rack A', 'Seoul · Zone 1', 12, '42%', 'Healthy'],
  ['Rack B', 'Seoul · Zone 2', 10, '67%', 'Healthy'],
  ['Rack C', 'Busan · Zone 1', 8, '81%', 'Degraded'],
  ['Rack D', 'Daejeon · Zone 1', 6, '28%', 'Healthy'],
  ['Rack E', 'Seoul · Zone 3', 12, '—', 'Maintenance'],
] as const;

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
    <Table.Root
      className="min-w-3xl"
      containerProps={{
        'aria-label': `${caption} scroll region`,
        tabIndex: 0,
      }}
      {...rootProps}
    >
      <Table.Caption>{caption}</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Rack</Table.Head>
          <Table.Head>Location</Table.Head>
          <Table.Head align="right">Nodes</Table.Head>
          <Table.Head align="right">Load</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rackRows.map(([rack, location, nodes, load, status]) => (
          <Table.Row key={rack}>
            <Table.Cell>{rack}</Table.Cell>
            <Table.Cell>{location}</Table.Cell>
            <Table.Cell align="right">{nodes}</Table.Cell>
            <Table.Cell align="right">{load}</Table.Cell>
            <Table.Cell>{status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
