import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, type CodeProps } from '../../src/components/code/react.js';

type ComponentStoryProps = Pick<CodeProps, 'children'>;

function CodeStory(controlValues: ComponentStoryProps) {
  return <Code {...controlValues} />;
}

CodeStory.displayName = 'CodeStory';

const meta = {
  title: 'Components/Code',
  component: CodeStory,
  args: {
    children: 'pnpm verify',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Code text.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'CSS-first Tinyrack inline Code rendered through the React wrapper.',
      },
    },
  },
} satisfies Meta<typeof CodeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
