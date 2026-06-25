import type { Meta, StoryObj } from '@storybook/react-vite';
import { withTinyrackStarlightTheme } from '../../src/astro/starlight/index.js';

function StarlightThemeUsage() {
  const config = withTinyrackStarlightTheme({
    title: 'Docs',
    customCss: ['./src/styles/global.css'],
  });

  return (
    <main style={{ maxWidth: 760 }}>
      <h1>Astro Starlight Theme</h1>
      <p>
        Use <code>withTinyrackStarlightTheme()</code> to prepend the packaged Starlight
        CSS before site-local overrides.
      </p>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </main>
  );
}

const meta = {
  title: 'Astro/Starlight Theme',
  component: StarlightThemeUsage,
} satisfies Meta<typeof StarlightThemeUsage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Usage: Story = {};
