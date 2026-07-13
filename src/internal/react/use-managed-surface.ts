import { type MutableRefObject, useEffect, useRef } from 'react';
import {
  type SurfaceOpenChangeDetail,
  type SurfaceOpenChangeReason,
  surfaceChangeEventName,
} from '../overlay/contract.js';
import type { OpenState } from './state.js';

export type ManagedSurfaceRoot = Document | ShadowRoot;
export type ManagedSurfaceManager<
  Target extends HTMLElement,
  Reason extends SurfaceOpenChangeReason,
> = {
  close: (target: Target, options?: { reason?: Reason }) => boolean;
  destroy: () => void;
  open: (
    target: Target,
    options?: { reason?: Reason; source?: HTMLElement | null },
  ) => boolean;
};

export function useManagedSurface<
  Target extends HTMLElement,
  Reason extends SurfaceOpenChangeReason,
>(
  elementRef: MutableRefObject<Target | null>,
  sourceRef: MutableRefObject<HTMLElement | null>,
  state: OpenState<Reason>,
  createManager: (root: ManagedSurfaceRoot) => ManagedSurfaceManager<Target, Reason>,
) {
  const managerRef = useRef<ManagedSurfaceManager<Target, Reason> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) {
      return;
    }

    const rootNode = element.getRootNode();
    const root = rootNode instanceof ShadowRoot ? rootNode : element.ownerDocument;
    const manager = createManager(root);
    managerRef.current = manager;
    let reconciliationFrame: number | null = null;

    function handleChange(event: Event) {
      const detail = (event as CustomEvent<SurfaceOpenChangeDetail<Reason>>).detail;
      const currentState = stateRef.current;
      if (detail.overlay === element && detail.open !== currentState.openRef.current) {
        currentState.requestOpen(detail.open, detail.reason, detail.source);
        if (currentState.isControlled) {
          const view = element.ownerDocument.defaultView;
          if (view === null) return;
          if (reconciliationFrame !== null) {
            view.cancelAnimationFrame(reconciliationFrame);
          }
          reconciliationFrame = view.requestAnimationFrame(() => {
            reconciliationFrame = null;
            const latestState = stateRef.current;
            const latestManager = managerRef.current;
            if (
              !latestState.isControlled ||
              latestManager === null ||
              latestState.openRef.current === detail.open
            ) {
              return;
            }
            if (latestState.openRef.current) {
              latestManager.open(element, {
                reason: 'programmatic' as Reason,
                source: sourceRef.current,
              });
            } else {
              latestManager.close(element, { reason: 'programmatic' as Reason });
            }
          });
        }
      }
    }

    element.addEventListener(surfaceChangeEventName, handleChange);
    return () => {
      element.removeEventListener(surfaceChangeEventName, handleChange);
      const view = element.ownerDocument.defaultView;
      if (view !== null && reconciliationFrame !== null) {
        view.cancelAnimationFrame(reconciliationFrame);
      }
      manager.destroy();
      managerRef.current = null;
    };
  }, [createManager, elementRef, sourceRef]);

  useEffect(() => {
    const element = elementRef.current;
    const manager = managerRef.current;
    if (element === null || manager === null) {
      return;
    }

    if (state.open) {
      manager.open(element, {
        reason: 'programmatic' as Reason,
        source: sourceRef.current,
      });
    } else {
      manager.close(element, { reason: 'programmatic' as Reason });
    }
  }, [elementRef, sourceRef, state.open]);
}
