import {
  MantineProvider,
  type MantineProviderProps,
  type MantineThemeOverride,
} from '@mantine/core';
import type { ReactNode } from 'react';
import {
  createTinyrackMantineTheme,
  type TinyrackMantineThemeOptions,
} from './create-tinyrack-mantine-theme.js';

export type TinyrackMantineProviderProps = Omit<
  MantineProviderProps,
  'children' | 'theme'
> & {
  children: ReactNode;
  theme?: MantineThemeOverride;
  themeOptions?: TinyrackMantineThemeOptions;
};

export function TinyrackMantineProvider({
  children,
  theme,
  themeOptions,
  ...mantineProps
}: TinyrackMantineProviderProps) {
  return (
    <MantineProvider
      {...mantineProps}
      defaultColorScheme={mantineProps.defaultColorScheme ?? 'dark'}
      theme={theme ?? createTinyrackMantineTheme(themeOptions)}
    >
      {children}
    </MantineProvider>
  );
}
