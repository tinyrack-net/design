export const buttonClassName = 'tr-btn';
export const iconButtonClassName = 'tr-icon-btn';
export const buttonGroupClassName = 'tr-btn-group';
export const buttonSizes = ['sm', 'md', 'lg'] as const;
export const buttonVariants = ['secondary', 'primary', 'danger'] as const;
export const buttonAppearances = ['solid', 'outline', 'ghost'] as const;
export const buttonGroupOrientations = ['horizontal', 'vertical'] as const;

export type ButtonSize = (typeof buttonSizes)[number];
export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonAppearance = (typeof buttonAppearances)[number];
export type ButtonGroupOrientation = (typeof buttonGroupOrientations)[number];

export const buttonContract = {
  defaultAppearance: 'solid',
  defaultSize: 'md',
  defaultVariant: 'secondary',
} as const satisfies {
  defaultAppearance: ButtonAppearance;
  defaultSize: ButtonSize;
  defaultVariant: ButtonVariant;
};
