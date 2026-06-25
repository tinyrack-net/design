import type { Meta, StoryObj } from '@storybook/react-vite';

function Introduction() {
  return (
    <main style={{ maxWidth: 760 }}>
      <h1>Tinyrack Themes</h1>
      <p>
        Shared theme adapters for Tinyrack products: Mantine for app surfaces, daisyUI
        for Tailwind product sites, and Astro Starlight for docs.
      </p>
      <ul>
        <li>
          <code>@tinyrack/themes/mantine</code>
        </li>
        <li>
          <code>@tinyrack/themes/daisyui</code>
        </li>
        <li>
          <code>@tinyrack/themes/astro/starlight</code>
        </li>
      </ul>
    </main>
  );
}

const meta = {
  title: 'Introduction',
  component: Introduction,
} satisfies Meta<typeof Introduction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
