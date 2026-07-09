import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  type FormMessageVariant,
  formControlSizes,
  formMessageVariants,
} from '../../src/components/form/contract.js';
import { Field, FormMessage, Input, Label } from '../../src/components/form/react.js';

type ComponentStoryProps = {
  disabled: boolean;
  invalid: boolean;
  message: string;
  messageVariant: FormMessageVariant;
  size: FormControlSize;
};

function FieldStory({
  disabled,
  invalid,
  message,
  messageVariant,
  size,
}: ComponentStoryProps) {
  return (
    <Field size={size}>
      <Label htmlFor="field-rack-name">Rack name</Label>
      <Input
        disabled={disabled}
        id="field-rack-name"
        invalid={invalid}
        placeholder="rack-a-01"
        size={size}
      />
      <FormMessage variant={messageVariant}>{message}</FormMessage>
    </Field>
  );
}

FieldStory.displayName = 'FieldStory';

const meta = {
  title: 'Components/Form/Field',
  component: FieldStory,
  args: {
    disabled: false,
    invalid: false,
    message: 'Use a stable rack identifier.',
    messageVariant: 'neutral',
    size: 'md',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Native disabled state for the composed control.',
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state forwarded to the composed control.',
    },
    message: {
      control: 'text',
      description: 'Supporting message text.',
    },
    messageVariant: {
      control: 'select',
      options: formMessageVariants,
      description: 'Message tone.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Shared field and control size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Field composition primitives for native form controls.',
      },
    },
  },
} satisfies Meta<typeof FieldStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
