export const tinyrackSpacing = {
  '3xs': '0.0625rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  // Section rhythm. The scale used to stop at 2rem, so anything laying out a
  // whole page — `mdx.css`, a marketing landing, a document header — had to
  // reach for a literal or synthesize a step with `calc()`.
  '3xl': '3rem',
  '4xl': '4rem',
  '5xl': '6rem',
} as const;
