import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from '../../src/components/code/index.js';

type CodeStoryArgs = { children: string; width: number };

const meta = {
  title: 'Components/Code',
  component: Code,
  parameters: { layout: 'centered' },
  args: { children: 'pnpm test:component\npnpm verify', width: 320 },
  argTypes: {
    children: { control: 'text' },
    width: { control: { type: 'range', min: 160, max: 640, step: 16 } },
  },
  render: ({ children, width }) => (
    <p style={{ maxWidth: width }}>
      Run <Code>{children}</Code> before publishing.
    </p>
  ),
} satisfies Meta<CodeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
