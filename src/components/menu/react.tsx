'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
} from 'react';
import { renderSlottable, type SlottableProps } from '../../internal/react/slot.js';
import {
  Popover,
  PopoverContent,
  type PopoverContentProps,
  type PopoverProps,
  PopoverTrigger,
  type PopoverTriggerProps,
} from '../popover/react.js';
import {
  menuClassName,
  menuContentClassName,
  menuItemClassName,
  menuLabelClassName,
  menuLeadingClassName,
  menuSeparatorClassName,
} from './contract.js';
import { createMenuManager } from './dom.js';

function mergeClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

export type MenuProps = PopoverProps & { className?: string };

export function Menu({ children, className, mode = 'auto', ...props }: MenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (root === null) {
      return;
    }
    const manager = createMenuManager(root);
    return () => manager.destroy();
  }, []);

  return (
    <Popover {...props} mode={mode}>
      <div
        className={mergeClassNames(menuClassName, className)}
        data-tr-menu="true"
        ref={rootRef}
      >
        {children}
      </div>
    </Popover>
  );
}

export type MenuTriggerProps = PopoverTriggerProps;

export const MenuTrigger = forwardRef<HTMLElement, MenuTriggerProps>(
  function MenuTrigger(props, ref) {
    return (
      <PopoverTrigger
        {...props}
        aria-haspopup="menu"
        data-tr-menu-trigger="true"
        ref={ref}
      />
    );
  },
);

export type MenuContentProps = PopoverContentProps;

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent({ className, ...props }, ref) {
    return (
      <PopoverContent
        {...props}
        className={mergeClassNames(menuContentClassName, className)}
        ref={ref}
        role="menu"
      />
    );
  },
);

export type MenuItemProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  disabled?: boolean;
  leadingVisual?: ReactNode;
  textValue?: string;
  value?: string;
};

export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(function MenuItem(
  {
    asChild,
    children,
    className,
    disabled = false,
    leadingVisual,
    textValue,
    value,
    ...props
  },
  forwardedRef,
) {
  const content = (
    <>
      {leadingVisual === undefined ? null : (
        <span aria-hidden="true" className={menuLeadingClassName}>
          {leadingVisual}
        </span>
      )}
      {children}
    </>
  );
  const slotProps: SlottableProps = {
    ...props,
    'aria-disabled': disabled || undefined,
    className: mergeClassNames(menuItemClassName, className),
    'data-text-value': textValue,
    'data-value': value,
    role: 'menuitem',
    tabIndex: -1,
  };

  const slottableChildren =
    asChild && leadingVisual !== undefined
      ? (() => {
          const child = Children.only(children) as ReactElement<{
            children?: ReactNode;
          }>;
          return cloneElement(child, {
            children: (
              <>
                <span aria-hidden="true" className={menuLeadingClassName}>
                  {leadingVisual}
                </span>
                {child.props.children}
              </>
            ),
          });
        })()
      : children;

  return renderSlottable(
    asChild,
    slottableChildren,
    slotProps,
    forwardedRef,
    (itemProps, ref) => (
      <button
        {...(itemProps as HTMLAttributes<HTMLButtonElement>)}
        disabled={disabled}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
      >
        {content}
      </button>
    ),
  );
});

export type MenuLabelProps = HTMLAttributes<HTMLDivElement>;

export const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(function MenuLabel(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      className={mergeClassNames(menuLabelClassName, className)}
      ref={ref}
      role="presentation"
    />
  );
});

export type MenuSeparatorProps = HTMLAttributes<HTMLHRElement>;

export const MenuSeparator = forwardRef<HTMLHRElement, MenuSeparatorProps>(
  function MenuSeparator({ className, ...props }, ref) {
    return (
      <hr
        {...props}
        className={mergeClassNames(menuSeparatorClassName, className)}
        ref={ref}
      />
    );
  },
);
