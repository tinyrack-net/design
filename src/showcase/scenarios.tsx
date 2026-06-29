import * as Mantine from '@mantine/core';
import type { ReactElement, ReactNode } from 'react';
import type {
  ShowcaseEntry,
  ShowcaseLibrary,
  ShowcaseScenario,
  ShowcaseScenarioId,
} from './types.js';

const scenarioIds: ShowcaseScenarioId[] = [
  'preview',
  'variants',
  'states',
  'composition',
  'tokens',
  'accessibility',
  'playground',
];

const scenarioNames: Record<ShowcaseScenarioId, string> = {
  preview: 'Preview',
  variants: 'Variants',
  states: 'States',
  composition: 'Composition',
  tokens: 'Tokens',
  accessibility: 'Accessibility',
  playground: 'Playground',
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

function GenericScenario({
  entry,
  library,
  scenarioId,
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const libraryName = library === 'mantine' ? 'Mantine' : 'daisyUI';
  const scenarioName = scenarioNames[scenarioId];

  return (
    <VariantMatrix
      description={`${scenarioName} fallback documentation for ${libraryName} ${entry.name}. The live component stays visible while reviewing theme coverage.`}
      title={`${libraryName} ${entry.name} ${scenarioName.toLowerCase()}`}
    >
      <VariantCell label={`${scenarioName} overview`}>
        <div className="tinyrack-scenario-note">
          <strong>{scenarioName}</strong>
          <p>{entry.description}</p>
        </div>
      </VariantCell>
      <VariantCell label="Live example">{entry.render()}</VariantCell>
      <VariantCell label="Review checklist">
        <ul className="tinyrack-scenario-list">
          <li>Confirm spacing, color, and typography tokens.</li>
          <li>Check empty, dense, and overflow-prone content.</li>
          <li>Review keyboard, label, and contrast expectations.</li>
        </ul>
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
          <Mantine.Button size={size}>Deploy</Mantine.Button>
        </VariantCell>
      ))}
      <VariantCell label="disabled">
        <Mantine.Button disabled>Disabled</Mantine.Button>
      </VariantCell>
      <VariantCell label="loading">
        <Mantine.Button loading>Loading</Mantine.Button>
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
            <Mantine.Button>Save changes</Mantine.Button>
          </VariantCell>
          <VariantCell label="states loading">
            <Mantine.Button loading>Deploying</Mantine.Button>
          </VariantCell>
          <VariantCell label="states disabled">
            <Mantine.Button disabled>Unavailable</Mantine.Button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition toolbar">
          <Mantine.Group>
            <Mantine.Button variant="filled">Create rack</Mantine.Button>
            <Mantine.Button variant="outline">Import</Mantine.Button>
            <Mantine.Button variant="subtle" color="red">
              Delete
            </Mantine.Button>
          </Mantine.Group>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens primary">
            <Mantine.Button color="tinyrack">Primary token</Mantine.Button>
          </VariantCell>
          <VariantCell label="tokens radius">
            <Mantine.Button radius="xl">Radius token</Mantine.Button>
          </VariantCell>
          <VariantCell label="tokens density">
            <Mantine.Button size="xs">Compact token</Mantine.Button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility label">
            <Mantine.Button aria-label="Create deployment">Create</Mantine.Button>
          </VariantCell>
          <VariantCell label="accessibility disabled">
            <Mantine.Button disabled>Disabled button</Mantine.Button>
          </VariantCell>
          <VariantCell label="accessibility note">
            <ul className="tinyrack-scenario-list">
              <li>Button text should describe the action.</li>
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
            <Mantine.Button>Button playground</Mantine.Button>
          </VariantCell>
          <VariantCell label="playground outline">
            <Mantine.Button variant="outline" size="lg">
              Large outline
            </Mantine.Button>
          </VariantCell>
          <VariantCell label="playground subtle">
            <Mantine.Button variant="subtle" color="gray">
              Subtle button
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
            <Mantine.TextInput label="Service URL" defaultValue="api.tinyrack.net" />
          </VariantCell>
          <VariantCell label="states input error">
            <Mantine.TextInput label="Secret key" error="Error: key is required" />
          </VariantCell>
          <VariantCell label="states disabled label">
            <Mantine.TextInput label="Workspace" disabled defaultValue="Production" />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition input label">
          <Mantine.Stack gap="xs">
            <Mantine.TextInput label="Domain" defaultValue="app.tinyrack.net" />
            <Mantine.Group justify="space-between">
              <Mantine.Text size="xs" c="dimmed">
                Label and error copy sit near the input.
              </Mantine.Text>
              <Mantine.Button size="xs">Validate</Mantine.Button>
            </Mantine.Group>
          </Mantine.Stack>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens input label">
            <Mantine.TextInput size="xs" radius="xl" label="Compact token" />
          </VariantCell>
          <VariantCell label="tokens input error">
            <Mantine.TextInput color="red" label="Error token" error="Invalid value" />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility input label">
            <Mantine.TextInput
              aria-describedby="mantine-input-help"
              description="Use a visible label before placeholder text."
              label="Deployment label"
              placeholder="Input placeholder"
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
            <Mantine.TextInput label="Input playground" defaultValue="tinyrack" />
          </VariantCell>
          <VariantCell label="playground input error">
            <Mantine.Input.Wrapper label="Raw input label" error="Error message">
              <Mantine.Input placeholder="Raw Mantine input" />
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
            <Mantine.Alert color="red" title="Deploy blocked">
              Status alert explains the failing check before actions.
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
            <Mantine.Alert color="blue" title="Info status">
              Alert playground copy for review.
            </Mantine.Alert>
          </VariantCell>
          <VariantCell label="playground alert error">
            <Mantine.Alert color="red" title="Error status">
              Alert error tone for comparison.
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
            <Mantine.Badge color="green">Status live</Mantine.Badge>
          </VariantCell>
          <VariantCell label="states badge warning">
            <Mantine.Badge color="yellow">Status pending</Mantine.Badge>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition badge status">
          <Mantine.Group>
            <Mantine.Text>Auth service</Mantine.Text>
            <Mantine.Badge color="green">Status healthy</Mantine.Badge>
            <Mantine.Badge variant="outline">Badge beta</Mantine.Badge>
          </Mantine.Group>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens badge status">
            <Mantine.Badge color="tinyrack" radius="xl">
              Brand status
            </Mantine.Badge>
          </VariantCell>
          <VariantCell label="tokens badge size">
            <Mantine.Badge size="lg" variant="dot">
              Large badge
            </Mantine.Badge>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility badge status">
            <Mantine.Badge aria-label="Deployment status: live">
              Status live
            </Mantine.Badge>
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
            <Mantine.Badge>Status playground</Mantine.Badge>
          </VariantCell>
          <VariantCell label="playground badge outline">
            <Mantine.Badge variant="outline">Outline badge</Mantine.Badge>
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
  component: 'checkbox' | 'switch';
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>;
}) {
  const Control = component === 'checkbox' ? Mantine.Checkbox : Mantine.Switch;

  return (
    <VariantMatrix
      description={`Mantine ${component} ${scenarioId} examples covering checked state, label text, disabled behavior, and form control tokens.`}
      title={`Mantine ${component} ${scenarioNames[scenarioId].toLowerCase()}`}
    >
      {scenarioId === 'states' ? (
        <>
          <VariantCell label={`states ${component} label`}>
            <Control defaultChecked label={`${component} label enabled`} />
          </VariantCell>
          <VariantCell label={`states ${component} disabled`}>
            <Control disabled label={`${component} label disabled`} />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label={`composition ${component} label`}>
          <Mantine.Stack gap="xs">
            <Control defaultChecked label={`Enable ${component} label`} />
            <Mantine.Text size="xs" c="dimmed">
              Label copy explains the control before saving preferences.
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
          <Mantine.TextInput
            size={size}
            label="Host"
            defaultValue="auth.tinyrack.net"
          />
        </VariantCell>
      ))}
      <VariantCell label="error">
        <Mantine.TextInput label="Secret" error="Required" defaultValue="" />
      </VariantCell>
      <VariantCell label="disabled">
        <Mantine.TextInput label="Read only" disabled defaultValue="config user" />
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
        <Mantine.Checkbox defaultChecked label="Enabled" />
      </VariantCell>
      <VariantCell label="radio">
        <Mantine.Radio defaultChecked label="Primary" />
      </VariantCell>
      <VariantCell label="switch">
        <Mantine.Switch defaultChecked label="Online" />
      </VariantCell>
      <VariantCell label="disabled">
        <Mantine.Switch disabled label="Locked" />
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
            <Mantine.Text fw={700}>Rack panel</Mantine.Text>
            <Mantine.Text size="sm" c="dimmed">
              Radius and border preview
            </Mantine.Text>
          </Mantine.Card>
        </VariantCell>
      ))}
      <VariantCell label="elevated">
        <Mantine.Card shadow="md" p="md">
          <Mantine.Text fw={700}>Elevated</Mantine.Text>
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
          <Mantine.Stepper.Step label="Profile" description="Create account" />
          <Mantine.Stepper.Step label="Workspace" description="Configure rack" />
          <Mantine.Stepper.Step label="Deploy" description="Launch service" />
        </Mantine.Stepper>
      </VariantCell>
      <VariantCell label="vertical">
        <Mantine.Stepper
          active={1}
          className="tinyrack-demo-stepper-vertical"
          orientation="vertical"
        >
          <Mantine.Stepper.Step label="Profile" description="Create account" />
          <Mantine.Stepper.Step label="Workspace" description="Configure rack" />
          <Mantine.Stepper.Step label="Deploy" description="Launch service" />
        </Mantine.Stepper>
      </VariantCell>
      <VariantCell label="compact labels">
        <Mantine.Stepper active={2} size="sm" className="tinyrack-demo-stepper">
          <Mantine.Stepper.Step label="Auth" />
          <Mantine.Stepper.Step label="Theme" />
          <Mantine.Stepper.Step label="Ship" />
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
              Save changes
            </button>
          </VariantCell>
          <VariantCell label="states loading">
            <button className="btn btn-primary" type="button">
              <span className="loading loading-spinner" /> Deploying
            </button>
          </VariantCell>
          <VariantCell label="states disabled">
            <button className="btn" type="button" disabled>
              Unavailable
            </button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition toolbar">
          <div className="join">
            <button className="btn btn-primary join-item" type="button">
              Create rack
            </button>
            <button className="btn btn-outline join-item" type="button">
              Import
            </button>
            <button className="btn btn-error join-item" type="button">
              Delete
            </button>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens primary">
            <button className="btn btn-primary" type="button">
              Primary token
            </button>
          </VariantCell>
          <VariantCell label="tokens radius">
            <button className="btn btn-secondary rounded-full" type="button">
              Radius token
            </button>
          </VariantCell>
          <VariantCell label="tokens density">
            <button className="btn btn-xs" type="button">
              Compact token
            </button>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility label">
            <button
              aria-label="Create deployment"
              className="btn btn-primary"
              type="button"
            >
              Create
            </button>
          </VariantCell>
          <VariantCell label="accessibility disabled">
            <button className="btn" type="button" disabled>
              Disabled button
            </button>
          </VariantCell>
          <VariantCell label="accessibility note">
            <ul className="tinyrack-scenario-list">
              <li>Button text should describe the action.</li>
              <li>Icon-only buttons need an accessible name.</li>
            </ul>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'playground' ? (
        <>
          <VariantCell label="playground default">
            <button className="btn btn-primary" type="button">
              Button playground
            </button>
          </VariantCell>
          <VariantCell label="playground outline">
            <button className="btn btn-outline btn-lg" type="button">
              Large outline
            </button>
          </VariantCell>
          <VariantCell label="playground ghost">
            <button className="btn btn-ghost" type="button">
              Ghost button
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
              <span className="label-text">Service label</span>
              <input className="input input-bordered" defaultValue="api.tinyrack.net" />
            </label>
          </VariantCell>
          <VariantCell label="states input error">
            <label className="form-control w-full max-w-xs">
              <span className="label-text">Secret label</span>
              <input
                className="input input-error"
                aria-invalid="true"
                defaultValue=""
              />
              <span className="label-text-alt">Error: value is required</span>
            </label>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition input label">
          <div className="join">
            <input
              className="input input-bordered join-item"
              defaultValue="tinyrack"
              aria-label="Input label"
            />
            <button className="btn btn-primary join-item" type="button">
              Validate
            </button>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens input label">
            <input
              className="input input-primary input-sm"
              defaultValue="Primary input"
              aria-label="Token label"
            />
          </VariantCell>
          <VariantCell label="tokens input error">
            <input
              className="input input-error input-lg"
              defaultValue="Error input"
              aria-label="Error label"
            />
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility input label">
            <label className="form-control w-full max-w-xs">
              <span className="label-text">Deployment label</span>
              <input
                className="input input-bordered"
                aria-describedby="daisy-input-help"
                placeholder="Input placeholder"
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
              defaultValue="Input playground"
              aria-label="Playground label"
            />
          </VariantCell>
          <VariantCell label="playground input error">
            <input
              className="input input-error"
              defaultValue="Invalid input"
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
              <span>Status alert: deployment succeeded.</span>
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
            <span>Alert status blocks deploy until checks pass.</span>
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
              <span>Info alert status token.</span>
            </div>
          </VariantCell>
          <VariantCell label="tokens alert error">
            <div role="alert" className="alert alert-error">
              <span>Error alert status token.</span>
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
              <span>Alert playground status.</span>
            </div>
          </VariantCell>
          <VariantCell label="playground alert warning">
            <div role="alert" className="alert alert-warning">
              <span>Warning alert status.</span>
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
            <span className="badge badge-success">Status live</span>
          </VariantCell>
          <VariantCell label="states badge warning">
            <span className="badge badge-warning">Status pending</span>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'composition' ? (
        <VariantCell label="composition badge status">
          <div className="flex items-center gap-2">
            <span>Auth service</span>
            <span className="badge badge-success">Status healthy</span>
            <span className="badge badge-outline">Badge beta</span>
          </div>
        </VariantCell>
      ) : null}
      {scenarioId === 'tokens' ? (
        <>
          <VariantCell label="tokens badge status">
            <span className="badge badge-primary">Brand status</span>
          </VariantCell>
          <VariantCell label="tokens badge size">
            <span className="badge badge-lg badge-outline">Large badge</span>
          </VariantCell>
        </>
      ) : null}
      {scenarioId === 'accessibility' ? (
        <>
          <VariantCell label="accessibility badge status">
            <span className="badge badge-success">Status live</span>
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
            <span className="badge badge-info">Status playground</span>
          </VariantCell>
          <VariantCell label="playground badge outline">
            <span className="badge badge-outline">Outline badge</span>
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
              <span className="label-text">{component} label enabled</span>
            </label>
          </VariantCell>
          <VariantCell label={`states ${component} disabled`}>
            <label className="label cursor-pointer justify-start gap-3">
              <input type={inputType} className={controlClass} disabled />
              <span className="label-text">{component} label disabled</span>
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
              <span className="label-text">Enable {component} label</span>
            </label>
            <span className="label-text-alt">Label copy explains the control.</span>
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
              <span className="label-text">{component} visible label</span>
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
              <span className="label-text">{component} playground label</span>
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
    case 'mantine-switch':
      return <MantineControlScenario component="switch" scenarioId={scenarioId} />;
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
    default:
      return undefined;
  }
}

