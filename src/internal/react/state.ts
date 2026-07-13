import { type MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import type { SurfaceOpenChangeReason } from '../overlay/contract.js';

export type OpenChangeCallback<Reason extends SurfaceOpenChangeReason> = (
  open: boolean,
  detail: {
    reason: Reason;
    source: HTMLElement | null;
  },
) => void;

export type ControlledOpenProps<Reason extends SurfaceOpenChangeReason> = {
  defaultOpen?: never;
  onOpenChange: OpenChangeCallback<Reason>;
  open: boolean;
};

export type UncontrolledOpenProps<Reason extends SurfaceOpenChangeReason> = {
  defaultOpen?: boolean;
  onOpenChange?: OpenChangeCallback<Reason>;
  open?: never;
};

export type OpenProps<Reason extends SurfaceOpenChangeReason> =
  | ControlledOpenProps<Reason>
  | UncontrolledOpenProps<Reason>;

export type OpenState<Reason extends SurfaceOpenChangeReason> = {
  isControlled: boolean;
  open: boolean;
  openRef: MutableRefObject<boolean>;
  requestOpen: (open: boolean, reason: Reason, source?: HTMLElement | null) => void;
};

export function useOpenState<Reason extends SurfaceOpenChangeReason>(
  props: OpenProps<Reason>,
): OpenState<Reason> {
  const isControlled = props.open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(props.defaultOpen ?? false);
  const open = isControlled ? props.open : uncontrolledOpen;
  const openRef = useRef(open);
  openRef.current = open;

  const requestOpen = useCallback(
    (nextOpen: boolean, reason: Reason, source: HTMLElement | null = null) => {
      if (openRef.current === nextOpen) {
        return;
      }

      if (!isControlled) {
        openRef.current = nextOpen;
        setUncontrolledOpen(nextOpen);
      }

      props.onOpenChange?.(nextOpen, { reason, source });
    },
    [isControlled, props.onOpenChange],
  );

  return useMemo(
    () => ({ isControlled, open, openRef, requestOpen }),
    [isControlled, open, requestOpen],
  );
}
