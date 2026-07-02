import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../src/showcase/showcase.css';

function MantineProductApp() {
  const services = [
    ['node-01', 'Healthy', '10.0.0.12', '31 C'],
    ['nas-01', 'Review', '10.0.0.24', '78% disk'],
    ['edge-proxy', 'Healthy', '10.0.0.5', '18 ms'],
  ];
  const statusClass = (status: string) =>
    status === 'Healthy'
      ? 'tinyrack-status-pill tinyrack-status-pill--healthy'
      : 'tinyrack-status-pill tinyrack-status-pill--warning';

  return (
    <main className="tinyrack-demo-page" data-demo-mantine="true">
      <div className="tinyrack-demo-shell">
        <aside className="tinyrack-demo-sidebar">
          <div className="tinyrack-demo-brand">
            <span className="tinyrack-demo-brand-mark">TR</span>
            <div>
              <strong>Tinyrack</strong>
              <span>Homelab</span>
            </div>
          </div>
          <nav className="tinyrack-demo-nav" aria-label="Mantine demo navigation">
            <a href="#overview" aria-current="page">
              Overview
            </a>
            <a href="#nodes">Nodes</a>
            <a href="#network">Network</a>
            <a href="#backups">Backups</a>
            <a href="#power">Power</a>
          </nav>
          <p className="tinyrack-demo-sidebar-note">
            Mantine primitives inherit compact Tinyrack color, radius, and density for
            small infrastructure consoles.
          </p>
        </aside>

        <section className="tinyrack-demo-main">
          <header className="tinyrack-demo-header">
            <div>
              <Mantine.Badge color="tinyrack" variant="light">
                Mantine homelab console
              </Mantine.Badge>
              <h1>Rack control plane</h1>
              <p>
                Monitor nodes, storage, local services, and restart guardrails from one
                compact operations surface.
              </p>
            </div>
            <div className="tinyrack-demo-header-actions">
              <Mantine.Button variant="default">Open logs</Mantine.Button>
              <Mantine.Button>Apply config</Mantine.Button>
            </div>
          </header>

          <section className="tinyrack-demo-grid">
            {[
              ['Rack uptime', '23d', 'last reboot clean'],
              ['Power draw', '186 W', 'UPS 74%'],
              ['Storage free', '2.8 TB', 'ZFS pool healthy'],
              ['Backup age', '3 h', 'next at 02:00'],
            ].map(([label, value, note]) => (
              <Mantine.Card
                className="tinyrack-demo-kpi"
                key={label}
                padding="md"
                radius="md"
                withBorder
              >
                <span>{label}</span>
                <strong>{value}</strong>
                <Mantine.Text c="dimmed" size="xs">
                  {note}
                </Mantine.Text>
              </Mantine.Card>
            ))}

            <Mantine.Card
              className="tinyrack-demo-panel tinyrack-demo-panel--wide"
              padding="md"
              radius="md"
              withBorder
            >
              <Mantine.Group justify="space-between">
                <div>
                  <h2>Rack inventory</h2>
                  <p>Node health, local address, and thermal/storage signals.</p>
                </div>
                <Mantine.SegmentedControl
                  data={['24h', '7d', '30d']}
                  defaultValue="24h"
                  size="xs"
                />
              </Mantine.Group>
              <div className="tinyrack-demo-table-scroll">
                <Mantine.Table highlightOnHover striped>
                  <Mantine.Table.Thead>
                    <Mantine.Table.Tr>
                      <Mantine.Table.Th>Service</Mantine.Table.Th>
                      <Mantine.Table.Th>Status</Mantine.Table.Th>
                      <Mantine.Table.Th>Address</Mantine.Table.Th>
                      <Mantine.Table.Th>Signal</Mantine.Table.Th>
                    </Mantine.Table.Tr>
                  </Mantine.Table.Thead>
                  <Mantine.Table.Tbody>
                    {services.map(([name, status, address, signal]) => (
                      <Mantine.Table.Tr key={name}>
                        <Mantine.Table.Td>{name}</Mantine.Table.Td>
                        <Mantine.Table.Td>
                          <span className={statusClass(status)}>{status}</span>
                        </Mantine.Table.Td>
                        <Mantine.Table.Td>
                          <Mantine.Code>{address}</Mantine.Code>
                        </Mantine.Table.Td>
                        <Mantine.Table.Td>{signal}</Mantine.Table.Td>
                      </Mantine.Table.Tr>
                    ))}
                  </Mantine.Table.Tbody>
                </Mantine.Table>
              </div>
            </Mantine.Card>

            <Mantine.Card
              className="tinyrack-demo-panel tinyrack-demo-panel--side"
              padding="md"
              radius="md"
              withBorder
            >
              <h2>Rack guardrails</h2>
              <Mantine.Alert color="yellow" title="NAS disk threshold">
                nas-01 is above the storage review threshold.
              </Mantine.Alert>
              <Mantine.Progress color="tinyrack" value={74} />
              <Mantine.Switch
                defaultChecked
                label="Require approval before restarting nodes"
              />
              <Mantine.TextInput defaultValue="rack.local" label="Local domain" />
            </Mantine.Card>
          </section>
        </section>
      </div>
    </main>
  );
}

const meta = {
  title: 'Demo/Mantine Product App',
  component: MantineProductApp,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MantineProductApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
