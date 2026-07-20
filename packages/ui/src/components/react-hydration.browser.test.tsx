import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { TRAccordion } from './accordion/index.js';
import { TRAlertDialog } from './alert-dialog/index.js';
import { TRAppShell } from './app-shell/index.js';
import { TRAutocomplete } from './autocomplete/index.js';
import { TRAvatar } from './avatar/index.js';
import { TRButton } from './button/index.js';
import { TRCheckbox } from './checkbox/index.js';
import { TRCheckboxGroup } from './checkbox-group/index.js';
import { TRCollapsible } from './collapsible/index.js';
import { TRCombobox } from './combobox/index.js';
import { TRContextMenu } from './context-menu/index.js';
import { TRCopyButton } from './copy-button/index.js';
import { TRDialog } from './dialog/index.js';
import { TRDrawer } from './drawer/index.js';
import { TRField } from './field/index.js';
import { TRFieldset } from './fieldset/index.js';
import { TRForm } from './form/index.js';
import { TRIconButton } from './icon-button/index.js';
import { TRInput } from './input/index.js';
import { TRMenu } from './menu/index.js';
import { TRMenubar } from './menubar/index.js';
import { TRMeter } from './meter/index.js';
import { TRNavigationMenu } from './navigation-menu/index.js';
import { TRNumberField } from './number-field/index.js';
import { TROTPField } from './otp-field/index.js';
import { TRPopover } from './popover/index.js';
import { TRPreviewCard } from './preview-card/index.js';
import { TRProgress } from './progress/index.js';
import { TRRadio } from './radio/index.js';
import { TRRadioGroup } from './radio-group/index.js';
import { TRScrollArea } from './scroll-area/index.js';
import { TRSelect } from './select/index.js';
import { TRSlider } from './slider/index.js';
import { TRSwitch } from './switch/index.js';
import { TRTabs } from './tabs/index.js';
import { TRTextarea } from './textarea/index.js';
import { TRToast } from './toast/index.js';
import { TRToggle } from './toggle/index.js';
import { TRToggleGroup } from './toggle-group/index.js';
import { TRToolbar } from './toolbar/index.js';
import { TRTooltip } from './tooltip/index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

