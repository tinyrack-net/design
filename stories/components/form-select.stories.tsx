import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  formControlSizes,
} from '../../src/components/form/contract.js';
import { Field, FormMessage, Label, Select } from '../../src/components/form/react.js';

type ComponentStoryProps = {
  disabled: boolean;
  invalid: boolean;
  size: FormControlSize;
};

function SelectStory({ disabled, invalid, size }: ComponentStoryProps) {
  return (
    <Field size={size}>
      <Label htmlFor="select-region">Region</Label>
      <Select
        defaultValue="seoul"
        disabled={disabled}
        id="select-region"
        invalid={invalid}
        size={size}
      >
        <option value="seoul">Seoul</option>
        <option value="tokyo">Tokyo</option>
        <option value="singapore">Singapore</option>
      </Select>
      <FormMessage variant={invalid ? 'error' : 'neutral'}>
        Use native select for compact option sets.
      </FormMessage>
    </Field>
  );
}

SelectStory.displayName = 'SelectStory';

const meta = {
  title: 'Components/Form/Select',
  component: SelectStory,
  args: {
    disabled: false,
    invalid: false,
    size: 'md',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Native disabled state.',
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state mapped to aria-invalid and data-invalid.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Select size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native select wrapper with shared text control styling.',
      },
    },
  },
} satisfies Meta<typeof SelectStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
