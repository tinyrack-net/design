import { cp, mkdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcRoot = resolve(root, 'src');
const distRoot = resolve(root, 'dist');
const checkMode = process.argv.includes('--check');

const publicAssetSourcePaths = {
  'components/accordion/accordion.css': 'components/accordion/accordion.css',
  'components/alert/alert.css': 'components/alert/alert.css',
  'components/avatar/avatar.css': 'components/avatar/avatar.css',
  'core/core.css': 'core/core.css',
  'components/badge/badge.css': 'components/badge/badge.css',
  'components/button/button.css': 'components/button/button.css',
  'components/combobox/combobox.css': 'components/combobox/combobox.css',
  'components/card/card.css': 'components/card/card.css',
  'components/code-block/code-block.css': 'components/code-block/code-block.css',
  'components/code/code.css': 'components/code/code.css',
  'components/divider/divider.css': 'components/divider/divider.css',
  'components/disclosure/disclosure.css': 'components/disclosure/disclosure.css',
  'components/form/form.css': 'components/form/form.css',
  'components/link/link.css': 'components/link/link.css',
  'components/menu/menu.css': 'components/menu/menu.css',
  'components/modal/modal.css': 'components/modal/modal.css',
  'components/pin-input/pin-input.css': 'components/pin-input/pin-input.css',
  'components/progress/progress.css': 'components/progress/progress.css',
  'components/skeleton/skeleton.css': 'components/skeleton/skeleton.css',
  'components/spinner/spinner.css': 'components/spinner/spinner.css',
  'components/overlay/overlay.css': 'components/overlay/overlay.css',
  'components/popover/popover.css': 'components/popover/popover.css',
  'components/table/table.css': 'components/table/table.css',
  'components/tabs/tabs.css': 'components/tabs/tabs.css',
  'components/toast/toast.css': 'components/toast/toast.css',
  'components/tooltip/tooltip.css': 'components/tooltip/tooltip.css',
  'mdx/astro-components/Anchor.astro': 'mdx/astro-components/Anchor.astro',
  'mdx/astro-components/Blockquote.astro': 'mdx/astro-components/Blockquote.astro',
  'mdx/astro-components/Break.astro': 'mdx/astro-components/Break.astro',
  'mdx/astro-components/Code.astro': 'mdx/astro-components/Code.astro',
  'mdx/astro-components/Delete.astro': 'mdx/astro-components/Delete.astro',
  'mdx/astro-components/Emphasis.astro': 'mdx/astro-components/Emphasis.astro',
  'mdx/astro-components/FootnoteReference.astro':
    'mdx/astro-components/FootnoteReference.astro',
  'mdx/astro-components/Heading1.astro': 'mdx/astro-components/Heading1.astro',
  'mdx/astro-components/Heading2.astro': 'mdx/astro-components/Heading2.astro',
  'mdx/astro-components/Heading3.astro': 'mdx/astro-components/Heading3.astro',
  'mdx/astro-components/Heading4.astro': 'mdx/astro-components/Heading4.astro',
  'mdx/astro-components/Heading5.astro': 'mdx/astro-components/Heading5.astro',
  'mdx/astro-components/Heading6.astro': 'mdx/astro-components/Heading6.astro',
  'mdx/astro-components/Image.astro': 'mdx/astro-components/Image.astro',
  'mdx/astro-components/Input.astro': 'mdx/astro-components/Input.astro',
  'mdx/astro-components/List.astro': 'mdx/astro-components/List.astro',
  'mdx/astro-components/ListItem.astro': 'mdx/astro-components/ListItem.astro',
  'mdx/astro-components/OrderedList.astro': 'mdx/astro-components/OrderedList.astro',
  'mdx/astro-components/Paragraph.astro': 'mdx/astro-components/Paragraph.astro',
  'mdx/astro-components/Pre.astro': 'mdx/astro-components/Pre.astro',
  'mdx/astro-components/Rule.astro': 'mdx/astro-components/Rule.astro',
  'mdx/astro-components/Section.astro': 'mdx/astro-components/Section.astro',
  'mdx/astro-components/Strong.astro': 'mdx/astro-components/Strong.astro',
  'mdx/astro-components/Table.astro': 'mdx/astro-components/Table.astro',
  'mdx/astro-components/TableBody.astro': 'mdx/astro-components/TableBody.astro',
  'mdx/astro-components/TableCell.astro': 'mdx/astro-components/TableCell.astro',
  'mdx/astro-components/TableHead.astro': 'mdx/astro-components/TableHead.astro',
  'mdx/astro-components/TableHeaderCell.astro':
    'mdx/astro-components/TableHeaderCell.astro',
  'mdx/astro-components/TableRow.astro': 'mdx/astro-components/TableRow.astro',
  'mdx/astro-components/Wrapper.astro': 'mdx/astro-components/Wrapper.astro',
  'mdx/mdx.css': 'mdx/mdx.css',
} as const;

await Promise.all(
  Object.values(publicAssetSourcePaths).map(async (sourcePath) => {
    const target = resolve(srcRoot, sourcePath);

    const existing = await readExistingFile(target);
    if (existing === null) {
      throw new Error(`${relative(root, target)} is missing.`);
    }

    if (sourcePath.endsWith('.css') && existing.includes('Generated from')) {
      throw new Error(`${relative(root, target)} must be maintained as source CSS.`);
    }

    if (checkMode) {
      console.log(`checked ${relative(root, target)}`);
    }
  }),
);

if (checkMode) {
  process.exit(0);
}

await Promise.all(
  Object.entries(publicAssetSourcePaths).map(async ([file, sourcePath]) => {
    const source = resolve(srcRoot, sourcePath);
    const target = resolve(distRoot, file);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target);
    console.log(`copied ${relative(root, source)} -> ${relative(root, target)}`);
  }),
);

async function readExistingFile(path: string) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
