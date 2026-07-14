import { Drawer } from '@tinyrack/ui/components/drawer';
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
              (nextEntry?.[0] as StoryArgs['activeSnapPoint'] | undefined) ?? 'medium',
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
              <label>
                Environment
                <select defaultValue="production">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                </select>
              </label>
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
    activeSnapPoint: 'medium',
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
