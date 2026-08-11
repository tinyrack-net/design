import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parse } from '@babel/parser';
import postcss from 'postcss';

export type TinyrackCheckFormat = 'github' | 'json' | 'pretty';

export type TinyrackCheckViolation = {
  column: number;
  line: number;
  message: string;
  path: string;
  replacement?: string;
  ruleId: string;
};

export type TinyrackCheckResult = {
  checkedFiles: number;
  packageVersion: string;
  platform: 'web';
  schemaVersion: 1;
  violations: TinyrackCheckViolation[];
};

export type TinyrackCheckConfig = {
  exclude?: string[];
  include?: string[];
};

export type TinyrackCheckOptions = {
  configPath?: string;
  root?: string;
};

type Node = Record<string, unknown>;

const packageVersion = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
)['version'] as string;
const designLiteral =
  /(?:#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch|lab|color)\s*\(|(?<![-\w.])(?:\d*\.\d+|\d+)(?:px|rem|em|ch|ex|%|vh|vw|dvh|svh|lvh|vmin|vmax|ms|s|deg|rad|turn)\b)/giu;
const designProperties = new Set([
  'background',
  'background-color',
  'block-size',
  'border',
  'border-color',
  'border-radius',
  'border-width',
  'bottom',
  'box-shadow',
  'color',
  'column-gap',
  'font-family',
  'font-size',
  'font-weight',
  'gap',
  'height',
  'inline-size',
  'inset',
  'left',
  'letter-spacing',
  'line-height',
  'margin',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'opacity',
  'outline',
  'outline-offset',
  'padding',
  'right',
  'row-gap',
  'text-shadow',
  'top',
  'transition',
  'transition-delay',
  'transition-duration',
  'width',
  'z-index',
]);
const inlineProperties = new Set(
  [...designProperties].map((property) =>
    property.replace(/-([a-z])/gu, (_match, letter: string) => letter.toUpperCase()),
  ),
);
const nativeComponents = new Map([
  ['button', 'TRButton or TRIconButton'],
  ['dialog', 'TRDialog or TRAlertDialog'],
  ['input', 'TRInput, TRCheckbox, TRRadio, or a typed field component'],
  ['meter', 'TRMeter'],
  ['progress', 'TRProgress'],
  ['select', 'TRSelect'],
  ['textarea', 'TRTextarea'],
]);
const designUtility =
  /^(?:-?(?:m[trblxy]?|p[trblxy]?|gap(?:-[xy])?|space-[xy]|w|h|min-w|min-h|max-w|max-h|size|top|right|bottom|left|inset(?:-[xy])?|text|font|leading|tracking|bg|border|rounded|shadow|opacity|z|duration|delay|ease|scale|translate-[xy]|rotate)-)/u;
const structuralUtilities = new Set([
  'h-dvh',
  'h-full',
  'h-screen',
  'max-h-dvh',
  'max-w-full',
  'min-h-dvh',
  'min-h-screen',
  'w-full',
  'w-screen',
]);
const structuralUtility =
  /^(?:(?:m[trblxy]?|p[trblxy]?)-(?:0|auto)|(?:inset(?:-[xy])?|top|right|bottom|left)-0|(?:w|h|min-w|min-h|max-w|max-h|size)-(?:0|auto|fit|full|max|min|screen|dvh|svh|lvh)|text-(?:left|right|center|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip|inherit)|(?:rounded|shadow)-none|opacity-(?:0|100)|z-(?:0|auto))$/u;
const defaultExcludes = [
  '**/*.test.*',
  '**/*.spec.*',
  '**/*.stories.*',
  '**/generated/**',
  '**/dist/**',
  '**/build/**',
  '**/node_modules/**',
];

function globExpression(pattern: string) {
  const source = pattern
    .split('/')
    .map((segment) => {
      if (segment === '**') return '.*';
      return segment.replace(/[.+^${}()|[\]\\]/gu, '\\$&').replaceAll('*', '[^/]*');
    })
    .join('/');
  return new RegExp(`^${source}$`, 'u');
}

function matches(path: string, patterns: string[]) {
  return patterns.some((pattern) => globExpression(pattern).test(path));
}

function productionFiles(root: string, config: TinyrackCheckConfig) {
  const includes = config.include ?? ['src/**', 'app/**'];
  const excludes = [...defaultExcludes, ...(config.exclude ?? [])];
  const found: string[] = [];
  const visit = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      const key = relative(root, path).replaceAll('\\', '/');
      if (entry.isDirectory()) visit(path);
      else if (
        entry.isFile() &&
        /\.(?:css|js|jsx|ts|tsx)$/u.test(entry.name) &&
        matches(key, includes) &&
        !matches(key, excludes)
      ) {
        found.push(path);
      }
    }
  };
  visit(root);
  return found.sort();
}

