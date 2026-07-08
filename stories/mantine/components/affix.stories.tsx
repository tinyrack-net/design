import * as Mantine from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

function AffixStory() {
  return (
    <Mantine.Box pos="relative" h={80}>
      <Mantine.Affix
        className="!absolute"
        position={{ bottom: 8, right: 8 }}
        style={{ position: 'absolute' }}
        withinPortal={false}
      >
        <Mantine.Button size="xs">Tail logs</Mantine.Button>
      </Mantine.Affix>
    </Mantine.Box>
  );
}

AffixStory.displayName = 'AffixStory';

const meta = {
  title: 'Mantine/Affix',
  component: AffixStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '@mantine/core Affix themed preview',
      },
    },
  },
} satisfies Meta<typeof AffixStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
