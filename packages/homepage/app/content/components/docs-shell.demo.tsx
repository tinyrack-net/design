import { DocsShell, type DocsShellLayout } from '@tinyrack/ui/components/docs-shell';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type Args = { layout: DocsShellLayout };
export function DocsShellPreview({ layout }: Args) {
  return (
    <div className="h-96 w-full overflow-hidden">
      <DocsShell.Root currentPath="/guide" layout={layout} locationKey="demo">
        <DocsShell.Header>
          <DocsShell.Brand>Tinyrack</DocsShell.Brand>
        </DocsShell.Header>
        <DocsShell.Sidebar aria-label="Documentation">Navigation</DocsShell.Sidebar>
        <DocsShell.Main render={<div />}>
          <article className="p-6">
            <h2>Documentation</h2>
            <p>Router-neutral documentation shell.</p>
          </article>
        </DocsShell.Main>
      </DocsShell.Root>
    </div>
  );
}
const meta = {
  args: { layout: 'docs' },
  argTypes: {
    layout: { control: 'select', options: ['docs', 'splash', 'standalone'] },
  },
  parameters: { layout: 'fullscreen' },
  render: DocsShellPreview,
  title: 'Components/DocsShell',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
