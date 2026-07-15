import { Drawer } from '@tinyrack/ui/components/drawer';
import { Select } from '@tinyrack/ui/components/select';
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
  modal: boolean;
  swipeDirection: 'down' | 'up' | 'left' | 'right';
};

type DrawerPreviewProps = StoryArgs & {
  onOpenChange?: (open: boolean) => void;
  onSnapPointChange?: (snapPoint: StoryArgs['activeSnapPoint']) => void;
};

const drawerHandle = Drawer.createHandle<{ title: string }>();

export function DrawerProviderHandlePreview() {
  return (
    <Drawer.Provider>
      <div className="relative min-h-48 w-full overflow-hidden rounded-md">
        <Drawer.IndentBackground />
        <Drawer.Indent>
          <div className="grid min-h-48 content-center gap-3 rounded-md border border-tinyrack p-4">
            <span>Provider-coordinated page surface</span>
            <Drawer.Trigger
              handle={drawerHandle}
              payload={{ title: 'Detached rack actions' }}
            >
              Open detached drawer
            </Drawer.Trigger>
          </div>
        </Drawer.Indent>
        <Drawer.Root handle={drawerHandle} swipeDirection="down">
          {({ payload }) => (
            <>
              <Drawer.SwipeArea />
              <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Viewport>
                  <Drawer.Popup>
                    <Drawer.Content>
                      <Drawer.Title>
                        {(payload as { title?: string } | undefined)?.title ??
                          'Detached rack actions'}
                      </Drawer.Title>
                      <Drawer.Description>
                        The trigger and drawer share an imperative handle.
                      </Drawer.Description>
                      <Drawer.Close>Close</Drawer.Close>
                    </Drawer.Content>
                  </Drawer.Popup>
                </Drawer.Viewport>
              </Drawer.Portal>
            </>
          )}
        </Drawer.Root>
      </div>
    </Drawer.Provider>
  );
}

export function DrawerPreview({
  label,
  open,
  modal,
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
    <Drawer.Root
      {...stateProps}
      {...snapStateProps}
      modal={modal}
      snapPoints={Object.values(snapPointValues)}
      swipeDirection={swipeDirection}
    >
      <Drawer.Trigger>{label}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title>Rack settings</Drawer.Title>
              <Drawer.Description>Update deployment preferences.</Drawer.Description>
              <Select.Root
                defaultValue="production"
                items={{ production: 'Production', staging: 'Staging' }}
              >
                <Select.Label>Environment</Select.Label>
                <Select.Trigger aria-label="Environment">
                  <Select.Value />
                  <Select.Icon aria-hidden="true">
                    <ChevronDown />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner>
                    <Select.Popup>
                      <Select.List>
                        <Select.Item value="production">
                          <Select.ItemText>Production</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="staging">
                          <Select.ItemText>Staging</Select.ItemText>
                        </Select.Item>
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
              <Drawer.Root>
                <Drawer.Trigger>Open nested confirmation</Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Backdrop />
                  <Drawer.Viewport>
                    <Drawer.Popup>
                      <Drawer.Content>
                        <Drawer.Title>Confirm environment</Drawer.Title>
                        <Drawer.Description>
                          Nested drawers indent their parent surface.
                        </Drawer.Description>
                        <Drawer.Close>Back</Drawer.Close>
                      </Drawer.Content>
                    </Drawer.Popup>
                  </Drawer.Viewport>
                </Drawer.Portal>
              </Drawer.Root>
              <Drawer.Close>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const meta = {
  title: 'Components/Drawer',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    activeSnapPoint: 'full',
    label: 'Open settings',
    open: false,
    modal: true,
    swipeDirection: 'down',
  },
  argTypes: {
    activeSnapPoint: {
      control: 'select',
      options: ['compact', 'medium', 'full'],
    },
    label: { control: 'text' },
    open: { control: 'boolean' },
    modal: { control: 'boolean' },
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
