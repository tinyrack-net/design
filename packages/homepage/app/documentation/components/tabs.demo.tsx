import { TRTabs, type TRTabsUiSize } from '@tinyrack/ui/components/tabs';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type TabsStoryArgs = {
  disabledTab: boolean;
  orientation: 'horizontal' | 'vertical';
  uiSize: TRTabsUiSize;
};

export function TabsPreview({ disabledTab, orientation, uiSize }: TabsStoryArgs) {
  return (
    <div className="grid w-[36rem] max-w-full min-w-0 gap-3">
      <TRTabs.Root
        className="w-full"
        defaultValue="overview"
        orientation={orientation}
        uiSize={uiSize}
      >
        <TRTabs.List aria-label="Service details">
          <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
          <TRTabs.Tab value="network">Network</TRTabs.Tab>
          <TRTabs.Tab value="storage">Storage</TRTabs.Tab>
          <TRTabs.Tab value="activity">Activity</TRTabs.Tab>
          <TRTabs.Tab value="settings">Settings</TRTabs.Tab>
          <TRTabs.Tab disabled={disabledTab} value="logs">
            Logs
          </TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="overview">All systems operational.</TRTabs.Panel>
        <TRTabs.Panel value="network">10 Gbps uplink.</TRTabs.Panel>
        <TRTabs.Panel value="storage">4.2 TB available.</TRTabs.Panel>
        <TRTabs.Panel value="activity">No recent alerts.</TRTabs.Panel>
        <TRTabs.Panel value="settings">Automatic updates enabled.</TRTabs.Panel>
        <TRTabs.Panel value="logs">Log stream.</TRTabs.Panel>
      </TRTabs.Root>
    </div>
  );
}

export function TabsInteractiveExample() {
  const [value, setValue] = useState<string | null>('overview');
  const locale = useDemoLocale();
  const labels = locale === 'ko' ? ['개요', '네트워크', '스토리지', '로그', '모든 시스템이 정상이에요.', '선택'] : locale === 'ja' ? ['概要', 'ネットワーク', 'ストレージ', 'ログ', 'すべてのシステムは正常です。', '選択中'] : ['Overview', 'Network', 'Storage', 'Logs', 'All systems operational.', 'Selected'];

  return (
    <div className="grid gap-3" data-docs-example-item="">
      <TRTabs.Root
        onValueChange={(nextValue) =>
          setValue(nextValue === null ? null : String(nextValue))
        }
        value={value}
      >
        <TRTabs.List activateOnFocus={false} aria-label="Rack details" loopFocus>
          <TRTabs.Tab value="overview">{labels[0]}</TRTabs.Tab>
          <TRTabs.Tab value="network">{labels[1]}</TRTabs.Tab>
          <TRTabs.Tab value="storage">{labels[2]}</TRTabs.Tab>
          <TRTabs.Tab disabled value="logs">
            {labels[3]}
          </TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="overview">{labels[4]}</TRTabs.Panel>
        <TRTabs.Panel value="network">10 Gbps uplink.</TRTabs.Panel>
        <TRTabs.Panel value="storage">4.2 TB available.</TRTabs.Panel>
        <TRTabs.Panel value="logs">Log stream.</TRTabs.Panel>
      </TRTabs.Root>
      <output aria-live="polite">{labels[5]}: {value ?? '—'}</output>
    </div>
  );
}

export const tabsControlledSource = `import { useState } from 'react';
import { TRTabs } from '@tinyrack/ui/components/tabs';

export function TabsExample() {
  const [value, setValue] = useState<string | null>('overview');

  return (
    <div className="grid gap-3">
      <TRTabs.Root
        onValueChange={(next) => setValue(next === null ? null : String(next))}
        value={value}
      >
        <TRTabs.List activateOnFocus={false} aria-label="Rack details" loopFocus>
          <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
          <TRTabs.Tab value="network">Network</TRTabs.Tab>
          <TRTabs.Tab value="storage">Storage</TRTabs.Tab>
          <TRTabs.Tab disabled value="logs">Logs</TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="overview">All systems operational.</TRTabs.Panel>
        <TRTabs.Panel value="network">10 Gbps uplink.</TRTabs.Panel>
        <TRTabs.Panel value="storage">4.2 TB available.</TRTabs.Panel>
        <TRTabs.Panel value="logs">Log stream.</TRTabs.Panel>
      </TRTabs.Root>
      <output aria-live="polite">Selected: {value ?? 'none'}</output>
    </div>
  );
}`;

export const tabsSizesSource = `import { TRTabs } from '@tinyrack/ui/components/tabs';

export function TabsSizes() {
  return (
    <div className="grid gap-5">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <TRTabs.Root defaultValue="overview" key={uiSize} uiSize={uiSize}>
          <TRTabs.List aria-label={'Service tabs, size ' + uiSize}>
            <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
            <TRTabs.Tab value="network">Network</TRTabs.Tab>
          </TRTabs.List>
          <TRTabs.Panel value="overview">{uiSize} overview</TRTabs.Panel>
          <TRTabs.Panel value="network">{uiSize} network</TRTabs.Panel>
        </TRTabs.Root>
      ))}
    </div>
  );
}`;

export const tabsVerticalSource = `import { TRTabs } from '@tinyrack/ui/components/tabs';

export function VerticalTabs() {
  return (
    <TRTabs.Root defaultValue="overview" orientation="vertical">
      <TRTabs.List activateOnFocus aria-label="Vertical rack details" loopFocus={false}>
        <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
        <TRTabs.Tab disabled value="logs">Logs</TRTabs.Tab>
      </TRTabs.List>
      <TRTabs.Panel value="overview">All systems operational.</TRTabs.Panel>
      <TRTabs.Panel keepMounted value="network">10 Gbps uplink.</TRTabs.Panel>
      <TRTabs.Panel value="logs">Unavailable</TRTabs.Panel>
    </TRTabs.Root>
  );
}`;

export const tabsOverflowIndicatorSource = `import { TRTabs } from '@tinyrack/ui/components/tabs';

const sections = ['Overview', 'Network', 'Storage', 'Activity', 'Settings', 'Audit log'];

export function OverflowTabs() {
  return (
    <div className="max-w-64">
      <TRTabs.Root defaultValue="Overview">
        <TRTabs.List aria-label="Deployment sections">
          {sections.map((label) => (
            <TRTabs.Tab key={label} value={label}>{label}</TRTabs.Tab>
          ))}
          <TRTabs.Indicator />
        </TRTabs.List>
        {sections.map((label) => (
          <TRTabs.Panel key={label} value={label}>{label} panel</TRTabs.Panel>
        ))}
      </TRTabs.Root>
    </div>
  );
}`;

const meta = {
  title: 'Components/Tabs',
  excludeStories: /.*(?:Preview|Example|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    disabledTab: false,
    orientation: 'horizontal',
    uiSize: 'md',
  },
  argTypes: {
    disabledTab: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <TabsPreview {...args} />,
} satisfies Meta<TabsStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
