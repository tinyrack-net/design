import '../../core/core.css';
import './code-block.css';
import { codeToTokens } from 'shiki/bundle/web';
import { beforeEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { CodeBlock } from './react.js';

vi.mock('shiki/bundle/web', () => ({ codeToTokens: vi.fn() }));

const mockedCodeToTokens = vi.mocked(codeToTokens);

beforeEach(() => mockedCodeToTokens.mockReset());

test('React CodeBlock renders every token style and empty-line branch', async () => {
  mockedCodeToTokens.mockResolvedValue({
    bg: '#010203',
    fg: '#040506',
    tokens: [
      [
        { content: 'html', htmlStyle: { fontStyle: 'oblique' }, offset: 0 },
        {
          bgColor: '#111111',
          color: '#eeeeee',
          content: 'italic',
          fontStyle: 1,
          offset: 4,
        },
        { content: 'bold', fontStyle: 2, offset: 10 },
        { content: 'underline', fontStyle: 4, offset: 14 },
        { content: 'plain', offset: 23 },
      ],
      [],
    ],
  });
  const screen = await render(
    <CodeBlock
      className="consumer"
      code="htmlitalicboldunderlineplain\n"
      language="ts"
      style={{ borderWidth: 2 }}
    />,
  );
  const pre = screen.container.querySelector('.tr-code-block') as HTMLElement;
  await expect.poll(() => pre.dataset['highlighted']).toBe('true');
  const spans = pre.querySelectorAll('span');
  expect((spans[0] as HTMLElement).style.fontStyle).toBe('oblique');
  expect((spans[1] as HTMLElement).style.fontStyle).toBe('italic');
  expect((spans[2] as HTMLElement).style.fontWeight).toBe('700');
  expect((spans[3] as HTMLElement).style.textDecoration).toBe('underline');
  expect((spans[4] as HTMLElement).getAttribute('style')).toBeNull();
  expect(pre.style.borderWidth).toBe('2px');
  expect(pre.textContent).toBe('htmlitalicboldunderlineplain\n');
});

test('React CodeBlock ignores stale async highlighting after unmount', async () => {
  mockedCodeToTokens.mockImplementation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return { bg: '#000000', fg: '#ffffff', tokens: [[{ content: 'old', offset: 0 }]] };
  });
  const rendered = await render(<CodeBlock code="old" language="ts" />);
  await expect.poll(() => mockedCodeToTokens).toHaveBeenCalledOnce();
  rendered.unmount();
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(rendered.container.querySelector('.tr-code-block')).toBeNull();
});

test('React CodeBlock keeps explicit style without highlighting', async () => {
  const screen = await render(<CodeBlock code="plain" style={{ color: 'red' }} />);
  const pre = screen.container.querySelector('.tr-code-block') as HTMLElement;
  expect(pre.textContent).toBe('plain');
  expect(pre.style.color).toBe('red');
});

test('React CodeBlock applies fallback theme colors', async () => {
  mockedCodeToTokens.mockResolvedValueOnce({
    tokens: [[{ content: 'fallback', offset: 0 }]],
  });
  const highlighted = await render(<CodeBlock code="fallback" language="ts" />);
  const pre = highlighted.container.querySelector('.tr-code-block') as HTMLElement;
  await expect.poll(() => pre.dataset['highlighted']).toBe('true');
  expect(pre.style.backgroundColor).toBe('rgb(36, 41, 46)');
});
