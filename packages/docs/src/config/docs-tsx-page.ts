import type { DocsFrontmatter, DocsHeading } from './docs-config.ts';

export type ParsedDocsTsxPage = {
  frontmatter: DocsFrontmatter;
  headings: readonly DocsHeading[];
};

type StaticValue =
  | boolean
  | null
  | number
  | string
  | StaticValue[]
  | { [key: string]: StaticValue };

function skipQuoted(source: string, start: number, quote: string) {
  let index = start + 1;
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2;
      continue;
    }
    if (source[index] === quote) return index + 1;
    index += 1;
  }
  return source.length;
}

function skipComment(source: string, start: number) {
  if (source[start + 1] === '/') {
    const end = source.indexOf('\n', start + 2);
    return end === -1 ? source.length : end + 1;
  }
  if (source[start + 1] === '*') {
    const end = source.indexOf('*/', start + 2);
    return end === -1 ? source.length : end + 2;
  }
  return start;
}

function previousSourceToken(source: string, index: number) {
  let previous = source.slice(0, index).trimEnd();
  while (previous.length > 0) {
    if (previous.endsWith('*/')) {
      const start = previous.lastIndexOf('/*');
      if (start !== -1) {
        previous = previous.slice(0, start).trimEnd();
        continue;
      }
    }
    const lineStart = previous.lastIndexOf('\n') + 1;
    if (previous.slice(lineStart).trimStart().startsWith('//')) {
      previous = previous.slice(0, lineStart).trimEnd();
      continue;
    }
    break;
  }
  return previous;
}

