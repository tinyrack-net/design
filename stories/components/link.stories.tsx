import type { Meta, StoryObj } from '@storybook/react-vite';
import { linkUnderlines, linkVariants } from '../../src/components/link/contract.js';
import { Link, type LinkProps } from '../../src/components/link/react.js';

type ComponentStoryProps = Pick<
  LinkProps,
  'children' | 'href' | 'underline' | 'variant'
>;

function LinkStory(controlValues: ComponentStoryProps) {
  return <Link {...controlValues} />;
}

LinkStory.displayName = 'LinkStory';

const meta = {
  title: 'Components/Link',
  component: LinkStory,
  args: {
    children: 'Rack inventory',
    href: '#',
    underline: 'hover',
    variant: 'primary',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Link label.',
    },
    href: {
      control: 'text',
      description: 'Native anchor href.',
    },
    underline: {
      control: 'select',
      options: linkUnderlines,
      description: 'Underline behavior.',
    },
    variant: {
      control: 'select',
      options: linkVariants,
      description: 'Semantic link color.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'CSS-first Tinyrack Link rendered as a native anchor.',
      },
    },
  },
} satisfies Meta<typeof LinkStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
