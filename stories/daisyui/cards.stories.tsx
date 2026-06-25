import type { Meta, StoryObj } from '@storybook/react-vite';

function DaisyCard() {
  return (
    <article className="card bg-base-100 text-base-content shadow-md max-w-md">
      <div className="card-body">
        <h2 className="card-title">Tinyrack theme</h2>
        <p>Theme tokens shared through daisyUI CSS variables.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" type="button">
            Use theme
          </button>
        </div>
      </div>
    </article>
  );
}

const meta = {
  title: 'daisyUI/Cards',
  component: DaisyCard,
} satisfies Meta<typeof DaisyCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
