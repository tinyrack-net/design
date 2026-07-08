import type { Meta, StoryObj } from '@storybook/react-vite';

function FieldsetStory() {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Fieldset</legend>
      <input className="input" placeholder="Input" />
    </fieldset>
  );
}

FieldsetStory.displayName = 'FieldsetStory';

const meta = {
  title: 'daisyUI/Fieldset',
  component: FieldsetStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI fieldset themed preview',
      },
    },
  },
} satisfies Meta<typeof FieldsetStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
