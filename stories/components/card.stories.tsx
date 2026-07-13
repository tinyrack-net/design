import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../src/components/card/index.js';

type CardStoryArgs = {
  content: string;
  description: string;
  footer: boolean;
  padding: 'none' | 'sm' | 'md' | 'lg';
  semanticElement: 'article' | 'div' | 'section';
  title: string;
  variant: 'default' | 'outlined' | 'elevated';
};

const meta = {
  title: 'Components/Card',
  parameters: { layout: 'centered' },
  args: {
    content: 'All systems operational.',
    description: '12 nodes',
    footer: true,
    padding: 'md',
    semanticElement: 'article',
    title: 'Rack A',
    variant: 'elevated',
  },
  argTypes: {
    content: { control: 'text' },
    description: { control: 'text' },
    footer: { control: 'boolean' },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    semanticElement: {
      control: 'select',
      options: ['article', 'div', 'section'],
    },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
  },
  render: ({ content, description, footer, semanticElement, title, ...rootProps }) => (
    <Card.Root
      className="w-80"
      render={
        semanticElement === 'article' ? (
          <article />
        ) : semanticElement === 'section' ? (
          <section />
        ) : (
          <div />
        )
      }
      {...rootProps}
    >
      <Card.Header>
        <Card.Title render={<h3>{title}</h3>} />
        <Card.Description>{description}</Card.Description>
      </Card.Header>
      <Card.Content>{content}</Card.Content>
      {footer ? <Card.Footer>Updated now</Card.Footer> : null}
    </Card.Root>
  ),
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
