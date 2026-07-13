import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { BundledLanguage, BundledTheme } from 'shiki/bundle/web';
import { Button } from '../../src/components/button/index.js';
import { CodeBlock } from '../../src/components/code-block/index.js';

type CodeBlockStoryArgs = {
  code: string;
  copyable: boolean;
  language: BundledLanguage;
  theme: BundledTheme;
  wrap: boolean;
};

export function CodeBlockPreview({ copyable, ...args }: CodeBlockStoryArgs) {
  const [copyResult, setCopyResult] = useState('Code not copied yet.');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(args.code);
      setCopyResult('Code copied.');
    } catch {
      setCopyResult('Clipboard permission is unavailable.');
    }
  }

  return (
    <div className="grid max-w-xl gap-2">
      <CodeBlock {...args} />
      {copyable ? (
        <div className="flex items-center justify-between gap-3">
          <output aria-live="polite">{copyResult}</output>
          <Button appearance="outline" onClick={copyCode} size="sm">
            Copy code
          </Button>
        </div>
      ) : null}
    </div>
  );
}

const meta = {
  title: 'Components/Code Block',
  component: CodeBlock,
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    code: "const status = 'healthy';",
    copyable: true,
    language: 'ts',
    theme: 'github-dark',
    wrap: false,
  },
  argTypes: {
    code: { control: 'text' },
    copyable: { control: 'boolean' },
    language: {
      control: 'select',
      options: ['ts', 'tsx', 'js', 'json', 'css', 'html', 'shellscript'],
    },
    theme: {
      control: 'select',
      options: ['github-dark', 'github-light', 'dark-plus', 'light-plus'],
    },
    wrap: { control: 'boolean' },
  },
  render: (args) => <CodeBlockPreview {...args} />,
} satisfies Meta<CodeBlockStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
