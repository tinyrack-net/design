import { type ComponentPropsWithoutRef, isValidElement, type ReactNode } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import { Code } from '../src/components/code/react.js';
import { ShikiCodeBlock } from '../src/components/code-block/shiki-react.js';
import { Table, TableContainer } from '../src/components/table/react.js';

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function textFromReactNode(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textFromReactNode).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textFromReactNode(node.props.children);
  }

  return '';
}

function languageFromClassName(className: string | undefined) {
  return (
    className
      ?.split(/\s+/)
      .find((classPart) => classPart.startsWith('language-'))
      ?.replace(/^language-/, '') || 'text'
  );
}

function TinyrackMdxWrapper({ children }: { children?: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-tinyrack-surface p-6 text-tinyrack-text max-sm:p-4 md:p-8">
      {children}
    </main>
  );
}

function TinyrackMdxPre({ children }: ComponentPropsWithoutRef<'pre'>) {
  if (isValidElement<{ children?: ReactNode; className?: string }>(children)) {
    const code = textFromReactNode(children.props.children).replace(/\n$/, '');
    const language = languageFromClassName(children.props.className);

    return <ShikiCodeBlock code={code} language={language as BundledLanguage} />;
  }

  return <pre className="tr-code-block">{children}</pre>;
}

function TinyrackMdxCode({
  className,
  ...codeProps
}: ComponentPropsWithoutRef<'code'>) {
  return <Code className={className} {...codeProps} />;
}

function TinyrackMdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <TableContainer>
      <Table density="compact" {...props} />
    </TableContainer>
  );
}

function TinyrackMdxH1({ className, ...headingProps }: ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={mergeClassNames(
        'm-0 text-tinyrack-5xl font-semibold leading-tinyrack-sm tracking-tinyrack-none max-sm:text-tinyrack-4xl',
        className,
      )}
      {...headingProps}
    />
  );
}

function TinyrackMdxH2({ className, ...headingProps }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className={mergeClassNames(
        'mt-8 mb-0 border-t border-tinyrack-border pt-5 text-tinyrack-lg font-semibold leading-tinyrack-sm tracking-tinyrack-none',
        className,
      )}
      {...headingProps}
    />
  );
}

function TinyrackMdxH3({ className, ...headingProps }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className={mergeClassNames(
        'mt-5 mb-0 text-tinyrack-md font-semibold leading-tinyrack-sm tracking-tinyrack-none',
        className,
      )}
      {...headingProps}
    />
  );
}

function TinyrackMdxParagraph({
  className,
  ...paragraphProps
}: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={mergeClassNames(
        'mt-4 max-w-[58rem] text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted',
        className,
      )}
      {...paragraphProps}
    />
  );
}

function TinyrackMdxList({ className, ...listProps }: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      className={mergeClassNames(
        'mt-3 grid max-w-[58rem] gap-2 pl-5 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted',
        className,
      )}
      {...listProps}
    />
  );
}

function TinyrackMdxOrderedList({
  className,
  ...listProps
}: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={mergeClassNames(
        'mt-3 grid max-w-[58rem] list-decimal gap-2 pl-5 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted',
        className,
      )}
      {...listProps}
    />
  );
}

function TinyrackMdxListItem({
  className,
  ...itemProps
}: ComponentPropsWithoutRef<'li'>) {
  return <li className={mergeClassNames('pl-1', className)} {...itemProps} />;
}

function TinyrackMdxAnchor({
  className,
  ...anchorProps
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={mergeClassNames(
        'font-medium text-tinyrack-primary underline underline-offset-4',
        className,
      )}
      {...anchorProps}
    />
  );
}

function TinyrackMdxHr({ className, ...hrProps }: ComponentPropsWithoutRef<'hr'>) {
  return (
    <hr
      className={mergeClassNames('my-8 border-t border-tinyrack-border', className)}
      {...hrProps}
    />
  );
}

function TinyrackMdxBlockquote({
  className,
  ...quoteProps
}: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      className={mergeClassNames(
        'mt-4 max-w-[58rem] border-l-2 border-tinyrack-border pl-4 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted',
        className,
      )}
      {...quoteProps}
    />
  );
}

export const tinyrackMdxComponents = {
  wrapper: TinyrackMdxWrapper,
  pre: TinyrackMdxPre,
  code: TinyrackMdxCode,
  table: TinyrackMdxTable,
  h1: TinyrackMdxH1,
  h2: TinyrackMdxH2,
  h3: TinyrackMdxH3,
  p: TinyrackMdxParagraph,
  ul: TinyrackMdxList,
  ol: TinyrackMdxOrderedList,
  li: TinyrackMdxListItem,
  a: TinyrackMdxAnchor,
  hr: TinyrackMdxHr,
  blockquote: TinyrackMdxBlockquote,
};
