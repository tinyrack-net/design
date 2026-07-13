'use client';

import {
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type FormHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import { ModalContext, useModalContext } from './context.js';
import {
  type ModalOpenChangeReason,
  type ModalPlacement,
  type ModalSize,
  modalActionClassName,
  modalBackdropClassName,
  modalBodyClassName,
  modalBoxClassName,
  modalClassName,
  modalContract,
  modalDescriptionClassName,
  modalHeaderClassName,
  modalTitleClassName,
} from './contract.js';
import { createModalManager } from './dom.js';

type OpenProps = GenericOpenProps<ModalOpenChangeReason>;
export type ModalOpenProps = OpenProps;

export type ModalProps = OpenProps & {
  children?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  id?: string;
  preventScroll?: boolean;
};

export function Modal({
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  id: providedId,
  preventScroll = true,
  ...openProps
}: ModalProps) {
  const id = useStableId('tr-modal', providedId);
  const state = useOpenState(openProps as OpenProps);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [descriptionPresent, setDescriptionPresent] = useState(false);
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const context = useMemo(
    () => ({
      ...state,
      closeOnBackdrop,
      closeOnEscape,
      descriptionId,
      descriptionPresent,
      id,
      preventScroll,
      setDescriptionPresent,
      titleId,
      triggerRef,
    }),
    [
      closeOnBackdrop,
      closeOnEscape,
      descriptionId,
      descriptionPresent,
      id,
      preventScroll,
      state,
      titleId,
    ],
  );

  return <ModalContext.Provider value={context}>{children}</ModalContext.Provider>;
}

export type ModalTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & AsChildProps;

export const ModalTrigger = forwardRef<HTMLElement, ModalTriggerProps>(
  function ModalTrigger(
    { asChild, children, onClick, type = 'button', ...triggerProps },
    forwardedRef,
  ) {
    const context = useModalContext('ModalTrigger');
    const ref = composeRefs<HTMLElement>(context.triggerRef, forwardedRef);
    const commandAttributes: CommandAttributes = {
      command: 'show-modal',
      commandfor: context.id,
    };
    const slotProps: SlottableProps = {
      ...triggerProps,
      ...commandAttributes,
      'aria-controls': context.id,
      'aria-expanded': context.open,
      'aria-haspopup': 'dialog',
      'data-tr-react-trigger': 'true',
      onClick(event: MouseEvent<HTMLElement>) {
        onClick?.(event as MouseEvent<HTMLButtonElement>);

        if (!event.defaultPrevented) {
          event.preventDefault();
          context.requestOpen(true, 'trigger', event.currentTarget);
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

export type ModalContentProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'open'
> & {
  placement?: ModalPlacement;
};

export const ModalContent = forwardRef<HTMLDialogElement, ModalContentProps>(
  function ModalContent(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      placement = modalContract.defaultPlacement,
      ...dialogProps
    },
    forwardedRef,
  ) {
    const context = useModalContext('ModalContent');
    const elementRef = useRef<HTMLDialogElement | null>(null);
    const ref = composeRefs(elementRef, forwardedRef);
    useManagedSurface(elementRef, context.triggerRef, context, createModalManager);

    const closedby = context.closeOnEscape
      ? context.closeOnBackdrop
        ? 'any'
        : 'closerequest'
      : 'none';
    const labelledBy =
      ariaLabel === undefined ? (ariaLabelledBy ?? context.titleId) : ariaLabelledBy;
    const describedBy =
      ariaDescribedBy ??
      (context.descriptionPresent ? context.descriptionId : undefined);

    const backdrop = context.closeOnBackdrop ? (
      <form className={modalBackdropClassName} method="dialog">
        <button aria-label="Close modal" type="submit">
          close
        </button>
      </form>
    ) : (
      <div aria-hidden="true" className={modalBackdropClassName} />
    );

    return (
      <dialog
        {...dialogProps}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        className={mergeClassNames(modalClassName, className)}
        closedby={closedby}
        data-close-on-backdrop={String(context.closeOnBackdrop)}
        data-close-on-escape={String(context.closeOnEscape)}
        data-default-open={context.open ? 'true' : undefined}
        data-placement={placement}
        data-prevent-scroll={String(context.preventScroll)}
        data-tr-overlay="modal"
        id={context.id}
        ref={ref}
      >
        {children}
        {backdrop}
      </dialog>
    );
  },
);

export type ModalBoxProps = HTMLAttributes<HTMLDivElement> & {
  size?: ModalSize;
};

export const ModalBox = forwardRef<HTMLDivElement, ModalBoxProps>(function ModalBox(
  { className, size = modalContract.defaultSize, ...boxProps },
  ref,
) {
  return (
    <div
      {...boxProps}
      className={mergeClassNames(modalBoxClassName, className)}
      data-size={size}
      ref={ref}
    />
  );
});

export type ModalHeaderProps = HTMLAttributes<HTMLElement>;

export const ModalHeader = forwardRef<HTMLElement, ModalHeaderProps>(
  function ModalHeader({ className, ...headerProps }, ref) {
    return (
      <header
        {...headerProps}
        className={mergeClassNames(modalHeaderClassName, className)}
        ref={ref}
      />
    );
  },
);

export type ModalTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  function ModalTitle({ className, id, tabIndex = -1, ...titleProps }, ref) {
    const context = useModalContext('ModalTitle');

    return (
      <h2
        {...titleProps}
        className={mergeClassNames(modalTitleClassName, className)}
        id={id ?? context.titleId}
        ref={ref}
        tabIndex={tabIndex}
      />
    );
  },
);

export type ModalDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  function ModalDescription({ className, id, ...descriptionProps }, ref) {
    const context = useModalContext('ModalDescription');

    useEffect(() => {
      context.setDescriptionPresent(true);
      return () => context.setDescriptionPresent(false);
    }, [context.setDescriptionPresent]);

    return (
      <p
        {...descriptionProps}
        className={mergeClassNames(modalDescriptionClassName, className)}
        id={id ?? context.descriptionId}
        ref={ref}
      />
    );
  },
);

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { className, ...bodyProps },
  ref,
) {
  return (
    <div
      {...bodyProps}
      className={mergeClassNames(modalBodyClassName, className)}
      ref={ref}
    />
  );
});

export type ModalActionProps = HTMLAttributes<HTMLElement>;

export const ModalAction = forwardRef<HTMLElement, ModalActionProps>(
  function ModalAction({ className, ...actionProps }, ref) {
    return (
      <footer
        {...actionProps}
        className={mergeClassNames(modalActionClassName, className)}
        ref={ref}
      />
    );
  },
);

export type ModalCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & AsChildProps;

export const ModalClose = forwardRef<HTMLElement, ModalCloseProps>(function ModalClose(
  { asChild, children, onClick, type = 'button', ...closeProps },
  forwardedRef,
) {
  const context = useModalContext('ModalClose');
  const commandAttributes: CommandAttributes = {
    command: 'close',
    commandfor: context.id,
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
});

export type ModalBackdropProps = FormHTMLAttributes<HTMLFormElement>;

export const ModalBackdrop = forwardRef<HTMLFormElement, ModalBackdropProps>(
  function ModalBackdrop({ className, ...backdropProps }, ref) {
    return (
      <form
        {...backdropProps}
        className={mergeClassNames(modalBackdropClassName, className)}
        method="dialog"
        ref={ref}
      />
    );
  },
);
