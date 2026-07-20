import { TRAccordion } from '@tinyrack/ui/components/accordion';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type AccordionStoryArgs = {
  disabledItem: boolean;
  lifecycle: 'unmount' | 'keepMounted' | 'hiddenUntilFound';
  multiple: boolean;
  rootDisabled: boolean;
  value: string[];
};

type AccordionPreviewProps = AccordionStoryArgs & {
  onValueChange?: (value: string[]) => void;
};

export function AccordionPreview({
  disabledItem,
  lifecycle,
  multiple,
  onValueChange,
  rootDisabled,
  value,
}: AccordionPreviewProps) {
  return (
    <div className="grid w-full max-w-96 gap-3">
      <TRAccordion.Root
        className="w-full"
        disabled={rootDisabled}
        hiddenUntilFound={lifecycle === 'hiddenUntilFound'}
        keepMounted={lifecycle === 'keepMounted'}
        multiple={multiple}
        onValueChange={(nextValue) => onValueChange?.(nextValue as string[])}
        value={value}
      >
        <TRAccordion.Item value="overview">
          <TRAccordion.Header>
            <TRAccordion.Trigger>What is Tinyrack?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>A React-only UI system.</TRAccordion.Panel>
        </TRAccordion.Item>
        <TRAccordion.Item disabled={disabledItem} value="install">
          <TRAccordion.Header>
            <TRAccordion.Trigger>How do I install it?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>Install the package and component CSS.</TRAccordion.Panel>
        </TRAccordion.Item>
      </TRAccordion.Root>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Expanded: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

export function AccordionInteractiveExample() {
  const [value, setValue] = useState<string[]>(['overview']);

  return (
    <div className="grid gap-3">
      <TRAccordion.Root
        multiple
        onValueChange={(nextValue) => setValue(nextValue as string[])}
        value={value}
      >
        <TRAccordion.Item value="overview">
          <TRAccordion.Header>
            <TRAccordion.Trigger>What is Tinyrack?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>A React-only UI system.</TRAccordion.Panel>
        </TRAccordion.Item>
        <TRAccordion.Item value="install">
          <TRAccordion.Header>
            <TRAccordion.Trigger>How do I install it?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>Install the package and component CSS.</TRAccordion.Panel>
        </TRAccordion.Item>
      </TRAccordion.Root>
      <output aria-live="polite">
        Expanded: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Accordion',
  excludeStories: /.*(?:Preview|Example)$/,
  parameters: { layout: 'centered' },
  args: {
    disabledItem: false,
    lifecycle: 'unmount',
    multiple: false,
    rootDisabled: false,
    value: ['overview'],
  },
  argTypes: {
    disabledItem: { control: 'boolean' },
    lifecycle: {
      control: 'select',
      options: ['unmount', 'keepMounted', 'hiddenUntilFound'],
    },
    multiple: { control: 'boolean' },
    rootDisabled: { control: 'boolean' },
    value: { control: 'json' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<AccordionStoryArgs>();

    return (
      <AccordionPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<AccordionStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
