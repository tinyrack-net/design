export * from './colors.js';
export * from './components.js';
export * from './motion.js';
export * from './radii.js';
export * from './semantic.js';
export * from './shadows.js';
export * from './spacing.js';
export * from './typography.js';

import { tinyrackPalettes } from './colors.js';
import { tinyrackComponentTokens } from './components.js';
import { tinyrackMotion } from './motion.js';
import { tinyrackRadii } from './radii.js';
import { tinyrackSemanticColors } from './semantic.js';
import { tinyrackShadows } from './shadows.js';
import { tinyrackSpacing } from './spacing.js';
import { tinyrackTypography } from './typography.js';

export const tinyrackTokens = {
  palettes: tinyrackPalettes,
  components: tinyrackComponentTokens,
  semanticColors: tinyrackSemanticColors,
  typography: tinyrackTypography,
  spacing: tinyrackSpacing,
  radii: tinyrackRadii,
  shadows: tinyrackShadows,
  motion: tinyrackMotion,
} as const;
