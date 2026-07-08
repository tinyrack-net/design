import type { Meta, StoryObj } from '@storybook/react-vite';

function DiffStory() {
  return (
    <div className="diff aspect-16/9 max-h-24">
      <div className="diff-item-1">
        <div className="bg-primary text-primary-content grid place-content-center text-tinyrack-sm">
          Before
        </div>
      </div>
      <div className="diff-item-2">
        <div className="bg-secondary text-secondary-content grid place-content-center text-tinyrack-sm">
          After
        </div>
      </div>
      <div className="diff-resizer" />
    </div>
  );
}

DiffStory.displayName = 'DiffStory';

const meta = {
  title: 'daisyUI/Diff',
  component: DiffStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI diff themed preview',
      },
    },
  },
} satisfies Meta<typeof DiffStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
