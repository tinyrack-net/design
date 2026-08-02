import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../', import.meta.url));
const flutterRoot = fileURLToPath(new URL('../../tinyrack_ui/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

function readFlutter(path: string) {
  return readFileSync(new URL(path, `file://${flutterRoot}/`), 'utf8');
}

describe('Flutter CodeBlock documentation', () => {
  it('exposes code, language, and wrap in the live playground', () => {
    const playgrounds = readHomepage('app/documentation/flutter/playgrounds.tsx');
    const definition = playgrounds.slice(
      playgrounds.indexOf('export const codeBlockPlayground'),
      playgrounds.indexOf('export const collapsiblePlayground'),
    );

    expect(definition).toContain("code: { control: 'textarea' }");
    expect(definition).toContain("options: ['plain', 'dart', 'json']");
    expect(definition).toContain("wrap: { control: 'boolean' }");
  });

  it('documents the public contract and localized outcomes', () => {
    const page = readHomepage('app/documentation/flutter/flutter-component-page.tsx');

    for (const name of [
      'TRCodeHighlighter',
      'TRCodeHighlighterProvider',
      'TRCodeHighlightFailure',
      'createTRSyntaxHighlighter',
      'onHighlightFailure',
      'unsupportedLanguage',
      'highlightFailed',
      'noHighlighter',
    ]) {
      expect(page).toContain(name);
    }
    expect(page).toContain('Missing highlighters');
    expect(page).toContain('하이라이터 미설정');
    expect(page).toContain('ハイライター未設定');
  });

  it('renders highlighted, fallback, wrapping, and override examples', () => {
    const examples = readHomepage('app/documentation/flutter/flutter-examples.tsx');
    const preview = readFlutter('example/lib/preview_examples.dart');

    for (const id of [
      'code-block-highlighted',
      'code-block-modes',
      'code-block-override',
    ]) {
      expect(examples).toContain(`id: '${id}'`);
      expect(preview).toContain(`'${id}':`);
    }
    expect(examples).toContain("language: 'ruby'");
    expect(examples).toContain('highlighter: alternateCodeHighlighter');
  });
});
