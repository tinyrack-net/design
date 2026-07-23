'use client';

import { useRender } from '@base-ui/react/use-render';
import { cloneElement, isValidElement } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRLinkButtonAppearance = 'solid' | 'outline' | 'ghost';
export type TRLinkButtonIntent =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';
export type TRLinkButtonUiSize = TRControlUiSize;
export type TRLinkButtonProps = useRender.ComponentProps<'a'> & {
  appearance?: TRLinkButtonAppearance;
  intent?: TRLinkButtonIntent;
  uiSize?: TRLinkButtonUiSize;
  disabled?: boolean;
};

type LinkButtonClickEvent = Parameters<NonNullable<TRLinkButtonProps['onClick']>>[0];
type LinkButtonKeyDownEvent = Parameters<
  NonNullable<TRLinkButtonProps['onKeyDown']>
>[0];

/**
 * A navigation control that looks like a `TRButton` but stays a real link.
 *
 * `TRButton` wraps Base UI `Button`, which is button-first: rendering it as an
 * anchor either warns (native button expected) or forces `role="button"`,
 * losing link semantics. `TRLinkButton` instead renders an anchor (polymorphic
 * through Base UI's `render` contract) and applies the button styling contract
 * (`tr-btn` plus the `data-appearance`/`data-intent`/`data-ui-size` attributes),
 * so it keeps `role="link"`, link keyboard behavior, and correct navigation
 * while looking identical to a button.
 */
export function TRLinkButton({
  appearance = 'solid',
  className,
  disabled = false,
  href,
  intent = 'neutral',
  onClick,
  onKeyDown,
  ref,
  render,
  uiSize = 'md',
  ...props
}: TRLinkButtonProps) {
  const resolvedRender =
    disabled && isValidElement<{ href?: string | undefined }>(render)
      ? cloneElement(render, { href: undefined })
      : render;

  return useRender({
    defaultTagName: 'a',
    props: {
      ...props,
      'aria-disabled': disabled || undefined,
      className: mergeClassNames('tr-btn tr-link-btn', className),
      'data-appearance': appearance,
      'data-disabled': disabled ? '' : undefined,
      'data-intent': intent,
      'data-ui-size': uiSize,
      href: disabled ? undefined : href,
      onClick(event: LinkButtonClickEvent) {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      },
      onKeyDown(event: LinkButtonKeyDownEvent) {
        if (disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onKeyDown?.(event);
      },
      tabIndex: disabled ? -1 : props.tabIndex,
    },
    ref,
    render: resolvedRender,
  });
}
