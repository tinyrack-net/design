import type { Meta, StoryObj } from '@storybook/react-vite';

function FooterStory() {
  return (
    <footer className="footer bg-base-200 p-4">
      <aside>
        <p>Tinyrack Themes</p>
      </aside>
    </footer>
  );
}

FooterStory.displayName = 'FooterStory';

const meta = {
  title: 'daisyUI/Footer',
  component: FooterStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI footer themed preview',
      },
    },
  },
} satisfies Meta<typeof FooterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
