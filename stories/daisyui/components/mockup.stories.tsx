import type { Meta, StoryObj } from '@storybook/react-vite';

function MockupStory() {
  return (
    <div className="mockup-code">
      <pre data-prefix="$">
        <code>pnpm test</code>
      </pre>
    </div>
  );
}

MockupStory.displayName = 'MockupStory';

const meta = {
  title: 'daisyUI/Mockup',
  component: MockupStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI mockup themed preview',
      },
    },
  },
} satisfies Meta<typeof MockupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
