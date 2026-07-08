import '@mantine/core/styles.css';
import '../../tests/fixtures/tailwind-daisyui-fixture.css';
import './mantine/styles.css';
import {
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Fieldset,
  FileInput,
  Indicator,
  Kbd,
  List,
  Loader,
  Menu,
  Modal,
  NativeSelect,
  Progress,
  Radio,
  Rating,
  RingProgress,
  Skeleton,
  Slider,
  Stepper,
  Switch,
  Table,
  Tabs,
  Textarea,
  TextInput,
  Timeline,
  Tooltip,
} from '@mantine/core';
import type { CSSProperties } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TinyrackMantineProvider } from '../exports/mantine.js';
import {
  type TinyrackControlSize,
  tinyrackControlSizeNames,
} from '../exports/tokens.js';

const themeDatasetKey = 'theme';

const daisyButtonSizeClasses = {
  xs: 'btn btn-primary btn-xs',
  sm: 'btn btn-primary btn-sm',
  md: 'btn btn-primary btn-md',
  lg: 'btn btn-primary btn-lg',
  xl: 'btn btn-primary btn-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyBadgeSizeClasses = {
  xs: 'badge badge-primary badge-xs',
  sm: 'badge badge-primary badge-sm',
  md: 'badge badge-primary badge-md',
  lg: 'badge badge-primary badge-lg',
  xl: 'badge badge-primary badge-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyAvatarSizeClasses = {
  xs: 'avatar avatar-placeholder avatar-xs',
  sm: 'avatar avatar-placeholder avatar-sm',
  md: 'avatar avatar-placeholder avatar-md',
  lg: 'avatar avatar-placeholder avatar-lg',
  xl: 'avatar avatar-placeholder avatar-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyIndicatorSizeClasses = {
  xs: 'indicator indicator-xs',
  sm: 'indicator indicator-sm',
  md: 'indicator indicator-md',
  lg: 'indicator indicator-lg',
  xl: 'indicator indicator-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyKbdSizeClasses = {
  xs: 'kbd kbd-xs',
  sm: 'kbd kbd-sm',
  md: 'kbd kbd-md',
  lg: 'kbd kbd-lg',
  xl: 'kbd kbd-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyLoaderSizeClasses = {
  xs: 'loading loading-spinner loading-xs',
  sm: 'loading loading-spinner loading-sm',
  md: 'loading loading-spinner loading-md',
  lg: 'loading loading-spinner loading-lg',
  xl: 'loading loading-spinner loading-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyRatingSizeClasses = {
  xs: 'rating rating-xs',
  sm: 'rating rating-sm',
  md: 'rating rating-md',
  lg: 'rating rating-lg',
  xl: 'rating rating-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisySelectionControlSizeClasses = {
  checkbox: {
    xs: 'checkbox checkbox-primary checkbox-xs',
    sm: 'checkbox checkbox-primary checkbox-sm',
    md: 'checkbox checkbox-primary checkbox-md',
    lg: 'checkbox checkbox-primary checkbox-lg',
    xl: 'checkbox checkbox-primary checkbox-xl',
  },
  radio: {
    xs: 'radio radio-primary radio-xs',
    sm: 'radio radio-primary radio-sm',
    md: 'radio radio-primary radio-md',
    lg: 'radio radio-primary radio-lg',
    xl: 'radio radio-primary radio-xl',
  },
} as const satisfies Record<string, Record<TinyrackControlSize, string>>;

const daisySwitchSizeClasses = {
  xs: 'toggle toggle-xs',
  sm: 'toggle toggle-sm',
  md: 'toggle toggle-md',
  lg: 'toggle toggle-lg',
  xl: 'toggle toggle-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyProgressSizeClasses = {
  xs: 'progress progress-primary progress-xs',
  sm: 'progress progress-primary progress-sm',
  md: 'progress progress-primary progress-md',
  lg: 'progress progress-primary progress-lg',
  xl: 'progress progress-primary progress-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyRadialProgressSizeClasses = {
  xs: 'radial-progress radial-progress-xs',
  sm: 'radial-progress radial-progress-sm',
  md: 'radial-progress radial-progress-md',
  lg: 'radial-progress radial-progress-lg',
  xl: 'radial-progress radial-progress-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyTableSizeClasses = {
  xs: 'table table-xs',
  sm: 'table table-sm',
  md: 'table table-md',
  lg: 'table table-lg',
  xl: 'table table-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyTabsSizeClasses = {
  xs: 'tabs tabs-box tabs-xs',
  sm: 'tabs tabs-box tabs-sm',
  md: 'tabs tabs-box tabs-md',
  lg: 'tabs tabs-box tabs-lg',
  xl: 'tabs tabs-box tabs-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const daisyRangeSizeClasses = {
  xs: 'range range-primary range-xs',
  sm: 'range range-primary range-sm',
  md: 'range range-primary range-md',
  lg: 'range range-primary range-lg',
  xl: 'range range-primary range-xl',
} as const satisfies Record<TinyrackControlSize, string>;

