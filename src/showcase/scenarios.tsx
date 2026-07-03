import * as Mantine from '@mantine/core';
import type { ReactElement, ReactNode } from 'react';
import type {
  ShowcaseControlValues,
  ShowcaseEntry,
  ShowcaseLibrary,
  ShowcaseScenario,
  ShowcaseScenarioId,
  ShowcaseStoryDefinition,
  ShowcaseStoryKind,
} from './types.js';

const storyKinds: ShowcaseStoryKind[] = [
  'default',
  'variants',
  'sizes',
  'states',
  'examples',
];

const storyNames: Record<ShowcaseStoryKind, string> = {
  default: 'Default',
  variants: 'Variants',
  sizes: 'Sizes',
  states: 'States',
  examples: 'Examples',
};

const scenarioNames: Record<ShowcaseScenarioId, string> = {
  default: 'Default',
  preview: 'Preview',
  variants: 'Variants',
  sizes: 'Sizes',
  states: 'States',
  composition: 'Composition',
  tokens: 'Tokens',
  accessibility: 'Accessibility',
  playground: 'Playground',
  examples: 'Examples',
};

function VariantMatrix({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="tinyrack-variant-matrix" data-showcase-variant-matrix="true">
      <header className="tinyrack-variant-matrix__header">
        <h4>{title}</h4>
        <p>{description}</p>
      </header>
      <div className="tinyrack-variant-matrix__grid">{children}</div>
    </section>
  );
}

function VariantCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="tinyrack-variant-cell">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function GenericVariants({
  entry,
  library,
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
}) {
  return (
    <VariantMatrix
      description="Default rendering plus compact and stress containers so layout, overflow, and theme inheritance are visible without returning to an all-components page."
      title={`${library === 'mantine' ? 'Mantine' : 'daisyUI'} ${entry.name} variants`}
    >
      <VariantCell label="Default">{entry.render()}</VariantCell>
      <VariantCell label="Compact">
        <div className="tinyrack-variant-frame tinyrack-variant-frame--compact">
          {entry.render()}
        </div>
      </VariantCell>
      <VariantCell label="Stress">
        <div className="tinyrack-variant-frame tinyrack-variant-frame--stress">
          {entry.render()}
        </div>
      </VariantCell>
    </VariantMatrix>
  );
}

