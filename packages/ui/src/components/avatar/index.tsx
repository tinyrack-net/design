import { TRAvatarFallback } from './avatar-fallback.js';
import { TRAvatarImage } from './avatar-image.js';
import { TRAvatarRoot } from './avatar-root.js';

export const TRAvatar = {
  Root: TRAvatarRoot,
  Image: TRAvatarImage,
  Fallback: TRAvatarFallback,
} as const;

export type {
  AvatarFallbackState as TRAvatarFallbackState,
  AvatarImageState as TRAvatarImageState,
  AvatarRootState as TRAvatarRootState,
} from '@base-ui/react/avatar';
export type { TRAvatarFallbackProps } from './avatar-fallback.js';
export type { TRAvatarImageProps } from './avatar-image.js';
export type {
  TRAvatarRootProps,
  TRAvatarShape,
  TRAvatarUiSize,
} from './avatar-root.js';
export { TRAvatarFallback, TRAvatarImage, TRAvatarRoot };
