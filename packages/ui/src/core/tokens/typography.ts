const tinyrackFontStack = '"IBM Plex Sans"';
const tinyrackMonoFontStack = '"IBM Plex Mono", monospace';

const tinyrackFontStacks = {
  body: tinyrackFontStack,
  heading: tinyrackFontStack,
  mono: tinyrackMonoFontStack,
} as const;

const tinyrackFontSizes = {
  '2xs': '0.6875rem',
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '2.75rem',
  '6xl': '3.5rem',
} as const;

const tinyrackLineHeights = {
  xs: '1',
  sm: '1.2',
  md: '1.5',
  lg: '1.65',
  xl: '1.75',
} as const;

const tinyrackLetterSpacing = {
  none: '0',
  sm: '0.02em',
  md: '0.06em',
  lg: '0.08em',
  xl: '0.12em',
} as const;

/**
 * IBM Plex Sans stops at Bold 700, and the variable build's `wght` axis stops
 * there too, so no value above 700 can render: CSS font matching picks the 700
 * face and a variable font clamps to the end of its axis. `strong` therefore
 * declares a weight the typeface cannot produce, which makes the token say
 * something untrue about what will be drawn.
 */
const tinyrackFontWeights = {
  regular: 400,
  medium: 600,
  heading: 650,
  bold: 700,
  strong: 700,
} as const;

export const tinyrackTypography = {
  fontStack: tinyrackFontStacks,
  fontFamily: {
    body: 'var(--tinyrack-font-body)',
    heading: 'var(--tinyrack-font-heading)',
    mono: 'var(--tinyrack-font-mono)',
  },
  fontSize: tinyrackFontSizes,
  lineHeight: tinyrackLineHeights,
  letterSpacing: tinyrackLetterSpacing,
  fontWeight: tinyrackFontWeights,
  textStyle: {
    caption: {
      fontSize: 'xs',
      lineHeight: 'sm',
      letterSpacing: 'none',
      fontWeight: 'regular',
    },
    label: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'lg',
      fontWeight: 'strong',
    },
    body: {
      fontSize: 'md',
      lineHeight: 'md',
      letterSpacing: 'none',
      fontWeight: 'regular',
    },
    bodySm: {
      fontSize: 'sm',
      lineHeight: 'md',
      letterSpacing: 'none',
      fontWeight: 'regular',
    },
    code: {
      fontSize: 'sm',
      lineHeight: 'lg',
      letterSpacing: 'none',
      fontWeight: 'regular',
    },
    headingSm: {
      fontSize: 'lg',
      lineHeight: 'sm',
      letterSpacing: 'none',
      fontWeight: 'heading',
    },
    headingMd: {
      fontSize: '2xl',
      lineHeight: 'sm',
      letterSpacing: 'none',
      fontWeight: 'heading',
    },
    headingLg: {
      fontSize: '3xl',
      lineHeight: 'sm',
      letterSpacing: 'none',
      fontWeight: 'heading',
    },
    display: {
      fontSize: '5xl',
      lineHeight: 'sm',
      letterSpacing: 'none',
      fontWeight: 'heading',
    },
    displayLg: {
      fontSize: '6xl',
      lineHeight: 'xs',
      letterSpacing: 'none',
      fontWeight: 'heading',
    },
  },
} as const;
