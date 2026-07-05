import {
  createTheme,
  defaultVariantColorsResolver,
  type MantineThemeOverride,
  type VariantColorsResolver,
} from '@mantine/core';
import {
  tinyrackPalettes,
  tinyrackRadii,
  tinyrackShadows,
  tinyrackSpacing,
  tinyrackTypography,
} from '../tokens/index.js';

export type TinyrackMantineThemeOptions = {
  fontFamily?: string;
  headingFontFamily?: string;
  primaryColor?: 'tinyrack';
};

type ComponentVars = Record<string, Record<string, string>>;
type ComponentVarsProps = Record<string, unknown> & {
  color?: unknown;
  variant?: unknown;
};

const tinyrackMantineFilledColorVariable = 'var(--tinyrack-mantine-filled-color)';

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

const tinyrackVariantColorResolver: VariantColorsResolver = (input) => {
  const colors = defaultVariantColorsResolver(input);

  if (input.color === 'tinyrack' && input.variant === 'filled') {
    return {
      ...colors,
      color: 'var(--tinyrack-mantine-filled-color)',
    };
  }

  if (input.color === 'tinyrack' && input.variant === 'white') {
    return {
      ...colors,
      color: tinyrackPalettes.neutral[950],
    };
  }

  return colors;
};

function usesTinyrackColor(props: ComponentVarsProps) {
  const color = props.color;

  return color === undefined || color === 'tinyrack';
}

function usesTinyrackFilledVariant(props: ComponentVarsProps) {
  const variant = props.variant;

  return usesTinyrackColor(props) && (variant === undefined || variant === 'filled');
}

function createRootVars(vars: Record<string, string>): ComponentVars {
  return { root: vars };
}

function createTinyrackFilledTextVars(cssVariable: string) {
  return (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
    usesTinyrackFilledVariant(props)
      ? createRootVars({ [cssVariable]: tinyrackMantineFilledColorVariable })
      : {};
}

function createTinyrackActiveTextVars(cssVariable: string) {
  return (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
    usesTinyrackColor(props)
      ? createRootVars({ [cssVariable]: tinyrackMantineFilledColorVariable })
      : {};
}

const tinyrackMantineComponentOverrides = {
  Badge: {
    vars: createTinyrackFilledTextVars('--badge-color'),
  },
  Chip: {
    vars: createTinyrackFilledTextVars('--chip-color'),
  },
  Indicator: {
    vars: createTinyrackActiveTextVars('--indicator-text-color'),
  },
  Pagination: {
    vars: createTinyrackActiveTextVars('--pagination-active-color'),
  },
  SegmentedControl: {
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--sc-color': 'var(--mantine-primary-color-filled)',
            '--sc-label-color': tinyrackMantineFilledColorVariable,
          })
        : {},
  },
  Stepper: {
    vars: createTinyrackActiveTextVars('--stepper-icon-color'),
  },
  Tabs: {
    vars: createTinyrackActiveTextVars('--tabs-text-color'),
  },
  ThemeIcon: {
    vars: createTinyrackFilledTextVars('--ti-color'),
  },
  Timeline: {
    vars: createTinyrackActiveTextVars('--tl-icon-color'),
  },
};

export function createTinyrackMantineTheme(
  options: TinyrackMantineThemeOptions = {},
): MantineThemeOverride {
  return createTheme({
    primaryColor: options.primaryColor ?? 'tinyrack',
    primaryShade: { light: 8, dark: 0 },
    colors: {
      dark: [...darkScale],
      tinyrack: [...brandScale],
    },
    variantColorResolver: tinyrackVariantColorResolver,
    fontFamily: options.fontFamily ?? tinyrackTypography.fontFamily.body,
    headings: {
      fontFamily: options.headingFontFamily ?? tinyrackTypography.fontFamily.heading,
      fontWeight: '700',
    },
    defaultRadius: 'sm',
    radius: {
      xs: tinyrackRadii.xs,
      sm: tinyrackRadii.sm,
      md: tinyrackRadii.md,
      lg: tinyrackRadii.lg,
      xl: tinyrackRadii.xl,
    },
    spacing: {
      xs: tinyrackSpacing.xs,
      sm: tinyrackSpacing.sm,
      md: tinyrackSpacing.md,
      lg: tinyrackSpacing.lg,
      xl: tinyrackSpacing.xl,
      '2xl': tinyrackSpacing['2xl'],
    },
    shadows: {
      xs: tinyrackShadows.sm,
      sm: tinyrackShadows.sm,
      md: tinyrackShadows.md,
      lg: tinyrackShadows.lg,
      xl: tinyrackShadows.lg,
    },
    components: tinyrackMantineComponentOverrides,
    autoContrast: true,
    focusRing: 'auto',
    cursorType: 'pointer',
  });
}

export const tinyrackMantineTheme = createTinyrackMantineTheme();
