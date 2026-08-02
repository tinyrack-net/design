const htmlEntities = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
} as const;

export function mergeClassNames(
  ...classNames: Array<false | null | string | undefined>
) {
  return classNames.filter(Boolean).join(' ');
}

export function languageFromClassName(className: string | undefined) {
  const languageClass = className
    ?.split(/\s+/)
    .find((classPart) => classPart.startsWith('language-'));

  if (languageClass === undefined) {
    return undefined;
  }

  return languageClass.replace(/^language-/, '') || 'text';
}

export function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, entityName) => {
    if (typeof entityName !== 'string') {
      return entity;
    }

    if (entityName.startsWith('#x') || entityName.startsWith('#X')) {
      const codePoint = Number.parseInt(entityName.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }

    if (entityName.startsWith('#')) {
      const codePoint = Number.parseInt(entityName.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }

    const namedEntity =
      htmlEntities[entityName.toLowerCase() as keyof typeof htmlEntities];

    return namedEntity ?? entity;
  });
}

export function htmlToPlainText(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|li|p)>/gi, '\n')
      .replace(/<[^>]*>/g, ''),
  );
}
