import { Menu } from '@tinyrack/ui/components/menu';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type MenuStoryArgs = { disabledItem: boolean; label: string; open: boolean };

type MenuExampleProps = Partial<MenuStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

const menuHandle = Menu.createHandle<{ rack: string }>();

export function MenuHandleExample() {
  const [result, setResult] = useState('No detached action selected');
  return (
    <div className="grid gap-3">
      <Menu.Trigger handle={menuHandle} payload={{ rack: 'Rack Delta' }}>
        Detached rack actions
      </Menu.Trigger>
      <Menu.Root handle={menuHandle}>
        {({ payload }) => (
          <Menu.Portal>
            <Menu.Backdrop />
            <Menu.Positioner sideOffset={8}>
              <Menu.Popup>
                <Menu.Arrow />
                <Menu.Viewport>
                  <Menu.Group>
                    <Menu.GroupLabel>
                      {(payload as { rack?: string } | undefined)?.rack ??
                        'Detached rack'}
                    </Menu.GroupLabel>
                    <Menu.Item
                      onClick={() =>
                        setResult(
                          `${(payload as { rack?: string } | undefined)?.rack ?? 'Detached rack'} inspected`,
                        )
                      }
                    >
                      Inspect rack
                    </Menu.Item>
                  </Menu.Group>
                </Menu.Viewport>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        )}
      </Menu.Root>
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function MenuExample({
  disabledItem = false,
  label = 'Actions',
  open = false,
  onOpenChange,
}: MenuExampleProps) {
  const [compact, setCompact] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [result, setResult] = useState('No action selected');
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };

  return (
    <Menu.Root {...stateProps}>
      <Menu.Trigger>{label}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Backdrop />
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Arrow />
            <Menu.Viewport>
              <Menu.Group>
                <Menu.GroupLabel>Rack actions</Menu.GroupLabel>
                <Menu.Item onClick={() => setResult('Restart selected')}>
                  Restart
                </Menu.Item>
                <Menu.Item
                  disabled={disabledItem}
                  onClick={() => setResult('Stop selected')}
                >
                  Stop
                </Menu.Item>
              </Menu.Group>
              <Menu.CheckboxItem checked={compact} onCheckedChange={setCompact}>
                <Menu.CheckboxItemIndicator aria-hidden="true">
                  ✓
                </Menu.CheckboxItemIndicator>
                Compact view
              </Menu.CheckboxItem>
              <Menu.RadioGroup onValueChange={setDensity} value={density}>
                <Menu.RadioItem value="comfortable">
                  <Menu.RadioItemIndicator aria-hidden="true">
                    ●
                  </Menu.RadioItemIndicator>
                  Comfortable density
                </Menu.RadioItem>
                <Menu.RadioItem value="compact">
                  <Menu.RadioItemIndicator aria-hidden="true">
                    ●
                  </Menu.RadioItemIndicator>
                  Compact density
                </Menu.RadioItem>
              </Menu.RadioGroup>
              <Menu.Separator />
              <Menu.LinkItem href="#rack-details">Rack details</Menu.LinkItem>
              <Menu.SubmenuRoot>
                <Menu.SubmenuTrigger>Move to</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup>
                      <Menu.Arrow />
                      <Menu.Item onClick={() => setResult('Moved to Production')}>
                        Production
                      </Menu.Item>
                      <Menu.Item onClick={() => setResult('Moved to Staging')}>
                        Staging
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.SubmenuRoot>
            </Menu.Viewport>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}; compact {compact ? 'on' : 'off'}; density {density}
      </output>
    </Menu.Root>
  );
}

const meta = {
  title: 'Components/Menu',
  parameters: { layout: 'centered' },
  args: { disabledItem: false, label: 'Actions', open: false },
  argTypes: {
    disabledItem: { control: 'boolean' },
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<MenuStoryArgs>();

    return <MenuExample {...args} onOpenChange={(open) => updateArgs({ open })} />;
  },
} satisfies Meta<MenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