const mantineRingProgressPxSizes = {
  xs: 48,
  sm: 64,
  md: 80,
  lg: 96,
  xl: 112,
} as const satisfies Record<TinyrackControlSize, number>;

const daisyFormControlSizeClasses = {
  fileInput: {
    xs: 'file-input file-input-xs',
    sm: 'file-input file-input-sm',
    md: 'file-input file-input-md',
    lg: 'file-input file-input-lg',
    xl: 'file-input file-input-xl',
  },
  input: {
    xs: 'input input-xs',
    sm: 'input input-sm',
    md: 'input input-md',
    lg: 'input input-lg',
    xl: 'input input-xl',
  },
  select: {
    xs: 'select select-xs',
    sm: 'select select-sm',
    md: 'select select-md',
    lg: 'select select-lg',
    xl: 'select select-xl',
  },
  textarea: {
    xs: 'textarea textarea-xs',
    sm: 'textarea textarea-sm',
    md: 'textarea textarea-md',
    lg: 'textarea textarea-lg',
    xl: 'textarea textarea-xl',
  },
} as const satisfies Record<string, Record<TinyrackControlSize, string>>;

const formControlParityCases = ['fileInput', 'input', 'select', 'textarea'] as const;
const selectionControlParityCases = ['checkbox', 'radio'] as const;
const surfaceParityCases = [
  'alert',
  'card',
  'divider',
  'fieldset',
  'skeleton',
] as const;

type FormControlParityCase = (typeof formControlParityCases)[number];
type SelectionControlParityCase = (typeof selectionControlParityCases)[number];
type SurfaceParityCase = (typeof surfaceParityCases)[number];

async function waitForMantineColorScheme(colorScheme: 'dark' | 'light') {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (
      document.documentElement.getAttribute('data-mantine-color-scheme') === colorScheme
    ) {
      return;
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  expect(document.documentElement.getAttribute('data-mantine-color-scheme')).toBe(
    colorScheme,
  );
}

function ButtonParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Button data-testid="mantine-button" size={size}>
          Apply
        </Button>
      </TinyrackMantineProvider>
      <button
        className={daisyButtonSizeClasses[size]}
        data-testid="daisy-button"
        type="button"
      >
        Apply
      </button>
    </div>
  );
}

function BadgeParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Badge data-testid="mantine-badge" size={size} variant="filled">
          Stable
        </Badge>
      </TinyrackMantineProvider>
      <span className={daisyBadgeSizeClasses[size]} data-testid="daisy-badge">
        Stable
      </span>
    </div>
  );
}

function KbdParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Kbd data-testid="mantine-kbd" size={size}>
          K
        </Kbd>
      </TinyrackMantineProvider>
      <kbd className={daisyKbdSizeClasses[size]} data-testid="daisy-kbd">
        K
      </kbd>
    </div>
  );
}

function AvatarParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Avatar data-testid="mantine-avatar" size={size}>
          TR
        </Avatar>
      </TinyrackMantineProvider>
      <div className={daisyAvatarSizeClasses[size]}>
        <div data-testid="daisy-avatar">TR</div>
      </div>
    </div>
  );
}

function IndicatorParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Indicator
          data-testid="mantine-indicator-root"
          label="1"
          size={`var(--tinyrack-indicator-size-${size})`}
        >
          <span className="inline-block h-8 w-8" />
        </Indicator>
      </TinyrackMantineProvider>
      <div className={daisyIndicatorSizeClasses[size]}>
        <span className="indicator-item" data-testid="daisy-indicator">
          1
        </span>
        <span className="inline-block h-8 w-8" />
      </div>
    </div>
  );
}

function LoaderParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Loader data-testid="mantine-loader" size={size} />
      </TinyrackMantineProvider>
      <span className={daisyLoaderSizeClasses[size]} data-testid="daisy-loader" />
    </div>
  );
}

function RatingParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Rating data-testid="mantine-rating" readOnly size={size} value={1} />
      </TinyrackMantineProvider>
      <div className={daisyRatingSizeClasses[size]} data-testid="daisy-rating">
        <input
          aria-label="One star"
          checked
          className="mask mask-star-2"
          data-testid="daisy-rating-symbol"
          readOnly
          type="radio"
        />
      </div>
    </div>
  );
}

function RadialProgressParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <RingProgress
          data-testid="mantine-radial-progress"
          sections={[{ color: 'tinyrack', value: 40 }]}
          size={mantineRingProgressPxSizes[size]}
        />
      </TinyrackMantineProvider>
      <div
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={40}
        className={daisyRadialProgressSizeClasses[size]}
        data-testid="daisy-radial-progress"
        role="progressbar"
        style={{ '--value': 40 } as CSSProperties}
      />
    </div>
  );
}

function BreadcrumbsParityPreview() {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Breadcrumbs data-testid="mantine-breadcrumbs">
          <Anchor href="#">Rack</Anchor>
          <Anchor href="#">Nodes</Anchor>
        </Breadcrumbs>
      </TinyrackMantineProvider>
      <div className="breadcrumbs" data-testid="daisy-breadcrumbs">
        <ul>
          <li>
            <a href="#daisy-breadcrumb-rack">Rack</a>
          </li>
          <li data-testid="daisy-breadcrumb-separator-source">Nodes</li>
        </ul>
      </div>
    </div>
  );
}

function ListParityPreview() {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <List data-testid="mantine-list">
          <List.Item data-testid="mantine-list-item">List item</List.Item>
        </List>
      </TinyrackMantineProvider>
      <ul className="list" data-testid="daisy-list">
        <li className="list-row" data-testid="daisy-list-item">
          List item
        </li>
      </ul>
    </div>
  );
}

function TableParityPreview() {
  return (
    <div className="flex items-start gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Table data-testid="mantine-table" striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Node</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td data-testid="mantine-table-cell">node-01</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </TinyrackMantineProvider>
      <table className={daisyTableSizeClasses.md} data-testid="daisy-table">
        <thead>
          <tr>
            <th>Node</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-testid="daisy-table-cell">node-01</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TabsParityPreview() {
  return (
    <div className="flex items-start gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Tabs defaultValue="overview" variant="pills">
          <Tabs.List>
            <Tabs.Tab data-testid="mantine-tab" value="overview">
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="logs">Logs</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </TinyrackMantineProvider>
      <div className={daisyTabsSizeClasses.md} role="tablist">
        <button
          aria-selected="true"
          className="tab tab-active"
          data-testid="daisy-tab"
          role="tab"
          type="button"
        >
          Overview
        </button>
        <button className="tab" role="tab" type="button">
          Logs
        </button>
      </div>
    </div>
  );
}

function TimelineParityPreview() {
  return (
    <div className="flex items-start gap-8" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Timeline active={0} data-testid="mantine-timeline">
          <Timeline.Item title="Discover">Nodes found</Timeline.Item>
          <Timeline.Item title="Verify">Backups checked</Timeline.Item>
        </Timeline>
      </TinyrackMantineProvider>
      <ul className="timeline">
        <li>
          <hr data-testid="daisy-timeline-line" />
          <div className="timeline-middle">1</div>
          <div className="timeline-end">Discover</div>
          <hr />
        </li>
      </ul>
    </div>
  );
}

function StepperParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-start gap-8" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Stepper active={1} size={size}>
          <Stepper.Step label="Discover" />
          <Stepper.Step label="Verify" />
        </Stepper>
      </TinyrackMantineProvider>
      <ul className="steps">
        <li className="step step-primary">
          <span className="step-icon" data-testid="daisy-step-icon">
            1
          </span>
          Discover
        </li>
        <li className="step">Verify</li>
      </ul>
    </div>
  );
}

function RangeParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex w-96 items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Slider
          data-testid="mantine-range"
          defaultValue={60}
          size={size}
          style={{ width: 160 }}
        />
      </TinyrackMantineProvider>
      <input
        aria-label="Range"
        className={daisyRangeSizeClasses[size]}
        data-testid="daisy-range"
        defaultValue={60}
        max={100}
        min={0}
        type="range"
      />
    </div>
  );
}

function MenuParityPreview() {
  return (
    <div className="flex items-start gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Menu opened withinPortal={false}>
          <Menu.Target>
            <Button size="xs">Menu</Button>
          </Menu.Target>
          <Menu.Dropdown data-testid="mantine-menu">
            <Menu.Item data-testid="mantine-menu-item">Open logs</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </TinyrackMantineProvider>
      <ul className="menu" data-testid="daisy-menu">
        <li>
          <a data-testid="daisy-menu-item" href="#daisy-menu-item">
            Open logs
          </a>
        </li>
      </ul>
    </div>
  );
}

