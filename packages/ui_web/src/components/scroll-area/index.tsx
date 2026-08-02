import { TRScrollAreaContent } from './scroll-area-content.js';
import { TRScrollAreaCorner } from './scroll-area-corner.js';
import { TRScrollAreaRoot } from './scroll-area-root.js';
import { TRScrollAreaScrollbar } from './scroll-area-scrollbar.js';
import { TRScrollAreaThumb } from './scroll-area-thumb.js';
import { TRScrollAreaViewport } from './scroll-area-viewport.js';

export const TRScrollArea = {
  Root: TRScrollAreaRoot,
  Viewport: TRScrollAreaViewport,
  Scrollbar: TRScrollAreaScrollbar,
  Content: TRScrollAreaContent,
  Thumb: TRScrollAreaThumb,
  Corner: TRScrollAreaCorner,
} as const;

export type {
  HiddenState as TRHiddenState,
  ScrollAreaContentState as TRScrollAreaContentState,
  ScrollAreaCornerState as TRScrollAreaCornerState,
  ScrollAreaRootState as TRScrollAreaRootState,
  ScrollAreaScrollbarState as TRScrollAreaScrollbarState,
  ScrollAreaThumbState as TRScrollAreaThumbState,
  ScrollAreaViewportState as TRScrollAreaViewportState,
} from '@base-ui/react/scroll-area';
export type { TRScrollAreaContentProps } from './scroll-area-content.js';
export type { TRScrollAreaCornerProps } from './scroll-area-corner.js';
export type {
  TRScrollAreaRootProps,
  TRScrollAreaVariant,
} from './scroll-area-root.js';
export type { TRScrollAreaScrollbarProps } from './scroll-area-scrollbar.js';
export type { TRScrollAreaThumbProps } from './scroll-area-thumb.js';
export type { TRScrollAreaViewportProps } from './scroll-area-viewport.js';
export {
  TRScrollAreaContent,
  TRScrollAreaCorner,
  TRScrollAreaRoot,
  TRScrollAreaScrollbar,
  TRScrollAreaThumb,
  TRScrollAreaViewport,
};
