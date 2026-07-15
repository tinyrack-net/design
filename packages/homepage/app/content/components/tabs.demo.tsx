import { Tabs, type TabsSize } from '@tinyrack/ui/components/tabs';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type TabsStoryArgs = {
  activation: 'automatic' | 'manual';
  disabled: boolean;
  loopFocus: boolean;
  orientation: 'horizontal' | 'vertical';
  size: TabsSize;
  value: string | null;
};

type TabsPreviewProps = TabsStoryArgs & {
  onValueChange?: (value: string | null) => void;
};

export function TabsPreview({
  activation,
  disabled,
  loopFocus,
  onValueChange,
  orientation,
  size,
  value,
}: TabsPreviewProps) {
  return (
    <div className="grid w-[36rem] max-w-full gap-3">
      <Tabs.Root
        className="w-full"
        onValueChange={(nextValue) =>
          onValueChange?.(nextValue === null ? null : String(nextValue))
        }
        orientation={orientation}
        size={size}
        value={value}
      >
        <Tabs.List
          activateOnFocus={activation === 'automatic'}
          aria-label="Service details"
          loopFocus={loopFocus}
        >
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="network">Network</Tabs.Tab>
          <Tabs.Tab value="storage">Storage</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Tab disabled={disabled} value="logs">
            Logs
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">All systems operational.</Tabs.Panel>
        <Tabs.Panel value="network">10 Gbps uplink.</Tabs.Panel>
        <Tabs.Panel value="storage">4.2 TB available.</Tabs.Panel>
        <Tabs.Panel value="activity">No recent alerts.</Tabs.Panel>
        <Tabs.Panel value="settings">Automatic updates enabled.</Tabs.Panel>
        <Tabs.Panel value="logs">Log stream.</Tabs.Panel>
      </Tabs.Root>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Selected: {value ?? 'none'}
      </output>
    </div>
  );
}

export function TabsInteractiveExample() {
  const [value, setValue] = useState<string | null>('overview');

  return (
    <div className="grid gap-3">
      <Tabs.Root
        onValueChange={(nextValue) =>
          setValue(nextValue === null ? null : String(nextValue))
        }
        value={value}
      >
        <Tabs.List activateOnFocus={false} aria-label="Rack details" loopFocus>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="network">Network</Tabs.Tab>
          <Tabs.Tab value="storage">Storage</Tabs.Tab>
          <Tabs.Tab disabled value="logs">
            Logs
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">All systems operational.</Tabs.Panel>
        <Tabs.Panel value="network">10 Gbps uplink.</Tabs.Panel>
        <Tabs.Panel value="storage">4.2 TB available.</Tabs.Panel>
        <Tabs.Panel value="logs">Log stream.</Tabs.Panel>
      </Tabs.Root>
      <output aria-live="polite">Selected: {value ?? 'none'}</output>
    </div>
  );
}

const meta = {
  title: 'Components/Tabs',
  excludeStories: /.*(?:Preview|Example)$/,
  parameters: { layout: 'centered' },
  args: {
    activation: 'manual',
    disabled: false,
    loopFocus: true,
    orientation: 'horizontal',
    size: 'md',
    value: 'overview',
  },
  argTypes: {
    activation: { control: 'radio', options: ['manual', 'automatic'] },
    disabled: { control: 'boolean' },
    loopFocus: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    value: {
      control: 'select',
      options: [null, 'overview', 'network', 'storage', 'activity', 'settings', 'logs'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TabsStoryArgs>();

    return <TabsPreview {...args} onValueChange={(value) => updateArgs({ value })} />;
  },
} satisfies Meta<TabsStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
