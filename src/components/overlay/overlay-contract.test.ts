import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { layerModes, modalPlacements, overlayContract } from './contract.js';

describe('deprecated Overlay facade', () => {
  it('keeps the previous public defaults and literal aliases', () => {
    expect(modalPlacements).toEqual(['top', 'middle', 'bottom', 'start', 'end']);
    expect(layerModes).toEqual(['auto', 'manual', 'hint']);
    expect(overlayContract.defaultModalPlacement).toBe('middle');
    expect(overlayContract.defaultLayerPlacement).toBe('bottom-start');
  });

  it('contains only compatibility composition', () => {
    const root = process.cwd();
    const css = readFileSync(join(root, 'src/components/overlay/overlay.css'), 'utf8');
    const dom = readFileSync(join(root, 'src/components/overlay/dom.ts'), 'utf8');
    const react = readFileSync(join(root, 'src/components/overlay/react.tsx'), 'utf8');

    expect(css.trim()).toBe(
      '@import "../modal/modal.css";\n@import "../popover/popover.css";',
    );
    expect(dom).toContain('@deprecated Use createModalManager or createPopoverManager');
    expect(dom).toContain('createModalManager(root)');
    expect(dom).toContain('createPopoverManager(root)');
    expect(react).toContain('Popover as Layer');
    expect(react).toContain(
      'export type OpenProps = GenericOpenProps<SurfaceOpenChangeReason>',
    );
    expect(react).not.toContain('type PopoverOpenProps as OpenProps');
    expect(dom).not.toContain('@floating-ui/dom');
    expect(react).not.toContain('./react/');
  });
});
