'use client';

import { type ReactNode, useRef } from 'react';

export type TRVirtualListEdge = 'leading' | 'trailing';
export type TRVirtualListAlignment = 'center' | 'leading' | 'nearest' | 'trailing';
export type TRVirtualListFollow = 'leading' | 'none' | 'trailing';

export type TRVirtualListInitialPosition<K> =
  | { edge: TRVirtualListEdge }
  | { alignment?: TRVirtualListAlignment; index: number }
  | { alignment?: TRVirtualListAlignment; key: K };

export type TRVirtualListSnapshot<K> = {
  readonly anchorKey: K | null;
  readonly anchorOffset: number;
  readonly itemSizes: readonly {
    readonly key: K;
    readonly size: number;
  }[];
  readonly version: 1;
};

export type TRVirtualListTriggerExtent =
  | { readonly kind: 'pixels'; readonly value: number }
  | { readonly kind: 'viewports'; readonly value: number };

export type TRVirtualListEdgeRequest = {
  readonly onRequest: () => void;
  readonly requestKey: string | number;
  readonly slot?: ReactNode;
  readonly triggerExtent?: TRVirtualListTriggerExtent;
};

export type TRVirtualListRange<K> = {
  readonly endIndex: number;
  readonly leadingKey: K;
  readonly startIndex: number;
  readonly trailingKey: K;
};

type ScrollOptions = {
  alignment?: TRVirtualListAlignment;
  behavior?: ScrollBehavior;
};

export type TRVirtualListController<K> = {
  holdVisibleAnchorForNextLayout(): void;
  scrollToEdge(
    edge: TRVirtualListEdge,
    options?: Omit<ScrollOptions, 'alignment'>,
  ): void;
  scrollToIndex(index: number, options?: ScrollOptions): void;
  scrollToKey(key: K, options?: ScrollOptions): void;
  takeSnapshot(): TRVirtualListSnapshot<K> | null;
};

export type TRVirtualListControllerBinding<K> = TRVirtualListController<K>;

type BindingRef<K> = { current: TRVirtualListControllerBinding<K> | null };
const controllerBindings = new WeakMap<object, BindingRef<unknown>>();

function createController<K>(bindingRef: BindingRef<K>): TRVirtualListController<K> {
  return {
    holdVisibleAnchorForNextLayout() {
      bindingRef.current?.holdVisibleAnchorForNextLayout();
    },
    scrollToEdge(edge, options) {
      bindingRef.current?.scrollToEdge(edge, options);
    },
    scrollToIndex(index, options) {
      bindingRef.current?.scrollToIndex(index, options);
    },
    scrollToKey(key, options) {
      bindingRef.current?.scrollToKey(key, options);
    },
    takeSnapshot() {
      return bindingRef.current?.takeSnapshot() ?? null;
    },
  };
}

export function useTRVirtualListController<K>(): TRVirtualListController<K> {
  const bindingRef = useRef<TRVirtualListControllerBinding<K> | null>(null);
  const controllerRef = useRef<TRVirtualListController<K> | null>(null);
  if (controllerRef.current === null) {
    controllerRef.current = createController(bindingRef);
    controllerBindings.set(controllerRef.current, bindingRef as BindingRef<unknown>);
  }
  return controllerRef.current;
}

export function attachTRVirtualListController<K>(
  controller: TRVirtualListController<K> | undefined,
  binding: TRVirtualListControllerBinding<K>,
) {
  if (!controller) return undefined;
  const bindingRef = controllerBindings.get(controller) as BindingRef<K> | undefined;
  if (!bindingRef) return undefined;
  bindingRef.current = binding;
  return () => {
    if (bindingRef.current === binding) bindingRef.current = null;
  };
}
