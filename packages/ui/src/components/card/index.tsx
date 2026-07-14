import { CardContent } from './card-content.js';
import { CardDescription } from './card-description.js';
import { CardFooter } from './card-footer.js';
import { CardHeader } from './card-header.js';
import { CardRoot } from './card-root.js';
import { CardTitle } from './card-title.js';

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
} as const;

export type { CardContentProps } from './card-content.js';
export type { CardDescriptionProps } from './card-description.js';
export type { CardFooterProps } from './card-footer.js';
export type { CardHeaderProps } from './card-header.js';
export type { CardRootProps } from './card-root.js';
export type { CardTitleProps } from './card-title.js';
export { CardContent, CardDescription, CardFooter, CardHeader, CardRoot, CardTitle };
