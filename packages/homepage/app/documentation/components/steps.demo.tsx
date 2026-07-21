import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import { TRSteps } from '@tinyrack/ui/components/steps';
import { TRTabs } from '@tinyrack/ui/components/tabs';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Args = { count: number };
export function StepsPreview({ count }: Args) {
  return (
    <TRSteps.Root className="!my-0">
      {['Install the package', 'Create the config', 'Build the site']
        .slice(0, count)
        .map((label) => (
          <TRSteps.Item key={label}>
            <strong>{label}</strong>
          </TRSteps.Item>
        ))}
    </TRSteps.Root>
  );
}

export function StepsGuidePreview({ count = 3 }: Args = { count: 3 }) {
  return (
    <TRSteps.Root className="!my-0 w-full max-w-2xl">
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">Create a project</h3>
        <p>Start with a React app and add the Tinyrack packages.</p>
        <TRTabs.Root defaultValue="pnpm" uiSize="sm">
          <TRTabs.List aria-label="Package manager" activateOnFocus>
            <TRTabs.Tab value="pnpm">pnpm</TRTabs.Tab>
            <TRTabs.Tab value="npm">npm</TRTabs.Tab>
            <TRTabs.Tab value="yarn">Yarn</TRTabs.Tab>
          </TRTabs.List>
          <TRTabs.Panel value="pnpm">
            <TRCodeBlock
              code="pnpm create vite my-app --template react-ts"
              language="shellscript"
            />
          </TRTabs.Panel>
          <TRTabs.Panel value="npm">
            <TRCodeBlock
              code="npm create vite@latest my-app -- --template react-ts"
              language="shellscript"
            />
          </TRTabs.Panel>
          <TRTabs.Panel value="yarn">
            <TRCodeBlock
              code="yarn create vite my-app --template react-ts"
              language="shellscript"
            />
          </TRTabs.Panel>
        </TRTabs.Root>
      </TRSteps.Item>
      {count > 1 ? (
        <TRSteps.Item>
          <h3 className="text-tinyrack-lg font-semibold">Install and configure</h3>
          <p>Install the UI package, then import the shared and component styles.</p>
          <TRCodeBlock
            code={
              "pnpm add @tinyrack/ui tailwindcss react react-dom\n\nimport '@tinyrack/ui/core.css';\nimport '@tinyrack/ui/components/steps.css';"
            }
            language="tsx"
          />
        </TRSteps.Item>
      ) : null}
      {count > 2 ? (
        <TRSteps.Item>
          <h3 className="text-tinyrack-lg font-semibold">Write the guide</h3>
          <p>
            Use normal React children inside each item: headings, prose, links, and code
            all remain available.
          </p>
        </TRSteps.Item>
      ) : null}
    </TRSteps.Root>
  );
}
const meta = {
  args: { count: 3 },
  argTypes: {},
  parameters: { layout: 'centered' },
  render: StepsGuidePreview,
  title: 'Components/Steps',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
