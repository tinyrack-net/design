import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  formControlSizes,
  formMessageVariants,
  radioGroupOrientations,
} from './contract.js';

const repoRoot = process.cwd();

function readFormCss() {
  return readFileSync(join(repoRoot, 'src/components/form/form.css'), 'utf8');
}

describe('form.css source contract', () => {
  it('is standalone component CSS', () => {
    const css = readFormCss();

    expect(css).toContain('.tr-field');
    expect(css).toContain('.tr-input');
    expect(css).toContain('.tr-switch');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
  });

  it('covers sizes, message variants, and radio orientations', () => {
    const css = readFormCss();

    for (const size of formControlSizes) {
      expect(css).toContain(`.tr-field[data-size="${size}"]`);
      expect(css).toContain(`.tr-input[data-size="${size}"]`);
      expect(css).toContain(`.tr-checkbox[data-size="${size}"]`);
      expect(css).toContain(`.tr-switch[data-size="${size}"]`);
    }

    for (const variant of formMessageVariants) {
      expect(css).toContain(`.tr-form-message[data-variant="${variant}"]`);
    }

    for (const orientation of radioGroupOrientations) {
      expect(css).toContain(`.tr-radio-group[data-orientation="${orientation}"]`);
    }
  });
});
