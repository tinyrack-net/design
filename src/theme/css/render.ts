export type CssDeclaration = readonly [property: string, value: string];

const generatedHeader =
  '/* Generated from src/theme/create-css.ts. Do not edit directly. */';

export function createFile(...sections: string[]) {
  return `${generatedHeader}\n\n${sections.join('\n\n')}\n`;
}

export function createBlock(selector: string, declarations: readonly CssDeclaration[]) {
  return `${selector} {\n${declarations
    .map(([property, value]) => {
      const separator = value.startsWith('\n') ? ':' : ': ';

      return `  ${property}${separator}${value};`;
    })
    .join('\n')}\n}`;
}

export function createWrappedFontStack(fontStack: string) {
  return `\n    ${fontStack}`;
}

export function createFontFallbackVar(name: string, fontStack: string) {
  const fallbackLines = fontStack.split(', ');

  return `var(\n    ${name},\n${fallbackLines
    .map((line, index) => `    ${line}${index === fallbackLines.length - 1 ? '' : ','}`)
    .join('\n')}\n  )`;
}

export function createSelectorList(selectors: readonly string[]) {
  return `:where(${selectors.join(', ')})`;
}
