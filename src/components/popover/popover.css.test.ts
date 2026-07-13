import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { popoverPlacements } from './contract.js';

const css = readFileSync(
  join(process.cwd(), 'src/components/popover/popover.css'),
  'utf8',
);

describe('popover.css source contract', () => {
  it('owns Popover open, positioning, and logical placement styles', () => {
    expect(css).toContain('.tr-layer:popover-open');
    expect(css).toContain('data-positioned="false"');
    for (const side of new Set(
      popoverPlacements.map((placement) => placement.split('-')[0]),
    )) {
      expect(css).toContain(`data-placement^="${side}"`);
    }
    expect(css).not.toContain('.tr-modal');
    expect(css).not.toContain('z-index: 999');
  });
});
