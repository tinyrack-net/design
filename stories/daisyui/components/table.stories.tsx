import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  zebra?: boolean;
  rowHover?: boolean;
  pinRows?: boolean;
};

function TableStory(controlValues: ComponentStoryProps) {
  const size = controlValues.size ?? 'md';
  const zebra = controlValues.zebra ?? true;
  const rowHover = controlValues.rowHover ?? false;
  const pinRows = controlValues.pinRows ?? false;

  return (
    <div className="min-w-0 overflow-x-auto [&_table]:min-w-[34rem]">
      <table
        className={[
          'table',
          `table-${size}`,
          zebra && 'table-zebra',
          pinRows && 'table-pin-rows',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <thead>
          <tr>
            <th>Node</th>
            <th>Status</th>
            <th>Address</th>
            <th>Load</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['node-01', 'Ready', '192.168.1.21', '34%'],
            ['nas-01', 'Rolling', '192.168.1.34', '74%'],
            ['edge-proxy', 'Ready', '192.168.1.2', '18%'],
          ].map(([node, status, address, load]) => (
            <tr className={rowHover ? 'row-hover' : undefined} key={node}>
              <td>{node}</td>
              <td>
                <span
                  className={
                    status === 'Ready'
                      ? 'badge badge-success badge-soft'
                      : 'badge badge-warning badge-soft'
                  }
                >
                  {status}
                </span>
              </td>
              <td>{address}</td>
              <td>{load}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableStory.displayName = 'TableStory';

const meta = {
  title: 'daisyUI/Table',
  component: TableStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    zebra: true,
    rowHover: false,
    pinRows: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
    zebra: {
      control: 'boolean',
      description: 'Applies the table-zebra row treatment.',
    },
    rowHover: { control: 'boolean', description: 'Applies row-hover to table rows.' },
    pinRows: {
      control: 'boolean',
      description: 'Applies the table-pin-rows sticky row class.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI table themed preview',
      },
    },
  },
} satisfies Meta<typeof TableStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
