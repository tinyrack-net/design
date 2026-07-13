import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Checkbox } from '../../src/components/checkbox/index.js';

type StoryArgs = {
  label: string;
  checked: boolean;
  disabled: boolean;
};

export function CheckboxPreview({ label, checked, disabled }: StoryArgs) {
  const [currentChecked, setCurrentChecked] = useState(checked);

  useEffect(() => {
    setCurrentChecked(checked);
  }, [checked]);

  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        aria-label={label}
        checked={currentChecked}
        disabled={disabled}
        name="backups"
        onCheckedChange={setCurrentChecked}
      >
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </div>
  );
}

const meta = {
  title: 'Components/Checkbox',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Enable backups',
    checked: true,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => <CheckboxPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
