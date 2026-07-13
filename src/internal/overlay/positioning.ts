import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
} from '@floating-ui/dom';
import {
  type PopoverPlacement,
  popoverContract,
  popoverPlacements,
} from '../../components/popover/contract.js';
import { dataBoolean, dataNumber } from './options.js';
import type { SurfaceEntry } from './types.js';

function isPlacement(value: string): value is PopoverPlacement {
  return popoverPlacements.includes(value as PopoverPlacement);
}

export function createPopoverPositioner(
  entry: SurfaceEntry,
  findSource: (element: HTMLElement) => HTMLElement | null,
) {
  const source = entry.source ?? findSource(entry.element);
  if (source === null || !source.isConnected) return null;

  entry.element.dataset['positioned'] = 'false';
  const cleanup = autoUpdate(source, entry.element, async () => {
    const requested = entry.element.dataset['placement'] ?? '';
    const placement = isPlacement(requested)
      ? requested
      : popoverContract.defaultPlacement;
    const collisionPadding = dataNumber(
      entry.element,
      'collisionPadding',
      popoverContract.defaultCollisionPadding,
    );
    const result = await computePosition(source, entry.element, {
      placement,
      middleware: [
        offset(dataNumber(entry.element, 'offset', popoverContract.defaultOffset)),
        flip({ padding: collisionPadding }),
        shift({ padding: collisionPadding }),
        size({
          padding: collisionPadding,
          apply({ availableHeight, availableWidth, elements, rects }) {
            elements.floating.style.setProperty(
              '--tr-layer-available-height',
              `${Math.max(0, availableHeight)}px`,
            );
            elements.floating.style.setProperty(
              '--tr-layer-available-width',
              `${Math.max(0, availableWidth)}px`,
            );
            if (dataBoolean(entry.element, 'matchAnchorWidth', false)) {
              elements.floating.style.minWidth = `${rects.reference.width}px`;
            } else {
              elements.floating.style.removeProperty('min-width');
            }
          },
        }),
      ],
    });
    entry.element.style.left = `${result.x}px`;
    entry.element.style.position = result.strategy;
    entry.element.style.top = `${result.y}px`;
    entry.element.dataset['placement'] = result.placement;
    entry.element.dataset['positioned'] = 'true';
  });

  return () => {
    cleanup();
    entry.element.style.removeProperty('--tr-layer-available-height');
    entry.element.style.removeProperty('--tr-layer-available-width');
    entry.element.style.removeProperty('left');
    entry.element.style.removeProperty('min-width');
    entry.element.style.removeProperty('position');
    entry.element.style.removeProperty('top');
    entry.element.removeAttribute('data-positioned');
  };
}
