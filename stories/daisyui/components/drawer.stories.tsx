import type { Meta, StoryObj } from '@storybook/react-vite';

function DrawerStory() {
  return (
    <div className="drawer drawer-open relative h-52 min-h-52 w-[min(100%,34rem)] max-w-[34rem] overflow-hidden rounded-md border border-base-300 [&_.drawer-content]:ml-36 [&_.drawer-content]:flex [&_.drawer-content]:min-h-full [&_.drawer-content]:items-center [&_.drawer-overlay]:hidden [&_.drawer-side]:absolute [&_.drawer-side]:inset-y-0 [&_.drawer-side]:left-0 [&_.drawer-side]:h-full [&_.drawer-side]:w-36 [&_.drawer-side>*:not(.drawer-overlay)]:min-h-full [&_.drawer-side>*:not(.drawer-overlay)]:w-36">
      <input
        aria-label="drawer"
        type="checkbox"
        className="drawer-toggle"
        defaultChecked
      />
      <div className="drawer-content p-4">Drawer content</div>
      <div className="drawer-side relative">
        <div aria-hidden="true" className="drawer-overlay" />
        <ul className="menu bg-base-200 min-h-full w-36 p-2">
          <li>
            <a href="#daisyui-drawer-item">Item</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

DrawerStory.displayName = 'DrawerStory';

const meta = {
  title: 'daisyUI/Drawer',
  component: DrawerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI drawer themed preview',
      },
    },
  },
} satisfies Meta<typeof DrawerStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
