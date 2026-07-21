import { TRFileTree } from '@tinyrack/ui/components/file-tree';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Args = Record<string, never>;

export function FileTreePreview() {
  return (
    <TRFileTree>
      <ul>
        <li>astro.config.mjs</li>
        <li>package.json</li>
        <li>
          src
          <ul>
            <li>
              components
              <ul>
                <li>Header.astro</li>
                <li>Title.astro</li>
              </ul>
            </li>
            <li>pages/</li>
          </ul>
        </li>
      </ul>
    </TRFileTree>
  );
}
const meta = {
  args: {},
  argTypes: {},
  parameters: { layout: 'centered' },
  render: FileTreePreview,
  title: 'Components/FileTree',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
