const tinyrackFontStack = '"IBM Plex Sans"';

const tinyrackFontStacks = {
  body: tinyrackFontStack,
  heading: tinyrackFontStack,
  mono: tinyrackFontStack,
  korean: tinyrackFontStack,
  japanese: tinyrackFontStack,
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

export const tinyrackTypography = {
  fontStack: tinyrackFontStacks,
  fontFamily: {
    body: 'var(--tinyrack-font-body)',
    heading: 'var(--tinyrack-font-heading)',
    mono: 'var(--tinyrack-font-mono)',
    korean: 'var(--tinyrack-font-korean)',
    japanese: 'var(--tinyrack-font-japanese)',
  },
  fontSize: tinyrackFontSizes,
  lineHeight: tinyrackLineHeights,
  letterSpacing: tinyrackLetterSpacing,
  textStyle: {
    caption: {
      fontSize: 'xs',
      lineHeight: 'sm',
      letterSpacing: 'none',
    },
    label: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'lg',
    },
    body: {
      fontSize: 'md',
      lineHeight: 'md',
      letterSpacing: 'none',
    },
    bodySm: {
      fontSize: 'sm',
      lineHeight: 'md',
      letterSpacing: 'none',
    },
    code: {
      fontSize: 'sm',
      lineHeight: 'lg',
      letterSpacing: 'none',
    },
    headingSm: {
      fontSize: 'lg',
      lineHeight: 'sm',
      letterSpacing: 'none',
    },
    headingMd: {
      fontSize: '2xl',
      lineHeight: 'sm',
      letterSpacing: 'none',
    },
    headingLg: {
      fontSize: '3xl',
      lineHeight: 'sm',
      letterSpacing: 'none',
    },
    display: {
      fontSize: '5xl',
      lineHeight: 'sm',
      letterSpacing: 'none',
    },
  },
} as const;
