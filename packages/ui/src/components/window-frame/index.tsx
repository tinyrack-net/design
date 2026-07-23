import { TRWindowFrameAddressBar } from './window-frame-address-bar.js';
import { TRWindowFrameBody } from './window-frame-body.js';
import { TRWindowFrameControl } from './window-frame-control.js';
import { TRWindowFrameControls } from './window-frame-controls.js';
import { TRWindowFrameRoot } from './window-frame-root.js';
import { TRWindowFrameTitle } from './window-frame-title.js';
import { TRWindowFrameTitleBar } from './window-frame-title-bar.js';

export const TRWindowFrame = {
  Root: TRWindowFrameRoot,
  TitleBar: TRWindowFrameTitleBar,
  Controls: TRWindowFrameControls,
  Control: TRWindowFrameControl,
  Title: TRWindowFrameTitle,
  AddressBar: TRWindowFrameAddressBar,
  Body: TRWindowFrameBody,
} as const;

export type { TRWindowFrameAddressBarProps } from './window-frame-address-bar.js';
export type { TRWindowFrameBodyProps } from './window-frame-body.js';
export type {
  TRWindowFrameControlProps,
  TRWindowFrameControlTone,
} from './window-frame-control.js';
export type { TRWindowFrameControlsProps } from './window-frame-controls.js';
export type { TRWindowFrameRootProps } from './window-frame-root.js';
export type { TRWindowFrameTitleProps } from './window-frame-title.js';
export type { TRWindowFrameTitleBarProps } from './window-frame-title-bar.js';
export {
  TRWindowFrameAddressBar,
  TRWindowFrameBody,
  TRWindowFrameControl,
  TRWindowFrameControls,
  TRWindowFrameRoot,
  TRWindowFrameTitle,
  TRWindowFrameTitleBar,
};
