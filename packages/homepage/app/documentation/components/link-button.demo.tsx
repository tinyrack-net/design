import {
  TRLinkButton,
  type TRLinkButtonAppearance,
  type TRLinkButtonIntent,
  type TRLinkButtonUiSize,
} from '@tinyrack/ui/components/link-button';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type LinkButtonStoryArgs = {
  appearance: TRLinkButtonAppearance;
  disabled: boolean;
  intent: TRLinkButtonIntent;
  uiSize: TRLinkButtonUiSize;
};

export const linkButtonBasicSource = `import '@tinyrack/ui/components/link-button.css';
import { TRLinkButton } from '@tinyrack/ui/components/link-button';

export function DeployLink() {
  return <TRLinkButton href="/deploy" intent="primary">Deploy changes</TRLinkButton>;
}`;

export const linkButtonSolidIntentsSource = `import '@tinyrack/ui/components/link-button.css';
import { TRLinkButton } from '@tinyrack/ui/components/link-button';

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'] as const;

export function SolidLinkButtonIntents() {
  return <div className="flex flex-wrap gap-2">
    {intents.map((intent) => <TRLinkButton appearance="solid" href="#destination" intent={intent} key={intent}>{intent}</TRLinkButton>)}
  </div>;
}`;

export const linkButtonOutlineIntentsSource = `import '@tinyrack/ui/components/link-button.css';
import { TRLinkButton } from '@tinyrack/ui/components/link-button';

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'] as const;

export function OutlineLinkButtonIntents() {
  return <div className="flex flex-wrap gap-2">
    {intents.map((intent) => <TRLinkButton appearance="outline" href="#destination" intent={intent} key={intent}>{intent}</TRLinkButton>)}
  </div>;
}`;

export const linkButtonGhostIntentsSource = `import '@tinyrack/ui/components/link-button.css';
import { TRLinkButton } from '@tinyrack/ui/components/link-button';

const intents = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'] as const;

export function GhostLinkButtonIntents() {
  return <div className="flex flex-wrap gap-2">
    {intents.map((intent) => <TRLinkButton appearance="ghost" href="#destination" intent={intent} key={intent}>{intent}</TRLinkButton>)}
  </div>;
}`;

export const linkButtonSizesSource = `import '@tinyrack/ui/components/link-button.css';
import { TRLinkButton } from '@tinyrack/ui/components/link-button';

export function LinkButtonSizes() {
  return <div className="flex flex-wrap items-center gap-3">
    <TRLinkButton href="#destination" intent="primary" uiSize="sm">Small</TRLinkButton>
    <TRLinkButton href="#destination" intent="primary" uiSize="md">Medium</TRLinkButton>
    <TRLinkButton href="#destination" intent="primary" uiSize="lg">Large</TRLinkButton>
  </div>;
}`;

export const linkButtonStatesSource = `import '@tinyrack/ui/components/link-button.css';
import { TRLinkButton } from '@tinyrack/ui/components/link-button';

export function LinkButtonStates() {
  return <div className="flex flex-wrap items-center gap-3">
    <TRLinkButton href="/deploy" intent="primary">Deploy changes</TRLinkButton>
    <TRLinkButton disabled href="/deploy" intent="primary">Deploy changes</TRLinkButton>
    <TRLinkButton href="https://tinyrack.net" intent="primary" rel="noreferrer" target="_blank">
      Open Tinyrack (new tab)
    </TRLinkButton>
  </div>;
}`;

const meta = {
  title: 'Components/LinkButton',
  component: TRLinkButton,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'solid',
    disabled: false,
    intent: 'primary',
    uiSize: 'md',
  },
  argTypes: {
    appearance: { control: 'radio', options: ['solid', 'outline', 'ghost'] },
    disabled: { control: 'boolean' },
    intent: {
      control: 'select',
      options: ['neutral', 'primary', 'info', 'success', 'warning', 'danger'],
    },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <TRLinkButton {...args} href="#link-button-playground">
      Deploy changes
    </TRLinkButton>
  ),
} satisfies Meta<LinkButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
