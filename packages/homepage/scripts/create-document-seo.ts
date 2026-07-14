import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { toString as mdastToString } from 'mdast-util-to-string';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import {
  canonicalDocumentPath,
  type StaticDocumentRoute,
  staticDocumentRoutes,
} from '../app/content/shared/static-document-routes.js';
import {
  type DocumentSeoBreadcrumb,
  type DocumentSeoEntry,
  documentSiteName,
  documentSiteUrl,
} from '../app/seo/document-seo.js';

const descriptionLimit = 160;

function truncateDescription(value: string) {
  if (value.length <= descriptionLimit) return value;

  const candidate = value.slice(0, descriptionLimit - 1);
  const wordBoundary = candidate.lastIndexOf(' ');
  const truncated = wordBoundary >= 80 ? candidate.slice(0, wordBoundary) : candidate;
  return `${truncated.trimEnd()}…`;
}

function extractDocumentText(source: string, sourceFile: string) {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const children = tree.children;
  const headingIndex = children.findIndex(
    (node) => node.type === 'heading' && node.depth === 1,
  );
  const heading = children[headingIndex];
  const summary = children
    .slice(headingIndex + 1)
    .find((node) => node.type === 'paragraph');

  if (headingIndex < 0 || heading?.type !== 'heading') {
    throw new Error(`${sourceFile} must contain one level-one heading`);
  }
  if (summary?.type !== 'paragraph') {
    throw new Error(`${sourceFile} must contain a summary paragraph after its heading`);
  }

  return {
    description: truncateDescription(
      mdastToString(summary).replace(/\s+/g, ' ').trim(),
    ),
    title: mdastToString(heading).replace(/\s+/g, ' ').trim(),
  };
}

function breadcrumbsFor(route: StaticDocumentRoute, canonicalUrl: string) {
  const breadcrumbs: DocumentSeoBreadcrumb[] = [
    { name: documentSiteName, url: `${documentSiteUrl}/` },
  ];

  if (route.section === 'foundations' && route.path !== '/foundations') {
    breadcrumbs.push({
      name: 'Foundations',
      url: `${documentSiteUrl}/foundations/`,
    });
  }

  breadcrumbs.push({ name: route.title, url: canonicalUrl });
  return breadcrumbs;
}

function imagePathFor(pathname: string) {
  return pathname === '/' ? '/og/home.png' : `/og${pathname}.png`;
}

export function createDocumentSeoManifest(homepageRoot: string) {
  const manifest = staticDocumentRoutes.map((route): DocumentSeoEntry => {
    const source = readFileSync(join(homepageRoot, route.sourceFile), 'utf8');
    const extracted = extractDocumentText(source, route.sourceFile);

    if (extracted.title !== route.title) {
      throw new Error(
        `${route.sourceFile} heading "${extracted.title}" must match route title "${route.title}"`,
      );
    }

    const canonicalPath = canonicalDocumentPath(route.path);
    const canonicalUrl = `${documentSiteUrl}${canonicalPath}`;
    const imagePath = imagePathFor(route.path);

    return {
      breadcrumbs: route.path === '/' ? [] : breadcrumbsFor(route, canonicalUrl),
      canonicalPath,
      canonicalUrl,
      description: route.seo?.description ?? extracted.description,
      documentTitle:
        route.path === '/' ? documentSiteName : `${route.title} · ${documentSiteName}`,
      imagePath,
      imageUrl: `${documentSiteUrl}${imagePath}`,
      path: route.path,
      section: route.section,
      sourceFile: route.sourceFile,
      title: route.title,
    };
  });

  const descriptions = new Map<string, string>();
  for (const entry of manifest) {
    if (entry.description.length === 0) {
      throw new Error(`${entry.sourceFile} generated an empty SEO description`);
    }
    const duplicate = descriptions.get(entry.description);
    if (duplicate !== undefined) {
      throw new Error(
        `${entry.sourceFile} and ${duplicate} generated the same SEO description`,
      );
    }
    descriptions.set(entry.description, entry.sourceFile);
  }

  return manifest;
}
