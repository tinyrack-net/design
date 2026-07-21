import { TRMenu } from '@tinyrack/ui/components/menu';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type MenuStoryArgs = { disabledItem: boolean };

const menuHandle = TRMenu.createHandle<{ rack: string }>();

export function MenuHandleExample() {
  const [result, setResult] = useState('No detached action selected');
  return (
    <div className="grid gap-3">
      <TRMenu.Trigger handle={menuHandle} payload={{ rack: 'Rack Delta' }}>
        Detached rack actions
      </TRMenu.Trigger>
      <TRMenu.Root handle={menuHandle}>
        {({ payload }) => (
          <TRMenu.Portal>
            <TRMenu.Backdrop />
            <TRMenu.Positioner sideOffset={8}>
              <TRMenu.Popup>
                <TRMenu.Arrow />
                <TRMenu.Viewport>
                  <TRMenu.Group>
                    <TRMenu.GroupLabel>
                      {(payload as { rack?: string } | undefined)?.rack ??
                        'Detached rack'}
                    </TRMenu.GroupLabel>
                    <TRMenu.Item
                      onClick={() =>
                        setResult(
                          `${(payload as { rack?: string } | undefined)?.rack ?? 'Detached rack'} inspected`,
                        )
                      }
                    >
                      Inspect rack
                    </TRMenu.Item>
                  </TRMenu.Group>
                </TRMenu.Viewport>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        )}
      </TRMenu.Root>
      <output aria-live="polite">{result}</output>
    </div>
  );
}

export function MenuExample({ disabledItem = false }: Partial<MenuStoryArgs>) {
  const [compact, setCompact] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [result, setResult] = useState('No action selected');

  return (
    <TRMenu.Root>
      <TRMenu.Trigger>Actions</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Backdrop />
        <TRMenu.Positioner sideOffset={8}>
          <TRMenu.Popup>
            <TRMenu.Arrow />
            <TRMenu.Viewport>
              <TRMenu.Group>
                <TRMenu.GroupLabel>Rack actions</TRMenu.GroupLabel>
                <TRMenu.Item onClick={() => setResult('Restart selected')}>
                  Restart
                </TRMenu.Item>
                <TRMenu.Item
                  disabled={disabledItem}
                  onClick={() => setResult('Stop selected')}
                >
                  Stop
                </TRMenu.Item>
              </TRMenu.Group>
              <TRMenu.CheckboxItem checked={compact} onCheckedChange={setCompact}>
                <TRMenu.CheckboxItemIndicator aria-hidden="true">
                  ✓
                </TRMenu.CheckboxItemIndicator>
                Compact view
              </TRMenu.CheckboxItem>
              <TRMenu.RadioGroup onValueChange={setDensity} value={density}>
                <TRMenu.RadioItem value="comfortable">
                  <TRMenu.RadioItemIndicator aria-hidden="true">
                    ●
                  </TRMenu.RadioItemIndicator>
                  Comfortable density
                </TRMenu.RadioItem>
                <TRMenu.RadioItem value="compact">
                  <TRMenu.RadioItemIndicator aria-hidden="true">
                    ●
                  </TRMenu.RadioItemIndicator>
                  Compact density
                </TRMenu.RadioItem>
              </TRMenu.RadioGroup>
              <TRMenu.Separator />
              <TRMenu.LinkItem href="#rack-details">Rack details</TRMenu.LinkItem>
              <TRMenu.SubmenuRoot>
                <TRMenu.SubmenuTrigger>Move to</TRMenu.SubmenuTrigger>
                <TRMenu.Portal>
                  <TRMenu.Positioner>
                    <TRMenu.Popup>
                      <TRMenu.Arrow />
                      <TRMenu.Item onClick={() => setResult('Moved to Production')}>
                        Production
                      </TRMenu.Item>
                      <TRMenu.Item onClick={() => setResult('Moved to Staging')}>
                        Staging
                      </TRMenu.Item>
                    </TRMenu.Popup>
                  </TRMenu.Positioner>
                </TRMenu.Portal>
              </TRMenu.SubmenuRoot>
            </TRMenu.Viewport>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}; compact {compact ? 'on' : 'off'}; density {density}
      </output>
    </TRMenu.Root>
  );
}

const meta = {
  title: 'Components/Menu',
  parameters: { layout: 'centered' },
  args: { disabledItem: false },
  argTypes: {
    disabledItem: { control: 'boolean' },
  },
  render: (args) => <MenuExample {...args} />,
} satisfies Meta<MenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
