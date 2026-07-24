'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRScrollArea } from '../scroll-area/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellMainProps = useRender.ComponentProps<'main'> & {
  /** Class applied to the scrollable content wrapper (only when `scroll`). */
  contentClassName?: string;
  /** Wrap children in a scroll panel wired to shell scroll restoration. */
  scroll?: boolean;
  /** Accessible name for the scroll viewport region (only when `scroll`). */
  viewportLabel?: string;
};

export function TRAppShellMain({
  children,
  className,
  contentClassName,
  ref,
  render,
  scroll = false,
  viewportLabel = 'Page content',
  ...props
}: TRAppShellMainProps) {
  const { isPending, mainViewportRef, onMainScroll } = useAppShellContext('Main');
  const content = scroll ? (
    <TRScrollArea.Root className="tr-app-shell-main-scroll-area" variant="plain">
      <TRScrollArea.Viewport
        aria-label={viewportLabel}
        className="tr-app-shell-main-viewport"
        onScroll={onMainScroll}
        ref={mainViewportRef}
        role="region"
      >
        <TRScrollArea.Content
          aria-busy={isPending || undefined}
          className={mergeClassNames('tr-app-shell-main-content', contentClassName)}
        >
          {children}
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>
  ) : (
    children
  );
  return useRender({
    defaultTagName: 'main',
    props: {
      ...props,
      children: content,
      className: mergeClassNames('tr-app-shell-main', className),
    },
    ref,
    render,
  });
}