function ModalParityPreview() {
  return (
    <div className="flex items-start gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Modal
          opened
          onClose={() => undefined}
          title="Restart service"
          withinPortal={false}
        >
          Restarting reverse-proxy will briefly interrupt local routing.
        </Modal>
      </TinyrackMantineProvider>
      <div className="modal modal-open relative" data-testid="daisy-modal">
        <div className="modal-box" data-testid="daisy-modal-box">
          <h3>Restart service</h3>
          <p>Restarting reverse-proxy will briefly interrupt local routing.</p>
        </div>
      </div>
    </div>
  );
}

function DrawerParityPreview() {
  return (
    <div className="flex items-start gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Drawer opened onClose={() => undefined} title="Drawer" withinPortal={false}>
          Drawer content
        </Drawer>
      </TinyrackMantineProvider>
      <div className="drawer drawer-open relative h-40 w-56" data-testid="daisy-drawer">
        <input
          aria-label="drawer"
          className="drawer-toggle"
          defaultChecked
          type="checkbox"
        />
        <div className="drawer-content">Drawer content</div>
        <div className="drawer-side absolute h-full">
          <div aria-hidden="true" className="drawer-overlay" />
          <div data-testid="daisy-drawer-panel">Drawer content</div>
        </div>
      </div>
    </div>
  );
}

function TooltipParityPreview() {
  return (
    <div className="flex items-center gap-12 pt-12" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Tooltip label="Open service logs" opened withinPortal={false}>
          <Button size="xs">Logs</Button>
        </Tooltip>
      </TinyrackMantineProvider>
      <div className="tooltip tooltip-open" data-tip="Open service logs">
        <button className="btn btn-xs" type="button">
          Logs
        </button>
      </div>
    </div>
  );
}

function SelectionControlParityPreview({
  checked,
  kind,
  size,
}: {
  checked: boolean;
  kind: SelectionControlParityCase;
  size: TinyrackControlSize;
}) {
  const className = daisySelectionControlSizeClasses[kind][size];

  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        {kind === 'checkbox' ? (
          <Checkbox
            data-testid="mantine-selection"
            defaultChecked={checked}
            size={size}
          />
        ) : (
          <Radio data-testid="mantine-selection" defaultChecked={checked} size={size} />
        )}
      </TinyrackMantineProvider>
      <input
        aria-label={kind}
        className={className}
        data-testid="daisy-selection"
        defaultChecked={checked}
        type={kind}
      />
    </div>
  );
}

function SwitchParityPreview({
  checked,
  size,
}: {
  checked: boolean;
  size: TinyrackControlSize;
}) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Switch
          data-testid="mantine-switch-input"
          defaultChecked={checked}
          size={size}
        />
      </TinyrackMantineProvider>
      <input
        aria-label="Toggle"
        className={daisySwitchSizeClasses[size]}
        data-testid="daisy-switch"
        defaultChecked={checked}
        type="checkbox"
      />
    </div>
  );
}

function MantineSurface({ kind }: { kind: SurfaceParityCase }) {
  if (kind === 'alert') {
    return <Alert data-testid="mantine-surface">Signal</Alert>;
  }

  if (kind === 'card') {
    return <Card data-testid="mantine-surface">Panel</Card>;
  }

  if (kind === 'divider') {
    return <Divider data-testid="mantine-surface" label="Meta" />;
  }

  if (kind === 'fieldset') {
    return <Fieldset data-testid="mantine-surface" legend="Settings" />;
  }

  return <Skeleton data-testid="mantine-surface" height={32} visible width={120} />;
}

function DaisySurface({ kind }: { kind: SurfaceParityCase }) {
  if (kind === 'alert') {
    return (
      <div className="alert" data-testid="daisy-surface">
        Signal
      </div>
    );
  }

  if (kind === 'card') {
    return (
      <div className="card" data-testid="daisy-surface">
        <div className="card-body">Panel</div>
      </div>
    );
  }

  if (kind === 'divider') {
    return (
      <div className="divider" data-testid="daisy-surface">
        Meta
      </div>
    );
  }

  if (kind === 'fieldset') {
    return (
      <fieldset className="fieldset" data-testid="daisy-surface">
        <legend className="fieldset-legend">Settings</legend>
      </fieldset>
    );
  }

  return (
    <div
      className="skeleton"
      data-testid="daisy-surface"
      style={{ height: 32, width: 120 }}
    />
  );
}

function SurfaceParityPreview({ kind }: { kind: SurfaceParityCase }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <MantineSurface kind={kind} />
      </TinyrackMantineProvider>
      <DaisySurface kind={kind} />
    </div>
  );
}

function ProgressParityPreview({ size }: { size: TinyrackControlSize }) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <Progress data-testid="mantine-progress" size={size} value={40} />
      </TinyrackMantineProvider>
      <progress
        className={daisyProgressSizeClasses[size]}
        data-testid="daisy-progress"
        max={100}
        value={40}
      />
    </div>
  );
}

