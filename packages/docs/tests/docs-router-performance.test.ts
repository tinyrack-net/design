import { availableParallelism } from 'node:os';
import { describe, expect, it } from 'vitest';
import { buildWorkerBudget } from '../src/config/build-worker-budget.ts';
import { createDocsRouterConfig } from '../src/react-router/docs-routes.ts';
import { createTestProject } from './test-project.ts';

describe('documentation prerender scheduling', () => {
  it('renders static routes with a bounded CPU-aware concurrency', () => {
    const project = createTestProject('/');
    try {
      expect(createDocsRouterConfig(project.config).prerender).toEqual({
        concurrency: buildWorkerBudget({
          maxWorkers: 8,
          parallelism: availableParallelism(),
        }),
        paths: true,
        retryCount: 2,
        retryDelay: 500,
      });
    } finally {
      project.dispose();
    }
  });
});

describe('portable documentation worker budgeting', () => {
  it.each([
    { parallelism: 1, expected: 1 },
    { parallelism: 2, expected: 1 },
    { parallelism: 4, expected: 3 },
    { parallelism: 8, expected: 7 },
    { parallelism: 32, expected: 8 },
  ])('uses $expected workers on $parallelism available CPUs', ({
    parallelism,
    expected,
  }) => {
    expect(buildWorkerBudget({ maxWorkers: 8, parallelism })).toBe(expected);
  });

  it('accepts valid overrides and safely ignores invalid values', () => {
    expect(buildWorkerBudget({ maxWorkers: 4, override: '6', parallelism: 8 })).toBe(6);
    expect(
      buildWorkerBudget({ maxWorkers: 4, override: 'invalid', parallelism: 8 }),
    ).toBe(4);
  });
});
