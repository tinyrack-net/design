import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CodeSnippet,
  DocsCallout,
  DocsCard,
  DocsGrid,
  DocsPage,
  DocsSection,
  DocsTable,
  GuidanceList,
} from '../docs-components.js';

function AstroStarlightPage() {
  return (
    <DocsPage
      eyebrow="Adapters"
      title="Astro Starlight"
      description="The Starlight adapter brings Tinyrack tone to documentation while preserving Starlight navigation and content conventions."
    >
      <DocsSection title="Integration options">
        <DocsTable
          columns={['Need', 'Use', 'Notes']}
          rows={[
            [
              'Standard Starlight site',
              'withTinyrackStarlightTheme()',
              'Prepends the packaged theme CSS before site-local customCss.',
            ],
            [
              'Astro cannot resolve package subpath CSS in customCss',
              '@tinyrack/themes/astro/starlight.css',
              'Import the CSS from site-local global CSS as a fallback.',
            ],
            [
              'Visual review before shipping docs',
              'Astro fixture build',
              'Checks packaged adapter resolution, custom CSS ordering, and Starlight content rendering.',
            ],
          ]}
        />
      </DocsSection>

      <DocsGrid>
        <DocsCard title="Recommended config">
          <CodeSnippet>{`// astro.config.mjs
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { withTinyrackStarlightTheme } from '@tinyrack/themes/astro/starlight';

export default defineConfig({
  integrations: [
    starlight(
      withTinyrackStarlightTheme({
        title: 'Docs',
        customCss: ['./src/styles/global.css'],
      }),
    ),
  ],
});`}</CodeSnippet>
        </DocsCard>
        <DocsCard title="CSS fallback">
          <CodeSnippet>{`/* src/styles/global.css */
@import "@tinyrack/themes/astro/starlight.css";`}</CodeSnippet>
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Guidance">
          <GuidanceList
            items={[
              'Keep docs pages direct: explain what to install, when to use it, and why.',
              'Use code blocks sparingly and keep snippets short enough to scan.',
              'Let Starlight own navigation; let Tinyrack own color, type, and rhythm.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Verify">
          <GuidanceList
            items={[
              'Confirm the Astro fixture builds against the packaged adapter.',
              'Confirm site-local CSS still overrides after the Tinyrack theme CSS.',
              'Review the Astro fixture output for code block and callout contrast.',
            ]}
          />
        </DocsCard>
      </DocsGrid>

      <DocsCallout title="Adapter boundary">
        The Starlight adapter should theme the docs shell. Keep information
        architecture, sidebar content, and page-level writing conventions in the
        Starlight site itself.
      </DocsCallout>
    </DocsPage>
  );
}

const meta = {
  title: 'Adapters/Astro Starlight',
  component: AstroStarlightPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AstroStarlightPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
