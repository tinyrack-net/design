import type { HTMLAttributes, HTMLTag } from 'astro/types';
import type { FormControlSize } from '../../components/form/contract.js';
import type { LinkUnderline, LinkVariant } from '../../components/link/contract.js';
import type { TableDensity } from '../../components/table/contract.js';

export type AstroMdxClassProps = {
  className?: string | null;
};

export type AstroMdxElementProps<Tag extends HTMLTag> = HTMLAttributes<Tag> &
  AstroMdxClassProps;

export type AnchorProps = AstroMdxElementProps<'a'> & {
  'data-underline'?: LinkUnderline;
  'data-variant'?: LinkVariant;
};

export type BlockquoteProps = AstroMdxElementProps<'blockquote'>;
export type BreakProps = AstroMdxElementProps<'br'>;
export type CodeProps = AstroMdxElementProps<'code'>;
export type DeleteProps = AstroMdxElementProps<'del'>;
export type EmphasisProps = AstroMdxElementProps<'em'>;
export type FootnoteReferenceProps = AstroMdxElementProps<'sup'>;
export type HeadingProps<Tag extends 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> =
  AstroMdxElementProps<Tag>;
export type ImageProps = AstroMdxElementProps<'img'>;
export type InputProps = AstroMdxElementProps<'input'> & {
  'data-size'?: FormControlSize;
};
export type ListProps = AstroMdxElementProps<'ul'>;
export type ListItemProps = AstroMdxElementProps<'li'>;
export type OrderedListProps = AstroMdxElementProps<'ol'>;
export type ParagraphProps = AstroMdxElementProps<'p'>;
export type PreProps = AstroMdxElementProps<'pre'>;
export type RuleProps = AstroMdxElementProps<'hr'>;
export type SectionProps = AstroMdxElementProps<'section'> & {
  'data-footnotes'?: string | boolean;
};
export type StrongProps = AstroMdxElementProps<'strong'>;
export type TableProps = AstroMdxElementProps<'table'> & {
  'data-density'?: TableDensity;
};
export type TableBodyProps = AstroMdxElementProps<'tbody'>;
export type TableCellProps = AstroMdxElementProps<'td'>;
export type TableHeadProps = AstroMdxElementProps<'thead'>;
export type TableHeaderCellProps = AstroMdxElementProps<'th'>;
export type TableRowProps = AstroMdxElementProps<'tr'>;
export type WrapperProps = AstroMdxElementProps<'main'>;

export type TinyrackAstroMdxComponent<Props extends object> = (props: Props) => unknown;
