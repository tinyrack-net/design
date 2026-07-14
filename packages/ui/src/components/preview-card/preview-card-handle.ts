'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';

export function createPreviewCardHandle<Payload>() {
  return BasePreviewCard.createHandle<Payload>();
}

export type PreviewCardHandle<Payload> = ReturnType<
  typeof createPreviewCardHandle<Payload>
>;
