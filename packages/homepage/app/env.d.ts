/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { JSX } from 'react';

  export default function MdxContent(props: Record<string, unknown>): JSX.Element;
}

declare module 'virtual:tinyrack-document-seo' {
  import type { DocumentSeoEntry } from './seo/document-seo.js';

  export const documentSeoManifest: readonly DocumentSeoEntry[];
}
