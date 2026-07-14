import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { Accordion } from './accordion/index.js';
import { AlertDialog } from './alert-dialog/index.js';
import { Autocomplete } from './autocomplete/index.js';
import { Avatar } from './avatar/index.js';
import { Button } from './button/index.js';
import { Checkbox } from './checkbox/index.js';
import { CheckboxGroup } from './checkbox-group/index.js';
import { Collapsible } from './collapsible/index.js';
import { Combobox } from './combobox/index.js';
import { ContextMenu } from './context-menu/index.js';
import { Dialog } from './dialog/index.js';
import { Drawer } from './drawer/index.js';
import { Field } from './field/index.js';
import { Fieldset } from './fieldset/index.js';
import { Form } from './form/index.js';
import { Input } from './input/index.js';
import { Menu } from './menu/index.js';
import { Menubar } from './menubar/index.js';
import { Meter } from './meter/index.js';
import { NavigationMenu } from './navigation-menu/index.js';
import { NumberField } from './number-field/index.js';
import { OTPField } from './otp-field/index.js';
import { Popover } from './popover/index.js';
import { PreviewCard } from './preview-card/index.js';
import { Progress } from './progress/index.js';
import { Radio } from './radio/index.js';
import { RadioGroup } from './radio-group/index.js';
import { ScrollArea } from './scroll-area/index.js';
import { Select } from './select/index.js';
import { Slider } from './slider/index.js';
import { Switch } from './switch/index.js';
import { Tabs } from './tabs/index.js';
import { Toast } from './toast/index.js';
import { Toggle } from './toggle/index.js';
import { ToggleGroup } from './toggle-group/index.js';
import { Toolbar } from './toolbar/index.js';
import { Tooltip } from './tooltip/index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

function InteractiveFixture() {
  return (
    <div>
      <Accordion.Root defaultValue={['one']}>
        <Accordion.Item value="one">
          <Accordion.Header>
            <Accordion.Trigger>Accordion</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Avatar.Root>
        <Avatar.Image alt="Profile" src="/avatar.png" />
        <Avatar.Fallback>TR</Avatar.Fallback>
      </Avatar.Root>
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete rack</AlertDialog.Trigger>
      </AlertDialog.Root>
      <Autocomplete.Root items={['Rack A']}>
        <Autocomplete.Input aria-label="Search racks" />
      </Autocomplete.Root>
      <Button>Save</Button>
      <CheckboxGroup defaultValue={['backups']}>
        <Checkbox.Root aria-label="Backups" value="backups">
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
      </CheckboxGroup>
      <Combobox.Root items={['Rack A']}>
        <Combobox.Input aria-label="Rack" />
        <Combobox.Trigger>Choose rack</Combobox.Trigger>
      </Combobox.Root>
      <Collapsible.Root>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Content</Collapsible.Panel>
      </Collapsible.Root>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
      </Field.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger>Rack context</ContextMenu.Trigger>
      </ContextMenu.Root>
      <Drawer.Root>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
      </Drawer.Root>
      <Fieldset.Root>
        <Fieldset.Legend>Options</Fieldset.Legend>
        <Input aria-label="Option" />
      </Fieldset.Root>
      <Form>
        <Input aria-label="Rack name" name="rack" />
      </Form>
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
      </Menu.Root>
      <Menubar aria-label="Application menu">
        <Menu.Root>
          <Menu.Trigger>File</Menu.Trigger>
        </Menu.Root>
      </Menubar>
      <Meter.Root aria-label="Storage" value={50}>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
      </Dialog.Root>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#racks">Racks</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <NumberField.Root defaultValue={2}>
        <NumberField.Group>
          <NumberField.Decrement>−</NumberField.Decrement>
          <NumberField.Input aria-label="Replicas" />
          <NumberField.Increment>+</NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
      <OTPField.Root aria-label="Code" length={2}>
        <OTPField.Input />
        <OTPField.Input />
      </OTPField.Root>
      <Popover.Root>
        <Popover.Trigger>Open popover</Popover.Trigger>
      </Popover.Root>
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#rack">Rack preview</PreviewCard.Trigger>
      </PreviewCard.Root>
      <Progress.Root aria-label="Upload" value={25}>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <RadioGroup defaultValue="alpha">
        <Radio.Root aria-label="Alpha" value="alpha">
          <Radio.Indicator />
        </Radio.Root>
      </RadioGroup>
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <ScrollArea.Content>Events</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <Select.Root defaultValue="alpha">
        <Select.Trigger aria-label="Rack">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>
      <Slider.Root aria-label="Volume" defaultValue={[50]}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>
      <Switch.Root aria-label="Updates" defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">Tab panel</Tabs.Panel>
      </Tabs.Root>
      <Toast.Provider />
      <ToggleGroup defaultValue={['bold']}>
        <Toggle value="bold">Bold</Toggle>
      </ToggleGroup>
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Save</Toolbar.Button>
      </Toolbar.Root>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Help</Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>
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
