export const buttonClassName = 'tr-btn';
export const buttonSizes = ['sm', 'md', 'lg'] as const;
export const buttonVariants = ['neutral', 'primary', 'danger'] as const;
export const buttonAppearances = ['solid', 'outline', 'ghost'] as const;

export type ButtonSize = (typeof buttonSizes)[number];
export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonAppearance = (typeof buttonAppearances)[number];

export const buttonContract = {
  defaultAppearance: 'solid',
  defaultSize: 'md',
  defaultVariant: 'neutral',
} as const satisfies {
  defaultAppearance: ButtonAppearance;
  defaultSize: ButtonSize;
  defaultVariant: ButtonVariant;
};
