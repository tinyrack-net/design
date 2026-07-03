import {
  tinyrackPalettes,
  tinyrackRadii,
  tinyrackSemanticColors,
} from '../tokens/index.js';

export type TinyrackDaisyUiTheme = {
  name: string;
  colorScheme: 'light' | 'dark';
  isDefault: boolean;
  prefersDark: boolean;
  tokens: Record<string, string>;
};

export const tinyrackDaisyUiThemes = {
  light: {
    name: 'tinyrack-light',
    colorScheme: 'light',
    isDefault: false,
    prefersDark: false,
    tokens: {
      '--color-base-100': tinyrackSemanticColors.light.surface,
      '--color-base-200': tinyrackSemanticColors.light.surfaceMuted,
      '--color-base-300': tinyrackSemanticColors.light.border,
      '--color-base-content': tinyrackSemanticColors.light.text,
      '--color-primary': tinyrackSemanticColors.light.primary,
      '--color-primary-content': tinyrackSemanticColors.light.primaryContent,
      '--color-secondary': tinyrackSemanticColors.light.secondary,
      '--color-secondary-content': tinyrackSemanticColors.light.secondaryContent,
      '--color-accent': tinyrackSemanticColors.light.accent,
      '--color-accent-content': tinyrackSemanticColors.light.accentContent,
      '--color-neutral': tinyrackPalettes.neutral[900],
      '--color-neutral-content': tinyrackPalettes.neutral[50],
      '--color-info': tinyrackSemanticColors.light.info,
      '--color-info-content': tinyrackSemanticColors.light.infoContent,
      '--color-success': tinyrackSemanticColors.light.success,
      '--color-success-content': tinyrackSemanticColors.light.successContent,
      '--color-warning': tinyrackSemanticColors.light.warning,
      '--color-warning-content': tinyrackSemanticColors.light.warningContent,
      '--color-error': tinyrackSemanticColors.light.error,
      '--color-error-content': tinyrackSemanticColors.light.errorContent,
      '--radius-selector': tinyrackRadii.md,
      '--radius-field': tinyrackRadii.sm,
      '--radius-box': tinyrackRadii.lg,
    },
  },
  dark: {
    name: 'tinyrack-dark',
    colorScheme: 'dark',
    isDefault: true,
    prefersDark: true,
    tokens: {
      '--color-base-100': tinyrackSemanticColors.dark.surface,
      '--color-base-200': tinyrackSemanticColors.dark.surfaceMuted,
      '--color-base-300': tinyrackSemanticColors.dark.border,
      '--color-base-content': tinyrackSemanticColors.dark.text,
      '--color-primary': tinyrackSemanticColors.dark.primary,
      '--color-primary-content': tinyrackSemanticColors.dark.primaryContent,
      '--color-secondary': tinyrackSemanticColors.dark.secondary,
      '--color-secondary-content': tinyrackSemanticColors.dark.secondaryContent,
      '--color-accent': tinyrackSemanticColors.dark.accent,
      '--color-accent-content': tinyrackSemanticColors.dark.accentContent,
      '--color-neutral': tinyrackPalettes.neutral[900],
      '--color-neutral-content': tinyrackPalettes.neutral[50],
      '--color-info': tinyrackSemanticColors.dark.info,
      '--color-info-content': tinyrackSemanticColors.dark.infoContent,
      '--color-success': tinyrackSemanticColors.dark.success,
      '--color-success-content': tinyrackSemanticColors.dark.successContent,
      '--color-warning': tinyrackSemanticColors.dark.warning,
      '--color-warning-content': tinyrackSemanticColors.dark.warningContent,
      '--color-error': tinyrackSemanticColors.dark.error,
      '--color-error-content': tinyrackSemanticColors.dark.errorContent,
      '--radius-selector': tinyrackRadii.md,
      '--radius-field': tinyrackRadii.sm,
      '--radius-box': tinyrackRadii.lg,
    },
  },
} as const satisfies Record<string, TinyrackDaisyUiTheme>;
