'use client';

import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useMemo,
  useRef,
} from 'react';
import {
  type AsChildProps,
  type CommandAttributes,
  mergeClassNames,
  useStableId,
} from '../../internal/react/shared.js';
import {
  composeRefs,
  renderSlottable,
  type SlottableProps,
} from '../../internal/react/slot.js';
import {
  type OpenProps as GenericOpenProps,
  useOpenState,
} from '../../internal/react/state.js';
import { useManagedSurface } from '../../internal/react/use-managed-surface.js';
import { PopoverContext, usePopoverContext } from './context.js';
import {
  type PopoverMode,
  type PopoverOpenChangeReason,
  type PopoverPlacement,
  popoverClassName,
  popoverContract,
} from './contract.js';
import { createPopoverManager } from './dom.js';

type OpenProps = GenericOpenProps<PopoverOpenChangeReason>;
export type PopoverOpenProps = OpenProps;

export type PopoverProps = OpenProps & {
  children?: ReactNode;
  closeOnEscape?: boolean;
  collisionPadding?: number;
  id?: string;
  matchAnchorWidth?: boolean;
  mode?: PopoverMode;
  offset?: number;
  placement?: PopoverPlacement;
};

export function Popover({
  children,
  closeOnEscape = true,
  collisionPadding = popoverContract.defaultCollisionPadding,
  id: providedId,
  matchAnchorWidth = false,
  mode = popoverContract.defaultMode,
  offset = popoverContract.defaultOffset,
  placement = popoverContract.defaultPlacement,
  ...openProps
}: PopoverProps) {
  const id = useStableId('tr-layer', providedId);
  const state = useOpenState(openProps as OpenProps);
  const anchorRef = useRef<HTMLElement | null>(null);
  const context = useMemo(
    () => ({
      ...state,
      anchorRef,
      closeOnEscape,
      collisionPadding,
      id,
      matchAnchorWidth,
      mode,
      offset,
      placement,
    }),
    [
      closeOnEscape,
      collisionPadding,
      id,
      matchAnchorWidth,
      mode,
      offset,
      placement,
      state,
    ],
  );

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>;
}

export type PopoverAnchorProps = HTMLAttributes<HTMLElement> & AsChildProps;

export const PopoverAnchor = forwardRef<HTMLElement, PopoverAnchorProps>(
  function PopoverAnchor({ asChild, children, ...anchorProps }, forwardedRef) {
    const context = usePopoverContext('PopoverAnchor');
    const ref = composeRefs(context.anchorRef, forwardedRef);
    const slotProps: SlottableProps = {
      ...anchorProps,
      'aria-controls': context.id,
    };

    return renderSlottable(asChild, children, slotProps, ref, (props, spanRef) => (
      <span
        {...(props as HTMLAttributes<HTMLSpanElement>)}
        ref={spanRef as Ref<HTMLSpanElement>}
      />
    ));
  },
);

export type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  AsChildProps;

export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerProps>(
  function PopoverTrigger(
    { asChild, children, onClick, type = 'button', ...triggerProps },
    forwardedRef,
  ) {
    const context = usePopoverContext('PopoverTrigger');
    const ref = composeRefs(context.anchorRef, forwardedRef);
    const commandAttributes: CommandAttributes = {
      popoverTarget: context.id,
      popoverTargetAction: 'toggle',
    };
    const slotProps: SlottableProps = {
      ...triggerProps,
      ...commandAttributes,
      'aria-controls': context.id,
      'aria-expanded': context.open,
      'data-tr-react-trigger': 'true',
      onClick(event: MouseEvent<HTMLElement>) {
        onClick?.(event as MouseEvent<HTMLButtonElement>);

        if (!event.defaultPrevented) {
          event.preventDefault();
          context.requestOpen(!context.openRef.current, 'trigger', event.currentTarget);
        }
      },
      type,
    };

    return renderSlottable(asChild, children, slotProps, ref, (props, buttonRef) => (
      <button
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={buttonRef as Ref<HTMLButtonElement>}
      />
    ));
  },
);

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  popover?: PopoverMode;
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ className, popover, ...contentProps }, forwardedRef) {
    const context = usePopoverContext('PopoverContent');
    const elementRef = useRef<HTMLDivElement | null>(null);
    const ref = composeRefs(elementRef, forwardedRef);
    useManagedSurface(elementRef, context.anchorRef, context, createPopoverManager);

    return (
      <div
        {...contentProps}
        className={mergeClassNames(popoverClassName, className)}
        data-close-on-escape={String(context.closeOnEscape)}
        data-collision-padding={context.collisionPadding}
        data-default-open={context.open ? 'true' : undefined}
        data-match-anchor-width={String(context.matchAnchorWidth)}
        data-offset={context.offset}
        data-placement={context.placement}
        data-tr-overlay="layer"
        id={context.id}
        popover={popover ?? context.mode}
        ref={ref}
      />
    );
  },
);

export type PopoverCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & AsChildProps;

export const PopoverClose = forwardRef<HTMLElement, PopoverCloseProps>(
  function PopoverClose(
    { asChild, children, onClick, type = 'button', ...closeProps },
    forwardedRef,
  ) {
    const context = usePopoverContext('PopoverClose');
    const commandAttributes: CommandAttributes = {
      popoverTarget: context.id,
      popoverTargetAction: 'hide',
    };
    const slotProps: SlottableProps = {
      ...closeProps,
      ...commandAttributes,
      'data-tr-overlay-close': 'true',
      'data-tr-react-trigger': 'true',
      onClick(event: MouseEvent<HTMLElement>) {
        onClick?.(event as MouseEvent<HTMLButtonElement>);

        if (!event.defaultPrevented) {
          event.preventDefault();
          context.requestOpen(false, 'close-button', event.currentTarget);
        }
      },
      type,
    };

    return renderSlottable(
      asChild,
      children,
      slotProps,
      forwardedRef,
      (props, buttonRef) => (
        <button
          {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
          ref={buttonRef as Ref<HTMLButtonElement>}
        />
      ),
    );
  },
);
