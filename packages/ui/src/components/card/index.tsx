import { TRCardContent } from './card-content.js';
import { TRCardDescription } from './card-description.js';
import { TRCardFooter } from './card-footer.js';
import { TRCardHeader } from './card-header.js';
import { TRCardRoot } from './card-root.js';
import { TRCardTitle } from './card-title.js';

export const TRCard = {
  Root: TRCardRoot,
  Header: TRCardHeader,
  Title: TRCardTitle,
  Description: TRCardDescription,
  Content: TRCardContent,
  Footer: TRCardFooter,
} as const;

export type { TRCardContentProps } from './card-content.js';
export type { TRCardDescriptionProps } from './card-description.js';
export type { TRCardFooterProps } from './card-footer.js';
export type { TRCardHeaderProps } from './card-header.js';
export type { TRCardRootProps } from './card-root.js';
export type { TRCardTitleProps } from './card-title.js';
export {
  TRCardContent,
  TRCardDescription,
  TRCardFooter,
  TRCardHeader,
  TRCardRoot,
  TRCardTitle,
};
