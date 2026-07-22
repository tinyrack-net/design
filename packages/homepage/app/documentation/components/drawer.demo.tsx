import { TRDrawer } from '@tinyrack/ui/components/drawer';
import { TRInput } from '@tinyrack/ui/components/input';
import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  activeSnapPoint: 'compact' | 'medium' | 'full';
  label: string;
  open: boolean;
  swipeDirection: 'down' | 'up' | 'left' | 'right';
};

type DrawerPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
  onSnapPointChange?: (snapPoint: StoryArgs['activeSnapPoint']) => void;
};

const drawerHandle = TRDrawer.createHandle<{ title: string }>();

export const drawerBasicSource = `import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

export function SettingsDrawer() {
  return (
    <TRDrawer.Root>
      <TRDrawer.Trigger>Open settings</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <TRDrawer.Description>Update deployment preferences.</TRDrawer.Description>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}`;

export const drawerSnapPointsSource = `import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

export function SnapPointDrawer() {
  return (
    <TRDrawer.Root defaultSnapPoint={0.35} snapPoints={[0.35, 0.7, 1]}>
      <TRDrawer.Trigger>Open snap drawer</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <TRDrawer.Description>Drag between three snap points.</TRDrawer.Description>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}`;

export const drawerDirectionsSource = `import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

export function DirectionalDrawer() {
  return (
    <TRDrawer.Root swipeDirection="right">
      <TRDrawer.Trigger>Open side drawer</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Side drawer</TRDrawer.Title>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}`;

export const drawerProviderHandleSource = `import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';

const drawerHandle = TRDrawer.createHandle<{ title: string }>();

export function DetachedDrawer() {
  return (
    <TRDrawer.Provider>
      <TRDrawer.IndentBackground />
      <TRDrawer.Indent>
        <TRDrawer.Trigger handle={drawerHandle} payload={{ title: 'Rack actions' }}>
          Open detached drawer
        </TRDrawer.Trigger>
      </TRDrawer.Indent>
      <TRDrawer.Root handle={drawerHandle}>
        {({ payload }) => (
          <TRDrawer.Portal>
            <TRDrawer.Backdrop />
            <TRDrawer.Viewport>
              <TRDrawer.Popup>
                <TRDrawer.Content>
                  <TRDrawer.Title>{payload?.title}</TRDrawer.Title>
                  <TRDrawer.Close>Close</TRDrawer.Close>
                </TRDrawer.Content>
              </TRDrawer.Popup>
            </TRDrawer.Viewport>
          </TRDrawer.Portal>
        )}
      </TRDrawer.Root>
    </TRDrawer.Provider>
  );
}`;

export const drawerVirtualKeyboardSource = `import '@tinyrack/ui/components/drawer.css';
import { TRDrawer } from '@tinyrack/ui/components/drawer';
import { TRInput } from '@tinyrack/ui/components/input';

export function KeyboardAwareDrawer() {
  return (
    <TRDrawer.Root>
      <TRDrawer.Trigger>Edit rack</TRDrawer.Trigger>
      <TRDrawer.VirtualKeyboardProvider>
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <TRDrawer.Title>Edit rack</TRDrawer.Title>
                <label htmlFor="rack-name">Rack name</label>
                <TRInput id="rack-name" name="rackName" />
                <TRDrawer.Close>Save</TRDrawer.Close>
              </TRDrawer.Content>
            </TRDrawer.Popup>
          </TRDrawer.Viewport>
        </TRDrawer.Portal>
      </TRDrawer.VirtualKeyboardProvider>
    </TRDrawer.Root>
  );
}`;

export function DrawerProviderHandlePreview() {
  return (
    <TRDrawer.Provider>
      <div className="relative min-h-48 w-full overflow-hidden rounded-md">
        <TRDrawer.IndentBackground />
        <TRDrawer.Indent>
          <div className="grid min-h-48 content-center gap-3 rounded-md border border-tinyrack p-4">
            <span>Provider-coordinated page surface</span>
            <TRDrawer.Trigger
              handle={drawerHandle}
              payload={{ title: 'Detached rack actions' }}
            >
              Open detached drawer
            </TRDrawer.Trigger>
          </div>
        </TRDrawer.Indent>
        <TRDrawer.Root handle={drawerHandle} swipeDirection="down">
          {({ payload }) => (
            <>
              <TRDrawer.SwipeArea />
              <TRDrawer.Portal>
                <TRDrawer.Backdrop />
                <TRDrawer.Viewport>
                  <TRDrawer.Popup>
                    <TRDrawer.Content>
                      <TRDrawer.Title>
                        {payload?.title ?? 'Detached rack actions'}
                      </TRDrawer.Title>
                      <TRDrawer.Description>
                        The trigger and drawer share an imperative handle.
                      </TRDrawer.Description>
                      <TRDrawer.Close>Close</TRDrawer.Close>
                    </TRDrawer.Content>
                  </TRDrawer.Popup>
                </TRDrawer.Viewport>
              </TRDrawer.Portal>
            </>
          )}
        </TRDrawer.Root>
      </div>
    </TRDrawer.Provider>
  );
}