function MantineFormControl({
  kind,
  size,
}: {
  kind: FormControlParityCase;
  size: TinyrackControlSize;
}) {
  if (kind === 'fileInput') {
    return <FileInput data-testid="mantine-control" placeholder="Upload" size={size} />;
  }

  if (kind === 'select') {
    return (
      <NativeSelect
        data={['Primary', 'Secondary']}
        data-testid="mantine-control"
        size={size}
      />
    );
  }

  if (kind === 'textarea') {
    return (
      <Textarea
        data-testid="mantine-control"
        defaultValue="Primary"
        rows={1}
        size={size}
      />
    );
  }

  return <TextInput data-testid="mantine-control" defaultValue="Primary" size={size} />;
}

function DaisyFormControl({
  kind,
  size,
}: {
  kind: FormControlParityCase;
  size: TinyrackControlSize;
}) {
  const className = daisyFormControlSizeClasses[kind][size];

  if (kind === 'fileInput') {
    return (
      <input
        aria-label="Upload"
        className={className}
        data-testid="daisy-control"
        type="file"
      />
    );
  }

  if (kind === 'select') {
    return (
      <select className={className} data-testid="daisy-control">
        <option>Primary</option>
        <option>Secondary</option>
      </select>
    );
  }

  if (kind === 'textarea') {
    return (
      <textarea
        className={className}
        data-testid="daisy-control"
        defaultValue="Primary"
        rows={1}
      />
    );
  }

  return (
    <input
      className={className}
      data-testid="daisy-control"
      defaultValue="Primary"
      type="text"
    />
  );
}

function FormControlParityPreview({
  kind,
  size,
}: {
  kind: FormControlParityCase;
  size: TinyrackControlSize;
}) {
  return (
    <div className="flex items-center gap-4" data-theme="tinyrack-dark">
      <TinyrackMantineProvider forceColorScheme="dark">
        <MantineFormControl kind={kind} size={size} />
      </TinyrackMantineProvider>
      <DaisyFormControl kind={kind} size={size} />
    </div>
  );
}

function expectControlParity(mantineElement: Element, daisyElement: Element) {
  const mantineStyles = getComputedStyle(mantineElement);
  const daisyStyles = getComputedStyle(daisyElement);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.borderTopColor).toBe(daisyStyles.borderTopColor);
}

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Button computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<ButtonParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineButton = document.querySelector('[data-testid="mantine-button"]');
  const daisyButton = document.querySelector('[data-testid="daisy-button"]');

  expect(mantineButton).not.toBeNull();
  expect(daisyButton).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineButton as Element);
  const daisyStyles = getComputedStyle(daisyButton as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.fontWeight).toBe(daisyStyles.fontWeight);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Badge computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<BadgeParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineBadge = document.querySelector('[data-testid="mantine-badge"]');
  const daisyBadge = document.querySelector('[data-testid="daisy-badge"]');

  expect(mantineBadge).not.toBeNull();
  expect(daisyBadge).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineBadge as Element);
  const daisyStyles = getComputedStyle(daisyBadge as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.fontWeight).toBe(daisyStyles.fontWeight);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.textTransform).toBe(daisyStyles.textTransform);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Kbd computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<KbdParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineKbd = document.querySelector('[data-testid="mantine-kbd"]');
  const daisyKbd = document.querySelector('[data-testid="daisy-kbd"]');

  expect(mantineKbd).not.toBeNull();
  expect(daisyKbd).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineKbd as Element);
  const daisyStyles = getComputedStyle(daisyKbd as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.minWidth).toBe(daisyStyles.minWidth);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.fontWeight).toBe(daisyStyles.fontWeight);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.borderTopColor).toBe(daisyStyles.borderTopColor);
  expect(mantineStyles.borderBottomWidth).toBe(daisyStyles.borderBottomWidth);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Avatar computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<AvatarParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineAvatar = document.querySelector('[data-testid="mantine-avatar"]');
  const daisyAvatar = document.querySelector('[data-testid="daisy-avatar"]');

  expect(mantineAvatar).not.toBeNull();
  expect(daisyAvatar).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineAvatar as Element);
  const daisyStyles = getComputedStyle(daisyAvatar as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Indicator computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<IndicatorParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineIndicator = document.querySelector('.mantine-Indicator-indicator');
  const daisyIndicator = document.querySelector('[data-testid="daisy-indicator"]');

  expect(mantineIndicator).not.toBeNull();
  expect(daisyIndicator).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineIndicator as Element);
  const daisyStyles = getComputedStyle(daisyIndicator as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.minWidth).toBe(daisyStyles.minWidth);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Loader computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<LoaderParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineLoader = document.querySelector('[data-testid="mantine-loader"]');
  const daisyLoader = document.querySelector('[data-testid="daisy-loader"]');

  expect(mantineLoader).not.toBeNull();
  expect(daisyLoader).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineLoader as Element);
  const daisyStyles = getComputedStyle(daisyLoader as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Rating computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<RatingParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineRatingSymbol = document.querySelector('.mantine-Rating-starSymbol');
  const daisyRatingSymbol = document.querySelector(
    '[data-testid="daisy-rating-symbol"]',
  );

  expect(mantineRatingSymbol).not.toBeNull();
  expect(daisyRatingSymbol).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineRatingSymbol as Element);
  const daisyStyles = getComputedStyle(daisyRatingSymbol as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI RadialProgress computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<RadialProgressParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineRadialProgress = document.querySelector(
    '[data-testid="mantine-radial-progress"]',
  );
  const daisyRadialProgress = document.querySelector(
    '[data-testid="daisy-radial-progress"]',
  );

  expect(mantineRadialProgress).not.toBeNull();
  expect(daisyRadialProgress).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineRadialProgress as Element);
  const daisyStyles = getComputedStyle(daisyRadialProgress as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test('aligns Mantine and daisyUI Breadcrumbs computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<BreadcrumbsParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineBreadcrumbs = document.querySelector(
    '[data-testid="mantine-breadcrumbs"]',
  );
  const daisyBreadcrumbs = document.querySelector('[data-testid="daisy-breadcrumbs"]');
  const mantineSeparator = document.querySelector('.mantine-Breadcrumbs-separator');
  const daisySeparatorSource = document.querySelector(
    '[data-testid="daisy-breadcrumb-separator-source"]',
  );

  expect(mantineBreadcrumbs).not.toBeNull();
  expect(daisyBreadcrumbs).not.toBeNull();
  expect(mantineSeparator).not.toBeNull();
  expect(daisySeparatorSource).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineBreadcrumbs as Element);
  const daisyStyles = getComputedStyle(daisyBreadcrumbs as Element);
  const mantineSeparatorStyles = getComputedStyle(mantineSeparator as Element);
  const daisySeparatorStyles = getComputedStyle(
    daisySeparatorSource as Element,
    '::before',
  );

  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineSeparatorStyles.color).toBe(daisySeparatorStyles.borderTopColor);
});

