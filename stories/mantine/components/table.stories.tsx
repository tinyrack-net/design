import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  striped?: boolean;
  highlightOnHover?: boolean;
  withTableBorder?: boolean;
  withColumnBorders?: boolean;
};

function TableStory(controlValues: ComponentStoryProps) {
  return (
    <div className="w-[min(100%,34rem)] min-w-0 overflow-x-auto [&_table]:min-w-[30rem] [&_.mantine-Table-td]:px-3 [&_.mantine-Table-th]:px-3">
      <Mantine.Table
        highlightOnHover={controlValues.highlightOnHover ?? true}
        striped={controlValues.striped ?? true}
        withColumnBorders={controlValues.withColumnBorders ?? false}
        withTableBorder={controlValues.withTableBorder ?? true}
      >
        <Mantine.Table.Thead>
          <Mantine.Table.Tr>
            <Mantine.Table.Th>Node</Mantine.Table.Th>
            <Mantine.Table.Th>Status</Mantine.Table.Th>
            <Mantine.Table.Th>Address</Mantine.Table.Th>
            <Mantine.Table.Th>Load</Mantine.Table.Th>
          </Mantine.Table.Tr>
        </Mantine.Table.Thead>
        <Mantine.Table.Tbody>
          {[
            ['node-01', 'Healthy', '192.168.1.21', '34%'],
            ['nas-01', 'Review', '192.168.1.34', '74%'],
            ['edge-proxy', 'Healthy', '192.168.1.2', '18%'],
          ].map(([node, status, address, load]) => (
            <Mantine.Table.Tr key={node}>
              <Mantine.Table.Td>{node}</Mantine.Table.Td>
              <Mantine.Table.Td>
                <Mantine.Badge
                  color={status === 'Healthy' ? 'green' : 'yellow'}
                  variant="light"
                >
                  {status}
                </Mantine.Badge>
              </Mantine.Table.Td>
              <Mantine.Table.Td>{address}</Mantine.Table.Td>
              <Mantine.Table.Td>{load}</Mantine.Table.Td>
            </Mantine.Table.Tr>
          ))}
        </Mantine.Table.Tbody>
      </Mantine.Table>
    </div>
  );
}

TableStory.displayName = 'TableStory';

const meta = {
  title: 'Mantine/Table',
  component: TableStory,
  tags: ['autodocs'],
  args: {
    striped: true,
    highlightOnHover: true,
    withTableBorder: true,
    withColumnBorders: false,
  },
  argTypes: {
    striped: { control: 'boolean', description: 'Show striped rows.' },
    highlightOnHover: { control: 'boolean', description: 'Highlight rows on hover.' },
    withTableBorder: { control: 'boolean', description: 'Show outer table border.' },
    withColumnBorders: { control: 'boolean', description: 'Show column borders.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '@mantine/core Table themed preview',
      },
    },
  },
} satisfies Meta<typeof TableStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
