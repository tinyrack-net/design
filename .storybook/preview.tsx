import '@mantine/core/styles.css';
import '../src/mantine/styles.css';
import './preview.css';
import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { TinyrackMantineProvider } from '../src/entrypoints/mantine.js';
import { tinyrackSemanticColors } from '../src/entrypoints/tokens.js';

const themeDatasetKey = 'theme';
const themedBodyClasses = ['bg-base-100', 'p-4', 'text-base-content'] as const;
const previewBackgroundVariable = '--tinyrack-storybook-preview-background';
const previewColorVariable = '--tinyrack-storybook-preview-color';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme =
        context.globals.theme === 'tinyrack-light' ? 'tinyrack-light' : 'tinyrack-dark';
      const colorScheme = theme === 'tinyrack-dark' ? 'dark' : 'light';
      const isDocs = context.viewMode === 'docs';
      const isComponentStory =
        !isDocs &&
        (context.title.startsWith('daisyUI/') || context.title.startsWith('Mantine/'));
      const modeColors =
        theme === 'tinyrack-dark'
          ? tinyrackSemanticColors.dark
          : tinyrackSemanticColors.light;

      document.documentElement.style.setProperty(
        previewBackgroundVariable,
        modeColors.surface,
      );
      document.documentElement.style.setProperty(previewColorVariable, modeColors.text);

      if (isDocs) {
        delete document.documentElement.dataset[themeDatasetKey];
        document.documentElement.style.removeProperty('color-scheme');
      } else {
        document.documentElement.dataset[themeDatasetKey] = theme;
        document.documentElement.style.colorScheme = colorScheme;
      }

      document.documentElement.classList.add('min-h-full');
      document.body.classList.add('m-0', 'min-h-full', 'overflow-auto');
      document.body.classList.toggle('tinyrack-storybook-docs', isDocs);
      document.body.classList.toggle('tinyrack-storybook-canvas', !isDocs);
      document.body.classList.toggle('bg-base-100', !isDocs);
      document.body.classList.toggle('p-4', !isDocs && !isComponentStory);
      document.body.classList.toggle('text-base-content', !isDocs);

      if (isDocs) {
        document.body.classList.remove(...themedBodyClasses);
      }

      document
        .getElementById('storybook-root')
        ?.classList.add('min-h-full', 'w-full', 'overflow-visible');

      const canvasClassName = isComponentStory
        ? 'grid min-h-screen w-full box-border place-items-center overflow-auto bg-base-100 p-6 text-base-content max-sm:p-3'
        : 'min-h-full overflow-visible bg-base-100 text-base-content';

      return (
        <TinyrackMantineProvider forceColorScheme={colorScheme}>
          <div className={canvasClassName} data-theme={theme} style={{ colorScheme }}>
            <Story />
          </div>
        </TinyrackMantineProvider>
      );
    },
  ],
  parameters: {
    docs: {
      theme: themes.dark,
      canvas: {
        sourceState: 'none',
      },
    },
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
