export const linkClassName = 'tr-link';
export const linkVariants = ['neutral', 'primary', 'danger'] as const;
export const linkUnderlines = ['none', 'hover', 'always'] as const;

export type LinkVariant = (typeof linkVariants)[number];
export type LinkUnderline = (typeof linkUnderlines)[number];

export const linkContract = {
  defaultUnderline: 'hover',
  defaultVariant: 'primary',
} as const satisfies {
  defaultUnderline: LinkUnderline;
  defaultVariant: LinkVariant;
};
