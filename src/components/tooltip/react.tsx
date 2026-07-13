'use client';

import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import {
  composeRefs,
  renderSlottable,
  type SlottableProps,
} from '../../internal/react/slot.js';
import { type PopoverPlacement, popoverClassName } from '../popover/contract.js';
import {
  tooltipClassName,
  tooltipContentClassName,
  tooltipContract,
} from './contract.js';
import { createTooltipManager } from './dom.js';

type TooltipContextValue = {
  id: string;
  placement: PopoverPlacement;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(name: string) {
  const context = useContext(TooltipContext);
  if (context === null) {
    throw new Error(`${name} must be used within Tooltip.`);
  }
  return context;
}

function mergeClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export type TooltipProps = HTMLAttributes<HTMLSpanElement> & {
  closeDelay?: number;
  openDelay?: number;
  placement?: PopoverPlacement;
};

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    children,
    className,
    closeDelay = tooltipContract.defaultCloseDelay,
    openDelay = tooltipContract.defaultOpenDelay,
    placement = tooltipContract.defaultPlacement,
    ...tooltipProps
  },
  forwardedRef,
) {
  const generatedId = useId().replace(/:/g, '');
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const ref = composeRefs(rootRef, forwardedRef);
  const context = useMemo(
    () => ({ id: `tr-tooltip-${generatedId}`, placement }),
    [generatedId, placement],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) {
      return;
    }
    const manager = createTooltipManager(root);
    return () => manager.destroy();
  }, []);

  return (
    <TooltipContext.Provider value={context}>
      <span
        {...tooltipProps}
        className={mergeClassNames(tooltipClassName, className)}
        data-close-delay={closeDelay}
        data-open-delay={openDelay}
        data-tr-tooltip="true"
        ref={ref}
      >
        {children}
      </span>
    </TooltipContext.Provider>
  );
});

export type TooltipTriggerProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  function TooltipTrigger({ asChild = true, children, ...triggerProps }, forwardedRef) {
    const context = useTooltipContext('TooltipTrigger');
    const slotProps: SlottableProps = {
      ...triggerProps,
      'aria-describedby': context.id,
      'data-state': 'closed',
      'data-tr-tooltip-trigger': 'true',
    };

    return renderSlottable(asChild, children, slotProps, forwardedRef, (props, ref) => (
      <span
        {...(props as HTMLAttributes<HTMLSpanElement>)}
        ref={ref as Ref<HTMLSpanElement>}
      />
    ));
  },
);

export type TooltipContentProps = HTMLAttributes<HTMLSpanElement>;

export const TooltipContent = forwardRef<HTMLSpanElement, TooltipContentProps>(
  function TooltipContent({ className, ...contentProps }, ref) {
    const context = useTooltipContext('TooltipContent');
    return (
      <span
        {...contentProps}
        className={mergeClassNames(
          popoverClassName,
          tooltipContentClassName,
          className,
        )}
        data-close-on-escape="true"
        data-offset="6"
        data-placement={context.placement}
        data-state="closed"
        data-tr-overlay="layer"
        id={context.id}
        popover="manual"
        ref={ref}
        role="tooltip"
      />
    );
  },
);

export type { PopoverPlacement as TooltipPlacement } from '../popover/contract.js';
