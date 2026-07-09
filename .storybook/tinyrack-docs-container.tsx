import { MDXProvider } from '@mdx-js/react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { ComponentPropsWithoutRef } from 'react';
import { createTinyrackMdxComponents } from '../src/mdx/react.js';
import { TinyrackMdxWrapper } from '../src/mdx/react-components/Wrapper.js';
import { mergeClassNames } from '../src/mdx/shared.js';

function StorybookTinyrackMdxWrapper({
  className,
  ...wrapperProps
}: ComponentPropsWithoutRef<'main'>) {
  return (
    <TinyrackMdxWrapper
      {...wrapperProps}
      className={mergeClassNames('sb-unstyled', className)}
    />
  );
}

export const storybookTinyrackMdxComponents = createTinyrackMdxComponents({
  components: {
    wrapper: StorybookTinyrackMdxWrapper,
  },
});

export function TinyrackDocsContainer(props: DocsContainerProps) {
  return (
    <MDXProvider components={storybookTinyrackMdxComponents}>
      <DocsContainer {...props} />
    </MDXProvider>
  );
}
