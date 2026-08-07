import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parse } from '@babel/parser';
import postcss from 'postcss';

export type StyleTokenViolation = {
  column: number;
  file: string;
  line: number;
  message: string;
};

const designLiteral =
  /(?:#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch|lab|color)\s*\(|(?<![-\w.])(?:\d*\.\d+|\d+)(?:px|rem|em|ch|ex|%|vh|vw|dvh|svh|lvh|vmin|vmax|ms|s|deg|rad|turn)\b)/giu;
const fullViewportOrPercentage = /^(?:100(?:%|d?v[hw]|sv[hw]|lv[hw]))$/u;
const zeroDimension = /^0(?:px|rem|em|%)?$/u;
const designNumberProperties = new Set([
  'border-width',
  'column-count',
  'font-size',
  'font-weight',
  'letter-spacing',
  'line-height',
  'opacity',
  'order',
  'outline-offset',
  'outline-width',
  'scale',
  'stroke-width',
  'z-index',
]);
const inlineDesignProperties = new Set([
  'blockSize',
  'borderRadius',
  'borderWidth',
  'bottom',
  'boxShadow',
  'columnGap',
  'fontSize',
  'fontWeight',
  'gap',
  'height',
  'inlineSize',
  'inset',
  'insetBlock',
  'insetBlockEnd',
  'insetBlockStart',
  'insetInline',
  'insetInlineEnd',
  'insetInlineStart',
  'left',
  'letterSpacing',
  'lineHeight',
  'margin',
  'marginBlock',
  'marginBlockEnd',
  'marginBlockStart',
  'marginBottom',
  'marginInline',
  'marginInlineEnd',
  'marginInlineStart',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxBlockSize',
  'maxHeight',
  'maxInlineSize',
  'maxWidth',
  'minBlockSize',
  'minHeight',
  'minInlineSize',
  'minWidth',
  'opacity',
  'outlineOffset',
  'outlineWidth',
  'padding',
  'paddingBlock',
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingBottom',
  'paddingInline',
  'paddingInlineEnd',
  'paddingInlineStart',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'right',
  'rowGap',
  'top',
  'transform',
  'transition',
  'transitionDelay',
  'transitionDuration',
  'width',
  'zIndex',
]);

function literalViolations(value: string) {
  return Array.from(value.matchAll(designLiteral)).filter((match) => {
    const literal = match[0].toLowerCase();
    if (
      /^(?:color|hsl|lab|oklch|rgb)\s*\($/u.test(literal) &&
      /(?:color|hsl|lab|oklch|rgb)\s*\(\s*from\s+var\(--tinyrack-/iu.test(value)
    )
      return false;
    return !zeroDimension.test(literal) && !fullViewportOrPercentage.test(literal);
  });
}

export function auditCssSource(
  source: string,
  file = '<css>',
  tokenValues: ReadonlySet<string> = new Set(),
) {
  const violations: StyleTokenViolation[] = [];
  const root = postcss.parse(source, { from: file });
  root.walkDecls((declaration) => {
    const raw = declaration.value.trim();
    const matches = literalViolations(raw);
    const isBareDesignNumber =
      designNumberProperties.has(declaration.prop) &&
      /^-?(?:\d*\.\d+|\d+)$/u.test(raw) &&
      raw !== '0' &&
      raw !== '1' &&
      !(declaration.prop === 'order' && raw === '-1');
    if (matches.length === 0 && !isBareDesignNumber) return;
    const start = declaration.source?.start ?? { column: 1, line: 1 };
    violations.push({
      column: start.column,
      file,
      line: start.line,
      message: `${declaration.prop} contains a literal design value: ${raw}`,
    });
  });
  root.walkAtRules((rule) => {
    if (!['container', 'media'].includes(rule.name)) return;
    const matches = literalViolations(rule.params);
    if (
      matches.length === 0 ||
      matches.every((match) => tokenValues.has(match[0].toLowerCase()))
    )
      return;
    const start = rule.source?.start ?? { column: 1, line: 1 };
    violations.push({
      column: start.column,
      file,
      line: start.line,
      message: `@${rule.name} contains a literal design value: ${rule.params}`,
    });
  });
  return violations;
}

function checkStyleObject(object: Record<string, unknown>, file: string) {
  const violations: StyleTokenViolation[] = [];
  const properties = object['properties'];
  if (!Array.isArray(properties)) return violations;
  for (const property of properties as Record<string, unknown>[]) {
    if (property['type'] !== 'ObjectProperty') continue;
    const key = property['key'] as Record<string, unknown> | undefined;
    const name =
      typeof key?.['name'] === 'string'
        ? key['name']
        : typeof key?.['value'] === 'string'
          ? key['value']
          : undefined;
    if (name === undefined || !inlineDesignProperties.has(name)) continue;
    const expression = property['value'] as Record<string, unknown> | undefined;
    let value: string | undefined;
    if (expression?.['type'] === 'NumericLiteral') value = String(expression['value']);
    if (expression?.['type'] === 'StringLiteral') value = String(expression['value']);
    if (
      expression?.['type'] === 'UnaryExpression' &&
      expression['operator'] === '-' &&
      (expression['argument'] as Record<string, unknown>)?.['type'] === 'NumericLiteral'
    ) {
      value = `-${String((expression['argument'] as Record<string, unknown>)['value'])}`;
    }
    if (value === undefined) continue;
    const numeric = /^-?(?:\d*\.\d+|\d+)$/u.test(value);
    const invalid = numeric
      ? value !== '0' && value !== '1'
      : literalViolations(value).length > 0;
    if (!invalid) continue;
    const location = property['loc'] as
      | { start?: { column?: number; line?: number } }
      | undefined;
    violations.push({
      column: (location?.start?.column ?? 0) + 1,
      file,
      line: location?.start?.line ?? 1,
      message: `${name} contains a literal design value: ${value}`,
    });
  }
  return violations;
}

export function auditTypeScriptSource(source: string, file = '<typescript>') {
  const tree = parse(source, {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
  });
  const violations: StyleTokenViolation[] = [];
  const styleObjects = new Set<Record<string, unknown>>();
  const objectVariables = new Map<string, Record<string, unknown>>();
  const styleVariableNames = new Set<string>();
  const markStyleExpression = (expression: Record<string, unknown> | undefined) => {
    if (expression?.['type'] === 'ObjectExpression') {
      styleObjects.add(expression);
      for (const property of expression['properties'] as Record<string, unknown>[]) {
        if (property['type'] !== 'SpreadElement') continue;
        const argument = property['argument'] as Record<string, unknown> | undefined;
        if (argument?.['type'] === 'Identifier' && typeof argument['name'] === 'string')
          styleVariableNames.add(argument['name']);
      }
      return;
    }
    if (
      expression?.['type'] === 'Identifier' &&
      typeof expression['name'] === 'string'
    ) {
      styleVariableNames.add(expression['name']);
      return;
    }
    for (const key of ['alternate', 'consequent', 'expression', 'left', 'right']) {
      const child = expression?.[key];
      if (child !== null && typeof child === 'object')
        markStyleExpression(child as Record<string, unknown>);
    }
  };
  const visit = (node: unknown) => {
    if (node === null || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    if (
      record['type'] === 'JSXAttribute' &&
      (record['name'] as Record<string, unknown>)?.['name'] === 'style'
    ) {
      const container = record['value'] as Record<string, unknown> | undefined;
      const expression = container?.['expression'] as
        | Record<string, unknown>
        | undefined;
      markStyleExpression(expression);
    }
    if (
      record['type'] === 'VariableDeclarator' &&
      (record['init'] as Record<string, unknown>)?.['type'] === 'ObjectExpression'
    ) {
      const id = record['id'] as Record<string, unknown>;
      if (id?.['type'] === 'Identifier' && typeof id['name'] === 'string')
        objectVariables.set(id['name'], record['init'] as Record<string, unknown>);
      const annotation = id?.['typeAnnotation'] as Record<string, unknown> | undefined;
      if ((JSON.stringify(annotation) ?? '').includes('CSSProperties'))
        styleObjects.add(record['init'] as Record<string, unknown>);
    }
    for (const value of Object.values(record)) {
      if (Array.isArray(value)) value.forEach(visit);
      else visit(value);
    }
  };
  visit(tree);
  for (const name of styleVariableNames) {
    const object = objectVariables.get(name);
    if (object !== undefined) styleObjects.add(object);
  }
  for (const object of styleObjects) violations.push(...checkStyleObject(object, file));
  return violations;
}

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return files(path);
    if (!entry.isFile() || !/\.(?:css|ts|tsx)$/u.test(entry.name)) return [];
    if (/\.(?:browser\.)?(?:docs\.)?test\./u.test(entry.name)) return [];
    return [path];
  });
}

export function auditWebProductSources(packageRoot: string) {
  const sourceRoot = resolve(packageRoot, 'src');
  const generatedTokenSources = [
    resolve(sourceRoot, 'core/core.css'),
    resolve(sourceRoot, 'core/tokens.generated.css'),
  ]
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  const tokenValues = new Set(
    Array.from(generatedTokenSources.matchAll(designLiteral), (match) =>
      match[0].toLowerCase(),
    ),
  );
  return files(sourceRoot).flatMap((path) => {
    const file = relative(packageRoot, path).replaceAll('\\', '/');
    if (file === 'src/core/core.css' || file.endsWith('/tokens.generated.css'))
      return [];
    const source = readFileSync(path, 'utf8');
    return path.endsWith('.css')
      ? auditCssSource(source, file, tokenValues)
      : auditTypeScriptSource(source, file);
  });
}
