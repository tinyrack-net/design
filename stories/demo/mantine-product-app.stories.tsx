import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../src/showcase/showcase.css';

function MantineProductApp() {
  const services = [
    ['API Gateway', 'Healthy', '99.99%', '18 ms'],
    ['Checkout Worker', 'Degraded', '99.91%', '44 ms'],
    ['Docs Search', 'Healthy', '99.98%', '22 ms'],
  ];

  return (
    <main className="tinyrack-demo-page" data-demo-mantine="true">
      <div className="tinyrack-demo-shell">
        <aside className="tinyrack-demo-sidebar">
          <div className="tinyrack-demo-brand">
            <span className="tinyrack-demo-brand-mark">TR</span>
            <div>
              <strong>Tinyrack</strong>
              <span>Operations</span>
            </div>
          </div>
          <nav className="tinyrack-demo-nav" aria-label="Mantine demo navigation">
            <a href="#overview" aria-current="page">
              Overview
            </a>
            <a href="#services">Services</a>
            <a href="#deployments">Deployments</a>
            <a href="#settings">Settings</a>
          </nav>
          <p className="tinyrack-demo-sidebar-note">
            Mantine primitives carry the Tinyrack theme through provider-level color,
            radius, and component defaults.
          </p>
        </aside>

        <section className="tinyrack-demo-main">
          <header className="tinyrack-demo-header">
            <div>
              <Mantine.Badge color="tinyrack" variant="light">
                Mantine product app
              </Mantine.Badge>
              <h1>Service control center</h1>
              <p>
                A dense operational surface using Mantine buttons, badges, alerts,
                forms, tables, progress, and segmented controls under one provider.
              </p>
            </div>
            <div className="tinyrack-demo-header-actions">
              <Mantine.Button variant="default">View logs</Mantine.Button>
              <Mantine.Button>Deploy change</Mantine.Button>
            </div>
          </header>

          <section className="tinyrack-demo-grid">
            {[
              ['Availability', '99.98%', '+0.03%'],
              ['Requests', '18.4M', '+12.8%'],
              ['Error budget', '71%', '8 days left'],
              ['Queue depth', '243', '-18%'],
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
                  <h2>Live services</h2>
                  <p>Theme density, table contrast, and status hierarchy.</p>
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
                      <Mantine.Table.Th>SLO</Mantine.Table.Th>
                      <Mantine.Table.Th>p95 latency</Mantine.Table.Th>
                    </Mantine.Table.Tr>
                  </Mantine.Table.Thead>
                  <Mantine.Table.Tbody>
                    {services.map(([name, status, slo, latency]) => (
                      <Mantine.Table.Tr key={name}>
                        <Mantine.Table.Td>{name}</Mantine.Table.Td>
                        <Mantine.Table.Td>
                          <Mantine.Badge
                            color={status === 'Healthy' ? 'green' : 'yellow'}
                            variant="light"
                          >
                            {status}
                          </Mantine.Badge>
                        </Mantine.Table.Td>
                        <Mantine.Table.Td>{slo}</Mantine.Table.Td>
                        <Mantine.Table.Td>{latency}</Mantine.Table.Td>
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
              <h2>Release guardrails</h2>
              <Mantine.Alert color="yellow" title="One check needs review">
                Checkout Worker latency is above the warning threshold.
              </Mantine.Alert>
              <Mantine.Progress color="tinyrack" value={71} />
              <Mantine.Switch
                defaultChecked
                label="Require approval over 10% traffic"
              />
              <Mantine.TextInput
                defaultValue="api.tinyrack.net"
                label="Primary domain"
              />
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
