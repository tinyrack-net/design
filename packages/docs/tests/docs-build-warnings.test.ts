import { describe, expect, it } from 'vitest';
import { collectBuildWarnings } from '../src/cli/docs-build-warnings.ts';

describe('collectBuildWarnings', () => {
  it('ignores successful asset output whose filename contains warning', () => {
    expect(
      collectBuildWarnings(
        [
          'build/client/assets/interface-alert-warning.svg-C-P4dfbn.js 0.71 kB',
          'build/server/assets/warning.svg-BC0-iZi1.js 1.15 kB',
        ].join('\n'),
      ),
    ).toEqual([]);
  });

  it('keeps explicit tool warnings and deprecations actionable', () => {
    expect(
      collectBuildWarnings(
        [
          '(!) Some chunks are larger than 500 kB after minification.',
          'WARN plugin fallback is active',
          '(node:1234) DeprecationWarning: legacy API',
          '[PLUGIN_TIMINGS] slow transform',
        ].join('\n'),
      ),
    ).toEqual([
      '(!) Some chunks are larger than 500 kB after minification.',
      'WARN plugin fallback is active',
      '(node:1234) DeprecationWarning: legacy API',
      '[PLUGIN_TIMINGS] slow transform',
    ]);
  });
});
