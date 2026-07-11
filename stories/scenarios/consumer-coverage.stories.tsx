import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionSummary,
} from '../../src/components/accordion/react.js';
import { Alert } from '../../src/components/alert/react.js';
import { Avatar } from '../../src/components/avatar/react.js';
import { Badge } from '../../src/components/badge/react.js';
import { Button, ButtonGroup, IconButton } from '../../src/components/button/react.js';
import { Card } from '../../src/components/card/react.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from '../../src/components/combobox/react.js';
import {
  Disclosure,
  DisclosureContent,
  DisclosureSummary,
} from '../../src/components/disclosure/react.js';
import {
  Checkbox,
  Field,
  FieldDescription,
  Input,
  InputAdornment,
  InputGroup,
  Label,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
} from '../../src/components/form/react.js';
import { Link } from '../../src/components/link/react.js';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from '../../src/components/menu/react.js';
import {
  Modal,
  ModalBody,
  ModalBox,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from '../../src/components/overlay/react.js';
import { PinInput } from '../../src/components/pin-input/react.js';
import { Spinner } from '../../src/components/spinner/react.js';
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from '../../src/components/tabs/react.js';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../src/components/tooltip/react.js';

function ScenarioFrame({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-4 p-4 text-tinyrack-text">
      <header className="flex items-center justify-between border-b border-tinyrack-border pb-3">
        <h1 className="text-tinyrack-xl font-extrabold">{title}</h1>
        <Badge variant="success">Coverage mapped</Badge>
      </header>
      {children}
    </main>
  );
}

function TinyAuthAuthScenario() {
  return (
    <ScenarioFrame title="TinyAuth · authentication">
      <Card className="mx-auto grid w-full max-w-md gap-4">
        <div className="flex items-center gap-3">
          <Avatar>TR</Avatar>
          <div>
            <strong>Verify your account</strong>
            <p className="text-tinyrack-xs text-tinyrack-text-muted">
              Enter the six-digit authenticator code.
            </p>
          </div>
        </div>
        <Alert variant="info">
          Your security key was not detected. TOTP remains available.
        </Alert>
        <Field>
          <Label>Verification code</Label>
          <PinInput />
          <FieldDescription>
            Paste is supported and non-digits are ignored.
          </FieldDescription>
        </Field>
        <Button loading={false} variant="primary">
          Continue
        </Button>
        <div className="flex justify-between">
          <Link href="#recovery">Use recovery code</Link>
          <Tooltip openDelay={0}>
            <TooltipTrigger>
              <IconButton label="Verification help">?</IconButton>
            </TooltipTrigger>
            <TooltipContent>Codes expire after one use</TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </ScenarioFrame>
  );
}

function TinyAuthAdminScenario() {
  return (
    <ScenarioFrame title="TinyAuth · admin">
      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <Card className="grid content-start gap-2">
          <strong>Administration</strong>
          <Button appearance="ghost">Users</Button>
          <Button appearance="ghost">OAuth clients</Button>
          <Button appearance="ghost">Policies</Button>
        </Card>
        <div className="grid gap-4">
          <Alert variant="warning">Changes affect every active login flow.</Alert>
          <Card className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <strong>Registration</strong>
                <p className="text-tinyrack-xs text-tinyrack-text-muted">
                  Control self-service account creation.
                </p>
              </div>
              <Switch defaultChecked>Enabled</Switch>
            </div>
            <RadioGroup
              appearance="segmented"
              aria-label="Registration policy"
              orientation="horizontal"
            >
              <Radio defaultChecked name="policy" value="open">
                Open
              </Radio>
              <Radio name="policy" value="invite">
                Invite
              </Radio>
            </RadioGroup>
            <ButtonGroup attached>
              <Button variant="primary">Save</Button>
              <Button>Reset</Button>
            </ButtonGroup>
            <Modal>
              <ModalTrigger asChild>
                <Button appearance="ghost">Review policy impact</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalBox>
                  <ModalTitle>Registration policy impact</ModalTitle>
                  <ModalBody>
                    Existing sessions remain active; new registration follows the
                    selected policy.
                  </ModalBody>
                </ModalBox>
              </ModalContent>
            </Modal>
          </Card>
        </div>
      </div>
    </ScenarioFrame>
  );
}

function TinyTranslatePopupScenario() {
  return (
    <ScenarioFrame title="Tiny Translate · popup">
      <Card className="mx-auto grid w-full max-w-sm gap-3">
        <Tabs defaultValue="page">
          <TabsList aria-label="Translation mode">
            <TabsTrigger value="page">Page</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
          <TabsPanel value="page">
            <div className="grid gap-3">
              <Combobox defaultInputValue="English" defaultValue="en">
                <ComboboxInput aria-label="Target language" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxOption value="en">English</ComboboxOption>
                    <ComboboxOption value="ko">한국어</ComboboxOption>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <Button variant="primary">Translate page</Button>
            </div>
          </TabsPanel>
          <TabsPanel value="text">
            <Textarea autosize minRows={4} placeholder="Text to translate" />
          </TabsPanel>
        </Tabs>
        <div className="flex items-center justify-between">
          <Badge variant="info">Ready</Badge>
          <Spinner aria-hidden size="sm" />
        </div>
      </Card>
    </ScenarioFrame>
  );
}

function TinyTranslateOptionsScenario() {
  return (
    <ScenarioFrame title="Tiny Translate · options">
      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <Card className="grid content-start gap-2">
          <Button appearance="ghost">General</Button>
          <Button appearance="ghost">Translation</Button>
          <Button appearance="ghost">Translators</Button>
        </Card>
        <Card className="grid gap-4">
          <Field>
            <Label htmlFor="endpoint">OpenAI-compatible endpoint</Label>
            <InputGroup>
              <InputAdornment position="start">https://</InputAdornment>
              <Input id="endpoint" defaultValue="api.example.com/v1" />
            </InputGroup>
          </Field>
          <Field>
            <Label htmlFor="model">Model</Label>
            <Input id="model" defaultValue="translator-small" />
          </Field>
          <Disclosure>
            <DisclosureSummary>Advanced JSON</DisclosureSummary>
            <DisclosureContent>
              <Textarea autosize minRows={4} defaultValue={'{"temperature":0.2}'} />
            </DisclosureContent>
          </Disclosure>
          <Accordion defaultValue="network">
            <AccordionItem value="network">
              <AccordionSummary>Network overrides</AccordionSummary>
              <AccordionContent>Use the default retry route.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="storage">
              <AccordionSummary>Local storage</AccordionSummary>
              <AccordionContent>Keep cached models for seven days.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <Checkbox defaultChecked>Translate selected text</Checkbox>
          <Button variant="primary">Save translator</Button>
        </Card>
      </div>
    </ScenarioFrame>
  );
}

function TinyTranslateContentOverlayScenario() {
  return (
    <ScenarioFrame title="Tiny Translate · content overlay">
      <div className="relative min-h-72 rounded border border-tinyrack-border bg-tinyrack-surface-muted p-6">
        <p className="max-w-xl">
          Select text on the page to open a translation card without leaking popovers or
          notifications outside the content-script ShadowRoot.
        </p>
        <Card className="absolute end-4 bottom-4 grid w-80 gap-3">
          <div className="flex items-center justify-between">
            <Badge variant="neutral">English → 한국어</Badge>
            <Menu>
              <MenuTrigger asChild>
                <IconButton label="Translation actions">•••</IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="copy">Copy</MenuItem>
                <MenuItem value="close">Close</MenuItem>
              </MenuContent>
            </Menu>
          </div>
          <strong>선택한 텍스트의 번역입니다.</strong>
          <div className="flex items-center gap-2 text-tinyrack-xs text-tinyrack-text-muted">
            <Spinner aria-hidden size="sm" />
            Translation complete
          </div>
        </Card>
      </div>
    </ScenarioFrame>
  );
}

const meta = {
  title: 'Scenarios/Consumer Coverage',
  component: TinyAuthAuthScenario,
} satisfies Meta<typeof TinyAuthAuthScenario>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TinyAuthAuth: Story = { render: () => <TinyAuthAuthScenario /> };
export const TinyAuthAdmin: Story = { render: () => <TinyAuthAdminScenario /> };
export const TinyTranslatePopup: Story = {
  render: () => <TinyTranslatePopupScenario />,
};
export const TinyTranslateOptions: Story = {
  render: () => <TinyTranslateOptionsScenario />,
};
export const TinyTranslateContentOverlay: Story = {
  render: () => <TinyTranslateContentOverlayScenario />,
};
