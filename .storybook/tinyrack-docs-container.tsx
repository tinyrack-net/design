import { MDXProvider } from '@mdx-js/react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { themes } from 'storybook/theming';
import { createTinyrackMdxComponents } from '../src/mdx/react.js';
import { TinyrackMdxWrapper } from '../src/mdx/react-components/Wrapper.js';
import { mergeClassNames } from '../src/mdx/shared.js';

const defaultTinyrackTheme = 'tinyrack-dark' as const;

function resolveTinyrackTheme(theme: unknown) {
  return theme === 'tinyrack-light' || theme === 'tinyrack-dark'
    ? theme
    : defaultTinyrackTheme;
}

function resolveTinyrackThemeFromLocation() {
  if (typeof window === 'undefined') {
    return defaultTinyrackTheme;
  }

  const globals = new URL(window.location.href).searchParams.get('globals') ?? '';
  const theme = globals
    .split(';')
    .map((entry) => entry.split(':'))
    .find(([key]) => key === 'theme')?.[1];

  return resolveTinyrackTheme(theme);
}

function TinyrackDocsThemeBridge({ theme }: { theme: string }) {
  const tinyrackTheme = resolveTinyrackTheme(theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tinyrackTheme);
    document.body.setAttribute('data-theme', tinyrackTheme);
    document.documentElement.style.colorScheme =
      tinyrackTheme === 'tinyrack-dark' ? 'dark' : 'light';
  }, [tinyrackTheme]);

  return null;
}

function StorybookTinyrackMdxWrapper({
  className,
  ...wrapperProps
}: ComponentPropsWithoutRef<'main'>) {
  return (
    <TinyrackMdxWrapper
      {...wrapperProps}
      className={mergeClassNames('sb-unstyled', className)}
    />
  );
}

export const storybookTinyrackMdxComponents = createTinyrackMdxComponents({
  components: {
    wrapper: StorybookTinyrackMdxWrapper,
  },
});

export function TinyrackDocsContainer(props: DocsContainerProps) {
  const [tinyrackTheme, setTinyrackTheme] = useState(resolveTinyrackThemeFromLocation);

  useEffect(() => {
    const handleGlobalsUpdated = ({
      globals,
    }: {
      globals?: Record<string, unknown>;
    }) => {
      const { theme } = globals ?? {};
      setTinyrackTheme(resolveTinyrackTheme(theme));
    };

    props.context.channel.on('globalsUpdated', handleGlobalsUpdated);
    return () => props.context.channel.off('globalsUpdated', handleGlobalsUpdated);
  }, [props.context.channel]);

  return (
    <MDXProvider components={storybookTinyrackMdxComponents}>
      <TinyrackDocsThemeBridge theme={tinyrackTheme} />
      <DocsContainer
        {...props}
        theme={tinyrackTheme === 'tinyrack-dark' ? themes.dark : themes.light}
      />
    </MDXProvider>
  );
}
