import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  formControlSizes,
  type RadioGroupOrientation,
  radioGroupOrientations,
} from '../../src/components/form/contract.js';
import { Radio, RadioGroup } from '../../src/components/form/react.js';

type ComponentStoryProps = {
  disabled: boolean;
  invalid: boolean;
  orientation: RadioGroupOrientation;
  size: FormControlSize;
};

function RadioStory({ disabled, invalid, orientation, size }: ComponentStoryProps) {
  return (
    <RadioGroup aria-label="Rack role" orientation={orientation}>
      <Radio
        defaultChecked
        disabled={disabled}
        invalid={invalid}
        name="radio-rack-role"
        size={size}
        value="primary"
      >
        Primary
      </Radio>
      <Radio
        disabled={disabled}
        invalid={invalid}
        name="radio-rack-role"
        size={size}
        value="replica"
      >
        Replica
      </Radio>
    </RadioGroup>
  );
}

RadioStory.displayName = 'RadioStory';

const meta = {
  title: 'Components/Form/Radio',
  component: RadioStory,
  args: {
    disabled: false,
    invalid: false,
    orientation: 'vertical',
    size: 'md',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Native disabled state for every radio.',
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state mapped to aria-invalid and data-invalid.',
    },
    orientation: {
      control: 'select',
      options: radioGroupOrientations,
      description: 'Radio group layout direction.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Radio size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native radio inputs grouped by a fieldset.',
      },
    },
  },
} satisfies Meta<typeof RadioStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
