import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { DocsPage } from '../src/runtime/docs-page/index.js';

describe('DocsPage', () => {
  it('renders the shared docs article without forwarding manifest props', () => {
    const markup = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        { initialEntries: ['/docs/'] },
        createElement(
          DocsPage,
          {
            className: 'custom-page',
            frontmatter: {
              description: 'Welcome.',
              order: 0,
              section: 'start',
              title: 'Home',
            },
            headings: [{ depth: 2, id: 'body', label: 'Body' }],
            id: 'content',
          },
          createElement('h2', { id: 'body' }, 'Body'),
        ),
      ),
    );

    expect(markup).toContain(
      '<article id="content" class="tr-mdx custom-page" data-pagefind-body=""',
    );
    expect(markup).toContain('<h1 class="tr-mdx-h1"');
    expect(markup).toContain('Home</h1>');
    expect(markup).toContain('<h2 id="body">Body</h2>');
    expect(markup).not.toMatch(/frontmatter=|headings=/);
  });
});
