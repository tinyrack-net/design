import { AvatarFallback } from './avatar-fallback.js';
import { AvatarImage } from './avatar-image.js';
import { AvatarRoot } from './avatar-root.js';

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
} as const;

export type {
  AvatarFallbackState,
  AvatarImageState,
  AvatarRootState,
} from '@base-ui/react/avatar';
export type { AvatarFallbackProps } from './avatar-fallback.js';
export type { AvatarImageProps } from './avatar-image.js';
export type { AvatarRootProps, AvatarShape, AvatarSize } from './avatar-root.js';
export { AvatarFallback, AvatarImage, AvatarRoot };
