import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  loopFocus: boolean;
  orientation: 'horizontal' | 'vertical';
};

export function MenubarPreview({ disabled, loopFocus, orientation }: StoryArgs) {
  const [result, setResult] = useState('No command selected');

  return (
    <div>
      <TRMenubar
        aria-label="Application menu"
        disabled={disabled}
        loopFocus={loopFocus}
        orientation={orientation}
      >
        <TRMenu.Root>
          <TRMenu.Trigger>File</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup data-menubar-popup="">
                <TRMenu.Item onClick={() => setResult('New rack selected')}>
                  New
                </TRMenu.Item>
                <TRMenu.Item onClick={() => setResult('Open selected')}>
                  Open
                </TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
        <TRMenu.Root>
          <TRMenu.Trigger>Edit</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup data-menubar-popup="">
                <TRMenu.Item onClick={() => setResult('Rename selected')}>
                  Rename
                </TRMenu.Item>
                <TRMenu.Item disabled>Duplicate unavailable</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
        <TRMenu.Root>
          <TRMenu.Trigger>View</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup data-menubar-popup="">
                <TRMenu.CheckboxItem defaultChecked>
                  <TRMenu.CheckboxItemIndicator aria-hidden="true">
                    ✓
                  </TRMenu.CheckboxItemIndicator>
                  Show status
                </TRMenu.CheckboxItem>
                <TRMenu.LinkItem href="#shortcuts">Keyboard shortcuts</TRMenu.LinkItem>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </TRMenubar>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

export function MenubarConfigurationMatrix() {
  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2">
      <section className="grid content-start gap-2">
        <strong>Vertical</strong>
        <TRMenubar aria-label="Vertical tools" orientation="vertical">
          <TRMenu.Root>
            <TRMenu.Trigger>File</TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Item>New</TRMenu.Item>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
          <TRMenu.Root>
            <TRMenu.Trigger>Edit</TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Item>Rename</TRMenu.Item>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
        </TRMenubar>
      </section>
      <section className="grid content-start gap-2">
        <strong>Disabled</strong>
        <TRMenubar aria-label="Unavailable tools" disabled>
          <TRMenu.Root>
            <TRMenu.Trigger>File</TRMenu.Trigger>
            <TRMenu.Portal>
              <TRMenu.Positioner>
                <TRMenu.Popup>
                  <TRMenu.Item>New</TRMenu.Item>
                </TRMenu.Popup>
              </TRMenu.Positioner>
            </TRMenu.Portal>
          </TRMenu.Root>
        </TRMenubar>
      </section>
    </div>
  );
}

export const menubarBasicSource = `import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';

export function BasicMenubar() {
  return <TRMenubar aria-label="Application menu">
    <TRMenu.Root>
      <TRMenu.Trigger>File</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.Item>New</TRMenu.Item>
            <TRMenu.Item>Open</TRMenu.Item>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>
  </TRMenubar>;
}`;

export const menubarApplicationSource = `import { useState } from 'react';
import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';

export function ApplicationMenu() {
  const [result, setResult] = useState('No command selected');

  return <div>
    <TRMenubar aria-label="Application menu" orientation="horizontal">
      <TRMenu.Root>
        <TRMenu.Trigger>File</TRMenu.Trigger>
        <TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup>
          <TRMenu.Item onClick={() => setResult('New rack selected')}>New</TRMenu.Item>
          <TRMenu.Item onClick={() => setResult('Open selected')}>Open</TRMenu.Item>
        </TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal>
      </TRMenu.Root>
      <TRMenu.Root>
        <TRMenu.Trigger>Edit</TRMenu.Trigger>
        <TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup>
          <TRMenu.Item onClick={() => setResult('Rename selected')}>Rename</TRMenu.Item>
          <TRMenu.Item disabled>Duplicate unavailable</TRMenu.Item>
        </TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal>
      </TRMenu.Root>
      <TRMenu.Root>
        <TRMenu.Trigger>View</TRMenu.Trigger>
        <TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup>
          <TRMenu.CheckboxItem defaultChecked>
            <TRMenu.CheckboxItemIndicator aria-hidden="true">✓</TRMenu.CheckboxItemIndicator>
            Show status
          </TRMenu.CheckboxItem>
          <TRMenu.LinkItem href="#shortcuts">Keyboard shortcuts</TRMenu.LinkItem>
        </TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal>
      </TRMenu.Root>
    </TRMenubar>
    <output aria-live="polite">{result}</output>
  </div>;
}`;

export const menubarConfigurationsSource = `import '@tinyrack/ui/components/menubar.css';
import { TRMenu } from '@tinyrack/ui/components/menu';
import { TRMenubar } from '@tinyrack/ui/components/menubar';

export function MenubarConfigurations() {
  return <div className="grid gap-6 sm:grid-cols-2">
    <TRMenubar aria-label="Vertical tools" orientation="vertical">
      <TRMenu.Root><TRMenu.Trigger>File</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>New</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root>
      <TRMenu.Root><TRMenu.Trigger>Edit</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>Rename</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root>
    </TRMenubar>
    <TRMenubar aria-label="Unavailable tools" disabled>
      <TRMenu.Root><TRMenu.Trigger>File</TRMenu.Trigger><TRMenu.Portal><TRMenu.Positioner><TRMenu.Popup><TRMenu.Item>New</TRMenu.Item></TRMenu.Popup></TRMenu.Positioner></TRMenu.Portal></TRMenu.Root>
    </TRMenubar>
  </div>;
}`;

const meta = {
  title: 'Components/Menubar',
  excludeStories: /.*(?:Preview|Matrix|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    loopFocus: true,
    orientation: 'horizontal',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: (args) => <MenubarPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
