'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRScrollArea } from '../scroll-area/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellMainProps = useRender.ComponentProps<'main'> & {
  /** Class applied to the content wrapper (only when `scroll`). */
  contentClassName?: string;
  /**
   * Wrap children in the page content region wired to shell scroll
   * restoration. Under `pageScroll="document"` the document is already the
   * scroller, so this renders the content wrapper without a scroll panel.
   */
  scroll?: boolean;
  /**
   * Accessible name for the scroll viewport region. Only applies when `scroll`
   * is set and the shell uses `pageScroll="container"`; the document posture
   * has no nested scroll region to name.
   */
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
  const { isPending, mainViewportRef, onMainScroll, pageScroll } =
    useAppShellContext('Main');
  const contentWrapper = (
    <div
      aria-busy={isPending || undefined}
      className={mergeClassNames('tr-app-shell-main-content', contentClassName)}
    >
      {children}
    </div>
  );
  let content = children;
  if (scroll && pageScroll === 'document') {
    content = contentWrapper;
  } else if (scroll) {
    content = (
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
    );
  }
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
