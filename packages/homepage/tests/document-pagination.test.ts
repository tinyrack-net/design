import { describe, expect, it } from 'vitest';
import { getDocumentPagination } from '../app/content/shared/document-pagination.js';
import { createDocumentSeoManifest } from '../scripts/create-document-seo.js';

const manifest = createDocumentSeoManifest(process.cwd());
const descriptionFor = (path: string) =>
  manifest.find((entry) => entry.path === path)?.description;

describe('document pagination order', () => {
  it('starts with a next document and ends with a previous document', () => {
    expect(getDocumentPagination('/', manifest)).toEqual({
      next: {
        description: descriptionFor('/foundations'),
        path: '/foundations/',
        section: 'foundations',
        title: 'Foundations',
      },
    });

    expect(getDocumentPagination('/integrations/mdx-renderer', manifest)).toEqual({
      previous: {
        description: descriptionFor('/integrations/base-ui-providers'),
        path: '/integrations/base-ui-providers/',
        section: 'integrations',
        title: 'Base UI Providers',
      },
    });
  });

  it('links both neighbors for a regular component document', () => {
    expect(getDocumentPagination('/components/button', manifest)).toMatchObject({
      next: {
        path: '/components/card/',
        section: 'components',
        title: 'Card',
      },
      previous: {
        path: '/components/badge/',
        section: 'components',
        title: 'Badge',
      },
    });
  });

  it('continues across section boundaries in sidebar order', () => {
    expect(getDocumentPagination('/foundations/elevation', manifest)).toMatchObject({
      next: {
        path: '/components/accordion/',
        section: 'components',
        title: 'Accordion',
      },
      previous: {
        path: '/foundations/motion/',
        section: 'foundations',
        title: 'Motion',
      },
    });
  });

  it('normalizes trailing slashes and ignores unknown routes', () => {
    expect(getDocumentPagination('/components/button/', manifest)).toEqual(
      getDocumentPagination('/components/button', manifest),
    );
    expect(getDocumentPagination('/missing', manifest)).toEqual({});
  });
});
