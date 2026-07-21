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
  orientation: 'horizontal' | 'vertical';
};

export function MenubarPreview({ disabled, orientation }: StoryArgs) {
  const [result, setResult] = useState('No command selected');

  return (
    <div>
      <TRMenubar
        aria-label="Application menu"
        disabled={disabled}
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
        <MenubarPreview disabled={false} orientation="vertical" />
      </section>
      <section className="grid content-start gap-2">
        <strong>Disabled</strong>
        <MenubarPreview disabled orientation="horizontal" />
      </section>
    </div>
  );
}

const meta = {
  title: 'Components/Menubar',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
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
