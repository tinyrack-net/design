import { TRCode } from '@tinyrack/ui/components/code';
import { TRSteps } from '@tinyrack/ui/components/steps';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Args = Record<string, never>;

export function StepsPreview() {
  return (
    <TRSteps.Root className="!my-0">
      <TRSteps.Item>Install the package</TRSteps.Item>
      <TRSteps.Item>Create the config</TRSteps.Item>
      <TRSteps.Item>Build the site</TRSteps.Item>
    </TRSteps.Root>
  );
}

export function StepsGuidePreview() {
  return (
    <TRSteps.Root className="!my-0 w-full max-w-2xl">
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">Create a project</h3>
        <p>Start with a React app and add the Tinyrack packages.</p>
        <TRCode>pnpm create vite my-app --template react-ts</TRCode>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">Install and configure</h3>
        <p>Install the UI package, then import the Steps styles.</p>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">Write the guide</h3>
        <p>Use normal React children inside each item.</p>
      </TRSteps.Item>
    </TRSteps.Root>
  );
}

export const stepsBasicSource = `import '@tinyrack/ui/components/steps.css';
import { TRSteps } from '@tinyrack/ui/components/steps';

export function InstallationSteps() {
  return (
    <TRSteps.Root aria-label="Installation">
      <TRSteps.Item>Install the package</TRSteps.Item>
      <TRSteps.Item>Create the config</TRSteps.Item>
      <TRSteps.Item>Build the site</TRSteps.Item>
    </TRSteps.Root>
  );
}`;

export const stepsRichContentSource = `import '@tinyrack/ui/components/code.css';
import '@tinyrack/ui/components/steps.css';
import { TRCode } from '@tinyrack/ui/components/code';
import { TRSteps } from '@tinyrack/ui/components/steps';

export function ProjectGuide() {
  return (
    <TRSteps.Root aria-label="Create a project">
      <TRSteps.Item>
        <h3>Create a project</h3>
        <p>Start with a React app and add the Tinyrack packages.</p>
        <TRCode>pnpm create vite my-app --template react-ts</TRCode>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3>Install and configure</h3>
        <p>Install the UI package, then import the Steps styles.</p>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3>Write the guide</h3>
        <p>Use normal React children inside each item.</p>
      </TRSteps.Item>
    </TRSteps.Root>
  );
}`;

const meta = {
  args: {},
  argTypes: {},
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  render: StepsGuidePreview,
  title: 'Components/Steps',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