function GenericStates({
  entry,
  library,
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
}) {
  const libraryName = library === 'mantine' ? 'Mantine' : 'daisyUI';

  return (
    <VariantMatrix
      description="Common idle, constrained, and disabled-adjacent review states for the component."
      title={`${libraryName} ${entry.name} states`}
    >
      <VariantCell label="idle">{entry.render()}</VariantCell>
      <VariantCell label="constrained">
        <div className="tinyrack-variant-frame tinyrack-variant-frame--compact">
          {entry.render()}
        </div>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineButtonVariants() {
  return (
    <VariantMatrix
      description="Visual button variants, size rhythm, and disabled/loading states on the Tinyrack dark surface."
      title="Mantine Button variants"
    >
      {(['filled', 'light', 'outline', 'subtle', 'transparent'] as const).map(
        (variant) => (
          <VariantCell key={variant} label={variant}>
            <Mantine.Button variant={variant}>{variant}</Mantine.Button>
          </VariantCell>
        ),
      )}
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <VariantCell key={size} label={`size ${size}`}>
          <Mantine.Button size={size}>Apply</Mantine.Button>
        </VariantCell>
      ))}
      <VariantCell label="disabled">
        <Mantine.Button disabled>Paused</Mantine.Button>
      </VariantCell>
      <VariantCell label="loading">
        <Mantine.Button loading>Applying</Mantine.Button>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineActionIconVariants() {
  return (
    <VariantMatrix
      description="Icon button variants, size rhythm, and disabled/loading states on compact command surfaces."
      title="Mantine ActionIcon variants"
    >
      {(['filled', 'light', 'outline', 'subtle', 'transparent'] as const).map(
        (variant) => (
          <VariantCell key={variant} label={variant}>
            <Mantine.ActionIcon
              aria-label={`${variant} rack settings`}
              variant={variant}
            >
              TR
            </Mantine.ActionIcon>
          </VariantCell>
        ),
      )}
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <VariantCell key={size} label={`size ${size}`}>
          <Mantine.ActionIcon aria-label={`rack settings ${size}`} size={size}>
            TR
          </Mantine.ActionIcon>
        </VariantCell>
      ))}
      <VariantCell label="disabled">
        <Mantine.ActionIcon aria-label="Disabled rack settings" disabled>
          TR
        </Mantine.ActionIcon>
      </VariantCell>
      <VariantCell label="loading">
        <Mantine.ActionIcon aria-label="Loading rack settings" loading>
          TR
        </Mantine.ActionIcon>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineButtonScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const scenarioName = scenarioNames[scenarioId];

  return (
    <VariantMatrix
      description={`Mantine Button ${scenarioId} guidance for Tinyrack product surfaces.`}
      title={`Mantine Button ${scenarioName.toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states idle">
            <Mantine.Button>Apply config</Mantine.Button>
          </VariantCell>
          <VariantCell label="states loading">
            <Mantine.Button loading>Applying</Mantine.Button>
          </VariantCell>
          <VariantCell label="states disabled">
            <Mantine.Button disabled>Paused</Mantine.Button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition toolbar">
          <Mantine.Group>
            <Mantine.Button variant="filled">Add node</Mantine.Button>
            <Mantine.Button variant="outline">Import config</Mantine.Button>
            <Mantine.Button variant="subtle" color="red">
              Stop service
            </Mantine.Button>
          </Mantine.Group>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens primary">
            <Mantine.Button color="tinyrack">Brand action</Mantine.Button>
          </VariantCell>
          <VariantCell label="tokens radius">
            <Mantine.Button radius="sm">Sharp action</Mantine.Button>
          </VariantCell>
          <VariantCell label="tokens density">
            <Mantine.Button size="xs">Dense action</Mantine.Button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility label">
            <Mantine.Button aria-label="Apply rack configuration">Apply</Mantine.Button>
          </VariantCell>
          <VariantCell label="accessibility disabled">
            <Mantine.Button disabled>Paused action</Mantine.Button>
          </VariantCell>
          <VariantCell label="accessibility note">
            <ul className="tinyrack-scenario-list">
              <li>Button text should describe the rack action.</li>
              <li>
                Disabled buttons need adjacent explanation when the reason is unclear.
              </li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground default">
            <Mantine.Button>Apply config</Mantine.Button>
          </VariantCell>
          <VariantCell label="playground outline">
            <Mantine.Button variant="outline" size="lg">
              Open logs
            </Mantine.Button>
          </VariantCell>
          <VariantCell label="playground subtle">
            <Mantine.Button variant="subtle" color="gray">
              View metrics
            </Mantine.Button>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function MantineInputScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  return (
    <VariantMatrix
      description={`Mantine input ${scenarioId} examples covering label, error, helper text, and tokenized field density.`}
      title={`Mantine input ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states input label">
            <Mantine.TextInput label="Local domain" defaultValue="rack.local" />
          </VariantCell>
          <VariantCell label="states input error">
            <Mantine.TextInput
              label="Route target"
              error="Use a local hostname or LAN IP."
            />
          </VariantCell>
          <VariantCell label="states disabled label">
            <Mantine.TextInput
              label="DHCP lease"
              disabled
              defaultValue="Managed by router"
            />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition input label">
          <Mantine.Stack gap="xs">
            <Mantine.TextInput label="Local domain" defaultValue="rack.local" />
            <Mantine.Group justify="space-between">
              <Mantine.Text size="xs" c="dimmed">
                Route labels and validation copy stay close to the field.
              </Mantine.Text>
              <Mantine.Button size="xs">Check DNS</Mantine.Button>
            </Mantine.Group>
          </Mantine.Stack>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens input label">
            <Mantine.TextInput size="xs" radius="sm" label="Compact token" />
          </VariantCell>
          <VariantCell label="tokens input error">
            <Mantine.TextInput
              color="red"
              label="Error token"
              error="Use a local hostname."
            />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility input label">
            <Mantine.TextInput
              aria-describedby="mantine-input-help"
              description="Use a visible label before placeholder text."
              label="Service label"
              placeholder="home-assistant"
            />
          </VariantCell>
          <VariantCell label="accessibility input error">
            <ul className="tinyrack-scenario-list" id="mantine-input-help">
              <li>Every input needs a persistent label.</li>
              <li>Error text should be announced with the field.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground input label">
            <Mantine.TextInput label="Local domain" defaultValue="rack.local" />
          </VariantCell>
          <VariantCell label="playground input error">
            <Mantine.Input.Wrapper
              label="Route target"
              error="Use a LAN IP or hostname."
            >
              <Mantine.Input placeholder="192.168.1.2" />
            </Mantine.Input.Wrapper>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function MantineAlertScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  return (
    <VariantMatrix
      description={`Mantine alert ${scenarioId} examples for status messaging, severity, and readable alert copy.`}
      title={`Mantine alert ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states alert status">
            <Mantine.Alert color="green" title="Status online">
              Alert confirms the rack is healthy.
            </Mantine.Alert>
          </VariantCell>
          <VariantCell label="states alert warning">
            <Mantine.Alert color="yellow" title="Status warning">
              Alert shows certificate renewal is due.
            </Mantine.Alert>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition alert status">
          <Mantine.Stack gap="xs">
            <Mantine.Alert color="red" title="Restart blocked">
              backup-sync is running. Review logs before restarting nas-01.
            </Mantine.Alert>
            <Mantine.Group>
              <Mantine.Button size="xs">View logs</Mantine.Button>
              <Mantine.Button size="xs" variant="subtle">
                Dismiss
              </Mantine.Button>
            </Mantine.Group>
          </Mantine.Stack>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens alert status">
            <Mantine.Alert color="tinyrack" radius="lg" title="Token status">
              Alert uses brand color and radius tokens.
            </Mantine.Alert>
          </VariantCell>
          <VariantCell label="tokens alert outline">
            <Mantine.Alert color="yellow" variant="outline" title="Outline status">
              Border token stays visible.
            </Mantine.Alert>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility alert status">
            <Mantine.Alert role="status" title="Background status">
              Non-blocking alert updates should use status semantics.
            </Mantine.Alert>
          </VariantCell>
          <VariantCell label="accessibility alert copy">
            <ul className="tinyrack-scenario-list">
              <li>Alert titles should summarize the status.</li>
              <li>Use assertive roles only for urgent interruptions.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground alert status">
            <Mantine.Alert color="tinyrack" title="Route updated">
              reverse-proxy route changed to edge-proxy.
            </Mantine.Alert>
          </VariantCell>
          <VariantCell label="playground alert error">
            <Mantine.Alert color="red" title="Backup failed">
              Snapshot target is unreachable.
            </Mantine.Alert>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function MantineBadgeScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  return (
    <VariantMatrix
      description={`Mantine badge ${scenarioId} examples for compact status labels and badge token choices.`}
      title={`Mantine badge ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states badge status">
            <Mantine.Badge color="green">Healthy</Mantine.Badge>
          </VariantCell>
          <VariantCell label="states badge warning">
            <Mantine.Badge color="yellow">Updating</Mantine.Badge>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition badge status">
          <Mantine.Group>
            <Mantine.Text>reverse-proxy</Mantine.Text>
            <Mantine.Badge color="green">Healthy</Mantine.Badge>
            <Mantine.Badge variant="outline">edge-proxy</Mantine.Badge>
          </Mantine.Group>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens badge status">
            <Mantine.Badge color="tinyrack" radius="sm">
              Rack status
            </Mantine.Badge>
          </VariantCell>
          <VariantCell label="tokens badge size">
            <Mantine.Badge size="lg" variant="dot">
              Backup due
            </Mantine.Badge>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility badge status">
            <Mantine.Badge aria-label="Node status: healthy">Healthy</Mantine.Badge>
          </VariantCell>
          <VariantCell label="accessibility badge note">
            <ul className="tinyrack-scenario-list">
              <li>Badge text should not rely on color alone.</li>
              <li>Status labels need clear adjacent context.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground badge status">
            <Mantine.Badge>node-01</Mantine.Badge>
          </VariantCell>
          <VariantCell label="playground badge outline">
            <Mantine.Badge variant="outline">LAN only</Mantine.Badge>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function MantineControlScenario({
  component,
  scenarioId,
}: {
  component: 'checkbox' | 'radio' | 'switch';
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const controls = {
    checkbox: Mantine.Checkbox,
    radio: Mantine.Radio,
    switch: Mantine.Switch,
  };
  const Control = controls[component];

  return (
    <VariantMatrix
      description={`Mantine ${component} ${scenarioId} examples covering checked state, label text, disabled behavior, and form control tokens.`}
      title={`Mantine ${component} ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label={`states ${component} label`}>
            <Control defaultChecked label={`Enable ${component} guardrail`} />
          </VariantCell>
          <VariantCell label={`states ${component} disabled`}>
            <Control disabled label={`${component} locked by policy`} />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label={`composition ${component} label`}>
          <Mantine.Stack gap="xs">
            <Control defaultChecked label={`Enable ${component} label`} />
            <Mantine.Text size="xs" c="dimmed">
              Helper copy explains the rack guardrail before saving config.
            </Mantine.Text>
          </Mantine.Stack>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label={`tokens ${component} label`}>
            <Control color="tinyrack" size="sm" label={`${component} label token`} />
          </VariantCell>
          <VariantCell label={`tokens ${component} density`}>
            <Control size="xs" label={`${component} compact label`} />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label={`accessibility ${component} label`}>
            <Control
              label={`${component} visible label`}
              aria-describedby={`${component}-help`}
            />
          </VariantCell>
          <VariantCell label={`accessibility ${component} help`}>
            <ul className="tinyrack-scenario-list" id={`${component}-help`}>
              <li>Use a visible label for every {component}.</li>
              <li>Keep disabled controls paired with explanatory text.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label={`playground ${component} label`}>
            <Control defaultChecked label={`${component} playground label`} />
          </VariantCell>
          <VariantCell label={`playground ${component} off`}>
            <Control label={`${component} unchecked label`} />
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function MantineLayoutScenario({
  component,
  scenarioId,
}: {
  component: 'card' | 'modal' | 'tabs' | 'table' | 'stepper';
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const scenarioName = scenarioNames[scenarioId];
  const copy: Record<typeof component, string> = {
    card: 'card surface action',
    modal: 'modal dialog confirm',
    tabs: 'tabs panel navigation',
    table: 'table status row',
    stepper: 'step flow progress',
  };

  return (
    <VariantMatrix
      description={`Mantine ${component} ${scenarioId} examples covering ${copy[component]}.`}
      title={`Mantine ${component} ${scenarioName.toLowerCase()}`}
    >
      {component === 'card' ? (
        <>
          <VariantCell label={`${scenarioId} card surface`}>
            <Mantine.Card withBorder shadow="sm" padding="md">
              <Mantine.Text fw={700}>node-01</Mantine.Text>
              <Mantine.Text size="sm" c="dimmed">
                CPU 34%, memory 61%, last backup 18 minutes ago.
              </Mantine.Text>
              <Mantine.Group mt="md">
                <Mantine.Button size="xs">Open node</Mantine.Button>
              </Mantine.Group>
            </Mantine.Card>
          </VariantCell>
          <VariantCell label={`${scenarioId} card action`}>
            <ul className="tinyrack-scenario-list">
              <li>Card surface contrast should frame related content.</li>
              <li>Card action placement should remain predictable.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'modal' ? (
        <>
          <VariantCell label={`${scenarioId} modal dialog`}>
            <Mantine.Modal
              opened
              onClose={() => undefined}
              title="Restart reverse-proxy"
              withinPortal={false}
            >
              <Mantine.Text size="sm">
                Local routing may pause while the service restarts.
              </Mantine.Text>
              <Mantine.Group mt="md" justify="flex-end">
                <Mantine.Button variant="default" size="xs">
                  Cancel
                </Mantine.Button>
                <Mantine.Button color="red" size="xs">
                  Restart
                </Mantine.Button>
              </Mantine.Group>
            </Mantine.Modal>
          </VariantCell>
          <VariantCell label={`${scenarioId} confirm note`}>
            <ul className="tinyrack-scenario-list">
              <li>Modal dialog copy should name the confirm action.</li>
              <li>Keep cancellation available next to confirm.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'tabs' ? (
        <>
          <VariantCell label={`${scenarioId} tabs navigation`}>
            <Mantine.Tabs defaultValue="overview" className="tinyrack-demo-tabs">
              <Mantine.Tabs.List>
                <Mantine.Tabs.Tab value="overview">Overview</Mantine.Tabs.Tab>
                <Mantine.Tabs.Tab value="logs">Logs</Mantine.Tabs.Tab>
              </Mantine.Tabs.List>
              <Mantine.Tabs.Panel value="overview" pt="sm">
                Node health and service drift for {scenarioId}.
              </Mantine.Tabs.Panel>
            </Mantine.Tabs>
          </VariantCell>
          <VariantCell label={`${scenarioId} panel note`}>
            <ul className="tinyrack-scenario-list">
              <li>Tabs navigation should expose the active panel.</li>
              <li>Panel content should follow the tab list.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'table' ? (
        <>
          <VariantCell label={`${scenarioId} table status row`}>
            <Mantine.Table striped highlightOnHover>
              <Mantine.Table.Thead>
                <Mantine.Table.Tr>
                  <Mantine.Table.Th>Node</Mantine.Table.Th>
                  <Mantine.Table.Th>Status</Mantine.Table.Th>
                </Mantine.Table.Tr>
              </Mantine.Table.Thead>
              <Mantine.Table.Tbody>
                <Mantine.Table.Tr>
                  <Mantine.Table.Td>edge-proxy</Mantine.Table.Td>
                  <Mantine.Table.Td>Healthy</Mantine.Table.Td>
                </Mantine.Table.Tr>
              </Mantine.Table.Tbody>
            </Mantine.Table>
          </VariantCell>
          <VariantCell label={`${scenarioId} row note`}>
            <ul className="tinyrack-scenario-list">
              <li>Table status text should be readable per row.</li>
              <li>Rows need enough contrast for dense data.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'stepper' ? (
        <>
          <VariantCell label={`${scenarioId} step flow progress`}>
            <Mantine.Stepper active={1} className="tinyrack-demo-stepper">
              <Mantine.Stepper.Step label="Discover" description="Find nodes" />
              <Mantine.Stepper.Step label="Configure" description="Set routes" />
              <Mantine.Stepper.Step label="Verify" description="Check backups" />
            </Mantine.Stepper>
          </VariantCell>
          <VariantCell label={`${scenarioId} progress note`}>
            <ul className="tinyrack-scenario-list">
              <li>Stepper progress should make the active step clear.</li>
              <li>Flow labels should remain short at narrow widths.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function MantineTabsVariants() {
  return (
    <VariantMatrix
      description="Tabs variants, orientation, color, and radius choices for panel navigation."
      title="Mantine Tabs variants"
    >
      {(['default', 'outline', 'pills'] as const).map((variant) => (
        <VariantCell key={variant} label={variant}>
          <Mantine.Tabs
            className="tinyrack-demo-tabs"
            defaultValue="overview"
            variant={variant}
          >
            <Mantine.Tabs.List>
              <Mantine.Tabs.Tab value="overview">Overview</Mantine.Tabs.Tab>
              <Mantine.Tabs.Tab value="logs">Logs</Mantine.Tabs.Tab>
            </Mantine.Tabs.List>
            <Mantine.Tabs.Panel value="overview" pt="sm">
              {variant} rack panel
            </Mantine.Tabs.Panel>
          </Mantine.Tabs>
        </VariantCell>
      ))}
      <VariantCell label="vertical">
        <Mantine.Tabs
          className="tinyrack-demo-tabs"
          defaultValue="overview"
          orientation="vertical"
          variant="pills"
        >
          <Mantine.Tabs.List>
            <Mantine.Tabs.Tab value="overview">Overview</Mantine.Tabs.Tab>
            <Mantine.Tabs.Tab value="logs">Logs</Mantine.Tabs.Tab>
          </Mantine.Tabs.List>
          <Mantine.Tabs.Panel value="overview" pl="sm">
            Vertical panel
          </Mantine.Tabs.Panel>
        </Mantine.Tabs>
      </VariantCell>
      <VariantCell label="radius sm">
        <Mantine.Tabs
          className="tinyrack-demo-tabs"
          defaultValue="overview"
          radius="sm"
          variant="pills"
        >
          <Mantine.Tabs.List>
            <Mantine.Tabs.Tab value="overview">Overview</Mantine.Tabs.Tab>
            <Mantine.Tabs.Tab value="logs">Logs</Mantine.Tabs.Tab>
          </Mantine.Tabs.List>
          <Mantine.Tabs.Panel value="overview" pt="sm">
            Radius panel
          </Mantine.Tabs.Panel>
        </Mantine.Tabs>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineBadgeVariants() {
  return (
    <VariantMatrix
      description="Badge contrast across filled, light, outline, dot, and status colors."
      title="Mantine Badge variants"
    >
      {(['filled', 'light', 'outline', 'dot'] as const).map((variant) => (
        <VariantCell key={variant} label={variant}>
          <Mantine.Badge variant={variant}>Rack</Mantine.Badge>
        </VariantCell>
      ))}
      {(['green', 'yellow', 'red', 'violet'] as const).map((color) => (
        <VariantCell key={color} label={color}>
          <Mantine.Badge color={color}>Status</Mantine.Badge>
        </VariantCell>
      ))}
    </VariantMatrix>
  );
}

function MantineAlertVariants() {
  return (
    <VariantMatrix
      description="Status alert surfaces and outlines on the black-tone palette."
      title="Mantine Alert variants"
    >
      {(['tinyrack', 'green', 'yellow', 'red'] as const).map((color) => (
        <VariantCell key={color} label={color}>
          <Mantine.Alert color={color} title="Signal">
            Rack signal is readable.
          </Mantine.Alert>
        </VariantCell>
      ))}
      <VariantCell label="outline">
        <Mantine.Alert color="tinyrack" variant="outline" title="Outline">
          Border state stays visible.
        </Mantine.Alert>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineInputVariants() {
  return (
    <VariantMatrix
      description="Input sizes and validation states for dense admin and auth surfaces."
      title="Mantine Input variants"
    >
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <VariantCell key={size} label={`size ${size}`}>
          <Mantine.TextInput size={size} label="Host" defaultValue="rack.local" />
        </VariantCell>
      ))}
      <VariantCell label="error">
        <Mantine.TextInput label="Token secret" error="Required" defaultValue="" />
      </VariantCell>
      <VariantCell label="disabled">
        <Mantine.TextInput label="DHCP lease" disabled defaultValue="router managed" />
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineToggleVariants() {
  return (
    <VariantMatrix
      description="Checked, unchecked, disabled, and status colors for boolean controls."
      title="Mantine Control variants"
    >
      <VariantCell label="checkbox">
        <Mantine.Checkbox defaultChecked label="Restart approved" />
      </VariantCell>
      <VariantCell label="radio">
        <Mantine.Radio defaultChecked label="node-01" />
      </VariantCell>
      <VariantCell label="switch">
        <Mantine.Switch defaultChecked label="Guard restarts" />
      </VariantCell>
      <VariantCell label="disabled">
        <Mantine.Switch disabled label="Locked by policy" />
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineCardVariants() {
  return (
    <VariantMatrix
      description="Surface, border, shadow, and action density for content containers."
      title="Mantine Card variants"
    >
      {(['sm', 'md', 'lg'] as const).map((radius) => (
        <VariantCell key={radius} label={`radius ${radius}`}>
          <Mantine.Card radius={radius} withBorder p="md">
            <Mantine.Text fw={700}>node-01</Mantine.Text>
            <Mantine.Text size="sm" c="dimmed">
              Radius and border preview for a node card.
            </Mantine.Text>
          </Mantine.Card>
        </VariantCell>
      ))}
      <VariantCell label="elevated">
        <Mantine.Card shadow="md" p="md">
          <Mantine.Text fw={700}>Rack alert</Mantine.Text>
        </Mantine.Card>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineProgressVariants() {
  return (
    <VariantMatrix
      description="Progress density and status colors."
      title="Mantine Progress variants"
    >
      {(['tinyrack', 'green', 'yellow', 'red'] as const).map((color) => (
        <VariantCell key={color} label={color}>
          <Mantine.Progress color={color} value={66} w={180} />
        </VariantCell>
      ))}
      <VariantCell label="segmented">
        <Mantine.Progress.Root w={180}>
          <Mantine.Progress.Section color="tinyrack" value={45} />
          <Mantine.Progress.Section color="orange" value={20} />
          <Mantine.Progress.Section color="red" value={10} />
        </Mantine.Progress.Root>
      </VariantCell>
    </VariantMatrix>
  );
}

function MantineStepperVariants() {
  return (
    <VariantMatrix
      description="Stepper width, vertical rhythm, and compact label behavior on the Tinyrack dark surface."
      title="Mantine Stepper variants"
    >
      <VariantCell label="horizontal">
        <Mantine.Stepper active={1} className="tinyrack-demo-stepper">
          <Mantine.Stepper.Step label="Discover" description="Find nodes" />
          <Mantine.Stepper.Step label="Configure" description="Set routes" />
          <Mantine.Stepper.Step label="Verify" description="Check backups" />
        </Mantine.Stepper>
      </VariantCell>
      <VariantCell label="vertical">
        <Mantine.Stepper
          active={1}
          className="tinyrack-demo-stepper-vertical"
          orientation="vertical"
        >
          <Mantine.Stepper.Step label="Discover" description="Find nodes" />
          <Mantine.Stepper.Step label="Configure" description="Set routes" />
          <Mantine.Stepper.Step label="Verify" description="Check backups" />
        </Mantine.Stepper>
      </VariantCell>
      <VariantCell label="compact labels">
        <Mantine.Stepper active={2} size="sm" className="tinyrack-demo-stepper">
          <Mantine.Stepper.Step label="Nodes" />
          <Mantine.Stepper.Step label="Routes" />
          <Mantine.Stepper.Step label="Backup" />
        </Mantine.Stepper>
      </VariantCell>
    </VariantMatrix>
  );
}

function DaisyButtonVariants() {
  return (
    <VariantMatrix
      description="daisyUI button colors, ghost/outline treatments, sizes, and disabled states."
      title="daisyUI button variants"
    >
      {['primary', 'secondary', 'accent', 'neutral'].map((tone) => (
        <VariantCell key={tone} label={tone}>
          <button className={`btn btn-${tone}`} type="button">
            {tone}
          </button>
        </VariantCell>
      ))}
      {['outline', 'ghost', 'link'].map((variant) => (
        <VariantCell key={variant} label={variant}>
          <button className={`btn btn-${variant}`} type="button">
            {variant}
          </button>
        </VariantCell>
      ))}
      <VariantCell label="loading">
        <button className="btn btn-primary" type="button">
          <span className="loading loading-spinner" /> Loading
        </button>
      </VariantCell>
      <VariantCell label="disabled">
        <button className="btn" type="button" disabled>
          Disabled
        </button>
      </VariantCell>
    </VariantMatrix>
  );
}

function DaisyButtonScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const scenarioName = scenarioNames[scenarioId];

  return (
    <VariantMatrix
      description={`daisyUI button ${scenarioId} guidance for Tinyrack Tailwind surfaces.`}
      title={`daisyUI button ${scenarioName.toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states idle">
            <button className="btn btn-primary" type="button">
              Apply config
            </button>
          </VariantCell>
          <VariantCell label="states loading">
            <button className="btn btn-primary" type="button">
              <span className="loading loading-spinner" /> Applying
            </button>
          </VariantCell>
          <VariantCell label="states disabled">
            <button className="btn" type="button" disabled>
              Paused
            </button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition toolbar">
          <div className="join">
            <button className="btn btn-primary join-item" type="button">
              Add node
            </button>
            <button className="btn btn-outline join-item" type="button">
              Import config
            </button>
            <button className="btn btn-error join-item" type="button">
              Stop service
            </button>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens primary">
            <button className="btn btn-primary" type="button">
              Brand action
            </button>
          </VariantCell>
          <VariantCell label="tokens radius">
            <button className="btn btn-secondary rounded-box" type="button">
              Sharp action
            </button>
          </VariantCell>
          <VariantCell label="tokens density">
            <button className="btn btn-xs" type="button">
              Dense action
            </button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility label">
            <button
              aria-label="Apply rack configuration"
              className="btn btn-primary"
              type="button"
            >
              Apply
            </button>
          </VariantCell>
          <VariantCell label="accessibility disabled">
            <button className="btn" type="button" disabled>
              Paused action
            </button>
          </VariantCell>
          <VariantCell label="accessibility note">
            <ul className="tinyrack-scenario-list">
              <li>Button text should describe the rack action.</li>
              <li>Icon-only buttons need an accessible name.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground default">
            <button className="btn btn-primary" type="button">
              Apply config
            </button>
          </VariantCell>
          <VariantCell label="playground outline">
            <button className="btn btn-outline btn-lg" type="button">
              Open logs
            </button>
          </VariantCell>
          <VariantCell label="playground ghost">
            <button className="btn btn-ghost" type="button">
              View metrics
            </button>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function DaisyInputScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  return (
    <VariantMatrix
      description={`daisyUI input ${scenarioId} examples covering label, error, helper text, and form field tokens.`}
      title={`daisyUI input ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states input label">
            <label className="form-control w-full max-w-xs">
              <span className="label-text">Local domain</span>
              <input className="input input-bordered" defaultValue="rack.local" />
            </label>
          </VariantCell>
          <VariantCell label="states input error">
            <label className="form-control w-full max-w-xs">
              <span className="label-text">Route target</span>
              <input
                className="input input-error"
                aria-invalid="true"
                defaultValue=""
              />
              <span className="label-text-alt">Use a local hostname or LAN IP.</span>
            </label>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition input label">
          <div className="join">
            <input
              className="input input-bordered join-item"
              defaultValue="rack.local"
              aria-label="Local domain"
            />
            <button className="btn btn-primary join-item" type="button">
              Check DNS
            </button>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens input label">
            <input
              className="input input-primary input-sm"
              defaultValue="rack.local"
              aria-label="Token label"
            />
          </VariantCell>
          <VariantCell label="tokens input error">
            <input
              className="input input-error input-lg"
              defaultValue="bad route"
              aria-label="Error label"
            />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility input label">
            <label className="form-control w-full max-w-xs">
              <span className="label-text">Service label</span>
              <input
                className="input input-bordered"
                aria-describedby="daisy-input-help"
                placeholder="home-assistant"
              />
            </label>
          </VariantCell>
          <VariantCell label="accessibility input error">
            <ul className="tinyrack-scenario-list" id="daisy-input-help">
              <li>Every input needs a visible label.</li>
              <li>Error text should remain next to the input.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground input label">
            <input
              className="input input-bordered"
              defaultValue="rack.local"
              aria-label="Playground label"
            />
          </VariantCell>
          <VariantCell label="playground input error">
            <input
              className="input input-error"
              defaultValue="bad route"
              aria-label="Error label"
            />
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function DaisyAlertScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  return (
    <VariantMatrix
      description={`daisyUI alert ${scenarioId} examples for status messaging, alert severity, and accessible copy.`}
      title={`daisyUI alert ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states alert status">
            <div role="alert" className="alert alert-success">
              <span>Status alert: node-01 is healthy.</span>
            </div>
          </VariantCell>
          <VariantCell label="states alert warning">
            <div role="alert" className="alert alert-warning">
              <span>Status alert: certificate expires soon.</span>
            </div>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition alert status">
          <div className="alert alert-error">
            <span>Restart blocked until backup-sync finishes.</span>
            <button className="btn btn-sm" type="button">
              View logs
            </button>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens alert status">
            <div role="alert" className="alert alert-info">
              <span>Route update uses the info status token.</span>
            </div>
          </VariantCell>
          <VariantCell label="tokens alert error">
            <div role="alert" className="alert alert-error">
              <span>Backup failure uses the error status token.</span>
            </div>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility alert status">
            <div role="status" className="alert alert-info">
              <span>Background alert status update.</span>
            </div>
          </VariantCell>
          <VariantCell label="accessibility alert note">
            <ul className="tinyrack-scenario-list">
              <li>Alert status text should describe the result.</li>
              <li>Use role alert only for urgent changes.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground alert status">
            <div role="alert" className="alert alert-info">
              <span>reverse-proxy route updated.</span>
            </div>
          </VariantCell>
          <VariantCell label="playground alert warning">
            <div role="alert" className="alert alert-warning">
              <span>nas-01 storage is above threshold.</span>
            </div>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function DaisyBadgeScenario({
  scenarioId,
}: {
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  return (
    <VariantMatrix
      description={`daisyUI badge ${scenarioId} examples for compact status text, badge color, and size tokens.`}
      title={`daisyUI badge ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label="states badge status">
            <span className="badge badge-success">Healthy</span>
          </VariantCell>
          <VariantCell label="states badge warning">
            <span className="badge badge-warning">Updating</span>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition badge status">
          <div className="flex items-center gap-2">
            <span>reverse-proxy</span>
            <span className="badge badge-success">Healthy</span>
            <span className="badge badge-outline">edge-proxy</span>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens badge status">
            <span className="badge badge-primary">Rack status</span>
          </VariantCell>
          <VariantCell label="tokens badge size">
            <span className="badge badge-lg badge-outline">Backup due</span>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility badge status">
            <span className="badge badge-success">Healthy</span>
          </VariantCell>
          <VariantCell label="accessibility badge note">
            <ul className="tinyrack-scenario-list">
              <li>Badge status should not rely on color alone.</li>
              <li>Keep badge text short and descriptive.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground badge status">
            <span className="badge badge-info">node-01</span>
          </VariantCell>
          <VariantCell label="playground badge outline">
            <span className="badge badge-outline">LAN only</span>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function DaisyControlScenario({
  component,
  scenarioId,
}: {
  component: 'checkbox' | 'toggle' | 'radio';
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const inputType = component === 'radio' ? 'radio' : 'checkbox';
  const controlClass = component;

  return (
    <VariantMatrix
      description={`daisyUI ${component} ${scenarioId} examples covering checked state, label text, disabled behavior, and control tokens.`}
      title={`daisyUI ${component} ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label={`states ${component} label`}>
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type={inputType}
                name={`${component}-states`}
                className={`${controlClass} ${controlClass}-primary`}
                defaultChecked
              />
              <span className="label-text">Enable {component} guardrail</span>
            </label>
          </VariantCell>
          <VariantCell label={`states ${component} disabled`}>
            <label className="label cursor-pointer justify-start gap-3">
              <input type={inputType} className={controlClass} disabled />
              <span className="label-text">{component} locked by policy</span>
            </label>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label={`composition ${component} label`}>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type={inputType}
                name={`${component}-composition`}
                className={`${controlClass} ${controlClass}-primary`}
                defaultChecked
              />
              <span className="label-text">Enable {component} guardrail</span>
            </label>
            <span className="label-text-alt">
              Helper copy explains the rack guardrail.
            </span>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label={`tokens ${component} label`}>
            <input
              type={inputType}
              name={`${component}-tokens`}
              className={`${controlClass} ${controlClass}-primary`}
              aria-label={`${component} token label`}
            />
          </VariantCell>
          <VariantCell label={`tokens ${component} status`}>
            <input
              type={inputType}
              name={`${component}-status`}
              className={`${controlClass} ${controlClass}-success`}
              defaultChecked
              aria-label={`${component} status label`}
            />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label={`accessibility ${component} label`}>
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type={inputType}
                name={`${component}-accessibility`}
                className={controlClass}
                aria-describedby={`${component}-help`}
              />
              <span className="label-text">{component} visible guardrail</span>
            </label>
          </VariantCell>
          <VariantCell label={`accessibility ${component} help`}>
            <ul className="tinyrack-scenario-list" id={`${component}-help`}>
              <li>Use a visible label for every {component}.</li>
              <li>Keep disabled controls paired with explanatory text.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label={`playground ${component} label`}>
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type={inputType}
                name={`${component}-playground`}
                className={`${controlClass} ${controlClass}-primary`}
                defaultChecked
              />
              <span className="label-text">{component} playground guardrail</span>
            </label>
          </VariantCell>
          <VariantCell label={`playground ${component} off`}>
            <input
              type={inputType}
              name={`${component}-off`}
              className={controlClass}
              aria-label={`${component} unchecked label`}
            />
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function DaisyLayoutScenario({
  component,
  scenarioId,
}: {
  component: 'card' | 'modal' | 'tab' | 'table' | 'navbar' | 'dropdown' | 'steps';
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const scenarioName = scenarioNames[scenarioId];
  const copy: Record<typeof component, string> = {
    card: 'card surface action',
    modal: 'modal dialog confirm',
    tab: 'tabs panel navigation',
    table: 'table status row',
    navbar: 'navigation menu action',
    dropdown: 'navigation menu action',
    steps: 'step flow progress',
  };

  return (
    <VariantMatrix
      description={`daisyUI ${component} ${scenarioId} examples covering ${copy[component]}.`}
      title={`daisyUI ${component} ${scenarioName.toLowerCase()}`}
    >
      {component === 'card' ? (
        <>
          <VariantCell label={`${scenarioId} card surface`}>
            <div className="card bg-base-100 border border-base-300 shadow-sm w-72">
              <div className="card-body">
                <h3 className="card-title">node-01</h3>
                <p>CPU 34%, memory 61%, last backup 18 minutes ago.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm" type="button">
                    Open node
                  </button>
                </div>
              </div>
            </div>
          </VariantCell>
          <VariantCell label={`${scenarioId} action note`}>
            <ul className="tinyrack-scenario-list">
              <li>Card surface contrast should group related content.</li>
              <li>Card action placement should stay consistent.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'modal' ? (
        <>
          <VariantCell label={`${scenarioId} modal dialog`}>
            <div className="modal modal-open relative">
              <div className="modal-box">
                <h3 className="font-bold">Restart reverse-proxy</h3>
                <p>Local routing may pause while the service restarts.</p>
                <div className="modal-action">
                  <button className="btn btn-ghost btn-sm" type="button">
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" type="button">
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </VariantCell>
          <VariantCell label={`${scenarioId} confirm note`}>
            <ul className="tinyrack-scenario-list">
              <li>Modal dialog text should name the confirm action.</li>
              <li>Confirm buttons need adjacent cancel actions.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'tab' ? (
        <>
          <VariantCell label={`${scenarioId} tabs navigation`}>
            <div>
              <div role="tablist" className="tabs tabs-box">
                <button role="tab" className="tab tab-active" type="button">
                  Overview
                </button>
                <button role="tab" className="tab" type="button">
                  Logs
                </button>
              </div>
              <div className="bg-base-200 rounded-box p-3 mt-2">
                Node health and service drift for {scenarioId}.
              </div>
            </div>
          </VariantCell>
          <VariantCell label={`${scenarioId} panel note`}>
            <ul className="tinyrack-scenario-list">
              <li>Tabs navigation should identify the active panel.</li>
              <li>Panel content should stay close to tabs.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'table' ? (
        <>
          <VariantCell label={`${scenarioId} table status row`}>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Node</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>edge-proxy</td>
                    <td>Healthy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VariantCell>
          <VariantCell label={`${scenarioId} row note`}>
            <ul className="tinyrack-scenario-list">
              <li>Table status should be visible in each row.</li>
              <li>Rows need enough spacing for scanning.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'navbar' || component === 'dropdown' ? (
        <>
          <VariantCell label={`${scenarioId} navigation menu action`}>
            {component === 'navbar' ? (
              <div className="navbar bg-base-200 rounded-box">
                <div className="flex-1">
                  <a className="btn btn-ghost" href="#daisy-navbar-action">
                    Tinyrack
                  </a>
                </div>
                <div className="flex-none">
                  <button className="btn btn-primary btn-sm" type="button">
                    Apply config
                  </button>
                </div>
              </div>
            ) : (
              <div className="dropdown dropdown-open">
                <button className="btn btn-sm" type="button">
                  Node menu
                </button>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-48 p-2 shadow">
                  <li>
                    <a href="#daisy-dropdown-action">Open logs</a>
                  </li>
                </ul>
              </div>
            )}
          </VariantCell>
          <VariantCell label={`${scenarioId} action note`}>
            <ul className="tinyrack-scenario-list">
              <li>Navigation menu items should describe the action.</li>
              <li>Keep primary actions reachable from the menu.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {component === 'steps' ? (
        <>
          <VariantCell label={`${scenarioId} step flow progress`}>
            <ul className="steps tinyrack-demo-steps">
              <li className="step step-primary">Discover</li>
              <li className="step step-primary">Configure</li>
              <li className="step">Verify</li>
            </ul>
          </VariantCell>
          <VariantCell label={`${scenarioId} progress note`}>
            <ul className="tinyrack-scenario-list">
              <li>Steps should communicate flow progress.</li>
              <li>Step labels should stay short on narrow screens.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
    </VariantMatrix>
  );
}

function DaisyBadgeVariants() {
  return (
    <VariantMatrix
      description="Status and outline badge contrast across the Tinyrack palette."
      title="daisyUI badge variants"
    >
      {['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'].map(
        (tone) => (
          <VariantCell key={tone} label={tone}>
            <span className={`badge badge-${tone}`}>{tone}</span>
          </VariantCell>
        ),
      )}
      <VariantCell label="outline">
        <span className="badge badge-outline">outline</span>
      </VariantCell>
    </VariantMatrix>
  );
}

function DaisyAlertVariants() {
  return (
    <VariantMatrix
      description="Alert status colors and readable icon/text contrast."
      title="daisyUI alert variants"
    >
      {['info', 'success', 'warning', 'error'].map((tone) => (
        <VariantCell key={tone} label={tone}>
          <div role="alert" className={`alert alert-${tone}`}>
            <span>{tone} signal</span>
          </div>
        </VariantCell>
      ))}
    </VariantMatrix>
  );
}

function DaisyInputVariants() {
  return (
    <VariantMatrix
      description="Form field sizes, borders, and validation colors."
      title="daisyUI input variants"
    >
      {['xs', 'sm', 'md', 'lg'].map((size) => (
        <VariantCell key={size} label={`size ${size}`}>
          <input
            className={`input input-bordered input-${size}`}
            defaultValue="tinyrack"
          />
        </VariantCell>
      ))}
      <VariantCell label="primary">
        <input className="input input-primary" defaultValue="auth.tinyrack.net" />
      </VariantCell>
      <VariantCell label="error">
        <input className="input input-error" defaultValue="invalid" />
      </VariantCell>
    </VariantMatrix>
  );
}

function DaisyToggleVariants() {
  return (
    <VariantMatrix
      description="Boolean controls in checked, status, and disabled states."
      title="daisyUI control variants"
    >
      <VariantCell label="checkbox">
        <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
      </VariantCell>
      <VariantCell label="radio">
        <input type="radio" className="radio radio-primary" defaultChecked />
      </VariantCell>
      <VariantCell label="toggle">
        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
      </VariantCell>
      <VariantCell label="disabled">
        <input type="checkbox" className="toggle" disabled />
      </VariantCell>
    </VariantMatrix>
  );
}

function DaisyCardVariants() {
  return (
    <VariantMatrix
      description="Card surface, border, shadow, and action styles."
      title="daisyUI card variants"
    >
      <VariantCell label="base">
        <div className="card bg-base-100 border border-base-300 w-56">
          <div className="card-body">
            <h3 className="card-title">Base</h3>
            <p>Bordered rack panel</p>
          </div>
        </div>
      </VariantCell>
      <VariantCell label="compact">
        <div className="card card-compact bg-base-200 w-56 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Compact</h3>
            <p>Dense surface</p>
          </div>
        </div>
      </VariantCell>
      <VariantCell label="actions">
        <div className="card bg-base-100 w-56 shadow-md">
          <div className="card-body">
            <h3 className="card-title">Actions</h3>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm" type="button">
                Open
              </button>
            </div>
          </div>
        </div>
      </VariantCell>
    </VariantMatrix>
  );
}

function DaisyProgressVariants() {
  return (
    <VariantMatrix
      description="Progress and loading indicators in status colors."
      title="daisyUI progress variants"
    >
      {['primary', 'secondary', 'accent', 'success', 'warning', 'error'].map((tone) => (
        <VariantCell key={tone} label={tone}>
          <progress className={`progress progress-${tone} w-48`} value="66" max="100" />
        </VariantCell>
      ))}
      <VariantCell label="loading">
        <span className="loading loading-spinner loading-md" />
      </VariantCell>
    </VariantMatrix>
  );
}

function renderMantineVariants(entry: ShowcaseEntry): ReactElement | undefined {
  switch (entry.id) {
    case 'mantine-actionicon':
      return <MantineActionIconVariants />;
    case 'mantine-button':
      return <MantineButtonVariants />;
    case 'mantine-alert':
      return <MantineAlertVariants />;
    case 'mantine-avatar':
    case 'mantine-badge':
    case 'mantine-themeicon':
      return <MantineBadgeVariants />;
    case 'mantine-card':
    case 'mantine-paper':
      return <MantineCardVariants />;
    case 'mantine-checkbox':
    case 'mantine-radio':
    case 'mantine-switch':
    case 'mantine-chip':
      return <MantineToggleVariants />;
    case 'mantine-input':
    case 'mantine-autocomplete':
    case 'mantine-colorinput':
    case 'mantine-jsoninput':
    case 'mantine-multiselect':
    case 'mantine-nativeselect':
    case 'mantine-numberinput':
    case 'mantine-passwordinput':
    case 'mantine-pininput':
    case 'mantine-select':
    case 'mantine-tagsinput':
    case 'mantine-textarea':
    case 'mantine-textinput':
      return <MantineInputVariants />;
    case 'mantine-progress':
    case 'mantine-ringprogress':
    case 'mantine-semicircleprogress':
      return <MantineProgressVariants />;
    case 'mantine-stepper':
      return <MantineStepperVariants />;
    case 'mantine-tabs':
      return <MantineTabsVariants />;
    default:
      return undefined;
  }
}

function renderDaisyUiVariants(entry: ShowcaseEntry): ReactElement | undefined {
  switch (entry.id) {
    case 'daisyui-button':
      return <DaisyButtonVariants />;
    case 'daisyui-alert':
      return <DaisyAlertVariants />;
    case 'daisyui-badge':
    case 'daisyui-status':
      return <DaisyBadgeVariants />;
    case 'daisyui-card':
      return <DaisyCardVariants />;
    case 'daisyui-checkbox':
    case 'daisyui-radio':
    case 'daisyui-toggle':
    case 'daisyui-swap':
    case 'daisyui-rating':
      return <DaisyToggleVariants />;
    case 'daisyui-fileinput':
    case 'daisyui-input':
    case 'daisyui-range':
    case 'daisyui-select':
    case 'daisyui-textarea':
    case 'daisyui-validator':
      return <DaisyInputVariants />;
    case 'daisyui-loading':
    case 'daisyui-progress':
    case 'daisyui-radialprogress':
      return <DaisyProgressVariants />;
    default:
      return undefined;
  }
}

function renderMantineScenario(
  entry: ShowcaseEntry,
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>,
): ReactElement | undefined {
  switch (entry.id) {
    case 'mantine-button':
      return <MantineButtonScenario scenarioId={scenarioId} />;
    case 'mantine-input':
    case 'mantine-textinput':
      return <MantineInputScenario scenarioId={scenarioId} />;
    case 'mantine-alert':
      return <MantineAlertScenario scenarioId={scenarioId} />;
    case 'mantine-badge':
      return <MantineBadgeScenario scenarioId={scenarioId} />;
    case 'mantine-checkbox':
      return <MantineControlScenario component="checkbox" scenarioId={scenarioId} />;
    case 'mantine-radio':
      return <MantineControlScenario component="radio" scenarioId={scenarioId} />;
    case 'mantine-switch':
      return <MantineControlScenario component="switch" scenarioId={scenarioId} />;
    case 'mantine-card':
      return <MantineLayoutScenario component="card" scenarioId={scenarioId} />;
    case 'mantine-modal':
      return <MantineLayoutScenario component="modal" scenarioId={scenarioId} />;
    case 'mantine-tabs':
      return <MantineLayoutScenario component="tabs" scenarioId={scenarioId} />;
    case 'mantine-table':
      return <MantineLayoutScenario component="table" scenarioId={scenarioId} />;
    case 'mantine-stepper':
      return <MantineLayoutScenario component="stepper" scenarioId={scenarioId} />;
    default:
      return undefined;
  }
}

function renderDaisyUiScenario(
  entry: ShowcaseEntry,
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>,
): ReactElement | undefined {
  switch (entry.id) {
    case 'daisyui-button':
      return <DaisyButtonScenario scenarioId={scenarioId} />;
    case 'daisyui-input':
      return <DaisyInputScenario scenarioId={scenarioId} />;
    case 'daisyui-alert':
      return <DaisyAlertScenario scenarioId={scenarioId} />;
    case 'daisyui-badge':
      return <DaisyBadgeScenario scenarioId={scenarioId} />;
    case 'daisyui-checkbox':
      return <DaisyControlScenario component="checkbox" scenarioId={scenarioId} />;
    case 'daisyui-toggle':
      return <DaisyControlScenario component="toggle" scenarioId={scenarioId} />;
    case 'daisyui-radio':
      return <DaisyControlScenario component="radio" scenarioId={scenarioId} />;
    case 'daisyui-card':
      return <DaisyLayoutScenario component="card" scenarioId={scenarioId} />;
    case 'daisyui-modal':
      return <DaisyLayoutScenario component="modal" scenarioId={scenarioId} />;
    case 'daisyui-tab':
      return <DaisyLayoutScenario component="tab" scenarioId={scenarioId} />;
    case 'daisyui-table':
      return <DaisyLayoutScenario component="table" scenarioId={scenarioId} />;
    case 'daisyui-navbar':
      return <DaisyLayoutScenario component="navbar" scenarioId={scenarioId} />;
    case 'daisyui-dropdown':
      return <DaisyLayoutScenario component="dropdown" scenarioId={scenarioId} />;
    case 'daisyui-steps':
      return <DaisyLayoutScenario component="steps" scenarioId={scenarioId} />;
    default:
      return undefined;
  }
}

function getEntryStoryKinds(entry: ShowcaseEntry): ShowcaseStoryKind[] {
  const requestedKinds = entry.storyKinds?.filter((storyKind) =>
    storyKinds.includes(storyKind),
  );

  if (requestedKinds?.length) {
    return requestedKinds.includes('default')
      ? requestedKinds
      : ['default', ...requestedKinds];
  }

  return ['default'];
}

function normalizeStoryKind(storyKind?: ShowcaseScenarioId): ShowcaseStoryKind {
  if (storyKind === 'preview') {
    return 'default';
  }

  if (storyKind && storyKinds.includes(storyKind as ShowcaseStoryKind)) {
    return storyKind as ShowcaseStoryKind;
  }

  return 'default';
}

function renderStoryKind({
  controlValues,
  entry,
  library,
  storyKind,
}: {
  controlValues?: ShowcaseControlValues | undefined;
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  storyKind: ShowcaseStoryKind;
}): ReactElement {
  if (storyKind === 'default') {
    return entry.render(controlValues);
  }

  if (storyKind === 'variants') {
    return (
      (library === 'mantine'
        ? renderMantineVariants(entry)
        : renderDaisyUiVariants(entry)) ?? (
        <GenericVariants entry={entry} library={library} />
      )
    );
  }

  if (storyKind === 'states') {
    return (
      (library === 'mantine'
        ? renderMantineScenario(entry, 'states')
        : renderDaisyUiScenario(entry, 'states')) ?? (
        <GenericStates entry={entry} library={library} />
      )
    );
  }

  if (storyKind === 'sizes') {
    return <GenericVariants entry={entry} library={library} />;
  }

  if (storyKind === 'examples') {
    return (
      (library === 'mantine'
        ? renderMantineScenario(entry, 'examples')
        : renderDaisyUiScenario(entry, 'examples')) ?? (
        <GenericStates entry={entry} library={library} />
      )
    );
  }

  return <GenericStates entry={entry} library={library} />;
}

export function getShowcaseStories({
  entry,
  library,
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
}): ShowcaseStoryDefinition[] {
  return getEntryStoryKinds(entry).map((storyKind) => ({
    id: storyKind,
    exportName: storyKind === 'default' ? 'Default' : storyNames[storyKind],
    name: storyNames[storyKind],
    description:
      storyKind === 'default'
        ? entry.description
        : `${entry.name} ${storyNames[storyKind].toLowerCase()} story for theme review`,
    render: (controlValues) =>
      renderStoryKind({ controlValues, entry, library, storyKind }),
  }));
}

export function getShowcaseStory({
  entry,
  library,
  storyKind = 'default',
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  storyKind?: ShowcaseStoryKind | ShowcaseScenarioId | undefined;
}): ShowcaseStoryDefinition {
  const resolvedStoryKind = normalizeStoryKind(storyKind);
  const stories = getShowcaseStories({ entry, library });
  const resolvedStory =
    stories.find((story) => story.id === resolvedStoryKind) ??
    stories.find((story) => story.id === 'default');

  if (resolvedStory) {
    return resolvedStory;
  }

  const fallbackStory = getShowcaseStories({
    entry: { ...entry, storyKinds: ['default'] },
    library,
  })[0];

  if (!fallbackStory) {
    throw new Error(`Missing default showcase story for ${entry.id}`);
  }

  return fallbackStory;
}

/** @deprecated Use getShowcaseStories instead. */
export function getShowcaseScenarioIds(entry: ShowcaseEntry): ShowcaseStoryKind[] {
  return getEntryStoryKinds(entry);
}

/** @deprecated Use getShowcaseStory instead. */
export function getShowcaseScenario({
  entry,
  library,
  scenarioId = 'default',
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId?: ShowcaseScenarioId;
}): ShowcaseScenario {
  return getShowcaseStory({ entry, library, storyKind: scenarioId });
}
