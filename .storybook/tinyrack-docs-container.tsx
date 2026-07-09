import { MDXProvider } from '@mdx-js/react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { tinyrackMdxComponents } from '../src/mdx/react.js';

export function TinyrackDocsContainer(props: DocsContainerProps) {
  return (
    <MDXProvider components={tinyrackMdxComponents}>
      <DocsContainer {...props} />
    </MDXProvider>
  );
}
