import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  valid?: boolean;
  showHint?: boolean;
};

function ValidatorStory(controlValues: ComponentStoryProps) {
  const valid = controlValues.valid ?? true;

  return (
    <label className="grid w-80 gap-2">
      <input
        className="input validator w-full"
        defaultValue={valid ? 'hello@tinyrack.net' : 'not-an-email'}
        required
        type="email"
      />
      {(controlValues.showHint ?? true) ? (
        <p className="validator-hint">Enter a valid email address.</p>
      ) : null}
    </label>
  );
}

ValidatorStory.displayName = 'ValidatorStory';

const meta = {
  title: 'daisyUI/Validator',
  component: ValidatorStory,
  tags: ['autodocs'],
  args: {
    valid: true,
    showHint: true,
  },
  argTypes: {
    valid: {
      control: 'boolean',
      description: 'Uses a valid email value.',
    },
    showHint: {
      control: 'boolean',
      description: 'Shows validator-hint content.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
