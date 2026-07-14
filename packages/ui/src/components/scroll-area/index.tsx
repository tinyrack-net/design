import { ScrollAreaContent } from './scroll-area-content.js';
import { ScrollAreaCorner } from './scroll-area-corner.js';
import { ScrollAreaRoot } from './scroll-area-root.js';
import { ScrollAreaScrollbar } from './scroll-area-scrollbar.js';
import { ScrollAreaThumb } from './scroll-area-thumb.js';
import { ScrollAreaViewport } from './scroll-area-viewport.js';

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Content: ScrollAreaContent,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
} as const;

export type {
  HiddenState,
  ScrollAreaContentState,
  ScrollAreaCornerState,
  ScrollAreaRootState,
  ScrollAreaScrollbarState,
  ScrollAreaThumbState,
  ScrollAreaViewportState,
} from '@base-ui/react/scroll-area';
export type { ScrollAreaContentProps } from './scroll-area-content.js';
export type { ScrollAreaCornerProps } from './scroll-area-corner.js';
export type { ScrollAreaRootProps } from './scroll-area-root.js';
export type { ScrollAreaScrollbarProps } from './scroll-area-scrollbar.js';
export type { ScrollAreaThumbProps } from './scroll-area-thumb.js';
export type { ScrollAreaViewportProps } from './scroll-area-viewport.js';
export {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
};
