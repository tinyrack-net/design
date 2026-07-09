import './preview.css';
import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { tinyrackSemanticColors } from '../src/core/index.js';

const themeDatasetKey = 'theme';
const previewBackgroundVariable = '--tinyrack-storybook-preview-background';
const previewColorVariable = '--tinyrack-storybook-preview-color';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme =
        context.globals.theme === 'tinyrack-light' ? 'tinyrack-light' : 'tinyrack-dark';
      const colorScheme = theme === 'tinyrack-dark' ? 'dark' : 'light';
      const isDocs = context.viewMode === 'docs';
      const isComponentStory = context.title.startsWith('Components/');
      const modeColors =
        theme === 'tinyrack-dark'
          ? tinyrackSemanticColors.dark
          : tinyrackSemanticColors.light;

      document.documentElement.style.setProperty(
        previewBackgroundVariable,
        modeColors.surface,
      );
      document.documentElement.style.setProperty(previewColorVariable, modeColors.text);
      document.documentElement.dataset[themeDatasetKey] = theme;
      document.documentElement.style.colorScheme = colorScheme;
      document.documentElement.classList.add('min-h-full');
      document.body.classList.add('m-0', 'min-h-full', 'overflow-auto');
      document.body.classList.toggle('tinyrack-storybook-docs', isDocs);
      document.body.classList.toggle('tinyrack-storybook-canvas', !isDocs);

      document
        .getElementById('storybook-root')
        ?.classList.add('min-h-full', 'w-full', 'overflow-visible');

      const canvasClassName =
        !isDocs && isComponentStory
          ? 'grid min-h-screen w-full min-w-0 box-border place-items-center overflow-auto bg-tinyrack-surface p-6 text-tinyrack-text max-sm:p-3'
          : 'min-h-full w-full min-w-0 overflow-visible bg-tinyrack-surface text-tinyrack-text';

      return (
        <div className={canvasClassName} data-theme={theme} style={{ colorScheme }}>
          <Story />
        </div>
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
          ['Colors', 'Typography', 'Spacing', 'Radius'],
          'Components',
          ['Button'],
          'CSS',
          ['Tailwind'],
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
