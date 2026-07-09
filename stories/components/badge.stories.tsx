import type { Meta, StoryObj } from '@storybook/react-vite';
import { badgeSizes, badgeVariants } from '../../src/components/badge/contract.js';
import { Badge, type BadgeProps } from '../../src/components/badge/react.js';

type ComponentStoryProps = Pick<BadgeProps, 'children' | 'size' | 'variant'>;

function BadgeStory(controlValues: ComponentStoryProps) {
  return <Badge {...controlValues} />;
}

BadgeStory.displayName = 'BadgeStory';

const meta = {
  title: 'Components/Badge',
  component: BadgeStory,
  args: {
    children: 'healthy',
    size: 'sm',
    variant: 'primary',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Badge label.',
    },
    size: {
      control: 'select',
      options: badgeSizes,
      description: 'Tailwind scale-backed badge size.',
    },
    variant: {
      control: 'select',
      options: badgeVariants,
      description: 'Semantic badge variant.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'CSS-first Tinyrack Badge rendered through the React wrapper.',
      },
    },
  },
} satisfies Meta<typeof BadgeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
