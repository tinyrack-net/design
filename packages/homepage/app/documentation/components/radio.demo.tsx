import type { TRRadioUiSize } from '@tinyrack/ui/components/radio';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { useId } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  label: string;
  readOnly: boolean;
  uiSize: TRRadioUiSize;
};

type RadioPreviewProps = Omit<StoryArgs, 'uiSize'> & {
  defaultSelected?: boolean;
  uiSize?: TRRadioUiSize;
};

export function RadioPreview({
  defaultSelected,
  disabled,
  label,
  readOnly,
  uiSize = 'md',
}: RadioPreviewProps) {
  const inputId = useId();
  return (
    <TRRadioGroup defaultValue={defaultSelected ? 'primary' : ''} readOnly={readOnly}>
      <div className="flex min-h-6 items-center gap-2">
        <TRRadio.Root disabled={disabled} id={inputId} uiSize={uiSize} value="primary">
          <TRRadio.Indicator aria-hidden="true" />
        </TRRadio.Root>
        <label
          className={`${
            disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'
          }${disabled ? ' text-tinyrack-text-muted' : ''}`}
          htmlFor={inputId}
        >
          {label}
        </label>
      </div>
    </TRRadioGroup>
  );
}

export function RadioStateComparison() {
  const groupId = useId();

  return (
    <div className="grid gap-4">
      <TRRadioGroup className="grid gap-3" defaultValue="disabled" name="radio-states">
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-selected`}
        >
          <TRRadio.Root id={`${groupId}-selected`} value="selected">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Available unselected
        </label>
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-available`}
        >
          <TRRadio.Root id={`${groupId}-available`} value="available">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Available alternate
        </label>
        <label
          className="flex min-h-6 items-center gap-2 text-tinyrack-text-muted"
          htmlFor={`${groupId}-disabled`}
        >
          <TRRadio.Root disabled id={`${groupId}-disabled`} value="disabled">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Disabled selected
        </label>
      </TRRadioGroup>
      <TRRadioGroup name="readonly-radio" readOnly value="">
        <label
          className="flex min-h-6 items-center gap-2"
          htmlFor={`${groupId}-readonly`}
        >
          <TRRadio.Root id={`${groupId}-readonly`} value="readonly">
            <TRRadio.Indicator aria-hidden="true" />
          </TRRadio.Root>
          Read-only unselected
        </label>
      </TRRadioGroup>
    </div>
  );
}

const meta = {
  title: 'Components/Radio',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    label: 'Primary rack',
    readOnly: false,
    uiSize: 'md',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <RadioPreview {...args} defaultSelected />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
