import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import '../../src/showcase/showcase.css';

function DemoUse({
  children,
  className,
  id,
  inline = false,
}: {
  children: ReactNode;
  className?: string;
  id: string;
  inline?: boolean;
}) {
  const Element = inline ? 'span' : 'div';

  return (
    <Element className={className} data-demo-component={id}>
      {children}
    </Element>
  );
}

function MantineProductApp() {
  const combobox = Mantine.useCombobox();
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
          <DemoUse id="mantine-flex">
            <div className="tinyrack-demo-brand">
              <DemoUse id="mantine-avatar">
                <Mantine.Avatar color="tinyrack" radius="sm" size="sm">
                  TR
                </Mantine.Avatar>
              </DemoUse>
              <DemoUse id="mantine-stack">
                <Mantine.Stack gap={0}>
                  <Mantine.Text fw={800}>Tinyrack</Mantine.Text>
                  <Mantine.Text c="dimmed" size="xs">
                    Homelab
                  </Mantine.Text>
                </Mantine.Stack>
              </DemoUse>
            </div>
          </DemoUse>
          <DemoUse id="mantine-navlink">
            <nav className="tinyrack-demo-nav" aria-label="Mantine demo navigation">
              <Mantine.NavLink active href="#overview" label="Overview" />
              <Mantine.NavLink href="#deploy" label="Deployments" />
              <Mantine.NavLink href="#network" label="Network" />
              <Mantine.NavLink href="#settings" label="Settings" />
            </nav>
          </DemoUse>
          <DemoUse id="mantine-burger">
            <Mantine.Group gap="xs">
              <Mantine.Burger aria-label="Toggle rack navigation" size="xs" />
              <Mantine.Text c="dimmed" size="xs">
                Compact nav state
              </Mantine.Text>
            </Mantine.Group>
          </DemoUse>
          <DemoUse id="mantine-blockquote">
            <Mantine.Blockquote cite="Rack policy" color="tinyrack" p="xs">
              Review storage and UPS health before applying live service restarts.
            </Mantine.Blockquote>
          </DemoUse>
        </aside>

        <section className="tinyrack-demo-main">
          <DemoUse id="mantine-container">
            <Mantine.Container fluid p={0}>
              <header className="tinyrack-demo-header">
                <div>
                  <DemoUse id="mantine-badge">
                    <Mantine.Badge color="tinyrack" variant="light">
                      Mantine homelab console
                    </Mantine.Badge>
                  </DemoUse>
                  <DemoUse id="mantine-title">
                    <Mantine.Title order={1}>Rack control plane</Mantine.Title>
                  </DemoUse>
                  <DemoUse id="mantine-text">
                    <Mantine.Text c="dimmed">
                      Monitor nodes, storage, local services, and restart guardrails
                      from one compact operations surface.
                    </Mantine.Text>
                  </DemoUse>
                </div>
                <div className="tinyrack-demo-header-actions">
                  <DemoUse id="mantine-menu">
                    <Mantine.Menu shadow="sm" width={180} withinPortal={false}>
                      <Mantine.Menu.Target>
                        <Mantine.Button size="xs" variant="default">
                          Queue menu
                        </Mantine.Button>
                      </Mantine.Menu.Target>
                      <Mantine.Menu.Dropdown>
                        <Mantine.Menu.Label>Operations</Mantine.Menu.Label>
                        <Mantine.Menu.Item>Freeze deploys</Mantine.Menu.Item>
                        <Mantine.Menu.Item>Export timeline</Mantine.Menu.Item>
                      </Mantine.Menu.Dropdown>
                    </Mantine.Menu>
                  </DemoUse>
                  <DemoUse id="mantine-button">
                    <Mantine.Button variant="default">Apply config</Mantine.Button>
                  </DemoUse>
                  <DemoUse id="mantine-actionicon">
                    <Mantine.ActionIcon aria-label="Sync rack state" variant="default">
                      S
                    </Mantine.ActionIcon>
                  </DemoUse>
                </div>
              </header>
            </Mantine.Container>
          </DemoUse>

          <section className="tinyrack-demo-grid">
            <DemoUse id="mantine-simplegrid" className="tinyrack-demo-panel--full">
              <Mantine.SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xs">
                {[
                  ['Rack uptime', '23d', 'last reboot clean'],
                  ['Power draw', '186 W', 'UPS 74%'],
                  ['Storage free', '2.8 TB', 'ZFS pool healthy'],
                  ['Backup age', '3 h', 'next at 02:00'],
                ].map(([label, value, note]) => (
                  <DemoUse id="mantine-card" key={label}>
                    <Mantine.Card
                      className="tinyrack-demo-kpi"
                      padding="sm"
                      radius="md"
                      withBorder
                    >
                      <span>{label}</span>
                      <strong>{value}</strong>
                      <Mantine.Text c="dimmed" size="xs">
                        {note}
                      </Mantine.Text>
                    </Mantine.Card>
                  </DemoUse>
                ))}
              </Mantine.SimpleGrid>
            </DemoUse>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <Mantine.Group justify="space-between">
                <div>
                  <h2>Rack inventory</h2>
                  <p>Node health, local address, and thermal/storage signals.</p>
                </div>
                <DemoUse id="mantine-segmentedcontrol">
                  <Mantine.SegmentedControl
                    data={['24h', '7d', '30d']}
                    defaultValue="24h"
                    size="xs"
                  />
                </DemoUse>
              </Mantine.Group>
              <DemoUse id="mantine-table" className="tinyrack-demo-table-scroll">
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
                          <DemoUse id="mantine-code">
                            <Mantine.Code>{address}</Mantine.Code>
                          </DemoUse>
                        </Mantine.Table.Td>
                        <Mantine.Table.Td>{signal}</Mantine.Table.Td>
                      </Mantine.Table.Tr>
                    ))}
                  </Mantine.Table.Tbody>
                </Mantine.Table>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Guardrail status</h2>
              <DemoUse id="mantine-alert">
                <Mantine.Alert
                  color="yellow"
                  title="NAS disk threshold"
                  variant="outline"
                >
                  nas-01 is above the storage review threshold.
                </Mantine.Alert>
              </DemoUse>
              <DemoUse id="mantine-progress">
                <Mantine.Progress color="tinyrack" value={74} />
              </DemoUse>
              <DemoUse id="mantine-switch">
                <Mantine.Switch
                  defaultChecked
                  label="Require approval before restarting nodes"
                />
              </DemoUse>
              <DemoUse id="mantine-textinput">
                <Mantine.TextInput defaultValue="rack.local" label="Local domain" />
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <Mantine.Group justify="space-between">
                <div>
                  <h2>Deployment queue</h2>
                  <p>
                    Tabs, timeline states, marks, and compact actions in a live flow.
                  </p>
                </div>
                <DemoUse id="mantine-copybutton">
                  <Mantine.CopyButton value="pnpm deploy --filter edge-proxy">
                    {({ copied, copy }) => (
                      <Mantine.Button onClick={copy} size="xs" variant="default">
                        {copied ? 'Copied' : 'Copy command'}
                      </Mantine.Button>
                    )}
                  </Mantine.CopyButton>
                </DemoUse>
              </Mantine.Group>
              <DemoUse id="mantine-tabs">
                <Mantine.Tabs defaultValue="deploys" variant="outline">
                  <Mantine.Tabs.List>
                    <Mantine.Tabs.Tab value="deploys">Deploys</Mantine.Tabs.Tab>
                    <Mantine.Tabs.Tab value="checks">Checks</Mantine.Tabs.Tab>
                    <Mantine.Tabs.Tab value="notes">Notes</Mantine.Tabs.Tab>
                  </Mantine.Tabs.List>
                  <Mantine.Tabs.Panel value="deploys" pt="sm">
                    <DemoUse id="mantine-timeline">
                      <Mantine.Timeline active={1} bulletSize={18} lineWidth={1}>
                        <Mantine.Timeline.Item title="Config staged">
                          <Mantine.Text c="dimmed" size="xs">
                            edge-proxy has a pending route update.
                          </Mantine.Text>
                        </Mantine.Timeline.Item>
                        <Mantine.Timeline.Item title="Health checks running">
                          <Mantine.Text c="dimmed" size="xs">
                            Waiting on{' '}
                            <DemoUse id="mantine-mark" inline>
                              <Mantine.Mark>nas-01</Mantine.Mark>
                            </DemoUse>{' '}
                            disk review.
                          </Mantine.Text>
                        </Mantine.Timeline.Item>
                        <Mantine.Timeline.Item title="Apply window">
                          <Mantine.Text c="dimmed" size="xs">
                            Approved changes apply at 02:00.
                          </Mantine.Text>
                        </Mantine.Timeline.Item>
                      </Mantine.Timeline>
                    </DemoUse>
                  </Mantine.Tabs.Panel>
                  <Mantine.Tabs.Panel value="checks" pt="sm">
                    <DemoUse id="mantine-checkbox">
                      <Mantine.Checkbox.Group
                        defaultValue={['backup', 'route']}
                        label="Preflight checks"
                      >
                        <Mantine.Group mt="xs">
                          <Mantine.Checkbox value="backup" label="Backup snapshot" />
                          <Mantine.Checkbox value="route" label="Route probe" />
                          <Mantine.Checkbox value="ups" label="UPS window" />
                        </Mantine.Group>
                      </Mantine.Checkbox.Group>
                    </DemoUse>
                  </Mantine.Tabs.Panel>
                  <Mantine.Tabs.Panel value="notes" pt="sm">
                    <DemoUse id="mantine-textarea">
                      <Mantine.Textarea
                        autosize
                        defaultValue="Restart reverse-proxy only after local DNS resolves from node-01."
                        label="Operator note"
                        minRows={2}
                      />
                    </DemoUse>
                  </Mantine.Tabs.Panel>
                </Mantine.Tabs>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Operator controls</h2>
              <DemoUse id="mantine-group">
                <Mantine.Group>
                  <DemoUse id="mantine-tooltip">
                    <Mantine.Tooltip label="On-call engineers" withinPortal={false}>
                      <Mantine.Avatar.Group>
                        <Mantine.Avatar color="tinyrack">AL</Mantine.Avatar>
                        <Mantine.Avatar color="gray">MK</Mantine.Avatar>
                      </Mantine.Avatar.Group>
                    </Mantine.Tooltip>
                  </DemoUse>
                  <DemoUse id="mantine-rating">
                    <Mantine.Rating defaultValue={4} size="sm" />
                  </DemoUse>
                </Mantine.Group>
              </DemoUse>
              <DemoUse id="mantine-multiselect">
                <Mantine.MultiSelect
                  data={['node-01', 'nas-01', 'edge-proxy', 'ups']}
                  defaultValue={['node-01', 'edge-proxy']}
                  label="Maintenance targets"
                />
              </DemoUse>
              <DemoUse id="mantine-pagination">
                <Mantine.Pagination total={4} size="xs" />
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Topology and media</h2>
              <DemoUse id="mantine-grid">
                <Mantine.Grid gutter="xs">
                  <Mantine.Grid.Col span={7}>
                    <DemoUse id="mantine-aspectratio">
                      <Mantine.AspectRatio ratio={16 / 9}>
                        <DemoUse id="mantine-backgroundimage">
                          <Mantine.BackgroundImage
                            radius="md"
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23262626'/%3E%3Cpath d='M40 60h80v60H40zM200 42h80v96h-80z' fill='%23fafafa' opacity='.18'/%3E%3Cpath d='M120 90h80' stroke='%23fafafa' stroke-width='3'/%3E%3C/svg%3E"
                          >
                            <DemoUse id="mantine-overlay">
                              <Mantine.Overlay color="#000" opacity={0.18} />
                            </DemoUse>
                            <Mantine.Center h="100%">
                              <DemoUse id="mantine-highlight">
                                <Mantine.Highlight highlight="rack">
                                  edge rack topology
                                </Mantine.Highlight>
                              </DemoUse>
                            </Mantine.Center>
                          </Mantine.BackgroundImage>
                        </DemoUse>
                      </Mantine.AspectRatio>
                    </DemoUse>
                  </Mantine.Grid.Col>
                  <Mantine.Grid.Col span={5}>
                    <DemoUse id="mantine-image">
                      <Mantine.Image
                        alt="Rack thermal map"
                        radius="md"
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 140'%3E%3Crect width='220' height='140' fill='%230a0a0a'/%3E%3Crect x='18' y='24' width='184' height='22' fill='%23404040'/%3E%3Crect x='18' y='58' width='184' height='22' fill='%23737373'/%3E%3Crect x='18' y='92' width='184' height='22' fill='%23262626'/%3E%3C/svg%3E"
                      />
                    </DemoUse>
                  </Mantine.Grid.Col>
                </Mantine.Grid>
              </DemoUse>
              <DemoUse id="mantine-marquee">
                <Mantine.Marquee>
                  node-01 green · nas-01 review · edge-proxy route probe 18 ms
                </Mantine.Marquee>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Service readiness</h2>
              <DemoUse id="mantine-ringprogress">
                <Mantine.RingProgress
                  label={
                    <Mantine.Text ta="center" size="xs">
                      70%
                    </Mantine.Text>
                  }
                  sections={[{ color: 'tinyrack', value: 70 }]}
                  size={92}
                />
              </DemoUse>
              <DemoUse id="mantine-semicircleprogress">
                <Mantine.SemiCircleProgress
                  filledSegmentColor="tinyrack"
                  label="UPS"
                  value={74}
                />
              </DemoUse>
              <DemoUse id="mantine-loader">
                <Mantine.Group gap="xs">
                  <Mantine.Loader size="xs" />
                  <Mantine.Text c="dimmed" size="xs">
                    Waiting for route probe
                  </Mantine.Text>
                </Mantine.Group>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Rack setup form</h2>
              <DemoUse id="mantine-fieldset">
                <Mantine.Fieldset legend="Maintenance window">
                  <Mantine.SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                    <DemoUse id="mantine-autocomplete">
                      <Mantine.Autocomplete
                        data={['node-01', 'nas-01', 'edge-proxy']}
                        defaultValue="node-01"
                        label="Primary node"
                      />
                    </DemoUse>
                    <DemoUse id="mantine-select">
                      <Mantine.Select
                        data={['Manual', 'Scheduled', 'Emergency']}
                        defaultValue="Scheduled"
                        label="Mode"
                      />
                    </DemoUse>
                    <DemoUse id="mantine-nativeselect">
                      <Mantine.NativeSelect
                        data={['UPS guarded', 'Network guarded']}
                        label="Guardrail"
                      />
                    </DemoUse>
                    <DemoUse id="mantine-numberinput">
                      <Mantine.NumberInput defaultValue={186} label="Power draw" />
                    </DemoUse>
                    <DemoUse id="mantine-passwordinput">
                      <Mantine.PasswordInput
                        defaultValue="rack-token"
                        label="Token secret"
                      />
                    </DemoUse>
                    <DemoUse id="mantine-fileinput">
                      <Mantine.FileInput label="Restore archive" placeholder="Select" />
                    </DemoUse>
                    <DemoUse id="mantine-jsoninput">
                      <Mantine.JsonInput
                        autosize
                        defaultValue={'{\n  "service": "edge-proxy"\n}'}
                        label="Deploy payload"
                      />
                    </DemoUse>
                    <DemoUse id="mantine-tagsinput">
                      <Mantine.TagsInput
                        data={['network', 'storage', 'power']}
                        defaultValue={['network']}
                        label="Labels"
                      />
                    </DemoUse>
                  </Mantine.SimpleGrid>
                </Mantine.Fieldset>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Access setup</h2>
              <DemoUse id="mantine-pininput">
                <Mantine.PinInput defaultValue="1234" />
              </DemoUse>
              <DemoUse id="mantine-input">
                <Mantine.Input defaultValue="rack.local" aria-label="Rack domain" />
              </DemoUse>
              <DemoUse id="mantine-datalist">
                <Mantine.DataList>
                  <Mantine.DataList.Item>
                    <Mantine.DataList.ItemLabel>Package</Mantine.DataList.ItemLabel>
                    <Mantine.DataList.ItemValue>
                      @tinyrack/themes
                    </Mantine.DataList.ItemValue>
                  </Mantine.DataList.Item>
                </Mantine.DataList>
              </DemoUse>
              <DemoUse id="mantine-kbd">
                <Mantine.Kbd>Ctrl K</Mantine.Kbd>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Theme controls</h2>
              <Mantine.SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                <DemoUse id="mantine-colorinput">
                  <Mantine.ColorInput defaultValue="#737373" label="Status color" />
                </DemoUse>
                <DemoUse id="mantine-colorpicker">
                  <Mantine.ColorPicker defaultValue="#737373" format="hex" />
                </DemoUse>
                <DemoUse id="mantine-colorswatch">
                  <Mantine.ColorSwatch color="#737373" />
                </DemoUse>
                <DemoUse id="mantine-chip">
                  <Mantine.Chip defaultChecked>Compact density</Mantine.Chip>
                </DemoUse>
                <DemoUse id="mantine-radio">
                  <Mantine.Radio.Group defaultValue="auto" label="Restart mode">
                    <Mantine.Group mt="xs">
                      <Mantine.Radio value="auto" label="Auto" />
                      <Mantine.Radio value="manual" label="Manual" />
                    </Mantine.Group>
                  </Mantine.Radio.Group>
                </DemoUse>
                <DemoUse id="mantine-slider">
                  <Mantine.Slider defaultValue={64} label="Traffic" />
                </DemoUse>
                <DemoUse id="mantine-rangeslider">
                  <Mantine.RangeSlider defaultValue={[20, 80]} />
                </DemoUse>
              </Mantine.SimpleGrid>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Pills and commands</h2>
              <DemoUse id="mantine-pillsinput">
                <Mantine.PillsInput label="Service tags">
                  <Mantine.Pill.Group>
                    <DemoUse id="mantine-pill">
                      <Mantine.Pill withRemoveButton>edge</Mantine.Pill>
                    </DemoUse>
                    <Mantine.PillsInput.Field placeholder="Add" />
                  </Mantine.Pill.Group>
                </Mantine.PillsInput>
              </DemoUse>
              <DemoUse id="mantine-combobox">
                <Mantine.Combobox store={combobox} withinPortal={false}>
                  <Mantine.Combobox.Target>
                    <Mantine.Button size="xs" variant="default">
                      Command palette
                    </Mantine.Button>
                  </Mantine.Combobox.Target>
                  <Mantine.Combobox.Dropdown>
                    <Mantine.Combobox.Options>
                      <Mantine.Combobox.Option value="restart">
                        Restart service
                      </Mantine.Combobox.Option>
                      <Mantine.Combobox.Option value="logs">
                        Open logs
                      </Mantine.Combobox.Option>
                    </Mantine.Combobox.Options>
                  </Mantine.Combobox.Dropdown>
                </Mantine.Combobox>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Runbook navigation</h2>
              <DemoUse id="mantine-breadcrumbs">
                <Mantine.Breadcrumbs>
                  <DemoUse id="mantine-anchor" inline>
                    <Mantine.Anchor href="#rack">Rack</Mantine.Anchor>
                  </DemoUse>
                  <Mantine.Anchor href="#nodes">Nodes</Mantine.Anchor>
                  <Mantine.Anchor href="#edge">edge-proxy</Mantine.Anchor>
                </Mantine.Breadcrumbs>
              </DemoUse>
              <DemoUse id="mantine-accordion">
                <Mantine.Accordion defaultValue="rollback">
                  <Mantine.Accordion.Item value="rollback">
                    <Mantine.Accordion.Control>
                      Rollback steps
                    </Mantine.Accordion.Control>
                    <Mantine.Accordion.Panel>
                      Verify DNS, drain traffic, restore previous route.
                    </Mantine.Accordion.Panel>
                  </Mantine.Accordion.Item>
                </Mantine.Accordion>
              </DemoUse>
              <DemoUse id="mantine-stepper">
                <Mantine.Stepper active={1} size="xs">
                  <Mantine.Stepper.Step label="Discover" />
                  <Mantine.Stepper.Step label="Configure" />
                  <Mantine.Stepper.Step label="Verify" />
                </Mantine.Stepper>
              </DemoUse>
              <DemoUse id="mantine-list">
                <Mantine.List size="sm">
                  <Mantine.List.Item>Confirm snapshot age.</Mantine.List.Item>
                  <Mantine.List.Item>Check route probe.</Mantine.List.Item>
                  <Mantine.List.Item>Notify on-call.</Mantine.List.Item>
                </Mantine.List>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Surface states</h2>
              <DemoUse id="mantine-notification">
                <Mantine.Notification title="Config saved" withCloseButton={false}>
                  Restart approval remains enabled.
                </Mantine.Notification>
              </DemoUse>
              <DemoUse id="mantine-skeleton">
                <Mantine.Skeleton height={36} radius="sm" />
              </DemoUse>
              <DemoUse id="mantine-loadingoverlay">
                <Mantine.Box h={64} pos="relative">
                  <Mantine.LoadingOverlay visible zIndex={1} />
                  <Mantine.Text c="dimmed" size="xs">
                    Loading service logs
                  </Mantine.Text>
                </Mantine.Box>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Inspector shell</h2>
              <DemoUse id="mantine-appshell">
                <div className="tinyrack-demo-appshell">
                  <Mantine.AppShell
                    header={{ height: 40 }}
                    mode="static"
                    navbar={{ width: 128, breakpoint: 'sm' }}
                    padding="sm"
                  >
                    <Mantine.AppShell.Header px="sm">
                      Tinyrack inspector
                    </Mantine.AppShell.Header>
                    <Mantine.AppShell.Navbar p="sm">Nodes</Mantine.AppShell.Navbar>
                    <Mantine.AppShell.Main>Route detail</Mantine.AppShell.Main>
                  </Mantine.AppShell>
                </div>
              </DemoUse>
              <Mantine.Group gap="xs">
                <DemoUse id="mantine-modal">
                  <Mantine.Modal
                    opened={false}
                    onClose={() => undefined}
                    title="Restart service"
                    withinPortal={false}
                  >
                    Restarting reverse-proxy will interrupt local routing.
                  </Mantine.Modal>
                  <Mantine.Button size="xs" variant="default">
                    Restart dialog
                  </Mantine.Button>
                </DemoUse>
                <DemoUse id="mantine-drawer">
                  <Mantine.Drawer
                    opened={false}
                    onClose={() => undefined}
                    title="Service inspector"
                    withinPortal={false}
                  >
                    Drawer content
                  </Mantine.Drawer>
                  <Mantine.Button size="xs" variant="default">
                    Open inspector
                  </Mantine.Button>
                </DemoUse>
                <DemoUse id="mantine-dialog">
                  <Mantine.Box h={72} pos="relative" w={160}>
                    <Mantine.Dialog
                      opened={false}
                      position={{ bottom: 4, right: 4 }}
                      size="xs"
                      withCloseButton={false}
                      withinPortal={false}
                    >
                      Dialog
                    </Mantine.Dialog>
                    <Mantine.Button size="xs" variant="default">
                      Dialog notice
                    </Mantine.Button>
                  </Mantine.Box>
                </DemoUse>
              </Mantine.Group>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Context help</h2>
              <DemoUse id="mantine-popover">
                <Mantine.Popover withinPortal={false}>
                  <Mantine.Popover.Target>
                    <Mantine.Button size="xs" variant="default">
                      Probe details
                    </Mantine.Button>
                  </Mantine.Popover.Target>
                  <Mantine.Popover.Dropdown>
                    Probe target: edge-proxy.
                  </Mantine.Popover.Dropdown>
                </Mantine.Popover>
              </DemoUse>
              <DemoUse id="mantine-hovercard">
                <Mantine.HoverCard withinPortal={false}>
                  <Mantine.HoverCard.Target>
                    <Mantine.Button size="xs" variant="default">
                      Route owner
                    </Mantine.Button>
                  </Mantine.HoverCard.Target>
                  <Mantine.HoverCard.Dropdown>
                    Network team owns this route.
                  </Mantine.HoverCard.Dropdown>
                </Mantine.HoverCard>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Logs and details</h2>
              <DemoUse id="mantine-scrollarea">
                <Mantine.ScrollArea h={140}>
                  <pre className="tinyrack-demo-code">{`10:30 backup-sync complete
10:31 edge-proxy route probe healthy
10:36 nas-01 storage threshold review
10:40 deploy window scheduled`}</pre>
                </Mantine.ScrollArea>
              </DemoUse>
              <DemoUse id="mantine-collapse">
                <Mantine.Collapse in>
                  <Mantine.Text c="dimmed" size="sm">
                    Collapsed details are visible for demo review.
                  </Mantine.Text>
                </Mantine.Collapse>
              </DemoUse>
              <DemoUse id="mantine-spoiler">
                <Mantine.Spoiler maxHeight={42} showLabel="Show more" hideLabel="Hide">
                  Route health is computed from DNS resolution, TCP probe, container
                  status, and recent deployment logs.
                </Mantine.Spoiler>
              </DemoUse>
              <DemoUse id="mantine-divider">
                <Mantine.Divider label="Runbook note" labelPosition="center" />
              </DemoUse>
              <DemoUse id="mantine-typography">
                <Mantine.Typography>
                  <p>
                    Keep runbooks short, procedural, and linked to the service owner.
                  </p>
                </Mantine.Typography>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Numbers and empty states</h2>
              <DemoUse id="mantine-numberformatter">
                <Mantine.Text fw={800}>
                  <Mantine.NumberFormatter
                    prefix="$"
                    value={12345.67}
                    thousandSeparator
                  />
                </Mantine.Text>
              </DemoUse>
              <DemoUse id="mantine-themeicon">
                <Mantine.ThemeIcon color="tinyrack" variant="light">
                  TR
                </Mantine.ThemeIcon>
              </DemoUse>
              <DemoUse id="mantine-indicator">
                <Mantine.Indicator label="new">
                  <Mantine.Button size="xs" variant="default">
                    Inbox
                  </Mantine.Button>
                </Mantine.Indicator>
              </DemoUse>
              <DemoUse id="mantine-emptystate">
                <Mantine.EmptyState>
                  <Mantine.EmptyState.Indicator>TR</Mantine.EmptyState.Indicator>
                  <Mantine.EmptyState.Title>
                    No critical alerts
                  </Mantine.EmptyState.Title>
                  <Mantine.EmptyState.Description>
                    All guardrails are currently passing.
                  </Mantine.EmptyState.Description>
                </Mantine.EmptyState>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--full">
              <h2>Floating recovery action</h2>
              <DemoUse id="mantine-paper">
                <Mantine.Paper p="sm" withBorder>
                  <DemoUse id="mantine-box">
                    <Mantine.Box pos="relative" h={72}>
                      <DemoUse id="mantine-affix">
                        <Mantine.Affix
                          position={{ bottom: 8, right: 8 }}
                          withinPortal={false}
                        >
                          <Mantine.Button size="xs">Tail logs</Mantine.Button>
                        </Mantine.Affix>
                      </DemoUse>
                      <DemoUse id="mantine-center">
                        <Mantine.Center h="100%">
                          <DemoUse id="mantine-unstyledbutton">
                            <Mantine.UnstyledButton>
                              Manual recovery workspace
                            </Mantine.UnstyledButton>
                          </DemoUse>
                        </Mantine.Center>
                      </DemoUse>
                    </Mantine.Box>
                  </DemoUse>
                </Mantine.Paper>
              </DemoUse>
              <DemoUse id="mantine-space">
                <Mantine.Space h="xs" />
              </DemoUse>
            </section>
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
