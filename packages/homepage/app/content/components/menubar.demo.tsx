import { Menu } from '@tinyrack/ui/components/menu';
import { Menubar } from '@tinyrack/ui/components/menubar';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
  label: string;
  loopFocus: boolean;
};

export function MenubarPreview({ disabled, loopFocus, orientation, label }: StoryArgs) {
  const [result, setResult] = useState('No command selected');

  return (
    <div>
      <Menubar
        aria-label={label}
        disabled={disabled}
        loopFocus={loopFocus}
        orientation={orientation}
      >
        <Menu.Root>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item onClick={() => setResult('New rack selected')}>
                  New
                </Menu.Item>
                <Menu.Item onClick={() => setResult('Open selected')}>Open</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item onClick={() => setResult('Rename selected')}>
                  Rename
                </Menu.Item>
                <Menu.Item disabled>Duplicate unavailable</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator aria-hidden="true">
                    ✓
                  </Menu.CheckboxItemIndicator>
                  Show status
                </Menu.CheckboxItem>
                <Menu.LinkItem href="#shortcuts">Keyboard shortcuts</Menu.LinkItem>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Menubar>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
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
    label: 'Application menu',
    loopFocus: true,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
    label: { control: 'text' },
    loopFocus: { control: 'boolean' },
  },
  render: (args) => <MenubarPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
