import Anchor from './astro-components/Anchor.astro';
import Blockquote from './astro-components/Blockquote.astro';
import Break from './astro-components/Break.astro';
import Code from './astro-components/Code.astro';
import Delete from './astro-components/Delete.astro';
import Emphasis from './astro-components/Emphasis.astro';
import FootnoteReference from './astro-components/FootnoteReference.astro';
import Heading1 from './astro-components/Heading1.astro';
import Heading2 from './astro-components/Heading2.astro';
import Heading3 from './astro-components/Heading3.astro';
import Heading4 from './astro-components/Heading4.astro';
import Heading5 from './astro-components/Heading5.astro';
import Heading6 from './astro-components/Heading6.astro';
import Image from './astro-components/Image.astro';
import Input from './astro-components/Input.astro';
import List from './astro-components/List.astro';
import ListItem from './astro-components/ListItem.astro';
import OrderedList from './astro-components/OrderedList.astro';
import Paragraph from './astro-components/Paragraph.astro';
import Pre from './astro-components/Pre.astro';
import type {
  AnchorProps,
  BlockquoteProps,
  BreakProps,
  CodeProps,
  DeleteProps,
  EmphasisProps,
  FootnoteReferenceProps,
  HeadingProps,
  ImageProps,
  InputProps,
  ListItemProps,
  ListProps,
  OrderedListProps,
  ParagraphProps,
  PreProps,
  RuleProps,
  SectionProps,
  StrongProps,
  TableBodyProps,
  TableCellProps,
  TableHeaderCellProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TinyrackAstroMdxComponent,
  WrapperProps,
} from './astro-components/props.js';
import Rule from './astro-components/Rule.astro';
import Section from './astro-components/Section.astro';
import Strong from './astro-components/Strong.astro';
import Table from './astro-components/Table.astro';
import TableBody from './astro-components/TableBody.astro';
import TableCell from './astro-components/TableCell.astro';
import TableHead from './astro-components/TableHead.astro';
import TableHeaderCell from './astro-components/TableHeaderCell.astro';
import TableRow from './astro-components/TableRow.astro';
import Wrapper from './astro-components/Wrapper.astro';

export type TinyrackAstroMdxComponents = {
  a: TinyrackAstroMdxComponent<AnchorProps>;
  blockquote: TinyrackAstroMdxComponent<BlockquoteProps>;
  br: TinyrackAstroMdxComponent<BreakProps>;
  code: TinyrackAstroMdxComponent<CodeProps>;
  del: TinyrackAstroMdxComponent<DeleteProps>;
  em: TinyrackAstroMdxComponent<EmphasisProps>;
  h1: TinyrackAstroMdxComponent<HeadingProps<'h1'>>;
  h2: TinyrackAstroMdxComponent<HeadingProps<'h2'>>;
  h3: TinyrackAstroMdxComponent<HeadingProps<'h3'>>;
  h4: TinyrackAstroMdxComponent<HeadingProps<'h4'>>;
  h5: TinyrackAstroMdxComponent<HeadingProps<'h5'>>;
  h6: TinyrackAstroMdxComponent<HeadingProps<'h6'>>;
  hr: TinyrackAstroMdxComponent<RuleProps>;
  img: TinyrackAstroMdxComponent<ImageProps>;
  input: TinyrackAstroMdxComponent<InputProps>;
  li: TinyrackAstroMdxComponent<ListItemProps>;
  ol: TinyrackAstroMdxComponent<OrderedListProps>;
  p: TinyrackAstroMdxComponent<ParagraphProps>;
  pre: TinyrackAstroMdxComponent<PreProps>;
  section: TinyrackAstroMdxComponent<SectionProps>;
  strong: TinyrackAstroMdxComponent<StrongProps>;
  sup: TinyrackAstroMdxComponent<FootnoteReferenceProps>;
  table: TinyrackAstroMdxComponent<TableProps>;
  tbody: TinyrackAstroMdxComponent<TableBodyProps>;
  td: TinyrackAstroMdxComponent<TableCellProps>;
  th: TinyrackAstroMdxComponent<TableHeaderCellProps>;
  thead: TinyrackAstroMdxComponent<TableHeadProps>;
  tr: TinyrackAstroMdxComponent<TableRowProps>;
  ul: TinyrackAstroMdxComponent<ListProps>;
  wrapper: TinyrackAstroMdxComponent<WrapperProps>;
};

export type TinyrackAstroMdxComponentKey = keyof TinyrackAstroMdxComponents;

export const tinyrackAstroMdxComponents = {
  wrapper: Wrapper as TinyrackAstroMdxComponent<WrapperProps>,
  pre: Pre as TinyrackAstroMdxComponent<PreProps>,
  code: Code as TinyrackAstroMdxComponent<CodeProps>,
  table: Table as TinyrackAstroMdxComponent<TableProps>,
  h1: Heading1 as TinyrackAstroMdxComponent<HeadingProps<'h1'>>,
  h2: Heading2 as TinyrackAstroMdxComponent<HeadingProps<'h2'>>,
  h3: Heading3 as TinyrackAstroMdxComponent<HeadingProps<'h3'>>,
  h4: Heading4 as TinyrackAstroMdxComponent<HeadingProps<'h4'>>,
  h5: Heading5 as TinyrackAstroMdxComponent<HeadingProps<'h5'>>,
  h6: Heading6 as TinyrackAstroMdxComponent<HeadingProps<'h6'>>,
  p: Paragraph as TinyrackAstroMdxComponent<ParagraphProps>,
  ul: List as TinyrackAstroMdxComponent<ListProps>,
  ol: OrderedList as TinyrackAstroMdxComponent<OrderedListProps>,
  li: ListItem as TinyrackAstroMdxComponent<ListItemProps>,
  a: Anchor as TinyrackAstroMdxComponent<AnchorProps>,
  hr: Rule as TinyrackAstroMdxComponent<RuleProps>,
  blockquote: Blockquote as TinyrackAstroMdxComponent<BlockquoteProps>,
  strong: Strong as TinyrackAstroMdxComponent<StrongProps>,
  em: Emphasis as TinyrackAstroMdxComponent<EmphasisProps>,
  del: Delete as TinyrackAstroMdxComponent<DeleteProps>,
  br: Break as TinyrackAstroMdxComponent<BreakProps>,
  img: Image as TinyrackAstroMdxComponent<ImageProps>,
  input: Input as TinyrackAstroMdxComponent<InputProps>,
  section: Section as TinyrackAstroMdxComponent<SectionProps>,
  sup: FootnoteReference as TinyrackAstroMdxComponent<FootnoteReferenceProps>,
  thead: TableHead as TinyrackAstroMdxComponent<TableHeadProps>,
  tbody: TableBody as TinyrackAstroMdxComponent<TableBodyProps>,
  tr: TableRow as TinyrackAstroMdxComponent<TableRowProps>,
  th: TableHeaderCell as TinyrackAstroMdxComponent<TableHeaderCellProps>,
  td: TableCell as TinyrackAstroMdxComponent<TableCellProps>,
} satisfies TinyrackAstroMdxComponents;