function ignored(source: string, line: number, ruleId: string) {
  const previous = source.split('\n')[line - 2] ?? '';
  const match =
    /tinyrack-check-ignore-next-line\s+([\w/-]+)\s+--\s+(.\S.*?)(?:\*\/)?\s*$/u.exec(
      previous,
    );
  return match?.[1] === ruleId;
}

function push(
  violations: TinyrackCheckViolation[],
  source: string,
  violation: TinyrackCheckViolation,
) {
  if (!ignored(source, violation.line, violation.ruleId)) violations.push(violation);
}

function auditCss(source: string, path: string) {
  const violations: TinyrackCheckViolation[] = [];
  const root = postcss.parse(source, { from: path });
  root.walkDecls((declaration) => {
    if (declaration.prop.startsWith('--tinyrack-')) return;
    const property = declaration.prop.replace(/^(?:-\w+-)/u, '');
    if (!designProperties.has(property) && !property.startsWith('border-')) return;
    const value = declaration.value.trim();
    const structural =
      /^(?:0|1|auto|none|normal|inherit|initial|unset|100%|100d?v[hw]|100s?v[hw]|100l?v[hw])$/u.test(
        value,
      );
    const tokenBacked = /var\(--tinyrack-[a-z0-9-]+(?:\s*,[^)]*)?\)/u.test(value);
    if (
      structural ||
      tokenBacked ||
      (!designLiteral.test(value) && !/^-?(?:\d*\.\d+|\d+)$/u.test(value))
    ) {
      designLiteral.lastIndex = 0;
      return;
    }
    designLiteral.lastIndex = 0;
    const start = declaration.source?.start ?? { column: 1, line: 1 };
    push(violations, source, {
      column: start.column,
      line: start.line,
      message: `${declaration.prop} uses a literal or non-Tinyrack design value: ${value}`,
      path,
      replacement: 'Use a var(--tinyrack-*) semantic token.',
      ruleId: 'tokens/no-literal',
    });
  });
  root.walkAtRules((rule) => {
    if (
      !['container', 'media'].includes(rule.name) ||
      !designLiteral.test(rule.params)
    ) {
      designLiteral.lastIndex = 0;
      return;
    }
    designLiteral.lastIndex = 0;
    const start = rule.source?.start ?? { column: 1, line: 1 };
    push(violations, source, {
      column: start.column,
      line: start.line,
      message: `@${rule.name} uses a literal breakpoint: ${rule.params}`,
      path,
      replacement: 'Use a Tinyrack Tailwind breakpoint variant.',
      ruleId: 'tokens/no-literal',
    });
  });
  return violations;
}

function nodeLocation(node: Node) {
  const location = node['loc'] as
    | { start?: { column?: number; line?: number } }
    | undefined;
  return {
    column: (location?.start?.column ?? 0) + 1,
    line: location?.start?.line ?? 1,
  };
}

function literalValue(node: Node | undefined): string | undefined {
  if (node?.['type'] === 'StringLiteral' || node?.['type'] === 'NumericLiteral') {
    return String(node['value']);
  }
  if (node?.['type'] === 'TemplateLiteral') {
    const expressions = node['expressions'];
    if (Array.isArray(expressions) && expressions.length === 0) {
      return ((node['quasis'] as Node[])?.[0]?.['value'] as Node)?.['cooked'] as string;
    }
  }
  return undefined;
}

function classTokens(value: string) {
  return value
    .trim()
    .split(/\s+/u)
    .map((token) => token.split(':').at(-1) ?? token);
}

