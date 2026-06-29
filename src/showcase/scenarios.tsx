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
  if (entry.id === 'mantine-button') {
    return <MantineButtonScenario scenarioId={scenarioId} />;
  }

  return undefined;
}

function renderDaisyUiScenario(
  entry: ShowcaseEntry,
  scenarioId: Exclude<ShowcaseScenarioId, 'preview' | 'variants'>,
): ReactElement | undefined {
  if (entry.id === 'daisyui-button') {
    return <DaisyButtonScenario scenarioId={scenarioId} />;
  }

  return undefined;
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
