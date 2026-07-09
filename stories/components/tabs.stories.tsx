import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type TabsActivationMode,
  type TabsOrientation,
  type TabsSize,
  tabsActivationModes,
  tabsOrientations,
  tabsSizes,
} from '../../src/components/tabs/contract.js';
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from '../../src/components/tabs/react.js';

const tabValues = ['overview', 'metrics', 'logs'] as const;
const tabPanels = {
  overview: [
    ['Status', 'Healthy', 'Deployments enabled and rack checks passing.'],
    ['Backup', 'Ready', 'Last snapshot completed at 03:18 KST.'],
    ['Region', 'Seoul', 'Primary node accepting traffic.'],
  ],
  metrics: [
    ['CPU', '41%', 'Sustained load across the last 15 minutes.'],
    ['Memory', '62%', 'No pressure warnings in the current window.'],
    ['Latency', '48 ms', 'p95 API latency from edge probes.'],
  ],
  logs: [
    ['03:18', 'Backup', 'Snapshot completed for rack-a-01.'],
    ['03:22', 'Health', 'Probe passed with no degraded services.'],
    ['03:30', 'Deploy', 'Release candidate queued for review.'],
  ],
} as const;

type ComponentStoryProps = {
  activationMode: TabsActivationMode;
  defaultValue: (typeof tabValues)[number];
  orientation: TabsOrientation;
  size: TabsSize;
};

type PanelRowsProps = {
  rows: (typeof tabPanels)[keyof typeof tabPanels];
};

function PanelRows({ rows }: PanelRowsProps) {
  return (
    <div className="grid border-t border-tinyrack-border">
      {rows.map(([label, value, detail]) => (
        <div
          className="grid gap-1 border-b border-tinyrack-border py-2 md:grid-cols-[7rem_8rem_1fr] md:gap-3"
          key={label}
        >
          <span className="text-tinyrack-xs font-extrabold leading-tinyrack-xs tracking-tinyrack-md text-tinyrack-text-muted uppercase">
            {label}
          </span>
          <span>{value}</span>
          <span>{detail}</span>
        </div>
      ))}
    </div>
  );
}

function TabsStory({
  activationMode,
  defaultValue,
  orientation,
  size,
}: ComponentStoryProps) {
  return (
    <Tabs
      activationMode={activationMode}
      defaultValue={defaultValue}
      key={`${activationMode}-${defaultValue}-${orientation}-${size}`}
      orientation={orientation}
      size={size}
    >
      <TabsList aria-label="Rack sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsPanel value="overview">
        <PanelRows rows={tabPanels.overview} />
      </TabsPanel>
      <TabsPanel value="metrics">
        <PanelRows rows={tabPanels.metrics} />
      </TabsPanel>
      <TabsPanel value="logs">
        <PanelRows rows={tabPanels.logs} />
      </TabsPanel>
    </Tabs>
  );
}

TabsStory.displayName = 'TabsStory';

const meta = {
  title: 'Components/Tabs',
  component: TabsStory,
  args: {
    activationMode: 'automatic',
    defaultValue: 'overview',
    orientation: 'horizontal',
    size: 'md',
  },
  argTypes: {
    activationMode: {
      control: 'select',
      options: tabsActivationModes,
      description: 'Keyboard activation behavior after roving focus changes.',
    },
    defaultValue: {
      control: 'select',
      options: tabValues,
      description: 'Initially selected tab for the uncontrolled example.',
    },
    orientation: {
      control: 'select',
      options: tabsOrientations,
      description: 'Tab list direction and arrow-key mapping.',
    },
    size: {
      control: 'select',
      options: tabsSizes,
      description: 'Tailwind scale-backed tab control size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'CSS-first Tinyrack Tabs rendered through React compound components.',
      },
    },
  },
} satisfies Meta<typeof TabsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
