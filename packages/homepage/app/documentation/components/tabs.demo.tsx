import { TRTabs, type TRTabsUiSize } from '@tinyrack/ui/components/tabs';
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
  size: TRTabsUiSize;
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
      <TRTabs.Root
        className="w-full"
        onValueChange={(nextValue) =>
          onValueChange?.(nextValue === null ? null : String(nextValue))
        }
        orientation={orientation}
        uiSize={size}
        value={value}
      >
        <TRTabs.List
          activateOnFocus={activation === 'automatic'}
          aria-label="Service details"
          loopFocus={loopFocus}
        >
          <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
          <TRTabs.Tab value="network">Network</TRTabs.Tab>
          <TRTabs.Tab value="storage">Storage</TRTabs.Tab>
          <TRTabs.Tab value="activity">Activity</TRTabs.Tab>
          <TRTabs.Tab value="settings">Settings</TRTabs.Tab>
          <TRTabs.Tab disabled={disabled} value="logs">
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
      <TRTabs.Root
        onValueChange={(nextValue) =>
          setValue(nextValue === null ? null : String(nextValue))
        }
        value={value}
      >
        <TRTabs.List activateOnFocus={false} aria-label="Rack details" loopFocus>
          <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
          <TRTabs.Tab value="network">Network</TRTabs.Tab>
          <TRTabs.Tab value="storage">Storage</TRTabs.Tab>
          <TRTabs.Tab disabled value="logs">
            Logs
          </TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="overview">All systems operational.</TRTabs.Panel>
        <TRTabs.Panel value="network">10 Gbps uplink.</TRTabs.Panel>
        <TRTabs.Panel value="storage">4.2 TB available.</TRTabs.Panel>
        <TRTabs.Panel value="logs">Log stream.</TRTabs.Panel>
      </TRTabs.Root>
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
