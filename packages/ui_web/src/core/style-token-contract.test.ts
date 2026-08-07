import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  auditCssSource,
  auditTypeScriptSource,
  auditWebProductSources,
} from '../../scripts/style-token-audit.ts';

describe('Web style token contract', () => {
  it.each([
    ['margin', '.example { margin: 8px; }'],
    ['padding', '.example { padding: 1rem; }'],
    ['color', '.example { color: #123456; }'],
    ['font size', '.example { font-size: 18px; }'],
    ['duration', '.example { transition-duration: 300ms; }'],
    ['breakpoint', '@media (width >= 48rem) { .example { display: block; } }'],
  ])('rejects a literal %s', (_label, source) => {
    expect(auditCssSource(source)).toHaveLength(1);
  });

  it('accepts tokens and structural CSS values', () => {
    expect(
      auditCssSource(`
        .example {
          margin: 0;
          padding: var(--tinyrack-space-md);
          inline-size: 100%;
          min-block-size: 100dvh;
        }
      `),
    ).toEqual([]);
  });

  it('rejects literal inline styles and accepts token references', () => {
    expect(
      auditTypeScriptSource(
        `export const Example = () => <div style={{ padding: 8 }} />`,
        '<fixture.tsx>',
      ),
    ).toHaveLength(1);
    expect(
      auditTypeScriptSource(
        `export const Example = () => <div style={{ padding: 'var(--tinyrack-space-md)', width: '100%' }} />`,
        '<fixture.tsx>',
      ),
    ).toEqual([]);
    expect(
      auditTypeScriptSource(
        `const styles = { marginTop: 12 }; export const Example = () => <div style={styles} />`,
        '<fixture.tsx>',
      ),
    ).toHaveLength(1);
  });

  it('keeps all shipped Web product styling token-backed', () => {
    expect(auditWebProductSources(resolve(import.meta.dirname, '../..'))).toEqual([]);
  });
});