test('aligns Mantine and daisyUI List computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<ListParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineList = document.querySelector('[data-testid="mantine-list"]');
  const daisyList = document.querySelector('[data-testid="daisy-list"]');
  const mantineListItem = document.querySelector('[data-testid="mantine-list-item"]');
  const daisyListItem = document.querySelector('[data-testid="daisy-list-item"]');

  expect(mantineList).not.toBeNull();
  expect(daisyList).not.toBeNull();
  expect(mantineListItem).not.toBeNull();
  expect(daisyListItem).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineList as Element);
  const daisyStyles = getComputedStyle(daisyList as Element);
  const mantineItemStyles = getComputedStyle(mantineListItem as Element);
  const daisyItemStyles = getComputedStyle(daisyListItem as Element);

  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineItemStyles.paddingTop).toBe(daisyItemStyles.paddingTop);
  expect(mantineItemStyles.borderRadius).toBe(daisyItemStyles.borderRadius);
});

test('aligns Mantine and daisyUI Table computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<TableParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineTable = document.querySelector('[data-testid="mantine-table"]');
  const daisyTable = document.querySelector('[data-testid="daisy-table"]');
  const mantineCell = document.querySelector('[data-testid="mantine-table-cell"]');
  const daisyCell = document.querySelector('[data-testid="daisy-table-cell"]');

  expect(mantineTable).not.toBeNull();
  expect(daisyTable).not.toBeNull();
  expect(mantineCell).not.toBeNull();
  expect(daisyCell).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineTable as Element);
  const daisyStyles = getComputedStyle(daisyTable as Element);
  const mantineCellStyles = getComputedStyle(mantineCell as Element);
  const daisyCellStyles = getComputedStyle(daisyCell as Element);

  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineCellStyles.paddingInlineStart).toBe(daisyCellStyles.paddingInlineStart);
  expect(mantineCellStyles.paddingBlockStart).toBe(daisyCellStyles.paddingBlockStart);
});

