import './preview.css';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'tinyrack-light': 'tinyrack-light',
        'tinyrack-dark': 'tinyrack-dark',
      },
      defaultTheme: 'tinyrack-dark',
      attributeName: 'data-theme',
    }),
    (Story, context) => {
      const isDocs = context.viewMode === 'docs';
      const isComponentStory = context.title.startsWith('Components/');

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
        <div className={canvasClassName}>
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
};

export default preview;
