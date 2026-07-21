import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRSelect, type TRSelectTriggerUiSize } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type StoryArgs = {
  disabled: boolean;
  disabledItem: boolean;
  open: boolean;
  readOnly: boolean;
  uiSize: TRSelectTriggerUiSize;
  value: string | null;
};

type SelectPreviewProps = Omit<
  StoryArgs,
  'disabledItem' | 'open' | 'uiSize' | 'value'
> & {
  defaultOpen?: boolean;
  defaultValue?: string;
  disabledItem?: boolean;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  required?: boolean;
  uiSize?: TRSelectTriggerUiSize;
  value?: string | null;
};

const selectItems = {
  alpha: 'Rack Alpha',
  beta: 'Rack Beta',
  gamma: 'Rack Gamma',
  staging: 'Staging rack',
} as const;

const longSelectItems = Object.fromEntries(
  Array.from({ length: 18 }, (_, index) => [
    `rack-${index + 1}`,
    `Rack ${String(index + 1).padStart(2, '0')} · Seoul availability zone`,
  ]),
);

export function SelectLongCollection() {
  return (
    <TRSelect.Root defaultValue="rack-1" items={longSelectItems}>
      <TRSelect.Label>Long rack collection</TRSelect.Label>
      <TRSelect.Trigger aria-label="Long rack collection">
        <TRSelect.Value />
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner sideOffset={8}>
          <TRSelect.Popup>
            <TRSelect.Arrow />
            <TRSelect.ScrollUpArrow aria-label="Scroll up">↑</TRSelect.ScrollUpArrow>
            <TRSelect.List>
              {Object.entries(longSelectItems).map(([value, label]) => (
                <TRSelect.Item key={value} value={value}>
                  <TRSelect.ItemText>{label}</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              ))}
            </TRSelect.List>
            <TRSelect.ScrollDownArrow aria-label="Scroll down">
              ↓
            </TRSelect.ScrollDownArrow>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>
  );
}

export function SelectPreview({
  defaultOpen,
  defaultValue,
  disabled,
  disabledItem = false,
  label = 'Deployment rack',
  onOpenChange,
  onValueChange,
  open,
  readOnly,
  required,
  uiSize = 'md',
  value,
}: SelectPreviewProps) {
  const openProps = open === undefined ? { defaultOpen } : { open };
  const valueProps = value === undefined ? { defaultValue } : { value };

  return (
    <TRSelect.Root
      {...openProps}
      {...valueProps}
      disabled={disabled}
      items={selectItems}
      name="rack"
      onOpenChange={onOpenChange}
      onValueChange={(nextValue) =>
        onValueChange?.((nextValue as string | null) ?? null)
      }
      readOnly={readOnly}
      required={required}
    >
      <TRSelect.Label>{label}</TRSelect.Label>
      <TRSelect.Trigger aria-label={label} uiSize={uiSize}>
        <TRSelect.Value placeholder="Choose a rack" />
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner sideOffset={8}>
          <TRSelect.Popup>
            <TRSelect.Arrow />
            <TRSelect.ScrollUpArrow aria-label="Scroll up">↑</TRSelect.ScrollUpArrow>
            <TRSelect.List>
              <TRSelect.Group>
                <TRSelect.GroupLabel>Production</TRSelect.GroupLabel>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Rack Alpha</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Rack Beta</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
                <TRSelect.Item disabled={disabledItem} value="gamma">
                  <TRSelect.ItemText>
                    Rack Gamma{disabledItem ? ' · Offline' : ''}
                  </TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              </TRSelect.Group>
              <TRSelect.Separator />
              <TRSelect.Group>
                <TRSelect.GroupLabel>Non-production</TRSelect.GroupLabel>
                <TRSelect.Item value="staging">
                  <TRSelect.ItemText>Staging rack</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              </TRSelect.Group>
            </TRSelect.List>
            <TRSelect.ScrollDownArrow aria-label="Scroll down">
              ↓
            </TRSelect.ScrollDownArrow>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>
  );
}

export function SelectStateComparison() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectPreview
        defaultValue="alpha"
        disabled={false}
        label="Editable"
        readOnly={false}
      />
      <SelectPreview defaultValue="beta" disabled label="Disabled" readOnly={false} />
      <SelectPreview
        defaultValue="staging"
        disabled={false}
        label="Read only"
        readOnly
      />
    </div>
  );
}

export const selectStatesSource = `import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';

const racks = {
  alpha: 'Rack Alpha',
  beta: 'Rack Beta',
  gamma: 'Rack Gamma',
  staging: 'Staging rack',
} as const;

function AvailabilitySelect({
  defaultValue,
  disabled = false,
  label,
  readOnly = false,
}: {
  defaultValue: keyof typeof racks;
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
}) {
  return (
    <TRSelect.Root
      defaultValue={defaultValue}
      disabled={disabled}
      items={racks}
      name="rack"
      readOnly={readOnly}
    >
      <TRSelect.Label>{label}</TRSelect.Label>
      <TRSelect.Trigger aria-label={label}>
        <TRSelect.Value placeholder="Choose a rack" />
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner sideOffset={8}>
          <TRSelect.Popup>
            <TRSelect.Arrow />
            <TRSelect.List>
              <TRSelect.Group>
                <TRSelect.GroupLabel>Production</TRSelect.GroupLabel>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Rack Alpha</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Rack Beta</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
                <TRSelect.Item disabled value="gamma">
                  <TRSelect.ItemText>Rack Gamma · Offline</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              </TRSelect.Group>
              <TRSelect.Separator />
              <TRSelect.Group>
                <TRSelect.GroupLabel>Non-production</TRSelect.GroupLabel>
                <TRSelect.Item value="staging">
                  <TRSelect.ItemText>Staging rack</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              </TRSelect.Group>
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>
  );
}

export function SelectStates() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AvailabilitySelect defaultValue="alpha" label="Editable" />
      <AvailabilitySelect defaultValue="beta" disabled label="Disabled" />
      <AvailabilitySelect defaultValue="staging" label="Read only" readOnly />
    </div>
  );
}`;

export function SelectValidationPreview() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const invalid = attempted && value === null;

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <SelectPreview
          disabled={false}
          label="Deployment rack"
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        {invalid ? (
          <TRField.Error match>Choose a deployment rack.</TRField.Error>
        ) : null}
      </TRField.Root>
      <TRButton type="submit">Deploy</TRButton>
      <output aria-live="polite">
        {attempted && value
          ? `Ready to deploy to ${selectItems[value as keyof typeof selectItems]}.`
          : ''}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Select',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    disabledItem: false,
    open: false,
    readOnly: false,
    uiSize: 'md',
    value: 'alpha',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    disabledItem: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <SelectPreview
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onValueChange={(value) => updateArgs({ value })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