test('aligns Mantine and daisyUI Tabs computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<TabsParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineTab = document.querySelector('[data-testid="mantine-tab"]');
  const daisyTab = document.querySelector('[data-testid="daisy-tab"]');

  expect(mantineTab).not.toBeNull();
  expect(daisyTab).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineTab as Element);
  const daisyStyles = getComputedStyle(daisyTab as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.paddingInlineStart).toBe(daisyStyles.paddingInlineStart);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test('aligns Mantine and daisyUI Timeline line computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<TimelineParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineTimelineItem = document.querySelector('.mantine-Timeline-item');
  const daisyTimelineLine = document.querySelector(
    '[data-testid="daisy-timeline-line"]',
  );

  expect(mantineTimelineItem).not.toBeNull();
  expect(daisyTimelineLine).not.toBeNull();

  const mantineLineStyles = getComputedStyle(
    mantineTimelineItem as Element,
    '::before',
  );
  const daisyLineStyles = getComputedStyle(daisyTimelineLine as Element);

  expect(mantineLineStyles.borderLeftColor).toBe(daisyLineStyles.backgroundColor);
  expect(mantineLineStyles.borderLeftWidth).toBe(daisyLineStyles.height);
});

test('aligns Mantine and daisyUI Stepper icon computed styles for md', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<StepperParityPreview size="md" />);
  await waitForMantineColorScheme('dark');

  const mantineStepIcon = document.querySelector(
    '.mantine-Stepper-stepIcon[data-completed]',
  );
  const daisyStepIcon = document.querySelector('[data-testid="daisy-step-icon"]');

  expect(mantineStepIcon).not.toBeNull();
  expect(daisyStepIcon).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineStepIcon as Element);
  const daisyStyles = getComputedStyle(daisyStepIcon as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Range computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<RangeParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineRange = document.querySelector('[data-testid="mantine-range"]');
  const mantineRangeThumb = document.querySelector('.mantine-Slider-thumb');
  const daisyRange = document.querySelector('[data-testid="daisy-range"]');

  expect(mantineRange).not.toBeNull();
  expect(mantineRangeThumb).not.toBeNull();
  expect(daisyRange).not.toBeNull();

  const mantineRootStyles = getComputedStyle(mantineRange as Element);
  const mantineThumbStyles = getComputedStyle(mantineRangeThumb as Element);
  const daisyStyles = getComputedStyle(daisyRange as Element);

  expect(mantineRootStyles.height).toBe(daisyStyles.height);
  expect(mantineThumbStyles.height).toBe(daisyStyles.height);
  expect(mantineThumbStyles.width).toBe(daisyStyles.height);
  expect(mantineThumbStyles.borderTopColor).toBe(daisyStyles.color);
});

test('aligns Mantine and daisyUI Menu computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<MenuParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineMenu = document.querySelector('[data-testid="mantine-menu"]');
  const daisyMenu = document.querySelector('[data-testid="daisy-menu"]');
  const mantineMenuItem = document.querySelector('[data-testid="mantine-menu-item"]');
  const daisyMenuItem = document.querySelector('[data-testid="daisy-menu-item"]');

  expect(mantineMenu).not.toBeNull();
  expect(daisyMenu).not.toBeNull();
  expect(mantineMenuItem).not.toBeNull();
  expect(daisyMenuItem).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineMenu as Element);
  const daisyStyles = getComputedStyle(daisyMenu as Element);
  const mantineItemStyles = getComputedStyle(mantineMenuItem as Element);
  const daisyItemStyles = getComputedStyle(daisyMenuItem as Element);

  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.boxShadow).toBe(daisyStyles.boxShadow);
  expect(mantineItemStyles.fontSize).toBe(daisyItemStyles.fontSize);
  expect(mantineItemStyles.paddingInlineStart).toBe(daisyItemStyles.paddingInlineStart);
  expect(mantineItemStyles.borderRadius).toBe(daisyItemStyles.borderRadius);
});

test('aligns Mantine and daisyUI Modal computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<ModalParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineModal = document.querySelector('.mantine-Modal-content');
  const mantineModalBody = document.querySelector('.mantine-Modal-body');
  const daisyModal = document.querySelector('[data-testid="daisy-modal-box"]');

  expect(mantineModal).not.toBeNull();
  expect(mantineModalBody).not.toBeNull();
  expect(daisyModal).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineModal as Element);
  const mantineBodyStyles = getComputedStyle(mantineModalBody as Element);
  const daisyStyles = getComputedStyle(daisyModal as Element);

  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.boxShadow).toBe(daisyStyles.boxShadow);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineBodyStyles.paddingTop).toBe(daisyStyles.paddingTop);
});

