import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import './fonts.css';
import './preview.css';
import { DecoratorHelpers, withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, StoryContext } from '@storybook/react-vite';
import { themes } from 'storybook/theming';

const tinyrackThemes = {
  'tinyrack-light': 'tinyrack-light',
  'tinyrack-dark': 'tinyrack-dark',
} as const;

type TinyrackTheme = keyof typeof tinyrackThemes;

type TinyrackStoryContext = StoryContext & {
  parameters: StoryContext['parameters'] & {
    themes?: {
      themeOverride?: string;
    };
  };
};

const defaultTinyrackTheme: TinyrackTheme = 'tinyrack-dark';

function isTinyrackTheme(theme: string | undefined): theme is TinyrackTheme {
  return theme === 'tinyrack-light' || theme === 'tinyrack-dark';
}

function resolveTinyrackTheme(context: StoryContext): TinyrackTheme {
  const { themeOverride } = (context as TinyrackStoryContext).parameters.themes ?? {};
  const selectedTheme = DecoratorHelpers.pluckThemeFromContext(context);

  if (isTinyrackTheme(themeOverride)) {
    return themeOverride;
  }

  if (isTinyrackTheme(selectedTheme)) {
    return selectedTheme;
  }

  return defaultTinyrackTheme;
}

function resolveTinyrackThemeFromLocation(): TinyrackTheme {
  if (typeof window === 'undefined') {
    return defaultTinyrackTheme;
  }

  const globals = new URL(window.location.href).searchParams.get('globals') ?? '';
  const theme = globals
    .split(';')
    .map((entry) => entry.split(':'))
    .find(([key]) => key === 'theme')?.[1];

  return isTinyrackTheme(theme) ? theme : defaultTinyrackTheme;
}

function syncTinyrackDocumentTheme(theme: TinyrackTheme) {
  document.documentElement.setAttribute('data-theme', tinyrackThemes[theme]);
  document.body.setAttribute('data-theme', tinyrackThemes[theme]);
  document.documentElement.style.colorScheme =
    theme === 'tinyrack-dark' ? 'dark' : 'light';
}

if (typeof document !== 'undefined') {
  syncTinyrackDocumentTheme(resolveTinyrackThemeFromLocation());
}

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: tinyrackThemes,
      defaultTheme: defaultTinyrackTheme,
      attributeName: 'data-theme',
    }),
    (Story, context) => {
      const isDocs = context.viewMode === 'docs';
      const isComponentStory = context.title.startsWith('Components/');
      const theme = resolveTinyrackTheme(context);

      syncTinyrackDocumentTheme(theme);

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
          ['Button', 'Table', 'Tabs'],
        ],
      },
    },
  },
};

export default preview;
