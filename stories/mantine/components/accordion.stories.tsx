import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AccordionStory() {
  return (
    <Mantine.Accordion defaultValue="item">
      <Mantine.Accordion.Item value="item">
        <Mantine.Accordion.Control>Section</Mantine.Accordion.Control>
        <Mantine.Accordion.Panel>Accordion panel</Mantine.Accordion.Panel>
      </Mantine.Accordion.Item>
    </Mantine.Accordion>
  );
}

AccordionStory.displayName = 'AccordionStory';

const meta = {
  title: 'Mantine/Accordion',
  component: AccordionStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Accordion themed preview',
      },
    },
  },
} satisfies Meta<typeof AccordionStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