export function getShowcaseScenarioIds(_entry: ShowcaseEntry): ShowcaseScenarioId[] {
  return scenarioIds;
}

export function getShowcaseScenario({
  entry,
  library,
  scenarioId = 'preview',
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId?: ShowcaseScenarioId;
}): ShowcaseScenario {
  const resolvedScenarioId = scenarioIds.includes(scenarioId) ? scenarioId : 'preview';

  if (resolvedScenarioId === 'preview') {
    return {
      id: 'preview',
      name: 'Preview',
      description: entry.description,
      render: entry.render,
    };
  }

  if (resolvedScenarioId === 'variants') {
    return {
      id: 'variants',
      name: 'Variants',
      description: `${entry.name} scenario matrix for theme review`,
      render: () =>
        (library === 'mantine'
          ? renderMantineVariants(entry)
          : renderDaisyUiVariants(entry)) ?? (
          <GenericVariants entry={entry} library={library} />
        ),
    };
  }

  return {
    id: resolvedScenarioId,
    name: scenarioNames[resolvedScenarioId],
    description: `${entry.name} ${scenarioNames[resolvedScenarioId].toLowerCase()} scenario for design-system review`,
    render: () =>
      (library === 'mantine'
        ? renderMantineScenario(entry, resolvedScenarioId)
        : renderDaisyUiScenario(entry, resolvedScenarioId)) ?? (
        <GenericScenario
          entry={entry}
          library={library}
          scenarioId={resolvedScenarioId}
        />
      ),
  };
}
