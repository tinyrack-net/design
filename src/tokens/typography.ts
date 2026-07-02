export const tinyrackTypography = {
  fontFamily: {
    body: 'var(--tinyrack-font-body), ui-sans-serif, system-ui, sans-serif',
    heading:
      'var(--tinyrack-font-heading), var(--tinyrack-font-body), ui-sans-serif, system-ui, sans-serif',
    mono: 'var(--tinyrack-font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    korean: '"IBM Plex Sans KR", "Gowun Dodum", ui-sans-serif, system-ui, sans-serif',
    japanese: '"Noto Sans JP", "Gowun Dodum", ui-sans-serif, system-ui, sans-serif',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.7',
  },
  letterSpacing: {
    tight: '0',
    normal: '0',
    wide: '0.02em',
  },
} as const;
