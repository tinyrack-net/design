import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type DistTokenModule = Record<string, unknown> & {
  tinyrackControlMetrics: {
    md: {
      height: string;
    };
  };
  tinyrackMotion: {
    duration: {
      fast: string;
    };
  };
  tinyrackSemanticColors: {
    dark: {
      primary: string;
    };
  };
  tinyrackShadows: {
    overlay: string;
  };
};

type DistButtonModule = Record<string, unknown> & {
  Button: unknown;
  ButtonGroup: unknown;
  IconButton: unknown;
};

type DistAlertModule = Record<string, unknown> & {
  Alert: unknown;
};

type DistAvatarModule = Record<string, unknown> & {
  Avatar: unknown;
};

type DistCardModule = Record<string, unknown> & {
  Card: unknown;
};

type DistLinkModule = Record<string, unknown> & {
  Link: unknown;
};

type DistFormModule = Record<string, unknown> & {
  Checkbox: unknown;
  Field: unknown;
  FieldDescription: unknown;
  FormMessage: unknown;
  Input: unknown;
  InputGroup: unknown;
  Label: unknown;
  Radio: unknown;
  RadioGroup: unknown;
  Select: unknown;
  Switch: unknown;
  Textarea: unknown;
};

type DistBadgeModule = Record<string, unknown> & {
  Badge: unknown;
};

type DistCodeModule = Record<string, unknown> & {
  Code: unknown;
};

type DistCodeBlockModule = Record<string, unknown> & {
  CodeBlock: unknown;
};

type DistDividerModule = Record<string, unknown> & {
  Divider: unknown;
};

type DistTableModule = Record<string, unknown> & {
  Table: unknown;
  TableContainer: unknown;
};

type DistTabsModule = Record<string, unknown> & {
  Tabs: unknown;
  TabsList: unknown;
  TabsPanel: unknown;
  TabsTrigger: unknown;
};

type DistAccordionModule = Record<string, unknown> & {
  Accordion: unknown;
  AccordionContent: unknown;
  AccordionItem: unknown;
  AccordionSummary: unknown;
};

type DistOverlayDomModule = Record<string, unknown> & {
  createOverlayManager: unknown;
};

type DistOverlayReactModule = Record<string, unknown> & {
  Layer: unknown;
  LayerContent: unknown;
  Modal: unknown;
  ModalContent: unknown;
};

type DistMdxReactModule = Record<string, unknown> & {
  createTinyrackMdxComponents: unknown;
  tinyrackMdxComponents: unknown;
};

type DistProgressModule = Record<string, unknown> & {
  Progress: unknown;
};