function auditTypeScript(source: string, path: string) {
  const violations: TinyrackCheckViolation[] = [];
  const imports: string[] = [];
  const tokenBindings = new Set<string>();
  const tokenNamespaces = new Set<string>();
  const variables = new Map<string, Node>();
  const tree = parse(source, {
    errorRecovery: false,
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
  }) as unknown as Node;
  const invalidStyleExpression = (
    node: Node | undefined,
    seen = new Set<string>(),
  ): string | undefined => {
    const raw = literalValue(node);
    if (raw !== undefined) {
      const structural = ['0', '1', '100%', 'auto', 'none'].includes(raw);
      return structural || raw.includes('var(--tinyrack-') ? undefined : raw;
    }
    if (node?.['type'] === 'Identifier') {
      const name = String(node['name']);
      if (seen.has(name)) return name;
      const initializer = variables.get(name);
      if (initializer === undefined) return undefined;
      seen.add(name);
      return invalidStyleExpression(initializer, seen);
    }
    if (node?.['type'] === 'MemberExpression') {
      let object = node['object'] as Node | undefined;
      while (object?.['type'] === 'MemberExpression') object = object['object'] as Node;
      if (
        object?.['type'] === 'Identifier' &&
        (tokenBindings.has(String(object['name'])) ||
          tokenNamespaces.has(String(object['name'])))
      ) {
        return undefined;
      }
      if (
        object?.['type'] === 'Identifier' &&
        /^tinyrack[A-Z]/u.test(String(object['name']))
      ) {
        return String(object['name']);
      }
    }
    return undefined;
  };
  const visit = (value: unknown, inClassName = false, inStyle = false) => {
    if (value === null || typeof value !== 'object') return;
    const node = value as Node;
    const type = node['type'];
    if (type === 'ImportDeclaration') {
      const imported = String((node['source'] as Node)?.['value'] ?? '');
      imports.push(imported);
      if (imported === '@tinyrack/ui/core') {
        for (const specifier of (node['specifiers'] as Node[] | undefined) ?? []) {
          const local = specifier['local'] as Node | undefined;
          const name = String(local?.['name'] ?? '');
          if (specifier['type'] === 'ImportNamespaceSpecifier') {
            tokenNamespaces.add(name);
          } else if (
            /^tinyrack[A-Z]/u.test(
              String((specifier['imported'] as Node | undefined)?.['name'] ?? ''),
            )
          ) {
            tokenBindings.add(name);
          }
        }
      }
      if (imported.startsWith('@tinyrack/ui/src/')) {
        const location = nodeLocation(node);
        push(violations, source, {
          ...location,
          message: `Private Tinyrack import: ${imported}`,
          path,
          replacement: 'Import an exported @tinyrack/ui subpath.',
          ruleId: 'imports/no-private-tinyrack',
        });
      }
    }
    if (type === 'VariableDeclarator') {
      const id = node['id'] as Node;
      const initializer = node['init'];
      if (
        id?.['type'] === 'Identifier' &&
        initializer !== null &&
        typeof initializer === 'object'
      ) {
        variables.set(String(id['name']), initializer as Node);
      }
    }
    if (type === 'JSXOpeningElement') {
      const name = node['name'] as Node;
      if (name?.['type'] === 'JSXIdentifier') {
        const replacement = nativeComponents.get(String(name['name']));
        if (replacement !== undefined) {
          const location = nodeLocation(node);
          push(violations, source, {
            ...location,
            message: `<${String(name['name'])}> has a public Tinyrack equivalent.`,
            path,
            replacement: `Use ${replacement}.`,
            ruleId: 'components/no-native-equivalent',
          });
        }
      }
    }
    if (type === 'JSXAttribute' && (node['name'] as Node)?.['name'] === 'className') {
      const attributeValue = node['value'] as Node | undefined;
      const expression =
        attributeValue?.['type'] === 'JSXExpressionContainer'
          ? (attributeValue['expression'] as Node)
          : attributeValue;
      visit(expression, true, false);
      return;
    }
    if (type === 'JSXAttribute' && (node['name'] as Node)?.['name'] === 'style') {
      const attributeValue = node['value'] as Node | undefined;
      const expression =
        attributeValue?.['type'] === 'JSXExpressionContainer'
          ? (attributeValue['expression'] as Node)
          : attributeValue;
      visit(expression, false, true);
      return;
    }
    if (inClassName) {
      const text = literalValue(node);
      if (text !== undefined) {
        for (const token of classTokens(text)) {
          if (
            !designUtility.test(token) ||
            structuralUtilities.has(token) ||
            structuralUtility.test(token) ||
            /(?:^|-)tinyrack(?:-|$)/u.test(token) ||
            token.includes('var(--tinyrack-')
          )
            continue;
          const location = nodeLocation(node);
          push(violations, source, {
            ...location,
            message: `Tailwind design utility is not Tinyrack-backed: ${token}`,
            path,
            replacement: 'Use the corresponding *-tinyrack-* utility.',
            ruleId: 'tokens/no-tailwind-default-design-utility',
          });
        }
      }
    }
    if (inStyle && type === 'ObjectProperty') {
      const key = node['key'] as Node;
      const name = String(key?.['name'] ?? key?.['value'] ?? '');
      if (inlineProperties.has(name)) {
        const raw = invalidStyleExpression(node['value'] as Node);
        if (raw !== undefined) {
          const location = nodeLocation(node);
          push(violations, source, {
            ...location,
            message: `${name} uses a literal or non-Tinyrack inline style: ${raw}`,
            path,
            replacement: 'Use a Tinyrack CSS variable or token export.',
            ruleId: 'tokens/no-literal',
          });
        }
      }
    }
    for (const child of Object.values(node)) {
      if (Array.isArray(child))
        child.forEach((item) => {
          visit(item, inClassName, inStyle);
        });
      else if (child !== node['loc']) visit(child, inClassName, inStyle);
    }
  };
  visit(tree);
  return { imports, violations };
}