function startsLiteral(source: string, index: number) {
  const previous = previousSourceToken(source, index);
  if (previous.length === 0) return true;
  if (/[([{:;,=!?&|+*%^~>-]$/.test(previous)) return true;
  return /(?:^|\W)(?:await|case|from|import|in|instanceof|of|return|throw|typeof|yield)$/.test(
    previous,
  );
}

function startsQuotedLiteral(source: string, index: number) {
  const previous = previousSourceToken(source, index);
  if (previous.endsWith('=>')) return true;
  if (previous.endsWith('>')) return false;
  return startsLiteral(source, index);
}

function skipRegex(source: string, start: number) {
  let index = start + 1;
  let characterClass = false;
  while (index < source.length) {
    const character = source[index];
    if (character === '\\') {
      index += 2;
      continue;
    }
    if (character === '[') characterClass = true;
    if (character === ']') characterClass = false;
    if (character === '/' && !characterClass) {
      index += 1;
      while (/[A-Za-z]/.test(source[index] ?? '')) index += 1;
      return index;
    }
    if (character === '\n' || character === '\r') return start;
    index += 1;
  }
  return start;
}

function openingTags(source: string) {
  const starts: number[] = [];
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    if (
      (character === '"' || character === "'" || character === '`') &&
      startsQuotedLiteral(source, index)
    ) {
      index = skipQuoted(source, index, character);
      continue;
    }
    if (character === '/') {
      const next = skipComment(source, index);
      if (next !== index) {
        index = next;
        continue;
      }
      if (startsLiteral(source, index)) {
        const end = skipRegex(source, index);
        if (end !== index) {
          index = end;
          continue;
        }
      }
    }
    if (
      source.startsWith('<DocsPage', index) &&
      /[\s/>]/.test(source[index + '<DocsPage'.length] ?? '')
    ) {
      starts.push(index);
      index += '<DocsPage'.length;
      continue;
    }
    index += 1;
  }
  return starts;
}

function location(source: string, index: number) {
  const lines = source.slice(0, index).split('\n');
  return `${lines.length}:${(lines.at(-1)?.length ?? 0) + 1}`;
}

function fail(
  source: string,
  sourceFile: string,
  index: number,
  message: string,
): never {
  throw new Error(`${sourceFile}:${location(source, index)} ${message}`);
}

function expressionEnd(source: string, start: number, sourceFile: string) {
  let depth = 1;
  let index = start + 1;
  while (index < source.length) {
    const character = source[index];
    if (character === '"' || character === "'" || character === '`') {
      index = skipQuoted(source, index, character);
      continue;
    }
    if (character === '/') {
      const next = skipComment(source, index);
      if (next !== index) {
        index = next;
        continue;
      }
      if (startsLiteral(source, index)) {
        const end = skipRegex(source, index);
        if (end !== index) {
          index = end;
          continue;
        }
      }
    }
    if (character === '{') depth += 1;
    if (character === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
    index += 1;
  }
  return fail(source, sourceFile, start, 'has an unterminated JSX expression');
}

function staticProps(source: string, sourceFile: string, opening: number) {
  const props = new Map<string, { source: string; start: number }>();
  let index = opening + '<DocsPage'.length;
  while (index < source.length) {
    while (/\s/.test(source[index] ?? '')) index += 1;
    if (source[index] === '>') return props;
    if (source[index] === '/' && source[index + 1] === '>') return props;
    if (source[index] === '{') {
      fail(source, sourceFile, index, 'DocsPage props must not use spread attributes');
    }
    const nameMatch = /^[A-Za-z_$][\w$:-]*/.exec(source.slice(index));
    if (nameMatch === null) {
      fail(source, sourceFile, index, 'contains an invalid DocsPage attribute');
    }
    const name = nameMatch[0];
    index += name.length;
    while (/\s/.test(source[index] ?? '')) index += 1;
    if (source[index] !== '=') continue;
    index += 1;
    while (/\s/.test(source[index] ?? '')) index += 1;
    if (source[index] === '"' || source[index] === "'") {
      if (name === 'frontmatter' || name === 'headings') {
        fail(source, sourceFile, index, `${name} must use a JSX expression`);
      }
      index = skipQuoted(source, index, source[index] as string);
      continue;
    }
    if (source[index] !== '{') {
      fail(source, sourceFile, index, `${name} must use a JSX expression`);
    }
    const start = index + 1;
    const end = expressionEnd(source, index, sourceFile);
    if (name === 'frontmatter' || name === 'headings') {
      if (props.has(name))
        fail(source, sourceFile, index, `contains duplicate ${name}`);
      props.set(name, { source: source.slice(start, end), start });
    }
    index = end + 1;
  }
  return fail(source, sourceFile, opening, 'has an unterminated DocsPage opening tag');
}

class StaticLiteralParser {
  private index = 0;
  private readonly source: string;
  private readonly error: (index: number, message: string) => never;

  constructor(source: string, error: (index: number, message: string) => never) {
    this.source = source;
    this.error = error;
  }

  parse(): StaticValue {
    const value = this.value();
    this.space();
    if (this.index !== this.source.length) {
      this.error(this.index, 'contains an unsupported expression');
    }
    return value;
  }

  private space() {
    while (this.index < this.source.length) {
      if (/\s/.test(this.source[this.index] ?? '')) {
        this.index += 1;
        continue;
      }
      if (this.source.startsWith('//', this.index)) {
        const end = this.source.indexOf('\n', this.index + 2);
        this.index = end === -1 ? this.source.length : end + 1;
        continue;
      }
      if (this.source.startsWith('/*', this.index)) {
        const end = this.source.indexOf('*/', this.index + 2);
        if (end === -1) this.error(this.index, 'has an unterminated comment');
        this.index = end + 2;
        continue;
      }
      break;
    }
  }

  private value(): StaticValue {
    this.space();
    const character = this.source[this.index];
    if (character === '{') return this.object();
    if (character === '[') return this.array();
    if (character === '"' || character === "'") return this.string();
    const number = /^-?(?:0|[1-9]\d*)(?:\.\d+)?/.exec(this.source.slice(this.index));
    if (number !== null) {
      this.index += number[0].length;
      return Number(number[0]);
    }
    for (const [keyword, value] of [
      ['true', true],
      ['false', false],
      ['null', null],
    ] as const) {
      if (this.source.startsWith(keyword, this.index)) {
        this.index += keyword.length;
        return value;
      }
    }
    this.error(this.index, 'contains an unsupported expression');
  }

  private object() {
    const value: Record<string, StaticValue> = {};
    this.index += 1;
    this.space();
    while (this.source[this.index] !== '}') {
      if (this.source.startsWith('...', this.index)) {
        this.error(this.index, 'must not contain spread properties');
      }
      const key =
        this.source[this.index] === '"' || this.source[this.index] === "'"
          ? this.string()
          : this.identifier();
      this.space();
      if (this.source[this.index] !== ':')
        this.error(this.index, 'must use key: value');
      this.index += 1;
      value[String(key)] = this.value();
      this.space();
      if (this.source[this.index] === ',') {
        this.index += 1;
        this.space();
        if (this.source[this.index] === '}') break;
        continue;
      }
      if (this.source[this.index] !== '}')
        this.error(this.index, 'must separate values with commas');
    }
    if (this.source[this.index] !== '}')
      this.error(this.index, 'has an unterminated object');
    this.index += 1;
    return value;
  }

  private array() {
    const value: StaticValue[] = [];
    this.index += 1;
    this.space();
    while (this.source[this.index] !== ']') {
      value.push(this.value());
      this.space();
      if (this.source[this.index] === ',') {
        this.index += 1;
        this.space();
        if (this.source[this.index] === ']') break;
        continue;
      }
      if (this.source[this.index] !== ']')
        this.error(this.index, 'must separate values with commas');
    }
    if (this.source[this.index] !== ']')
      this.error(this.index, 'has an unterminated array');
    this.index += 1;
    return value;
  }

  private identifier() {
    const match = /^[A-Za-z_$][\w$]*/.exec(this.source.slice(this.index));
    if (match === null) this.error(this.index, 'contains an invalid object key');
    this.index += match[0].length;
    return match[0];
  }

  private string() {
    const quote = this.source[this.index];
    let value = '';
    this.index += 1;
    while (this.index < this.source.length && this.source[this.index] !== quote) {
      const character = this.source[this.index];
      if (character !== '\\') {
        value += character;
        this.index += 1;
        continue;
      }
      const escaped = this.source[this.index + 1];
      const replacements: Record<string, string> = {
        '"': '"',
        "'": "'",
        '0': '\0',
        '\\': '\\',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t',
        v: '\v',
      };
      if (escaped === '\n') {
        this.index += 2;
        continue;
      }
      if (escaped === '\r') {
        this.index += this.source[this.index + 2] === '\n' ? 3 : 2;
        continue;
      }
      if (escaped === 'x') {
        const digits = this.source.slice(this.index + 2, this.index + 4);
        if (!/^[\da-f]{2}$/i.test(digits))
          this.error(this.index, 'contains an invalid hexadecimal escape');
        value += String.fromCharCode(Number.parseInt(digits, 16));
        this.index += 4;
        continue;
      }
      if (escaped === 'u') {
        if (this.source[this.index + 2] === '{') {
          const end = this.source.indexOf('}', this.index + 3);
          const digits = end === -1 ? '' : this.source.slice(this.index + 3, end);
          const codePoint = Number.parseInt(digits, 16);
          if (end === -1 || !/^[\da-f]+$/i.test(digits) || codePoint > 0x10ffff) {
            this.error(this.index, 'contains an invalid Unicode escape');
          }
          value += String.fromCodePoint(codePoint);
          this.index = end + 1;
          continue;
        }
        const digits = this.source.slice(this.index + 2, this.index + 6);
        if (!/^[\da-f]{4}$/i.test(digits))
          this.error(this.index, 'contains an invalid Unicode escape');
        value += String.fromCharCode(Number.parseInt(digits, 16));
        this.index += 6;
        continue;
      }
      if (escaped === '0' && /\d/.test(this.source[this.index + 2] ?? '')) {
        this.error(this.index, 'contains an unsupported numeric escape');
      }
      value += replacements[escaped ?? ''] ?? escaped ?? '';
      this.index += 2;
    }
    if (this.source[this.index] !== quote)
      this.error(this.index, 'has an unterminated string');
    this.index += 1;
    return value;
  }
}

function literal(
  expression: { source: string; start: number },
  source: string,
  sourceFile: string,
  prop: string,
) {
  return new StaticLiteralParser(expression.source, (index, message) =>
    fail(source, sourceFile, expression.start + index, `${prop} ${message}`),
  ).parse();
}

export function parseDocsTsxPage(
  source: string,
  sourceFile: string,
): { frontmatter: unknown; headings: unknown } {
  const openings = openingTags(source);
  if (openings.length !== 1) {
    throw new Error(
      `${sourceFile} must contain exactly one <DocsPage> opening element`,
    );
  }
  const props = staticProps(source, sourceFile, openings[0] as number);
  const frontmatter = props.get('frontmatter');
  if (frontmatter === undefined || !/^\s*\{/.test(frontmatter.source)) {
    fail(
      source,
      sourceFile,
      frontmatter?.start ?? (openings[0] as number),
      'frontmatter must be an inline static object literal',
    );
  }
  const headings = props.get('headings');
  if (headings !== undefined && !/^\s*\[/.test(headings.source)) {
    fail(
      source,
      sourceFile,
      headings.start,
      'headings must be an inline static array literal',
    );
  }
  return {
    frontmatter: literal(frontmatter, source, sourceFile, 'frontmatter'),
    headings:
      headings === undefined ? [] : literal(headings, source, sourceFile, 'headings'),
  };
}