export function DrawerPreview({
  label,
  open,
  onOpenChange,
  activeSnapPoint,
  onSnapPointChange,
  swipeDirection,
}: DrawerPreviewProps) {
  const snapPointValues = { compact: 0.35, medium: 0.7, full: 1 } as const;
  const snapPoint = snapPointValues[activeSnapPoint];
  const stateProps =
    onOpenChange === undefined ? { defaultOpen: open } : { onOpenChange, open };
  const snapStateProps =
    onSnapPointChange === undefined
      ? { defaultSnapPoint: snapPoint }
      : {
          onSnapPointChange: (nextSnapPoint: number | string | null) => {
            const nextEntry = Object.entries(snapPointValues).find(
              ([, value]) => value === nextSnapPoint,
            );
            onSnapPointChange(
              (nextEntry?.[0] as StoryArgs['activeSnapPoint'] | undefined) ?? 'full',
            );
          },
          snapPoint,
        };

  return (
    <TRDrawer.Root
      {...stateProps}
      {...snapStateProps}
      snapPoints={Object.values(snapPointValues)}
      swipeDirection={swipeDirection}
    >
      <TRDrawer.Trigger>{label}</TRDrawer.Trigger>
      <TRDrawer.Portal>
        <TRDrawer.Backdrop />
        <TRDrawer.Viewport>
          <TRDrawer.Popup>
            <TRDrawer.Content>
              <TRDrawer.Title>Rack settings</TRDrawer.Title>
              <TRDrawer.Description>
                Update deployment preferences.
              </TRDrawer.Description>
              <TRSelect.Root
                defaultValue="production"
                items={{ production: 'Production', staging: 'Staging' }}
              >
                <TRSelect.Label>Environment</TRSelect.Label>
                <TRSelect.Trigger aria-label="Environment">
                  <TRSelect.Value />
                  <TRSelect.Icon aria-hidden="true">
                    <ChevronDown />
                  </TRSelect.Icon>
                </TRSelect.Trigger>
                <TRSelect.Portal>
                  <TRSelect.Positioner>
                    <TRSelect.Popup>
                      <TRSelect.List>
                        <TRSelect.Item value="production">
                          <TRSelect.ItemText>Production</TRSelect.ItemText>
                        </TRSelect.Item>
                        <TRSelect.Item value="staging">
                          <TRSelect.ItemText>Staging</TRSelect.ItemText>
                        </TRSelect.Item>
                      </TRSelect.List>
                    </TRSelect.Popup>
                  </TRSelect.Positioner>
                </TRSelect.Portal>
              </TRSelect.Root>
              <TRDrawer.Root>
                <TRDrawer.Trigger>Open nested confirmation</TRDrawer.Trigger>
                <TRDrawer.Portal>
                  <TRDrawer.Backdrop />
                  <TRDrawer.Viewport>
                    <TRDrawer.Popup>
                      <TRDrawer.Content>
                        <TRDrawer.Title>Confirm environment</TRDrawer.Title>
                        <TRDrawer.Description>
                          Nested drawers indent their parent surface.
                        </TRDrawer.Description>
                        <TRDrawer.Close>Back</TRDrawer.Close>
                      </TRDrawer.Content>
                    </TRDrawer.Popup>
                  </TRDrawer.Viewport>
                </TRDrawer.Portal>
              </TRDrawer.Root>
              <TRDrawer.Close>Close</TRDrawer.Close>
            </TRDrawer.Content>
          </TRDrawer.Popup>
        </TRDrawer.Viewport>
      </TRDrawer.Portal>
    </TRDrawer.Root>
  );
}

export function DrawerDirectionPreview() {
  return (
    <DrawerPreview
      activeSnapPoint="full"
      label="Open side drawer"
      open={false}
      swipeDirection="right"
    />
  );
}

export function DrawerVirtualKeyboardPreview() {
  return (
    <TRDrawer.Root swipeDirection="down">
      <TRDrawer.Trigger>Edit rack</TRDrawer.Trigger>
      <TRDrawer.VirtualKeyboardProvider>
        <TRDrawer.Portal>
          <TRDrawer.Backdrop />
          <TRDrawer.Viewport>
            <TRDrawer.Popup>
              <TRDrawer.Content>
                <TRDrawer.Title>Edit rack</TRDrawer.Title>
                <label className="grid gap-2" htmlFor="drawer-rack-name">
                  Rack name
                </label>
                <TRInput
                  className="border border-tinyrack p-2"
                  defaultValue="rack-alpha"
                  id="drawer-rack-name"
                />
                <TRDrawer.Close>Save</TRDrawer.Close>
              </TRDrawer.Content>
            </TRDrawer.Popup>
          </TRDrawer.Viewport>
        </TRDrawer.Portal>
      </TRDrawer.VirtualKeyboardProvider>
    </TRDrawer.Root>
  );
}

const meta = {
  title: 'Components/Drawer',
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    activeSnapPoint: 'full',
    label: 'Open settings',
    open: false,
    swipeDirection: 'down',
  },
  argTypes: {
    label: { control: 'text' },
    swipeDirection: {
      control: 'select',
      options: ['down', 'up', 'left', 'right'],
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <DrawerPreview
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onSnapPointChange={(activeSnapPoint) => updateArgs({ activeSnapPoint })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
