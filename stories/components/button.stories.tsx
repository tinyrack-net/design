import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  buttonAppearances,
  buttonSizes,
  buttonVariants,
} from '../../src/components/button/contract.js';
import { Button, type ButtonProps } from '../../src/components/button/react.js';
import {
  CodeSnippet,
  DocsCard,
  DocsGrid,
  DocsPage,
  TokenTable,
} from '../docs-components.js';

type ComponentStoryProps = Pick<
  ButtonProps,
  'appearance' | 'children' | 'disabled' | 'size' | 'variant'
>;

const reactUsage = `import '@tinyrack/ui/core/core.css';
import '@tinyrack/ui/components/button/button.css';
import { Button } from '@tinyrack/ui/components/button/react';

export function DeployAction() {
  return (
    <Button size="md" variant="primary" appearance="solid">
      Deploy
    </Button>
  );
}`;

const cssUsage = `@import '@tinyrack/ui/core/core.css';
@import '@tinyrack/ui/components/button/button.css';

<button class="tr-btn" data-size="md" data-variant="primary" data-appearance="solid">
  Deploy
</button>`;

const importContract = `import { Button } from '@tinyrack/ui/components/button/react';

// No root React barrel:
// import { Button } from '@tinyrack/ui';`;

function ButtonStory(controlValues: ComponentStoryProps) {
  return <Button {...controlValues} />;
}

ButtonStory.displayName = 'ButtonStory';

function ButtonDocsPage() {
  return (
    <DocsPage
      eyebrow="Components"
      title="Button"
      description="A native button wrapper backed by the framework-neutral .tr-btn CSS contract."
    >
      <DocsGrid>
        <DocsCard title="React">
          <CodeSnippet>{reactUsage}</CodeSnippet>
        </DocsCard>
        <DocsCard title="CSS">
          <CodeSnippet>{cssUsage}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Sizes">
          <div className="flex flex-wrap items-center gap-2">
            {buttonSizes.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </div>
          <TokenTable
            items={[
              { name: 'sm', value: 'h-8 px-3 gap-1.5 text-sm' },
              { name: 'md', value: 'h-10 px-4 gap-2 text-sm' },
              { name: 'lg', value: 'h-12 px-5 gap-2.5 text-base' },
            ]}
          />
        </DocsCard>
        <DocsCard title="Variants">
          <div className="flex flex-wrap items-center gap-2">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
          <TokenTable
            items={[
              { name: 'neutral', value: 'surfaceMuted / border / text' },
              { name: 'primary', value: 'primary / primaryContrast' },
              { name: 'danger', value: 'error / errorContrast' },
            ]}
          />
        </DocsCard>
      </DocsGrid>

      <DocsCard title="Appearances">
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))]">
          {buttonAppearances.map((appearance) => (
            <div
              className="grid gap-2 rounded-md border border-tinyrack-border bg-tinyrack-surface p-3"
              key={appearance}
            >
              <strong className="text-tinyrack-sm text-tinyrack-text">
                {appearance}
              </strong>
              <Button appearance={appearance} variant="primary">
                Deploy
              </Button>
              <Button appearance={appearance} variant="danger">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </DocsCard>

      <DocsGrid>
        <DocsCard title="API">
          <TokenTable
            items={[
              { name: 'size', value: 'sm | md | lg', note: 'Default: md' },
              {
                name: 'variant',
                value: 'neutral | primary | danger',
                note: 'Default: neutral',
              },
              {
                name: 'appearance',
                value: 'solid | outline | ghost',
                note: 'Default: solid',
              },
              {
                name: 'type',
                value: 'button | submit | reset',
                note: 'Default: button',
              },
              {
                name: 'disabled',
                value: 'boolean',
                note: 'Native disabled state plus CSS disabled styling.',
              },
            ]}
          />
        </DocsCard>
        <DocsCard title="Import boundary">
          <CodeSnippet>{importContract}</CodeSnippet>
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Components/Button',
  component: ButtonStory,
  tags: ['autodocs'],
  args: {
    appearance: 'solid',
    children: 'Deploy',
    disabled: false,
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label.',
    },
    disabled: {
      control: 'boolean',
      description: 'Native disabled state.',
    },
    size: {
      control: 'select',
      options: buttonSizes,
      description: 'Tailwind scale-backed button size.',
    },
    variant: {
      control: 'select',
      options: buttonVariants,
      description: 'Semantic action variant.',
    },
    appearance: {
      control: 'select',
      options: buttonAppearances,
      description: 'Visual treatment.',
    },
  },
  parameters: {
    docs: {
      page: ButtonDocsPage,
      description: {
        component: 'CSS-first Tinyrack Button rendered through the React wrapper.',
      },
    },
  },
} satisfies Meta<typeof ButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
