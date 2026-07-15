type AstNode = {
  children?: AstNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
  depth?: number;
  name?: string;
  type: string;
  value?: string;
};

function visit(node: AstNode, callback: (node: AstNode) => void) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
}

function headingText(node: AstNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  return (node.children ?? []).map(headingText).join('');
}

function slugifyHeading(label: string) {
  const slug = label
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[`*_~[\](){}<>]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
  return slug.length === 0 ? 'section' : slug;
}

export function remarkDocsHeadings() {
  return (tree: AstNode) => {
    const ids = new Map<string, number>();
    visit(tree, (node) => {
      if (node.type !== 'heading' || (node.depth !== 2 && node.depth !== 3)) return;
      const baseId = slugifyHeading(headingText(node));
      const count = ids.get(baseId) ?? 0;
      ids.set(baseId, count + 1);
      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          id: count === 0 ? baseId : `${baseId}-${count + 1}`,
        },
      };
    });
  };
}

const calloutVariants = new Set(['note', 'tip', 'caution', 'danger']);

export function remarkDocsDirectives() {
  return (tree: AstNode) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective' || !calloutVariants.has(node.name ?? '')) {
        return;
      }
      node.data = {
        ...node.data,
        hName: 'Callout',
        hProperties: {
          ...node.data?.hProperties,
          variant: node.name,
        },
      };
    });
  };
}
