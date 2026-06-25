import { createTheme, type MantineThemeOverride } from '@mantine/core';
import {
  tinyrackPalettes,
  tinyrackRadii,
  tinyrackShadows,
  tinyrackTypography,
} from '../tokens/index.js';

export type TinyrackMantineThemeOptions = {
  fontFamily?: string;
  headingFontFamily?: string;
  primaryColor?: 'tinyrack';
};

const brandScale = [
  tinyrackPalettes.brand[50],
  tinyrackPalettes.brand[100],
  tinyrackPalettes.brand[200],
  tinyrackPalettes.brand[300],
  tinyrackPalettes.brand[400],
  tinyrackPalettes.brand[500],
  tinyrackPalettes.brand[600],
  tinyrackPalettes.brand[700],
  tinyrackPalettes.brand[800],
  tinyrackPalettes.brand[900],
] as const;

const darkScale = [
  tinyrackPalettes.neutral[50],
  tinyrackPalettes.neutral[100],
  tinyrackPalettes.neutral[300],
  tinyrackPalettes.neutral[500],
  tinyrackPalettes.neutral[600],
  tinyrackPalettes.neutral[700],
  tinyrackPalettes.neutral[800],
  tinyrackPalettes.neutral[900],
  tinyrackPalettes.neutral[900],
  tinyrackPalettes.neutral[950],
] as const;

export function createTinyrackMantineTheme(
  options: TinyrackMantineThemeOptions = {},
): MantineThemeOverride {
  return createTheme({
    primaryColor: options.primaryColor ?? 'tinyrack',
    colors: {
      dark: [...darkScale],
      tinyrack: [...brandScale],
    },
    fontFamily: options.fontFamily ?? tinyrackTypography.fontFamily.body,
    headings: {
      fontFamily: options.headingFontFamily ?? tinyrackTypography.fontFamily.heading,
      fontWeight: '700',
    },
    defaultRadius: 'md',
    radius: {
      xs: tinyrackRadii.xs,
      sm: tinyrackRadii.sm,
      md: tinyrackRadii.md,
      lg: tinyrackRadii.lg,
      xl: tinyrackRadii.xl,
    },
    shadows: {
      xs: tinyrackShadows.sm,
      sm: tinyrackShadows.sm,
      md: tinyrackShadows.md,
      lg: tinyrackShadows.lg,
      xl: tinyrackShadows.lg,
    },
    focusRing: 'auto',
    cursorType: 'pointer',
  });
}

export const tinyrackMantineTheme = createTinyrackMantineTheme();
