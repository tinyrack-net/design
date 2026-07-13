import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { modalPlacements, modalSizes } from './contract.js';

const css = readFileSync(join(process.cwd(), 'src/components/modal/modal.css'), 'utf8');

describe('modal.css source contract', () => {
  it('owns every Modal part, placement, and size', () => {
    for (const part of [
      'tr-modal',
      'tr-modal-box',
      'tr-modal-header',
      'tr-modal-title',
      'tr-modal-description',
      'tr-modal-body',
      'tr-modal-action',
      'tr-modal-backdrop',
    ]) {
      expect(css).toContain(`.${part}`);
    }
    for (const placement of modalPlacements.filter((value) => value !== 'middle')) {
      expect(css).toContain(`data-placement="${placement}"`);
    }
    for (const size of modalSizes) expect(css).toContain(`data-size="${size}"`);
    expect(css).toContain(':has(.tr-modal:modal:not([data-prevent-scroll="false"]))');
    expect(css).not.toContain('.tr-layer');
  });
});
