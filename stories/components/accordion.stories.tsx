import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type AccordionType,
  accordionTypes,
} from '../../src/components/accordion/contract.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionSummary,
} from '../../src/components/accordion/react.js';

type AccordionStoryProps = {
  collapsible: boolean;
  type: AccordionType;
};

function AccordionStory({ collapsible, type }: AccordionStoryProps) {
  const items = (
    <>
      <AccordionItem value="network">
        <AccordionSummary>Network</AccordionSummary>
        <AccordionContent>Primary and failover links are online.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="storage">
        <AccordionSummary>Storage</AccordionSummary>
        <AccordionContent>
          Snapshots are healthy with 62% capacity used.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="backup">
        <AccordionSummary>Backup</AccordionSummary>
        <AccordionContent>Last backup completed at 03:18 KST.</AccordionContent>
      </AccordionItem>
    </>
  );

  return type === 'multiple' ? (
    <Accordion defaultValue={['network', 'backup']} key={type} type="multiple">
      {items}
    </Accordion>
  ) : (
    <Accordion
      collapsible={collapsible}
      defaultValue="network"
      key={`${type}-${collapsible}`}
    >
      {items}
    </Accordion>
  );
}

AccordionStory.displayName = 'AccordionStory';

const meta = {
  title: 'Components/Accordion',
  component: AccordionStory,
  args: {
    collapsible: true,
    type: 'single',
  },
  argTypes: {
    collapsible: {
      control: 'boolean',
      description: 'Allows the active item in single mode to close.',
    },
    type: {
      control: 'select',
      description: 'Selects exclusive or independent expansion state.',
      options: accordionTypes,
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native Disclosure group with single/multiple state and shared keyboard behavior.',
      },
    },
  },
} satisfies Meta<typeof AccordionStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
