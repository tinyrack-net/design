import type { Meta, StoryObj } from '@storybook/react-vite';
import { tableDensities } from '../../src/components/table/contract.js';
import {
  Table,
  TableContainer,
  type TableProps,
} from '../../src/components/table/react.js';

type ComponentStoryProps = Pick<TableProps, 'density' | 'striped'>;

function TableStory(controlValues: ComponentStoryProps) {
  return (
    <TableContainer>
      <Table {...controlValues}>
        <thead>
          <tr>
            <th scope="col">Node</th>
            <th scope="col">Region</th>
            <th scope="col">Load</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>rack-a-01</td>
            <td>Seoul</td>
            <td>41%</td>
            <td>Healthy</td>
          </tr>
          <tr>
            <td>rack-b-03</td>
            <td>Tokyo</td>
            <td>58%</td>
            <td>Review</td>
          </tr>
          <tr>
            <td>rack-c-02</td>
            <td>Singapore</td>
            <td>29%</td>
            <td>Healthy</td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
  );
}

TableStory.displayName = 'TableStory';

const meta = {
  title: 'Components/Table',
  component: TableStory,
  args: {
    density: 'normal',
    striped: false,
  },
  argTypes: {
    density: {
      control: 'select',
      options: tableDensities,
      description: 'Cell spacing density.',
    },
    striped: {
      control: 'boolean',
      description: 'Adds zebra striping to body rows.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'CSS-first Tinyrack Table rendered through native table markup.',
      },
    },
  },
} satisfies Meta<typeof TableStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
