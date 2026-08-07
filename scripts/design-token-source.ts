import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Ajv } from 'ajv';

// biome-ignore lint/suspicious/noExplicitAny: untrusted JSON is validated before property access.
type JsonObject = any;
type Token = {
  $type: string;
  $value: unknown;
  $extensions?: { 'net.tinyrack'?: { output?: string | number } };
};

const referencePattern = /^\{([^}]+)\}$/;

function object(value: unknown, path: string): asserts value is JsonObject {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
}

function isToken(value: unknown): value is Token {
  return value !== null && typeof value === 'object' && '$value' in value;
}

function merge(target: JsonObject, source: JsonObject): JsonObject {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    target[key] =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !isToken(value) &&
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      !isToken(current)
        ? merge(current as JsonObject, value as JsonObject)
        : structuredClone(value);
  }
  return target;
}

function tokenAt(root: JsonObject, reference: string): Token {
  let value: unknown = root;
  for (const segment of reference.split('.')) {
    object(value, reference);
    value = value[segment];
  }
  if (!isToken(value)) throw new Error(`Unresolved token reference: {${reference}}`);
  return value;
}

function validateTypedValue(type: string, value: unknown, path: string) {
  const dimension = (candidate: unknown) =>
    candidate !== null &&
    typeof candidate === 'object' &&
    typeof (candidate as JsonObject).value === 'number' &&
    ['px', 'rem'].includes(String((candidate as JsonObject).unit));
  switch (type) {
    case 'color':
      object(value, path);
      if (value.colorSpace !== 'srgb' || !Array.isArray(value.components)) {
        throw new Error(`${path} must be an sRGB color`);
      }
      return;
    case 'dimension':
      if (!dimension(value)) throw new Error(`${path} must be a px/rem dimension`);
      return;
    case 'duration':
      object(value, path);
      if (
        typeof value.value !== 'number' ||
        !['ms', 's'].includes(String(value.unit))
      ) {
        throw new Error(`${path} must be an ms/s duration`);
      }
      return;
    case 'cubicBezier':
      if (
        !Array.isArray(value) ||
        value.length !== 4 ||
        value.some((part) => typeof part !== 'number')
      ) {
        throw new Error(`${path} must be a four-number cubic Bézier`);
      }
      return;
    case 'fontFamily':
      if (
        !(
          typeof value === 'string' ||
          (Array.isArray(value) && value.every((part) => typeof part === 'string'))
        )
      ) {
        throw new Error(`${path} must be a font family`);
      }
      return;
    case 'fontWeight':
      if (typeof value !== 'number' || value < 1 || value > 1000) {
        throw new Error(`${path} must be a font weight from 1 through 1000`);
      }
      return;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`${path} must be a finite number`);
      }
      return;
    case 'shadow':
      object(value, path);
      if (
        !dimension(value.offsetX) ||
        !dimension(value.offsetY) ||
        !dimension(value.blur) ||
        !dimension(value.spread)
      ) {
        throw new Error(`${path} must be a DTCG shadow`);
      }
      validateTypedValue('color', value.color, `${path}.color`);
      return;
    default:
      throw new Error(`${path} has unsupported DTCG type ${type}`);
  }
}

function typedValue(
  root: JsonObject,
  token: Token,
  path: string,
  stack: string[],
): unknown {
  if (typeof token.$value === 'string') {
    const match = referencePattern.exec(token.$value);
    if (match) {
      const reference = match[1];
      if (!reference) throw new Error(`${path} has an empty reference`);
      if (stack.includes(reference))
        throw new Error(
          `Circular token reference: ${[...stack, reference].join(' -> ')}`,
        );
      const referenced = tokenAt(root, reference);
      if (referenced.$type !== token.$type) {
        throw new Error(
          `${path} (${token.$type}) references ${reference} (${referenced.$type})`,
        );
      }
      return typedValue(root, referenced, reference, [...stack, reference]);
    }
  }
  validateTypedValue(token.$type, token.$value, path);
  return token.$value;
}

function colorHex(value: JsonObject) {
  if (typeof value.hex === 'string') return value.hex;
  const channels = (value.components as number[]).map((part) =>
    Math.round(part * 255)
      .toString(16)
      .padStart(2, '0'),
  );
  const alpha =
    typeof value.alpha === 'number' && value.alpha < 1
      ? Math.round(value.alpha * 255)
          .toString(16)
          .padStart(2, '0')
      : '';
  return `#${channels.join('')}${alpha}`;
}

function dimensionCss(value: JsonObject) {
  return `${value.value}${value.unit}`;
}

