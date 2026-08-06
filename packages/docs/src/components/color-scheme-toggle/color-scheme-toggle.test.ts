import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { type TRColorScheme, TRColorSchemeToggle } from './color-scheme-toggle.tsx';

describe('TRColorSchemeToggle', () => {
  it.each([
    ['auto', 'Use light color scheme', 'lucide-sun'],
    ['light', 'Use dark color scheme', 'lucide-moon'],
    ['dark', 'Use automatic color scheme', 'lucide-monitor'],
  ] satisfies readonly [TRColorScheme, string, string][])(
    'renders the next action after %s',
    (value, label, iconClass) => {
      const markup = renderToStaticMarkup(
        createElement(TRColorSchemeToggle, {
          onValueChange() {},
          value,
        }),
      );

      expect(markup).toContain(`aria-label="${label}"`);
      expect(markup).toContain(iconClass);
      expect(markup).not.toContain('aria-pressed');
    },
  );
});
