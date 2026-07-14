'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';

export function createToastManager<Data extends object = Record<string, never>>() {
  return BaseToast.createToastManager<Data>();
}

export function useToastManager<Data extends object = Record<string, never>>() {
  return BaseToast.useToastManager<Data>();
}
