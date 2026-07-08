import {
  createTheme,
  defaultVariantColorsResolver,
  type MantineThemeOverride,
  type VariantColorsResolver,
} from '@mantine/core';
import {
  tinyrackPalettes,
  tinyrackRadii,
  tinyrackSemanticColors,
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

function createSemanticScale(
  lightValue: string,
  darkValue: string,
): [string, string, string, string, string, string, string, string, string, string] {
  return [
    lightValue,
    lightValue,
    lightValue,
    lightValue,
    lightValue,
    darkValue,
    darkValue,
    darkValue,
    darkValue,
    darkValue,
  ];
}

const successScale = createSemanticScale(
  tinyrackSemanticColors.dark.success,
  tinyrackSemanticColors.light.success,
);
const warningScale = createSemanticScale(
  tinyrackSemanticColors.dark.warning,
  tinyrackSemanticColors.light.warning,
);
const errorScale = createSemanticScale(
  tinyrackSemanticColors.dark.error,
  tinyrackSemanticColors.light.error,
);
const infoScale = createSemanticScale(
  tinyrackSemanticColors.dark.info,
  tinyrackSemanticColors.light.info,
);

const tinyrackMantineFontSizes = {
  xs: tinyrackTypography.fontSize.xs,
  sm: tinyrackTypography.fontSize.sm,
  md: tinyrackTypography.fontSize.md,
  lg: tinyrackTypography.fontSize.lg,
  xl: tinyrackTypography.fontSize.xl,
  '2xs': tinyrackTypography.fontSize['2xs'],
  '2xl': tinyrackTypography.fontSize['2xl'],
  '3xl': tinyrackTypography.fontSize['3xl'],
  '4xl': tinyrackTypography.fontSize['4xl'],
  '5xl': tinyrackTypography.fontSize['5xl'],
} as const;

const tinyrackMantineLineHeights = {
  xs: tinyrackTypography.lineHeight.xs,
  sm: tinyrackTypography.lineHeight.sm,
  md: tinyrackTypography.lineHeight.md,
  lg: tinyrackTypography.lineHeight.lg,
  xl: tinyrackTypography.lineHeight.xl,
} as const;

const tinyrackVariantColorResolver: VariantColorsResolver = (input) => {
  const colors = defaultVariantColorsResolver(input);

  if (input.color === 'tinyrack' && input.variant === 'filled') {
    return {
      ...colors,
      background: 'var(--tinyrack-primary)',
      hover: 'var(--tinyrack-accent)',
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
  Avatar: {
    defaultProps: {
      color: 'tinyrack',
      variant: 'filled',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--avatar-bg': 'var(--tinyrack-surface-muted)',
            '--avatar-bd':
              'var(--tinyrack-avatar-border-width) solid var(--tinyrack-border)',
            '--avatar-color': 'var(--tinyrack-text)',
          })
        : {},
  },
  Button: {
    defaultProps: {
      color: 'tinyrack',
    },
  },
  Badge: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: createTinyrackFilledTextVars('--badge-color'),
  },
  Chip: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: createTinyrackFilledTextVars('--chip-color'),
  },
  Checkbox: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--checkbox-color': 'var(--tinyrack-primary)',
            '--checkbox-icon-color': tinyrackMantineFilledColorVariable,
          })
        : {},
  },
  Drawer: {
    defaultProps: {
      radius: 'md',
    },
  },
  Indicator: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--indicator-color': 'var(--tinyrack-primary)',
            '--indicator-text-color': tinyrackMantineFilledColorVariable,
          })
        : {},
  },
  Loader: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--loader-color': 'var(--tinyrack-primary)',
          })
        : {},
  },
  Menu: {
    defaultProps: {
      radius: 'md',
      shadow: 'none',
    },
  },
  Modal: {
    defaultProps: {
      radius: 'md',
    },
  },
  Pagination: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--pagination-active-bg': 'var(--tinyrack-primary)',
            '--pagination-active-color': tinyrackMantineFilledColorVariable,
          })
        : {},
  },
  PaginationRoot: {
    defaultProps: {
      color: 'tinyrack',
    },
  },
  Radio: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--radio-color': 'var(--tinyrack-primary)',
            '--radio-icon-color': tinyrackMantineFilledColorVariable,
          })
        : {},
  },
  Rating: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--rating-color': 'var(--tinyrack-primary)',
          })
        : {},
  },
  RangeSlider: {
    defaultProps: {
      color: 'tinyrack',
      radius: 'sm',
      size: 'md',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--slider-color': 'var(--tinyrack-primary)',
          })
        : {},
  },
  SegmentedControl: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--sc-color': 'var(--tinyrack-primary)',
            '--sc-label-color': tinyrackMantineFilledColorVariable,
          })
        : {},
  },
  Slider: {
    defaultProps: {
      color: 'tinyrack',
      radius: 'sm',
      size: 'md',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--slider-color': 'var(--tinyrack-primary)',
          })
        : {},
  },
  Stepper: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: createTinyrackActiveTextVars('--stepper-icon-color'),
  },
  Table: {
    defaultProps: {
      horizontalSpacing: 'md',
      verticalSpacing: 'md',
    },
  },
  Tooltip: {
    defaultProps: {
      color: 'tinyrack',
      radius: 'sm',
    },
  },
  Switch: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: (_theme: unknown, props: ComponentVarsProps): ComponentVars =>
      usesTinyrackColor(props)
        ? createRootVars({
            '--switch-color': 'var(--tinyrack-primary)',
          })
        : {},
  },
  Tabs: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: createTinyrackActiveTextVars('--tabs-text-color'),
  },
  ThemeIcon: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: createTinyrackFilledTextVars('--ti-color'),
  },
  Timeline: {
    defaultProps: {
      color: 'tinyrack',
    },
    vars: createTinyrackActiveTextVars('--tl-icon-color'),
  },
};

export function createTinyrackMantineTheme(
  options: TinyrackMantineThemeOptions = {},
): MantineThemeOverride {
  return createTheme({
    primaryColor: options.primaryColor ?? 'tinyrack',
    colors: {
      dark: [...darkScale],
      error: [...errorScale],
      info: [...infoScale],
      success: [...successScale],
      tinyrack: [...brandScale],
      warning: [...warningScale],
    },
    variantColorResolver: tinyrackVariantColorResolver,
    fontFamily: options.fontFamily ?? tinyrackTypography.fontFamily.body,
    fontFamilyMonospace: tinyrackTypography.fontFamily.mono,
    fontSizes: tinyrackMantineFontSizes,
    lineHeights: tinyrackMantineLineHeights,
    headings: {
      fontFamily: options.headingFontFamily ?? tinyrackTypography.fontFamily.heading,
      fontWeight: '700',
      textWrap: 'balance',
      sizes: {
        h1: {
          fontSize: tinyrackTypography.fontSize['4xl'],
          lineHeight: tinyrackTypography.lineHeight.sm,
        },
        h2: {
          fontSize: tinyrackTypography.fontSize['3xl'],
          lineHeight: tinyrackTypography.lineHeight.sm,
        },
        h3: {
          fontSize: tinyrackTypography.fontSize['2xl'],
          lineHeight: tinyrackTypography.lineHeight.sm,
        },
        h4: {
          fontSize: tinyrackTypography.fontSize.xl,
          lineHeight: tinyrackTypography.lineHeight.md,
        },
        h5: {
          fontSize: tinyrackTypography.fontSize.lg,
          lineHeight: tinyrackTypography.lineHeight.md,
        },
        h6: {
          fontSize: tinyrackTypography.fontSize.md,
          lineHeight: tinyrackTypography.lineHeight.md,
        },
      },
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
