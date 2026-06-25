import type { Meta, StoryObj } from '@storybook/react-vite';

function DaisyButtons() {
  return (
    <div className="flex gap-3">
      <button className="btn btn-primary" type="button">
        Primary
      </button>
      <button className="btn btn-secondary" type="button">
        Secondary
      </button>
      <button className="btn btn-outline" type="button">
        Outline
      </button>
    </div>
  );
}

const meta = {
  title: 'daisyUI/Buttons',
  component: DaisyButtons,
} satisfies Meta<typeof DaisyButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {};
