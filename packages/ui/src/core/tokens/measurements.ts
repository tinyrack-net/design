export const tinyrackMeasurements = {
  'measure-xs': '4rem',
  'measure-sm': '8rem',
  'measure-md': '12rem',
  'measure-lg': '16rem',
  'measure-xl': '24rem',
  'measure-2xl': '32rem',
  // Page frames. `measure-*` sizes a component and tops out at 32rem, which is
  // narrower than any real page, so every site was inventing its own shell
  // width. `page-width-*` is the outer frame; `reading-width-*` is the
  // long-form column, sized by measure rather than by the viewport.
  'page-width-sm': '64rem',
  'page-width-md': '72rem',
  'page-width-lg': '76rem',
  'page-width-xl': '80rem',
  'reading-width-sm': '44rem',
  'reading-width-md': '48rem',
  'reading-width-lg': '56rem',
  // The horizontal breathing room a page frame keeps against the viewport.
  // Expressed as a clamp rather than a breakpoint ladder so it needs no
  // variants and holds inside a container query.
  'page-gutter': 'clamp(1rem, 4vw, 2.5rem)',
  'control-width-md': '20rem',
  'control-press-distance': '0.0625rem',
  'overlay-width-sm': '20rem',
  'overlay-width-md': '32rem',
  'overlay-width-lg': '48rem',
  'overlay-width-xl': '64rem',
  'overlay-inline-inset': '1.5rem',
  'overlay-closed-scale': '0.98',
  'text-decoration-thickness': '0.08em',
  'text-underline-offset': '0.18em',
} as const;
