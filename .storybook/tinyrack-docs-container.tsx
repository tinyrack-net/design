import { MDXProvider } from '@mdx-js/react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { tinyrackMdxComponents } from './tinyrack-mdx-components.js';

export function TinyrackDocsContainer(props: DocsContainerProps) {
  return (
    <MDXProvider components={tinyrackMdxComponents}>
      <DocsContainer {...props} />
    </MDXProvider>
  );
}
