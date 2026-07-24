'use client';

import { TRProgress } from '../progress/index.js';

/** Internal top-of-shell indeterminate loading bar shown during route transitions. */
export function AppShellProgress({ label }: { label: string }) {
  return (
    <TRProgress.Root className="tr-app-shell-progress" uiSize="sm" value={null}>
      <TRProgress.Label className="tr-app-shell-visually-hidden">
        {label}
      </TRProgress.Label>
      <TRProgress.Track>
        <TRProgress.Indicator />
      </TRProgress.Track>
    </TRProgress.Root>
  );
}
