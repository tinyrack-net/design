import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { DocsMdxWrapper } from '../src/runtime/docs-mdx-wrapper.js';

describe('DocsMdxWrapper', () => {
  it('does not forward React Router route props to the article element', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const markup = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: ['/docs/components/button'] },
          createElement(
            DocsMdxWrapper,
            {
              actionData: { saved: true },
              id: 'content',
              loaderData: { title: 'Button' },
              matches: [{ id: 'docs' }],
              params: { slug: 'button' },
            },
            createElement('p', null, 'Body'),
          ),
        ),
      );

      expect(markup).toContain('<article id="content"');
      expect(markup).not.toMatch(/actionData|loaderData|matches|params/);
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });
});
