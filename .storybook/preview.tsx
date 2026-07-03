import '@mantine/core/styles.css';
import '../src/mantine/styles.css';
import './preview.css';
import type { Preview } from '@storybook/react-vite';
import { TinyrackMantineProvider } from '../src/mantine/index.js';

const themeDatasetKey = 'theme';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'tinyrack-dark';
      document.documentElement.dataset[themeDatasetKey] = theme;
      return (
        <TinyrackMantineProvider
          forceColorScheme={theme === 'tinyrack-dark' ? 'dark' : 'light'}
        >
          <Story />
        </TinyrackMantineProvider>
      );
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Welcome',
          ['Start Here'],
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows'],
          'Adapters',
          ['Tailwind', 'daisyUI', 'Mantine', 'Astro Starlight'],
          'Demo',
          ['Mantine Product App', 'daisyUI Product App', 'Starlight Docs Site'],
          'Mantine',
          'daisyUI',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Tinyrack theme mode',
      defaultValue: 'tinyrack-dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['tinyrack-light', 'tinyrack-dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