function cssValue(type: string, value: unknown): string | number {
  if (type === 'color') return colorHex(value as JsonObject);
  if (type === 'dimension' || type === 'duration')
    return dimensionCss(value as JsonObject);
  if (type === 'fontFamily') {
    return (Array.isArray(value) ? value : [value])
      .map((family) => (String(family).includes(' ') ? `"${family}"` : family))
      .join(', ');
  }
  if (type === 'shadow') {
    const shadow = value as JsonObject;
    const color = shadow.color as JsonObject;
    const [r, g, b] = (color.components as number[]).map((part) =>
      Math.round(part * 255),
    );
    return `${dimensionCss(shadow.offsetX as JsonObject)} ${dimensionCss(shadow.offsetY as JsonObject)} ${dimensionCss(shadow.blur as JsonObject)} ${dimensionCss(shadow.spread as JsonObject)} rgb(${r} ${g} ${b} / ${color.alpha ?? 1})`;
  }
  if (type === 'cubicBezier') return `cubic-bezier(${(value as number[]).join(', ')})`;
  return value as string | number;
}

function materialize(root: JsonObject, value: unknown, path = ''): unknown {
  if (isToken(value)) {
    const resolved = typedValue(root, value, path, [path]);
    return (
      value.$extensions?.['net.tinyrack']?.output ?? cssValue(value.$type, resolved)
    );
  }
  object(value, path || 'tokens');
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, child]) => [
        key,
        materialize(root, child, path ? `${path}.${key}` : key),
      ]),
  );
}

function validateDocument(root: JsonObject) {
  const visit = (value: unknown, path: string) => {
    if (isToken(value)) {
      if (typeof value.$type !== 'string') throw new Error(`${path} is missing $type`);
      typedValue(root, value, path, [path]);
      return;
    }
    object(value, path || 'tokens');
    for (const [key, child] of Object.entries(value)) {
      if (!key.startsWith('$')) visit(child, path ? `${path}.${key}` : key);
    }
  };
  visit(root, '');
}

export async function loadDesignTokens(
  rootDirectory: string,
  platform: 'flutter' | 'web',
) {
  const resolverPath = resolve(rootDirectory, 'design-tokens/tinyrack.resolver.json');
  const resolver = JSON.parse(await readFile(resolverPath, 'utf8')) as JsonObject;
  const [formatSchema, resolverSchema] = await Promise.all([
    readFile(
      resolve(rootDirectory, 'design-tokens/schema/format-2025.10.schema.json'),
      'utf8',
    ).then(JSON.parse),
    readFile(
      resolve(rootDirectory, 'design-tokens/schema/resolver-2025.10.schema.json'),
      'utf8',
    ).then(JSON.parse),
  ]);
  const resolverAjv = new Ajv({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });
  const formatAjv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  const validateResolver = resolverAjv.compile(resolverSchema);
  const validateFormat = formatAjv.compile(formatSchema);
  if (!validateResolver(resolver)) {
    throw new Error(
      `Invalid DTCG resolver: ${resolverAjv.errorsText(validateResolver.errors)}`,
    );
  }
  const resolverDocument = resolver as JsonObject;
  object(resolverDocument.sets, 'resolver.sets');
  object(resolverDocument.modifiers, 'resolver.modifiers');
  if (resolverDocument.version !== '2025.10')
    throw new Error('The token resolver must use DTCG 2025.10.');
  const base = dirname(resolverPath);
  const references = [
    ...((resolverDocument.sets.common as JsonObject).sources as JsonObject[]),
    ...(((resolverDocument.modifiers.platform as JsonObject).contexts as JsonObject)[
      platform
    ] as JsonObject[]),
    ...(Object.values(
      (resolverDocument.modifiers.theme as JsonObject).contexts as JsonObject,
    ).flat() as JsonObject[]),
  ];
  const merged: JsonObject = {};
  for (const reference of references) {
    const file = reference.$ref;
    if (typeof file !== 'string' || file.startsWith('/') || file.includes('..')) {
      throw new Error(`Unsafe resolver source: ${String(file)}`);
    }
    const document = JSON.parse(
      await readFile(resolve(base, file), 'utf8'),
    ) as JsonObject;
    if (!validateFormat(document)) {
      throw new Error(
        `Invalid DTCG source ${file}: ${formatAjv.errorsText(validateFormat.errors)}`,
      );
    }
    merge(merged, document);
  }
  validateDocument(merged);
  const tokens = materialize(merged, merged) as JsonObject;
  object(tokens.semanticColors, 'semanticColors');
  const light = Object.keys(tokens.semanticColors.light as JsonObject);
  const dark = Object.keys(tokens.semanticColors.dark as JsonObject);
  if (JSON.stringify(light) !== JSON.stringify(dark)) {
    throw new Error('Light and dark semantic token keys must match in the same order.');
  }
  return tokens;
}
