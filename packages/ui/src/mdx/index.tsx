import type { ElementType } from 'react';
import { TinyrackMdxAnchor } from './react-components/Anchor.js';
import { TinyrackMdxBlockquote } from './react-components/Blockquote.js';
import { TinyrackMdxBr } from './react-components/Break.js';
import { TinyrackMdxCode } from './react-components/Code.js';
import { TinyrackMdxDel } from './react-components/Delete.js';
import { TinyrackMdxEm } from './react-components/Emphasis.js';
import { TinyrackMdxSup } from './react-components/FootnoteReference.js';
import { TinyrackMdxH1 } from './react-components/Heading1.js';
import { TinyrackMdxH2 } from './react-components/Heading2.js';
import { TinyrackMdxH3 } from './react-components/Heading3.js';
import { TinyrackMdxH4 } from './react-components/Heading4.js';
import { TinyrackMdxH5 } from './react-components/Heading5.js';
import { TinyrackMdxH6 } from './react-components/Heading6.js';
import { TinyrackMdxImg } from './react-components/Image.js';
import { TinyrackMdxInput } from './react-components/Input.js';
import { TinyrackMdxList } from './react-components/List.js';
import { TinyrackMdxListItem } from './react-components/ListItem.js';
import { TinyrackMdxOrderedList } from './react-components/OrderedList.js';
import { TinyrackMdxParagraph } from './react-components/Paragraph.js';
import { TinyrackMdxPre } from './react-components/Pre.js';
import { TinyrackMdxHr } from './react-components/Rule.js';
import { TinyrackMdxSection } from './react-components/Section.js';
import { TinyrackMdxStrong } from './react-components/Strong.js';
import { TinyrackMdxTable } from './react-components/Table.js';
import { TinyrackMdxTbody } from './react-components/TableBody.js';
import { TinyrackMdxTd } from './react-components/TableCell.js';
import { TinyrackMdxThead } from './react-components/TableHead.js';
import { TinyrackMdxTh } from './react-components/TableHeaderCell.js';
import { TinyrackMdxTr } from './react-components/TableRow.js';
import { TinyrackMdxWrapper } from './react-components/Wrapper.js';

export type TinyrackMdxComponents = Record<string, ElementType>;

export type TinyrackMdxComponentsOptions = {
  components?: TinyrackMdxComponents;
};

const defaultTinyrackMdxComponents = {
  wrapper: TinyrackMdxWrapper,
  pre: TinyrackMdxPre,
  code: TinyrackMdxCode,
  table: TinyrackMdxTable,
  h1: TinyrackMdxH1,
  h2: TinyrackMdxH2,
  h3: TinyrackMdxH3,
  h4: TinyrackMdxH4,
  h5: TinyrackMdxH5,
  h6: TinyrackMdxH6,
  p: TinyrackMdxParagraph,
  ul: TinyrackMdxList,
  ol: TinyrackMdxOrderedList,
  li: TinyrackMdxListItem,
  a: TinyrackMdxAnchor,
  hr: TinyrackMdxHr,
  blockquote: TinyrackMdxBlockquote,
  strong: TinyrackMdxStrong,
  em: TinyrackMdxEm,
  del: TinyrackMdxDel,
  br: TinyrackMdxBr,
  img: TinyrackMdxImg,
  input: TinyrackMdxInput,
  section: TinyrackMdxSection,
  sup: TinyrackMdxSup,
  thead: TinyrackMdxThead,
  tbody: TinyrackMdxTbody,
  tr: TinyrackMdxTr,
  th: TinyrackMdxTh,
  td: TinyrackMdxTd,
} satisfies TinyrackMdxComponents;

export function createTinyrackMdxComponents(
  options: TinyrackMdxComponentsOptions = {},
) {
  return {
    ...defaultTinyrackMdxComponents,
    ...options.components,
  };
}

export const tinyrackMdxComponents = createTinyrackMdxComponents();
