export const tinyrackControlMetrics = {
  sm: {
    height: '2rem',
    paddingInline: '0.75rem',
    gap: '0.375rem',
    fontSize: 'sm',
    lineHeight: '1.25rem',
  },
  md: {
    height: '2.5rem',
    paddingInline: '1rem',
    gap: '0.5rem',
    fontSize: 'sm',
    lineHeight: '1.25rem',
  },
  lg: {
    height: '3rem',
    paddingInline: '1.25rem',
    gap: '0.625rem',
    fontSize: 'md',
    lineHeight: '1.5rem',
  },
} as const;

export type TRControlUiSize = keyof typeof tinyrackControlMetrics;
