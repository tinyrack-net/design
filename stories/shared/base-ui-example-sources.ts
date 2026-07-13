export const baseUiExampleSources = {
  'alert-dialog': `<AlertDialog.Root>
  <AlertDialog.Trigger>Delete rack</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Backdrop />
    <AlertDialog.Viewport>
      <AlertDialog.Popup>
        <AlertDialog.Title>Delete rack?</AlertDialog.Title>
        <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
        <AlertDialog.Close>Cancel</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Viewport>
  </AlertDialog.Portal>
</AlertDialog.Root>`,
  autocomplete: `<Autocomplete.Root items={['Rack Alpha', 'Rack Beta']}>
  <Autocomplete.InputGroup>
    <Autocomplete.Input aria-label="Rack" placeholder="Search racks" />
    <Autocomplete.Trigger>Suggestions</Autocomplete.Trigger>
  </Autocomplete.InputGroup>
  <Autocomplete.Portal>
    <Autocomplete.Positioner>
      <Autocomplete.Popup>
        <Autocomplete.List>
          <Autocomplete.Item value="Rack Alpha">Rack Alpha</Autocomplete.Item>
          <Autocomplete.Item value="Rack Beta">Rack Beta</Autocomplete.Item>
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete.Positioner>
  </Autocomplete.Portal>
</Autocomplete.Root>`,
  checkbox: `<Checkbox.Root aria-label="Enable backups" defaultChecked name="backups">
  <Checkbox.Indicator>✓</Checkbox.Indicator>
</Checkbox.Root>`,
  'checkbox-group': `<CheckboxGroup aria-label="Rack features" defaultValue={['metrics', 'backups']}>
  {[
    { label: 'Metrics', value: 'metrics' },
    { label: 'Alerts', value: 'alerts' },
    { label: 'Automated backups', value: 'backups' },
  ].map((option) => (
    <label className="flex items-center gap-2" key={option.value}>
      <Checkbox.Root
        name="rack-features"
        value={option.value}
      >
        <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
      </Checkbox.Root>
      {option.label}
    </label>
  ))}
</CheckboxGroup>`,
  'context-menu': `<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click target</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Positioner>
      <ContextMenu.Popup>
        <ContextMenu.Item>Restart</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Inspect</ContextMenu.Item>
      </ContextMenu.Popup>
    </ContextMenu.Positioner>
  </ContextMenu.Portal>
</ContextMenu.Root>`,
  drawer: `<Drawer.Root>
  <Drawer.Trigger>Open settings</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop />
    <Drawer.Viewport>
      <Drawer.Popup>
        <Drawer.Content>
          <Drawer.Title>Rack settings</Drawer.Title>
          <Drawer.Description>Update deployment preferences.</Drawer.Description>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Viewport>
  </Drawer.Portal>
</Drawer.Root>`,
  fieldset: `<Fieldset.Root>
  <Fieldset.Legend>Notifications</Fieldset.Legend>
  <label>
    <input type="checkbox" /> Email alerts
  </label>
</Fieldset.Root>`,
  form: `<Form onSubmit={(event) => event.preventDefault()}>
  <label htmlFor="rack-name">Rack name</label>
  <Input id="rack-name" name="rack" required />
  <Button type="submit">Save</Button>
</Form>`,
  input: `<Input aria-label="Rack name" placeholder="rack-alpha" />`,
  menubar: `<Menubar aria-label="Application menu">
  <Menu.Root>
    <Menu.Trigger>File</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item>New</Menu.Item>
          <Menu.Item>Open</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</Menubar>`,
  meter: `<Meter.Root aria-label="Storage usage" max={100} value={64}>
  <Meter.Label>Storage usage</Meter.Label>
  <Meter.Track><Meter.Indicator /></Meter.Track>
  <Meter.Value />
</Meter.Root>`,
  'navigation-menu': `<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#status">Status</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`,
  'number-field': `<NumberField.Root defaultValue={3}>
  <NumberField.ScrubArea>
    <label htmlFor="replicas">Replicas</label>
  </NumberField.ScrubArea>
  <NumberField.Group>
    <NumberField.Decrement>−</NumberField.Decrement>
    <NumberField.Input id="replicas" />
    <NumberField.Increment>+</NumberField.Increment>
  </NumberField.Group>
</NumberField.Root>`,
  'preview-card': `<PreviewCard.Root>
  <PreviewCard.Trigger href="#rack-alpha">Rack Alpha</PreviewCard.Trigger>
  <PreviewCard.Portal>
    <PreviewCard.Positioner>
      <PreviewCard.Popup>
        <strong>Rack Alpha</strong>
        <p>Healthy · 12 services</p>
      </PreviewCard.Popup>
    </PreviewCard.Positioner>
  </PreviewCard.Portal>
</PreviewCard.Root>`,
  radio: `<RadioGroup defaultValue="primary">
  <Radio.Root aria-label="Primary rack" value="primary">
    <Radio.Indicator />
  </Radio.Root>
</RadioGroup>`,
  'radio-group': `<RadioGroup aria-label="Rack" defaultValue="alpha">
  <Radio.Root aria-label="Alpha" value="alpha"><Radio.Indicator /></Radio.Root>
  <Radio.Root aria-label="Beta" value="beta"><Radio.Indicator /></Radio.Root>
</RadioGroup>`,
  'scroll-area': `<ScrollArea.Root className="h-40 w-80">
  <ScrollArea.Viewport>
    <ScrollArea.Content>Scrollable event log</ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>`,
  select: `<Select.Root defaultValue="alpha">
  <Select.Trigger aria-label="Rack">
    <Select.Value />
    <Select.Icon>⌄</Select.Icon>
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.List>
          <Select.Item value="alpha"><Select.ItemText>Alpha</Select.ItemText></Select.Item>
          <Select.Item value="beta"><Select.ItemText>Beta</Select.ItemText></Select.Item>
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>`,
  slider: `<Slider.Root aria-label="Volume" defaultValue={[48]}>
  <Slider.Label>Volume</Slider.Label>
  <Slider.Value />
  <Slider.Control>
    <Slider.Track><Slider.Indicator /></Slider.Track>
    <Slider.Thumb />
  </Slider.Control>
</Slider.Root>`,
  switch: `<Switch.Root aria-label="Automatic updates" defaultChecked>
  <Switch.Thumb />
</Switch.Root>`,
  toggle: `<Toggle defaultPressed>Bold</Toggle>`,
  'toggle-group': `<ToggleGroup defaultValue={['start']}>
  <Toggle value="start">Start</Toggle>
  <Toggle value="center">Center</Toggle>
  <Toggle value="end">End</Toggle>
</ToggleGroup>`,
  toolbar: `<Toolbar.Root aria-label="Editor controls">
  <Toolbar.Group>
    <Toolbar.Button>Bold</Toolbar.Button>
    <Toolbar.Button>Italic</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Link href="#help">Help</Toolbar.Link>
</Toolbar.Root>`,
} as const;
