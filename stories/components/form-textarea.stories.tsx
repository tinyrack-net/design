import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  formControlSizes,
} from '../../src/components/form/contract.js';
import {
  Field,
  FormMessage,
  Label,
  Textarea,
} from '../../src/components/form/react.js';

type ComponentStoryProps = {
  disabled: boolean;
  invalid: boolean;
  placeholder: string;
  rows: number;
  size: FormControlSize;
};

function TextareaStory({
  disabled,
  invalid,
  placeholder,
  rows,
  size,
}: ComponentStoryProps) {
  return (
    <Field size={size}>
      <Label htmlFor="textarea-notes">Notes</Label>
      <Textarea
        disabled={disabled}
        id="textarea-notes"
        invalid={invalid}
        placeholder={placeholder}
        rows={rows}
        size={size}
      />
      <FormMessage variant={invalid ? 'error' : 'neutral'}>
        Use for multiline operational notes.
      </FormMessage>
    </Field>
  );
}

TextareaStory.displayName = 'TextareaStory';

const meta = {
  title: 'Components/Form/Textarea',
  component: TextareaStory,
  args: {
    disabled: false,
    invalid: false,
    placeholder: 'Maintenance window, owner, or alert routing.',
    rows: 4,
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
    placeholder: {
      control: 'text',
      description: 'Textarea placeholder.',
    },
    rows: {
      control: { type: 'number', min: 2, max: 8, step: 1 },
      description: 'Native rows attribute.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Textarea size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native textarea wrapper with shared text control styling.',
      },
    },
  },
} satisfies Meta<typeof TextareaStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
