import { describe, expect, it, vi } from 'vitest';
import {
  applyTinyrackColorScheme,
  createTinyrackColorSchemeScript,
  getTinyrackColorSchemePreference,
  resolveTinyrackColorScheme,
  setupTinyrackColorScheme,
} from './color-scheme-provider.tsx';

describe('Tinyrack color scheme helpers', () => {
  it('reads current preferences and legacy applied values', () => {
    expect(getTinyrackColorSchemePreference({ getItem: () => 'auto' })).toBe('auto');
    expect(getTinyrackColorSchemePreference({ getItem: () => 'tinyrack-dark' })).toBe(
      'dark',
    );
    expect(getTinyrackColorSchemePreference({ getItem: () => 'unexpected' })).toBe(
      'auto',
    );
    expect(
      getTinyrackColorSchemePreference(
        {
          getItem() {
            throw new Error('storage unavailable');
          },
        },
        'theme',
        'dark',
      ),
    ).toBe('dark');
  });

  it('resolves and applies all preferences', () => {
    expect(resolveTinyrackColorScheme('auto', true)).toBe('tinyrack-dark');
    expect(resolveTinyrackColorScheme('auto', false)).toBe('tinyrack-light');
    const html = { dataset: {}, style: {} } as unknown as HTMLElement;
    expect(applyTinyrackColorScheme(html, 'dark', false)).toBe('tinyrack-dark');
    expect(html.dataset['theme']).toBe('tinyrack-dark');
    expect(html.style.colorScheme).toBe('dark');
  });

  it('only reacts to system changes while the preference is auto', () => {
    let stored = 'auto';
    let listener: (() => void) | undefined;
    const onChange = vi.fn();
    const removeEventListener = vi.fn();
    const cleanup = setupTinyrackColorScheme({
      document: {
        documentElement: { dataset: {}, style: {} },
      } as unknown as Document,
      onChange,
      window: {
        localStorage: { getItem: () => stored },
        matchMedia: () =>
          ({
            matches: true,
            addEventListener: (_name: string, callback: () => void) => {
              listener = callback;
            },
            removeEventListener,
          }) as unknown as MediaQueryList,
      } as unknown as Window,
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    listener?.();
    expect(onChange).toHaveBeenCalledTimes(2);
    stored = 'light';
    listener?.();
    expect(onChange).toHaveBeenCalledTimes(2);
    cleanup();
    expect(removeEventListener).toHaveBeenCalledWith('change', listener);
  });

  it('creates a bootstrap script with configurable defaults', () => {
    const script = createTinyrackColorSchemeScript({
      defaultPreference: 'dark',
      storageKey: 'custom-theme',
    });
    expect(script).toContain('custom-theme');
    expect(script).toContain('"dark"');
    expect(script).toContain('prefers-color-scheme: dark');
  });
});