function InteractiveFixture() {
  return (
    <div>
      <TRAccordion.Root defaultValue={['one']}>
        <TRAccordion.Item value="one">
          <TRAccordion.Header>
            <TRAccordion.Trigger>TRAccordion</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>Panel</TRAccordion.Panel>
        </TRAccordion.Item>
      </TRAccordion.Root>
      <TRAvatar.Root>
        <TRAvatar.Image alt="Profile" src="/avatar.png" />
        <TRAvatar.Fallback>TR</TRAvatar.Fallback>
      </TRAvatar.Root>
      <TRAppShell.Root>
        <TRAppShell.Header>
          <TRAppShell.Trigger aria-label="Open shell">☰</TRAppShell.Trigger>
        </TRAppShell.Header>
        <TRAppShell.Sidebar aria-label="Shell navigation">
          Navigation
        </TRAppShell.Sidebar>
        <TRAppShell.Main>Shell content</TRAppShell.Main>
      </TRAppShell.Root>
      <TRAlertDialog.Root>
        <TRAlertDialog.Trigger>Delete rack</TRAlertDialog.Trigger>
      </TRAlertDialog.Root>
      <TRAutocomplete.Root items={['Rack A']}>
        <TRAutocomplete.Input aria-label="Search racks" />
      </TRAutocomplete.Root>
      <TRButton>Save</TRButton>
      <TRCopyButton value="Rack source" />
      <TRIconButton aria-label="Refresh rack">↻</TRIconButton>
      <TRCheckboxGroup defaultValue={['backups']}>
        <TRCheckbox.Root aria-label="Backups" value="backups">
          <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
        </TRCheckbox.Root>
      </TRCheckboxGroup>
      <TRCombobox.Root items={['Rack A']}>
        <TRCombobox.Input aria-label="Rack" />
        <TRCombobox.Trigger>Choose rack</TRCombobox.Trigger>
      </TRCombobox.Root>
      <TRCollapsible.Root>
        <TRCollapsible.Trigger>Details</TRCollapsible.Trigger>
        <TRCollapsible.Panel>Content</TRCollapsible.Panel>
      </TRCollapsible.Root>
      <TRField.Root>
        <TRField.Label>Email</TRField.Label>
        <TRField.Control type="email" />
      </TRField.Root>
      <TRContextMenu.Root>
        <TRContextMenu.Trigger>Rack context</TRContextMenu.Trigger>
      </TRContextMenu.Root>
      <TRDrawer.Root>
        <TRDrawer.Trigger>Open drawer</TRDrawer.Trigger>
      </TRDrawer.Root>
      <TRFieldset.Root>
        <TRFieldset.Legend>Options</TRFieldset.Legend>
        <TRInput aria-label="Option" />
      </TRFieldset.Root>
      <TRForm>
        <TRInput aria-label="Rack name" name="rack" />
        <TRTextarea aria-label="Rack notes" />
      </TRForm>
      <TRMenu.Root>
        <TRMenu.Trigger>Actions</TRMenu.Trigger>
      </TRMenu.Root>
      <TRMenubar aria-label="Application menu">
        <TRMenu.Root>
          <TRMenu.Trigger>File</TRMenu.Trigger>
        </TRMenu.Root>
      </TRMenubar>
      <TRMeter.Root aria-label="Storage" value={50}>
        <TRMeter.Track>
          <TRMeter.Indicator />
        </TRMeter.Track>
      </TRMeter.Root>
      <TRDialog.Root>
        <TRDialog.Trigger>Open dialog</TRDialog.Trigger>
      </TRDialog.Root>
      <TRNavigationMenu.Root>
        <TRNavigationMenu.List>
          <TRNavigationMenu.Item>
            <TRNavigationMenu.Link href="#racks">Racks</TRNavigationMenu.Link>
          </TRNavigationMenu.Item>
        </TRNavigationMenu.List>
      </TRNavigationMenu.Root>
      <TRNumberField.Root defaultValue={2}>
        <TRNumberField.Group>
          <TRNumberField.Decrement>−</TRNumberField.Decrement>
          <TRNumberField.Input aria-label="Replicas" />
          <TRNumberField.Increment>+</TRNumberField.Increment>
        </TRNumberField.Group>
      </TRNumberField.Root>
      <TROTPField.Root aria-label="Code" length={2}>
        <TROTPField.Input />
        <TROTPField.Input />
      </TROTPField.Root>
      <TRPopover.Root>
        <TRPopover.Trigger>Open popover</TRPopover.Trigger>
      </TRPopover.Root>
      <TRPreviewCard.Root>
        <TRPreviewCard.Trigger href="#rack">Rack preview</TRPreviewCard.Trigger>
      </TRPreviewCard.Root>
      <TRProgress.Root aria-label="Upload" value={25}>
        <TRProgress.Track>
          <TRProgress.Indicator />
        </TRProgress.Track>
      </TRProgress.Root>
      <TRRadioGroup defaultValue="alpha">
        <TRRadio.Root aria-label="Alpha" value="alpha">
          <TRRadio.Indicator />
        </TRRadio.Root>
      </TRRadioGroup>
      <TRScrollArea.Root>
        <TRScrollArea.Viewport>
          <TRScrollArea.Content>Events</TRScrollArea.Content>
        </TRScrollArea.Viewport>
        <TRScrollArea.Scrollbar>
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
      </TRScrollArea.Root>
      <TRSelect.Root defaultValue="alpha">
        <TRSelect.Trigger aria-label="Rack">
          <TRSelect.Value />
        </TRSelect.Trigger>
      </TRSelect.Root>
      <TRSlider.Root aria-label="Volume" defaultValue={[50]}>
        <TRSlider.Control>
          <TRSlider.Track>
            <TRSlider.Indicator />
          </TRSlider.Track>
          <TRSlider.Thumb />
        </TRSlider.Control>
      </TRSlider.Root>
      <TRSwitch.Root aria-label="Updates" defaultChecked>
        <TRSwitch.Thumb />
      </TRSwitch.Root>
      <TRTabs.Root defaultValue="one">
        <TRTabs.List>
          <TRTabs.Tab value="one">One</TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="one">Tab panel</TRTabs.Panel>
      </TRTabs.Root>
      <TRToast.Provider />
      <TRToggleGroup defaultValue={['bold']}>
        <TRToggle value="bold">Bold</TRToggle>
      </TRToggleGroup>
      <TRToolbar.Root aria-label="Editor">
        <TRToolbar.Button>Save</TRToolbar.Button>
      </TRToolbar.Root>
      <TRTooltip.Provider>
        <TRTooltip.Root>
          <TRTooltip.Trigger>Help</TRTooltip.Trigger>
        </TRTooltip.Root>
      </TRTooltip.Provider>
    </div>
  );
}

test('interactive components render on the server and hydrate without recovery', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const serverMarkup = renderToString(<InteractiveFixture />);
  const host = document.createElement('div');
  host.innerHTML = serverMarkup;
  document.body.append(host);
  const hydrationErrors: unknown[] = [];

  const root = hydrateRoot(host, <InteractiveFixture />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelectorAll('button').length).toBeGreaterThan(0);

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
