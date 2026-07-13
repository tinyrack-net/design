import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { NavigationMenu } from '../../src/components/navigation-menu/index.js';

type StoryArgs = {
  label: string;
  disabled: boolean;
  openSection: 'none' | 'platform' | 'resources';
};

type NavigationMenuPreviewProps = StoryArgs & {
  onOpenSectionChange?: (value: StoryArgs['openSection']) => void;
};

export function NavigationMenuPreview({
  label,
  disabled,
  openSection,
  onOpenSectionChange,
}: NavigationMenuPreviewProps) {
  const value = openSection === 'none' ? null : openSection;
  const stateProps =
    onOpenSectionChange === undefined
      ? { defaultValue: value }
      : {
          onValueChange: (nextValue: unknown) => {
            const normalizedValue =
              nextValue === 'platform' || nextValue === 'resources'
                ? nextValue
                : 'none';
            onOpenSectionChange(normalizedValue);
          },
          value,
        };

  return (
    <NavigationMenu.Root {...stateProps}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="platform">
          <NavigationMenu.Trigger disabled={disabled}>
            {label} <NavigationMenu.Icon>⌄</NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <strong>Platform</strong>
            <p>Build and observe every rack from one place.</p>
            <NavigationMenu.Link href="#deployments">Deployments</NavigationMenu.Link>
            <NavigationMenu.Link href="#metrics">Metrics</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <strong>Resources</strong>
            <NavigationMenu.Link href="#guides">Guides</NavigationMenu.Link>
            <NavigationMenu.Link href="#api">API reference</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#status">Status</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner>
          <NavigationMenu.Popup>
            <NavigationMenu.Viewport />
            <NavigationMenu.Arrow />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}

const meta = {
  title: 'Components/Navigation Menu',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Documentation',
    disabled: false,
    openSection: 'none',
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    openSection: {
      control: 'select',
      options: ['none', 'platform', 'resources'],
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <NavigationMenuPreview
        {...args}
        onOpenSectionChange={(openSection) => updateArgs({ openSection })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