type DistSkeletonModule = Record<string, unknown> & {
  Skeleton: unknown;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function resolvePackageSubpath(subpath: string) {
  return fileURLToPath(import.meta.resolve(`@tinyrack/ui${subpath}`));
}

async function assertJsExport<TModule extends Record<string, unknown>>(
  subpath: string,
  expectedExports: readonly string[],
) {
  const resolvedPath = resolvePackageSubpath(subpath);

  assert(
    resolvedPath.includes('/dist/') || resolvedPath.includes('\\dist\\'),
    `${subpath || '/'} should resolve to dist, received ${resolvedPath}`,
  );
  assert(existsSync(resolvedPath), `${subpath || '/'} resolved file is missing`);

  const module = (await import(`@tinyrack/ui${subpath}`)) as TModule;

  for (const exportName of expectedExports) {
    assert(exportName in module, `${subpath || '/'} is missing export ${exportName}`);
  }

  return module;
}

function assertCssExport(subpath: string, expectedContents: readonly string[]) {
  const resolvedPath = resolvePackageSubpath(subpath);

  assert(
    resolvedPath.includes('/dist/') || resolvedPath.includes('\\dist\\'),
    `${subpath} should resolve to dist, received ${resolvedPath}`,
  );
  assert(existsSync(resolvedPath), `${subpath} resolved file is missing`);

  const css = readFileSync(resolvedPath, 'utf8');

  for (const expectedContent of expectedContents) {
    assert(
      css.includes(expectedContent),
      `${subpath} does not include expected content: ${expectedContent}`,
    );
  }
}

async function assertMissingExport(subpath: string) {
  let resolved = false;

  try {
    await import(`@tinyrack/ui${subpath}`);
    resolved = true;
  } catch {
    resolved = false;
  }

  assert(!resolved, `${subpath || '/'} should not resolve`);
}

function assertMissingResolvedExport(subpath: string) {
  let resolved = false;

  try {
    resolvePackageSubpath(subpath);
    resolved = true;
  } catch {
    resolved = false;
  }

  assert(!resolved, `${subpath || '/'} should not resolve`);
}

const coreModule = await assertJsExport<DistTokenModule>('/core', [
  'tinyrackBorders',
  'tinyrackControlMetrics',
  'tinyrackMotion',
  'tinyrackOpacity',
  'tinyrackPalettes',
  'tinyrackRadii',
  'tinyrackSemanticColors',
  'tinyrackShadows',
  'tinyrackSpacing',
  'tinyrackTypography',
]);
const alertModule = await assertJsExport<DistAlertModule>('/components/alert/react', [
  'Alert',
]);
const avatarModule = await assertJsExport<DistAvatarModule>(
  '/components/avatar/react',
  ['Avatar'],
);
const badgeModule = await assertJsExport<DistBadgeModule>('/components/badge/react', [
  'Badge',
]);
const buttonModule = await assertJsExport<DistButtonModule>(
  '/components/button/react',
  ['Button', 'ButtonGroup', 'IconButton'],
);
const cardModule = await assertJsExport<DistCardModule>('/components/card/react', [
  'Card',
]);
const codeModule = await assertJsExport<DistCodeModule>('/components/code/react', [
  'Code',
]);
const codeBlockModule = await assertJsExport<DistCodeBlockModule>(
  '/components/code-block/react',
  ['CodeBlock'],
);
const dividerModule = await assertJsExport<DistDividerModule>(
  '/components/divider/react',
  ['Divider'],
);
const linkModule = await assertJsExport<DistLinkModule>('/components/link/react', [
  'Link',
]);
const progressModule = await assertJsExport<DistProgressModule>(
  '/components/progress/react',
  ['Progress'],
);
const skeletonModule = await assertJsExport<DistSkeletonModule>(
  '/components/skeleton/react',
  ['Skeleton'],
);
const formModule = await assertJsExport<DistFormModule>('/components/form/react', [
  'Checkbox',
  'Field',
  'FieldDescription',
  'FormMessage',
  'Input',
  'InputGroup',
  'Label',
  'Radio',
  'RadioGroup',
  'Select',
  'Switch',
  'Textarea',
]);
const tableModule = await assertJsExport<DistTableModule>('/components/table/react', [
  'Table',
  'TableContainer',
]);
const tabsModule = await assertJsExport<DistTabsModule>('/components/tabs/react', [
  'Tabs',
  'TabsList',
  'TabsPanel',
  'TabsTrigger',
]);
await assertJsExport<DistAccordionModule>('/components/accordion/react', [
  'Accordion',
  'AccordionContent',
  'AccordionItem',
  'AccordionSummary',
]);
await assertJsExport('/components/accordion/dom', ['createAccordionManager']);
const overlayDomModule = await assertJsExport<DistOverlayDomModule>(
  '/components/overlay/dom',
  ['createOverlayManager'],
);
const overlayReactModule = await assertJsExport<DistOverlayReactModule>(
  '/components/overlay/react',
  ['Layer', 'LayerContent', 'Modal', 'ModalContent'],
);
await assertJsExport('/components/combobox/dom', ['createComboboxManager']);
await assertJsExport('/components/combobox/react', [
  'Combobox',
  'ComboboxContent',
  'ComboboxInput',
  'ComboboxOption',
]);
await assertJsExport('/components/disclosure/react', [
  'Disclosure',
  'DisclosureContent',
  'DisclosureSummary',
]);
await assertJsExport('/components/menu/dom', ['createMenuManager']);
await assertJsExport('/components/menu/react', [
  'Menu',
  'MenuContent',
  'MenuItem',
  'MenuTrigger',
]);
await assertJsExport('/components/pin-input/dom', ['createPinInputManager']);
await assertJsExport('/components/pin-input/react', ['PinInput']);
await assertJsExport('/components/spinner/react', ['Spinner']);
await assertJsExport('/components/tabs/dom', ['createTabsManager']);
await assertJsExport('/components/toast/dom', ['createToastManager']);
await assertJsExport('/components/toast/react', [
  'ToastProvider',
  'ToastViewport',
  'useToast',
]);
await assertJsExport('/components/tooltip/dom', ['createTooltipManager']);
await assertJsExport('/components/tooltip/react', [
  'Tooltip',
  'TooltipContent',
  'TooltipTrigger',
]);
const mdxReactModule = await assertJsExport<DistMdxReactModule>('/mdx/react', [
  'createTinyrackMdxComponents',
  'tinyrackMdxComponents',
]);

await assertMissingExport('');
await assertMissingExport('/tokens');
await assertMissingExport('/react/button');
await assertMissingExport('/react/link');
await assertMissingExport('/react/form');
await assertMissingExport('/react/feedback');
await assertMissingExport('/components/feedback/react');
await assertMissingExport('/react/layout');
await assertMissingExport('/components/layout/react');
await assertMissingExport('/components/input/react');
await assertMissingExport('/components/textarea/react');
await assertMissingExport('/components/select/react');
await assertMissingExport('/components/checkbox/react');
await assertMissingExport('/components/radio/react');
await assertMissingExport('/components/switch/react');
await assertMissingExport('/react/table');
await assertMissingExport('/icons');
await assertMissingExport('/icons/react');
assertMissingResolvedExport('/tailwind.css');
assertMissingResolvedExport('/icons/icons.css');
assertMissingResolvedExport('/components/feedback/feedback.css');
assertMissingResolvedExport('/components/layout/layout.css');
assertMissingResolvedExport('/mdx/shared');
assertMissingResolvedExport('/mdx/astro-code');
assertMissingResolvedExport('/mdx/astro-components/props');
assertMissingResolvedExport('/mdx/react-components/Code');
const mdxAstroPath = resolvePackageSubpath('/mdx/astro');
assert(
  mdxAstroPath.includes('/dist/') || mdxAstroPath.includes('\\dist\\'),
  `/mdx/astro should resolve to dist, received ${mdxAstroPath}`,
);
assert(existsSync(mdxAstroPath), '/mdx/astro resolved file is missing');
const mdxAstroSource = readFileSync(mdxAstroPath, 'utf8');
assert(
  mdxAstroSource.includes('tinyrackAstroMdxComponents'),
  '/mdx/astro should export tinyrackAstroMdxComponents',
);
assert(
  existsSync(resolvePackageSubpath('/mdx/mdx.css')),
  '/mdx/mdx.css resolved file is missing',
);
for (const astroComponentFile of [
  'Anchor.astro',
  'Blockquote.astro',
  'Break.astro',
  'Code.astro',
  'Delete.astro',
  'Emphasis.astro',
  'FootnoteReference.astro',
  'Heading1.astro',
  'Heading2.astro',
  'Heading3.astro',
  'Heading4.astro',
  'Heading5.astro',
  'Heading6.astro',
  'Image.astro',
  'Input.astro',
  'List.astro',
  'ListItem.astro',
  'OrderedList.astro',
  'Paragraph.astro',
  'Pre.astro',
  'Rule.astro',
  'Section.astro',
  'Strong.astro',
  'Table.astro',
  'TableBody.astro',
  'TableCell.astro',
  'TableHead.astro',
  'TableHeaderCell.astro',
  'TableRow.astro',
  'Wrapper.astro',
]) {
  assert(
    existsSync(
      new URL(`../dist/mdx/astro-components/${astroComponentFile}`, import.meta.url),
    ),
    `Astro ${astroComponentFile} component is missing from dist`,
  );
}
assert(
  existsSync(new URL('../dist/mdx/astro-components/props.d.ts', import.meta.url)),
  'Astro MDX component props types are missing from dist',
);
for (const reactComponentFile of [
  'Anchor.js',
  'Blockquote.js',
  'Break.js',
  'Code.js',
  'Delete.js',
  'Emphasis.js',
  'FootnoteReference.js',
  'Heading1.js',
  'Heading2.js',
  'Heading3.js',
  'Heading4.js',
  'Heading5.js',
  'Heading6.js',
  'Image.js',
  'Input.js',
  'List.js',
  'ListItem.js',
  'OrderedList.js',
  'Paragraph.js',
  'Pre.js',
  'Rule.js',
  'Section.js',
  'Strong.js',
  'Table.js',
  'TableBody.js',
  'TableCell.js',
  'TableHead.js',
  'TableHeaderCell.js',
  'TableRow.js',
  'Wrapper.js',
  'utils.js',
]) {
  assert(
    existsSync(
      new URL(`../dist/mdx/react-components/${reactComponentFile}`, import.meta.url),
    ),
    `React ${reactComponentFile} MDX component is missing from dist`,
  );
}
assert(!('Button' in coreModule), '/core export should not include React Button');
assert(!('Badge' in coreModule), '/core export should not include React Badge');
assert(!('Code' in coreModule), '/core export should not include React Code');
assert(!('CodeBlock' in coreModule), '/core export should not include React CodeBlock');
assert(!('Link' in coreModule), '/core export should not include React Link');
assert(!('Field' in coreModule), '/core export should not include React Form');
assert(!('Table' in coreModule), '/core export should not include React Table');
assert(!('Tabs' in coreModule), '/core export should not include React Tabs');
assert(
  coreModule.tinyrackSemanticColors.dark.primary === '#fafafa',
  'dark primary semantic color changed unexpectedly',
);
assert(
  coreModule.tinyrackControlMetrics.md.height === '2.5rem',
  'medium control height changed unexpectedly',
);
assert(
  coreModule.tinyrackMotion.duration.fast === '120ms',
  'fast motion duration changed unexpectedly',
);
assert(
  coreModule.tinyrackShadows.overlay.includes('rgb('),
  'overlay shadow token is missing',
);
assert(
  typeof alertModule.Alert === 'object' || typeof alertModule.Alert === 'function',
  'Alert export should be a React component',
);
assert(
  typeof avatarModule.Avatar === 'object' || typeof avatarModule.Avatar === 'function',
  'Avatar export should be a React component',
);
assert(
  typeof badgeModule.Badge === 'object' || typeof badgeModule.Badge === 'function',
  'Badge export should be a React component',
);
assert(
  typeof buttonModule.Button === 'object' || typeof buttonModule.Button === 'function',
  'Button export should be a React component',
);
assert(
  typeof buttonModule.IconButton === 'object' ||
    typeof buttonModule.IconButton === 'function',
  'IconButton export should be a React component',
);
assert(
  typeof cardModule.Card === 'object' || typeof cardModule.Card === 'function',
  'Card export should be a React component',
);
assert(
  typeof codeModule.Code === 'object' || typeof codeModule.Code === 'function',
  'Code export should be a React component',
);
assert(
  typeof codeBlockModule.CodeBlock === 'object' ||
    typeof codeBlockModule.CodeBlock === 'function',
  'CodeBlock export should be a React component',
);
assert(
  typeof dividerModule.Divider === 'object' ||
    typeof dividerModule.Divider === 'function',
  'Divider export should be a React component',
);
assert(
  typeof linkModule.Link === 'object' || typeof linkModule.Link === 'function',
  'Link export should be a React component',
);
assert(
  typeof progressModule.Progress === 'object' ||
    typeof progressModule.Progress === 'function',
  'Progress export should be a React component',
);
assert(
  typeof skeletonModule.Skeleton === 'object' ||
    typeof skeletonModule.Skeleton === 'function',
  'Skeleton export should be a React component',
);
assert(
  typeof formModule.Field === 'object' || typeof formModule.Field === 'function',
  'Field export should be a React component',
);
assert(
  typeof tableModule.Table === 'object' || typeof tableModule.Table === 'function',
  'Table export should be a React component',
);
assert(
  typeof tableModule.TableContainer === 'object' ||
    typeof tableModule.TableContainer === 'function',
  'TableContainer export should be a React component',
);
assert(
  typeof tabsModule.Tabs === 'object' || typeof tabsModule.Tabs === 'function',
  'Tabs export should be a React component',
);
assert(
  typeof tabsModule.TabsList === 'object' || typeof tabsModule.TabsList === 'function',
  'TabsList export should be a React component',
);
assert(
  typeof overlayDomModule.createOverlayManager === 'function',
  'Overlay DOM export should include createOverlayManager',
);
assert(
  typeof overlayReactModule.Modal === 'function',
  'Overlay React export should include Modal',
);
assert(
  typeof mdxReactModule.createTinyrackMdxComponents === 'function',
  'MDX React export should include a component map factory',
);
assert(
  typeof mdxReactModule.tinyrackMdxComponents === 'object',
  'MDX React export should include a component map',
);

assertCssExport('/core/core.css', ['@theme', '--color-tinyrack-primary']);
assertCssExport('/components/alert/alert.css', ['.tr-alert', 'data-variant="danger"']);
assertCssExport('/components/avatar/avatar.css', ['.tr-avatar', 'data-size="lg"']);
assertCssExport('/components/badge/badge.css', ['.tr-badge', 'data-size="sm"']);
assertCssExport('/components/button/button.css', [
  '.tr-btn',
  'data-appearance="solid"',
]);
assertCssExport('/components/card/card.css', ['.tr-card', 'data-padding="md"']);
assertCssExport('/components/code/code.css', ['.tr-code']);
assertCssExport('/components/code-block/code-block.css', [
  '.tr-code-block',
  'data-wrap="true"',
]);
assertCssExport('/components/divider/divider.css', [
  '.tr-divider',
  'data-orientation="vertical"',
]);
assertCssExport('/components/link/link.css', ['.tr-link', 'data-underline="hover"']);
assertCssExport('/components/progress/progress.css', [
  '.tr-progress',
  'data-size="lg"',
]);
assertCssExport('/components/overlay/overlay.css', [
  '.tr-modal',
  '.tr-modal-box',
  '.tr-layer:popover-open',
]);
assertCssExport('/components/form/form.css', ['.tr-field', '.tr-switch']);
assertCssExport('/components/skeleton/skeleton.css', [
  '.tr-skeleton',
  'data-shape="circle"',
]);
assertCssExport('/components/table/table.css', ['.tr-table', 'data-density="normal"']);
assertCssExport('/components/tabs/tabs.css', ['.tr-tabs', 'aria-selected="true"']);
assertCssExport('/components/accordion/accordion.css', [
  '.tr-accordion',
  '.tr-accordion-item',
]);
assertCssExport('/components/combobox/combobox.css', ['.tr-combobox']);
assertCssExport('/components/disclosure/disclosure.css', ['.tr-disclosure']);
assertCssExport('/components/menu/menu.css', ['.tr-menu-item']);
assertCssExport('/components/pin-input/pin-input.css', ['.tr-pin-input-digit']);
assertCssExport('/components/spinner/spinner.css', ['.tr-spinner']);
assertCssExport('/components/toast/toast.css', ['.tr-toast-viewport']);
assertCssExport('/components/tooltip/tooltip.css', ['.tr-tooltip-content']);
assertCssExport('/mdx/mdx.css', ['.tr-mdx', '.tr-mdx-h1']);

console.log('dist package smoke test passed');