test('aligns Mantine and daisyUI Drawer computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<DrawerParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineDrawer = document.querySelector('.mantine-Drawer-content');
  const daisyDrawer = document.querySelector('[data-testid="daisy-drawer-panel"]');

  expect(mantineDrawer).not.toBeNull();
  expect(daisyDrawer).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineDrawer as Element);
  const daisyStyles = getComputedStyle(daisyDrawer as Element);

  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.boxShadow).toBe(daisyStyles.boxShadow);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test('aligns Mantine and daisyUI Tooltip computed styles', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<TooltipParityPreview />);
  await waitForMantineColorScheme('dark');

  const mantineTooltip = document.querySelector('.mantine-Tooltip-tooltip');
  const daisyTooltip = document.querySelector('.tooltip');

  expect(mantineTooltip).not.toBeNull();
  expect(daisyTooltip).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineTooltip as Element);
  const daisyStyles = getComputedStyle(daisyTooltip as Element, '::before');

  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.color).toBe(daisyStyles.color);
  expect(mantineStyles.fontSize).toBe(daisyStyles.fontSize);
  expect(mantineStyles.paddingInlineStart).toBe(daisyStyles.paddingInlineStart);
});

test.each(
  selectionControlParityCases.flatMap((kind) =>
    tinyrackControlSizeNames.flatMap((size) =>
      [false, true].map((checked) => [kind, size, checked] as const),
    ),
  ),
)('aligns Mantine and daisyUI %s computed styles for %s checked=%s', async (kind, size, checked) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(
    <SelectionControlParityPreview checked={checked} kind={kind} size={size} />,
  );
  await waitForMantineColorScheme('dark');

  const mantineSelection = document.querySelector('[data-testid="mantine-selection"]');
  const daisySelection = document.querySelector('[data-testid="daisy-selection"]');

  expect(mantineSelection).not.toBeNull();
  expect(daisySelection).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineSelection as Element);
  const daisyStyles = getComputedStyle(daisySelection as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderTopColor).toBe(daisyStyles.borderTopColor);
});

test.each(
  tinyrackControlSizeNames.flatMap((size) =>
    [false, true].map((checked) => [size, checked] as const),
  ),
)('aligns Mantine and daisyUI Switch computed styles for %s checked=%s', async (size, checked) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<SwitchParityPreview checked={checked} size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineSwitch = document.querySelector('.mantine-Switch-track');
  const daisySwitch = document.querySelector('[data-testid="daisy-switch"]');

  expect(mantineSwitch).not.toBeNull();
  expect(daisySwitch).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineSwitch as Element);
  const daisyStyles = getComputedStyle(daisySwitch as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.width).toBe(daisyStyles.width);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderTopColor).toBe(daisyStyles.borderTopColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  surfaceParityCases,
)('aligns Mantine and daisyUI %s surface computed styles', async (kind) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<SurfaceParityPreview kind={kind} />);
  await waitForMantineColorScheme('dark');

  const mantineSurface = document.querySelector('[data-testid="mantine-surface"]');
  const daisySurface = document.querySelector('[data-testid="daisy-surface"]');

  expect(mantineSurface).not.toBeNull();
  expect(daisySurface).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineSurface as Element);
  const daisyStyles = getComputedStyle(daisySurface as Element);

  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  tinyrackControlSizeNames,
)('aligns Mantine and daisyUI Progress computed styles for %s', async (size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<ProgressParityPreview size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineProgress = document.querySelector('[data-testid="mantine-progress"]');
  const daisyProgress = document.querySelector('[data-testid="daisy-progress"]');

  expect(mantineProgress).not.toBeNull();
  expect(daisyProgress).not.toBeNull();

  const mantineStyles = getComputedStyle(mantineProgress as Element);
  const daisyStyles = getComputedStyle(daisyProgress as Element);

  expect(mantineStyles.height).toBe(daisyStyles.height);
  expect(mantineStyles.borderRadius).toBe(daisyStyles.borderRadius);
  expect(mantineStyles.backgroundColor).toBe(daisyStyles.backgroundColor);
  expect(mantineStyles.color).toBe(daisyStyles.color);
});

test.each(
  formControlParityCases.flatMap((kind) =>
    tinyrackControlSizeNames.map((size) => [kind, size] as const),
  ),
)('aligns Mantine and daisyUI %s computed styles for %s', async (kind, size) => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';

  await render(<FormControlParityPreview kind={kind} size={size} />);
  await waitForMantineColorScheme('dark');

  const mantineControl = document.querySelector('[data-testid="mantine-control"]');
  const daisyControl = document.querySelector('[data-testid="daisy-control"]');

  expect(mantineControl).not.toBeNull();
  expect(daisyControl).not.toBeNull();

  expectControlParity(mantineControl as Element, daisyControl as Element);
});
