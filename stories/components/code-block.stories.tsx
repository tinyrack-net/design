import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BundledLanguage, BundledTheme } from 'shiki/bundle/web';
import { CodeBlock } from '../../src/components/code-block/react.js';
import { ShikiCodeBlock } from '../../src/components/code-block/shiki-react.js';

const codeBlockLanguages = [
  'bash',
  'css',
  'json',
  'ts',
  'tsx',
] as const satisfies readonly BundledLanguage[];
const codeBlockThemes = [
  'github-dark',
  'github-light',
] as const satisfies readonly BundledTheme[];

type ComponentStoryProps = {
  code: string;
  highlighted: boolean;
  language: (typeof codeBlockLanguages)[number];
  theme: (typeof codeBlockThemes)[number];
  wrap: boolean;
};

function CodeBlockStory({
  code,
  highlighted,
  language,
  theme,
  wrap,
}: ComponentStoryProps) {
  return highlighted ? (
    <ShikiCodeBlock code={code} language={language} theme={theme} wrap={wrap} />
  ) : (
    <CodeBlock language={language} wrap={wrap}>
      {code}
    </CodeBlock>
  );
}

CodeBlockStory.displayName = 'CodeBlockStory';

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlockStory,
  args: {
    code: 'const answer = 1;\nconsole.log(answer);',
    highlighted: true,
    language: 'ts',
    theme: 'github-dark',
    wrap: false,
  },
  argTypes: {
    code: {
      control: 'text',
      description: 'Code block text.',
    },
    highlighted: {
      control: 'boolean',
      description: 'Use the optional Shiki client highlighter.',
    },
    language: {
      control: 'select',
      options: codeBlockLanguages,
      description: 'Language passed to the code block and Shiki.',
    },
    theme: {
      control: 'select',
      options: codeBlockThemes,
      description: 'Shiki bundled theme used by the client highlighter.',
    },
    wrap: {
      control: 'boolean',
      description: 'Wrap long lines instead of horizontal scrolling.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'SSR-safe Tinyrack CodeBlock with optional Shiki client highlighting.',
      },
    },
  },
} satisfies Meta<typeof CodeBlockStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