function readConfig(root: string, configPath?: string) {
  const path = resolve(root, configPath ?? 'tinyrack.check.json');
  if (!existsSync(path)) return {};
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as TinyrackCheckConfig;
  if (parsed.include !== undefined && !Array.isArray(parsed.include)) {
    throw new Error('tinyrack.check.json include must be an array of paths.');
  }
  if (parsed.exclude !== undefined && !Array.isArray(parsed.exclude)) {
    throw new Error('tinyrack.check.json exclude must be an array of paths.');
  }
  return parsed;
}

export async function checkTinyrackProject(
  options: TinyrackCheckOptions = {},
): Promise<TinyrackCheckResult> {
  const root = resolve(options.root ?? process.cwd());
  const files = productionFiles(root, readConfig(root, options.configPath));
  const violations: TinyrackCheckViolation[] = [];
  const imports: string[] = [];
  for (const file of files) {
    const path = relative(root, file).replaceAll('\\', '/');
    const source = readFileSync(file, 'utf8');
    if (file.endsWith('.css')) violations.push(...auditCss(source, path));
    else {
      const result = auditTypeScript(source, path);
      violations.push(...result.violations);
      imports.push(...result.imports);
    }
  }
  const allSource = files.map((file) => readFileSync(file, 'utf8')).join('\n');
  if (files.length > 0 && !allSource.includes('@tinyrack/ui/core.css')) {
    violations.push({
      column: 1,
      line: 1,
      message: 'The project does not import @tinyrack/ui/core.css.',
      path: relative(root, dirname(files[0] ?? root)).replaceAll('\\', '/') || '.',
      replacement: 'Import @tinyrack/ui/core.css before component styles.',
      ruleId: 'setup/require-core-css',
    });
  }
  for (const imported of new Set(imports)) {
    const match = /^@tinyrack\/ui\/components\/([^/.]+)$/u.exec(imported);
    if (match === null) continue;
    const cssPath = `@tinyrack/ui/components/${match[1]}.css`;
    if (allSource.includes(cssPath)) continue;
    violations.push({
      column: 1,
      line: 1,
      message: `${imported} is used without its component stylesheet.`,
      path: '.',
      replacement: `Import ${cssPath}.`,
      ruleId: 'setup/require-component-css',
    });
  }
  return {
    checkedFiles: files.length,
    packageVersion,
    platform: 'web',
    schemaVersion: 1,
    violations: violations.sort((left, right) =>
      `${left.path}:${left.line}:${left.column}:${left.ruleId}`.localeCompare(
        `${right.path}:${right.line}:${right.column}:${right.ruleId}`,
      ),
    ),
  };
}

function escapeAnnotation(value: string) {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

export function formatTinyrackCheckResult(
  result: TinyrackCheckResult,
  format: TinyrackCheckFormat = 'pretty',
) {
  if (format === 'json') return JSON.stringify(result, null, 2);
  if (format === 'github') {
    if (result.violations.length === 0) {
      return `Tinyrack UI check passed (${result.checkedFiles} files).`;
    }
    return result.violations
      .map(
        (violation) =>
          `::error file=${escapeAnnotation(violation.path)},line=${violation.line},col=${violation.column},title=${escapeAnnotation(violation.ruleId)}::${escapeAnnotation(violation.message)}`,
      )
      .join('\n');
  }
  if (result.violations.length === 0) {
    return `Tinyrack UI check passed (${result.checkedFiles} files).`;
  }
  return [
    ...result.violations.map(
      (violation) =>
        `${violation.path}:${violation.line}:${violation.column} ${violation.ruleId} ${violation.message}${violation.replacement === undefined ? '' : ` ${violation.replacement}`}`,
    ),
    `Tinyrack UI check failed with ${result.violations.length} violation(s) in ${result.checkedFiles} file(s).`,
  ].join('\n');
}
