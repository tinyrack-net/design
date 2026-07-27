import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { docsHighlightLanguageGrammars } from '@tinyrack/docs/highlighting';
import { describe, it } from 'vitest';
import config from '../docs.config.ts';

const contentRoot = join(process.cwd(), config.contentDir);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function contentFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? contentFiles(path)
      : path.endsWith('.mdx')
        ? [path]
        : [];
  });
}

const fencePattern = /^```([A-Za-z0-9_+-]+)/gm;
const fenceBlockPattern = /^```[\s\S]*?^```/gm;
const languageAttributePattern = /language="([^"]+)"/g;
const languagePropertyPattern = /language:\s*'([^']+)'/g;

/**
 * Language identifiers a page actually asks TRCodeBlock to highlight.
 *
 * Fenced blocks are collected first and then removed, because their contents are
 * illustrative source rather than live component props — `docs.config.ts`
 * examples contain `language: 'en'` locale fields that would otherwise read as
 * grammar requests.
 */
function requestedLanguages(source: string) {
  const languages = new Set<string>();
  for (const match of source.matchAll(fencePattern)) {
    languages.add(match[1] as string);
  }

  const outsideFences = source.replaceAll(fenceBlockPattern, '');
  for (const match of outsideFences.matchAll(languageAttributePattern)) {
    languages.add(match[1] as string);
  }
  for (const match of outsideFences.matchAll(languagePropertyPattern)) {
    languages.add(match[1] as string);
  }

  return languages;
}

function requestedContentLanguages() {
  const requested = new Set<string>();
  for (const file of contentFiles(contentRoot)) {
    const source = readFileSync(file, 'utf8');
    for (const language of requestedLanguages(source)) {
      requested.add(language);
    }
  }
  return requested;
}

describe('documentation code block languages', () => {
  it('only requests grammars declared in docs.config.ts', () => {
    const declared = new Set<string>(config.highlight?.languages ?? []);
    assert(declared.size > 0, 'docs.config.ts must declare highlight.languages');

    const undeclared: string[] = [];
    for (const file of contentFiles(contentRoot)) {
      for (const language of requestedLanguages(readFileSync(file, 'utf8'))) {
        if (!declared.has(language)) {
          undeclared.push(`${relative(process.cwd(), file)}: ${language}`);
        }
      }
    }

    assert(
      undeclared.length === 0,
      `Content requests grammars that are not enabled, so those blocks render as plain text. Add them to highlight.languages in docs.config.ts (supported ids: ${Object.keys(docsHighlightLanguageGrammars).join(', ')}):\n${undeclared.join('\n')}`,
    );
  });

  it('does not bundle grammars that content never requests', () => {
    const requestedGrammars = new Set(
      [...requestedContentLanguages()].map((language) => {
        assert(
          Object.hasOwn(docsHighlightLanguageGrammars, language),
          `Content requests unsupported grammar id: ${language}`,
        );
        return docsHighlightLanguageGrammars[
          language as keyof typeof docsHighlightLanguageGrammars
        ];
      }),
    );
    const unusedGrammars = [
      ...new Set(
        (config.highlight?.languages ?? []).map(
          (language) => docsHighlightLanguageGrammars[language],
        ),
      ),
    ].filter((grammar) => !requestedGrammars.has(grammar));

    assert(
      unusedGrammars.length === 0,
      `docs.config.ts builds grammar chunks that app/content never requests: ${unusedGrammars.join(', ')}`,
    );
  });
});
