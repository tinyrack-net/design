import '../components/code-block/code-block.css';
import '../components/code/code.css';
import '../components/form/form.css';
import '../components/link/link.css';
import '../components/table/table.css';
import '../core/core.css';
import './mdx.css';
import type { ComponentType, ReactNode } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createTinyrackMdxComponents, tinyrackMdxComponents } from './react.js';

type MdxComponentProps = {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
};

const markdownComponentKeys = [
  'a',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'ul',
] as const;

const gfmComponentKeys = [
  'del',
  'input',
  'section',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
] as const;

function mdxComponent(name: string) {
  const components = tinyrackMdxComponents as Record<
    string,
    ComponentType<MdxComponentProps> | undefined
  >;
  const component = components[name];

  if (component === undefined) {
    throw new Error(`Missing MDX component: ${name}`);
  }

  return component;
}

test('React MDX renderer exposes the full CommonMark and GFM component map', () => {
  expect(Object.keys(tinyrackMdxComponents).sort()).toEqual(
    ['wrapper', ...markdownComponentKeys, ...gfmComponentKeys].sort(),
  );
});

test('React MDX renderer maps inline code, fenced code, and tables to Tinyrack contracts', async () => {
  document.documentElement.setAttribute('data-theme', 'tinyrack-dark');
  const Wrapper = mdxComponent('wrapper');
  const Code = mdxComponent('code');
  const Pre = mdxComponent('pre');
  const Table = mdxComponent('table');

  await render(
    <Wrapper>
      <Code>pnpm verify</Code>
      <Pre>
        <Code className="language-ts">{'const answer = 1;'}</Code>
      </Pre>
      <Table>
        <thead>
          <tr>
            <th align="left">Token</th>
            <th align="right">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>radius</td>
            <td>md</td>
          </tr>
        </tbody>
      </Table>
    </Wrapper>,
  );

  const inlineCode = document.querySelector<HTMLElement>('code.tr-code');
  const codeBlock = document.querySelector<HTMLElement>('pre.tr-code-block');
  const tableContainer = document.querySelector<HTMLElement>('.tr-table-container');
  const table = document.querySelector<HTMLElement>('table.tr-table');
  const rightAlignedHeader = document.querySelector<HTMLElement>('th[align="right"]');

  expect(inlineCode?.textContent).toBe('pnpm verify');
  expect(codeBlock?.getAttribute('data-language')).toBe('ts');
  expect(tableContainer).not.toBeNull();
  expect(table?.getAttribute('data-density')).toBe('compact');
  expect(rightAlignedHeader?.textContent).toBe('Value');
  await expect
    .poll(() => codeBlock?.querySelectorAll('span[style*="color"]').length ?? 0)
    .toBeGreaterThan(0);
});

test('React MDX renderer maps prose, links, images, task lists, and footnotes', async () => {
  document.documentElement.setAttribute('data-theme', 'tinyrack-dark');
  const Wrapper = mdxComponent('wrapper');
  const Anchor = mdxComponent('a');
  const Strong = mdxComponent('strong');
  const Emphasis = mdxComponent('em');
  const Delete = mdxComponent('del');
  const Break = mdxComponent('br');
  const Image = mdxComponent('img');
  const List = mdxComponent('ul');
  const ListItem = mdxComponent('li');
  const Input = mdxComponent('input');
  const Section = mdxComponent('section');
  const Sup = mdxComponent('sup');
  const Heading4 = mdxComponent('h4');
  const Heading5 = mdxComponent('h5');
  const Heading6 = mdxComponent('h6');

  await render(
    <Wrapper>
      <Heading4>Fourth</Heading4>
      <Heading5>Fifth</Heading5>
      <Heading6>Sixth</Heading6>
      <Anchor href="https://example.com">Example</Anchor>
      <Strong>Strong</Strong>
      <Emphasis>Emphasis</Emphasis>
      <Delete>Deleted</Delete>
      <Break />
      <Image
        alt="Tiny rack"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      />
      <List className="contains-task-list">
        <ListItem className="task-list-item">
          <Input checked disabled type="checkbox" />
          Done
        </ListItem>
      </List>
      <p>
        Note
        <Sup>
          <Anchor href="#fn-1">1</Anchor>
        </Sup>
      </p>
      <Section data-footnotes="">
        <ol>
          <ListItem id="fn-1">
            Footnote
            <Anchor
              aria-label="Back to content"
              data-footnote-backref=""
              href="#fnref-1"
            >
              Back
            </Anchor>
          </ListItem>
        </ol>
      </Section>
    </Wrapper>,
  );

  expect(document.querySelector('.tr-mdx-h4')?.textContent).toBe('Fourth');
  expect(document.querySelector('.tr-mdx-h5')?.textContent).toBe('Fifth');
  expect(document.querySelector('.tr-mdx-h6')?.textContent).toBe('Sixth');
  expect(document.querySelector('a.tr-link.tr-mdx-link')?.textContent).toBe('Example');
  expect(
    document.querySelector('a.tr-link.tr-mdx-link')?.getAttribute('data-underline'),
  ).toBe('always');
  expect(document.querySelector('.tr-mdx-strong')?.textContent).toBe('Strong');
  expect(document.querySelector('.tr-mdx-em')?.textContent).toBe('Emphasis');
  expect(document.querySelector('.tr-mdx-del')?.textContent).toBe('Deleted');
  expect(document.querySelector('.tr-mdx-break')).not.toBeNull();
  expect(document.querySelector('img.tr-mdx-image')?.getAttribute('alt')).toBe(
    'Tiny rack',
  );
  expect(document.querySelector('ul.tr-mdx-task-list')).not.toBeNull();
  expect(document.querySelector('li.tr-mdx-task-item')).not.toBeNull();
  expect(
    document.querySelector('label.tr-checkbox.tr-mdx-task-checkbox'),
  ).not.toBeNull();
  expect(
    document.querySelector<HTMLInputElement>(
      'label.tr-mdx-task-checkbox input.tr-checkbox-input',
    )?.checked,
  ).toBe(true);
  expect(document.querySelector('.tr-mdx-footnote-ref')).not.toBeNull();
  expect(document.querySelector('section.tr-mdx-footnotes')).not.toBeNull();
  expect(document.querySelector('[data-footnote-backref]')).not.toBeNull();
});

test('React MDX renderer supports custom component overrides', async () => {
  const components = createTinyrackMdxComponents({
    components: {
      h1: function CustomHeading({ children }: MdxComponentProps) {
        return <h1 className="custom-heading">{children}</h1>;
      },
    },
  });
  const Heading = components.h1 as ComponentType<MdxComponentProps>;

  await render(<Heading>Custom</Heading>);

  await expect
    .element(document.querySelector<HTMLElement>('.custom-heading'))
    .toHaveTextContent('Custom');
});
