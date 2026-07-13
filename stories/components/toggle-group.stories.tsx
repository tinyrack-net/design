import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '../../src/components/toggle/index.js';
import { ToggleGroup } from '../../src/components/toggle-group/index.js';

type StoryArgs = {
  disabled: boolean;
  multiple: boolean;
  orientation: 'horizontal' | 'vertical';
  value: string;
};

export function ToggleGroupPreview({
  disabled,
  multiple,
  orientation,
  value,
}: StoryArgs) {
  return (
    <ToggleGroup
      key={`${multiple}:${value}`}
      defaultValue={[value]}
      disabled={disabled}
      multiple={multiple}
      orientation={orientation}
    >
      <Toggle value="start">Start</Toggle>
      <Toggle value="center">Center</Toggle>
      <Toggle value="end">End</Toggle>
    </ToggleGroup>
  );
}

const meta = {
  title: 'Components/Toggle Group',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    multiple: false,
    orientation: 'horizontal',
    value: 'start',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
    value: { control: 'text' },
  },
  render: (args) => <ToggleGroupPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
