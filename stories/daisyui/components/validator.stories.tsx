import type { Meta, StoryObj } from '@storybook/react-vite';

function ValidatorStory() {
  return (
    <input
      className="input validator"
      required
      type="email"
      defaultValue="hello@tinyrack.net"
    />
  );
}

ValidatorStory.displayName = 'ValidatorStory';

const meta = {
  title: 'daisyUI/Validator',
  component: ValidatorStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI validator themed preview',
      },
    },
  },
} satisfies Meta<typeof ValidatorStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
