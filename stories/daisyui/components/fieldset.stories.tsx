import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof daisySizeOptions)[number];
  disabled?: boolean;
};

function FieldsetStory(controlValues: ComponentStoryProps) {
  const size = controlValues.size ?? 'md';

  return (
    <fieldset
      className="fieldset w-80 rounded-box border border-base-300 p-4"
      disabled={controlValues.disabled ?? false}
    >
      <legend className="fieldset-legend">Node access</legend>
      <label className="label" htmlFor="daisy-fieldset-hostname">
        Hostname
      </label>
      <input
        className={['input w-full', `input-${size}`].filter(Boolean).join(' ')}
        defaultValue="nas-01"
        id="daisy-fieldset-hostname"
      />
    </fieldset>
  );
}

FieldsetStory.displayName = 'FieldsetStory';

const meta = {
  title: 'daisyUI/Fieldset',
  component: FieldsetStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
