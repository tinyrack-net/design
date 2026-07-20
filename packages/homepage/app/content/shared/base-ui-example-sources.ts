export const baseUiExampleSources = {
  'alert-dialog': `function DeleteRackDialog() {
  const [result, setResult] = useState('Rack not deleted');

  return <div>
    <TRAlertDialog.Root>
      <TRAlertDialog.Trigger>Delete rack</TRAlertDialog.Trigger>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup>
            <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>This action cannot be undone.</TRAlertDialog.Description>
            <div className="tr-alert-dialog-actions">
              <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
              <TRAlertDialog.Close onClick={() => setResult('Rack deleted')}>
                Delete rack
              </TRAlertDialog.Close>
            </div>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>
    <output aria-live="polite">{result}</output>
  </div>;
}`,
  autocomplete: `<TRAutocomplete.Root items={['Rack Alpha', 'Rack Beta']}>
  <TRAutocomplete.InputGroup>
    <TRAutocomplete.Input aria-label="Rack" placeholder="Search racks" />
    <TRAutocomplete.Trigger>Suggestions</TRAutocomplete.Trigger>
  </TRAutocomplete.InputGroup>
  <TRAutocomplete.Portal>
    <TRAutocomplete.Positioner>
      <TRAutocomplete.Popup>
        <TRAutocomplete.List>
          <TRAutocomplete.Item value="Rack Alpha">Rack Alpha</TRAutocomplete.Item>
          <TRAutocomplete.Item value="Rack Beta">Rack Beta</TRAutocomplete.Item>
        </TRAutocomplete.List>
      </TRAutocomplete.Popup>
    </TRAutocomplete.Positioner>
  </TRAutocomplete.Portal>
</TRAutocomplete.Root>`,
  checkbox: `<TRCheckbox.Root aria-label="Enable backups" defaultChecked name="backups">
  <TRCheckbox.Indicator>✓</TRCheckbox.Indicator>
</TRCheckbox.Root>`,
  'checkbox-group': `<TRCheckboxGroup aria-label="Rack features" defaultValue={['metrics', 'backups']}>
  {[
    { label: 'Metrics', value: 'metrics' },
    { label: 'Alerts', value: 'alerts' },
    { label: 'Automated backups', value: 'backups' },
  ].map((option) => (
    <label className="flex items-center gap-2" key={option.value}>
      <TRCheckbox.Root
        name="rack-features"
        value={option.value}
      >
        <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
      </TRCheckbox.Root>
      {option.label}
    </label>
  ))}
</TRCheckboxGroup>`,
  'context-menu': `<TRContextMenu.Root>
  <TRContextMenu.Trigger render={<TRButton />}>Right-click target</TRContextMenu.Trigger>
  <TRContextMenu.Portal>
    <TRContextMenu.Positioner>
      <TRContextMenu.Popup>
        <TRContextMenu.Item>Restart</TRContextMenu.Item>
        <TRContextMenu.Separator />
        <TRContextMenu.Item>Inspect</TRContextMenu.Item>
      </TRContextMenu.Popup>
    </TRContextMenu.Positioner>
  </TRContextMenu.Portal>
</TRContextMenu.Root>`,
  drawer: `<TRDrawer.Root>
  <TRDrawer.Trigger>Open settings</TRDrawer.Trigger>
  <TRDrawer.Portal>
    <TRDrawer.Backdrop />
    <TRDrawer.Viewport>
      <TRDrawer.Popup>
        <TRDrawer.Content>
          <TRDrawer.Title>Rack settings</TRDrawer.Title>
          <TRDrawer.Description>Update deployment preferences.</TRDrawer.Description>
          <TRDrawer.Close>Close</TRDrawer.Close>
        </TRDrawer.Content>
      </TRDrawer.Popup>
    </TRDrawer.Viewport>
  </TRDrawer.Portal>
</TRDrawer.Root>`,
  fieldset: `<TRFieldset.Root>
  <TRFieldset.Legend>Notifications</TRFieldset.Legend>
  <label className="flex items-center gap-2">
    <TRCheckbox.Root aria-label="Email alerts"><TRCheckbox.Indicator>✓</TRCheckbox.Indicator></TRCheckbox.Root>
    Email alerts
  </label>
</TRFieldset.Root>`,
  form: `<TRForm onSubmit={(event) => event.preventDefault()}>
  <label htmlFor="rack-name">Rack name</label>
  <TRInput id="rack-name" name="rack" required />
  <TRButton type="submit">Save</TRButton>
</TRForm>`,
  input: `<TRInput aria-label="Rack name" placeholder="rack-alpha" />`,
  menubar: `<TRMenubar aria-label="Application menu">
  <TRMenu.Root>
    <TRMenu.Trigger>File</TRMenu.Trigger>
    <TRMenu.Portal>
      <TRMenu.Positioner>
        <TRMenu.Popup>
          <TRMenu.Item>New</TRMenu.Item>
          <TRMenu.Item>Open</TRMenu.Item>
        </TRMenu.Popup>
      </TRMenu.Positioner>
    </TRMenu.Portal>
  </TRMenu.Root>
</TRMenubar>`,
  meter: `<TRMeter.Root aria-label="Storage usage" max={100} value={64}>
  <TRMeter.Label>Storage usage</TRMeter.Label>
  <TRMeter.Track><TRMeter.Indicator /></TRMeter.Track>
  <TRMeter.Value />
</TRMeter.Root>`,
  'navigation-menu': `<TRNavigationMenu.Root aria-label="Documentation links">
  <TRNavigationMenu.List>
    <TRNavigationMenu.Item>
      <TRNavigationMenu.Link href="#docs">Documentation</TRNavigationMenu.Link>
    </TRNavigationMenu.Item>
    <TRNavigationMenu.Item>
      <TRNavigationMenu.Link href="#status">Status</TRNavigationMenu.Link>
    </TRNavigationMenu.Item>
  </TRNavigationMenu.List>
</TRNavigationMenu.Root>`,
  'number-field': `<TRNumberField.Root defaultValue={3}>
  <TRNumberField.ScrubArea>
    <label htmlFor="replicas">Replicas</label>
  </TRNumberField.ScrubArea>
  <TRNumberField.Group>
    <TRNumberField.Decrement>−</TRNumberField.Decrement>
    <TRNumberField.Input id="replicas" />
    <TRNumberField.Increment>+</TRNumberField.Increment>
  </TRNumberField.Group>
</TRNumberField.Root>`,
  'preview-card': `<TRPreviewCard.Root>
  <TRPreviewCard.Trigger href="#rack-alpha">Rack Alpha</TRPreviewCard.Trigger>
  <TRPreviewCard.Portal>
    <TRPreviewCard.Positioner>
      <TRPreviewCard.Popup>
        <strong>Rack Alpha</strong>
        <p>Healthy · 12 services</p>
      </TRPreviewCard.Popup>
    </TRPreviewCard.Positioner>
  </TRPreviewCard.Portal>
</TRPreviewCard.Root>`,
  radio: `<TRRadioGroup defaultValue="primary">
  <TRRadio.Root aria-label="Primary rack" value="primary">
    <TRRadio.Indicator />
  </TRRadio.Root>
</TRRadioGroup>`,
  'radio-group': `<TRRadioGroup aria-label="Rack" defaultValue="alpha">
  <TRRadio.Root aria-label="Alpha" value="alpha"><TRRadio.Indicator /></TRRadio.Root>
  <TRRadio.Root aria-label="Beta" value="beta"><TRRadio.Indicator /></TRRadio.Root>
</TRRadioGroup>`,
  'scroll-area': `<TRScrollArea.Root className="h-40 w-80">
  <TRScrollArea.Viewport>
    <TRScrollArea.Content>
      {Array.from({ length: 12 }, (_, index) => (
        <p key={index}>Rack event log {index + 1}</p>
      ))}
    </TRScrollArea.Content>
  </TRScrollArea.Viewport>
  <TRScrollArea.Scrollbar orientation="vertical">
    <TRScrollArea.Thumb />
  </TRScrollArea.Scrollbar>
  <TRScrollArea.Corner />
</TRScrollArea.Root>`,
  select: `import { ChevronDown } from 'lucide-react';

<TRSelect.Root
  defaultValue="alpha"
  items={{ alpha: 'Alpha', beta: 'Beta' }}
>
  <TRSelect.Trigger aria-label="Rack">
    <TRSelect.Value />
    <TRSelect.Icon aria-hidden="true"><ChevronDown /></TRSelect.Icon>
  </TRSelect.Trigger>
  <TRSelect.Portal>
    <TRSelect.Positioner>
      <TRSelect.Popup>
        <TRSelect.List>
          <TRSelect.Item value="alpha">
            <TRSelect.ItemText>Alpha</TRSelect.ItemText>
            <TRSelect.ItemIndicator>✓</TRSelect.ItemIndicator>
          </TRSelect.Item>
          <TRSelect.Item value="beta">
            <TRSelect.ItemText>Beta</TRSelect.ItemText>
            <TRSelect.ItemIndicator>✓</TRSelect.ItemIndicator>
          </TRSelect.Item>
        </TRSelect.List>
      </TRSelect.Popup>
    </TRSelect.Positioner>
  </TRSelect.Portal>
</TRSelect.Root>`,
  slider: `<TRSlider.Root aria-label="Volume" defaultValue={[48]}>
  <TRSlider.Label>Volume</TRSlider.Label>
  <TRSlider.Value />
  <TRSlider.Control>
    <TRSlider.Track><TRSlider.Indicator /></TRSlider.Track>
    <TRSlider.Thumb />
  </TRSlider.Control>
</TRSlider.Root>`,
  switch: `<div className="flex items-center gap-2">
  <TRSwitch.Root aria-label="Automatic updates" defaultChecked id="automatic-updates">
    <TRSwitch.Thumb />
  </TRSwitch.Root>
  <label className="cursor-pointer" htmlFor="automatic-updates">
    Automatic updates
  </label>
</div>`,
  toggle: `<TRToggle defaultPressed>Bold</TRToggle>`,
  'toggle-group': `<TRToggleGroup defaultValue={['start']}>
  <TRToggle value="start">Start</TRToggle>
  <TRToggle value="center">Center</TRToggle>
  <TRToggle value="end">End</TRToggle>
</TRToggleGroup>`,
  toolbar: `<TRToolbar.Root aria-label="Editor controls">
  <TRToolbar.Group>
    <TRToolbar.Button>Bold</TRToolbar.Button>
    <TRToolbar.Button>Italic</TRToolbar.Button>
  </TRToolbar.Group>
  <TRToolbar.Separator />
  <TRToolbar.Link href="#help">Help</TRToolbar.Link>
</TRToolbar.Root>`,
} as const;

export const switchStateComparisonSource = `import { TRSwitch } from '@tinyrack/ui/components/switch';
import { useId } from 'react';

function SwitchStateSample({
  checked = false,
  disabled = false,
  readOnly = false,
  title,
}: {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  title: string;
}) {
  const inputId = useId();

  return (
    <div className="grid gap-2">
      <strong>{title}</strong>
      <div className="flex items-center gap-2">
        <TRSwitch.Root
          aria-label="Automatic updates"
          defaultChecked={checked}
          disabled={disabled}
          id={inputId}
          name="automatic-updates"
          readOnly={readOnly}
        >
          <TRSwitch.Thumb />
        </TRSwitch.Root>
        <label
          className={disabled || readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}
          htmlFor={inputId}
          style={disabled ? { color: 'var(--tinyrack-text-muted)' } : undefined}
        >
          Automatic updates
        </label>
      </div>
    </div>
  );
}

export function SwitchStates() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SwitchStateSample title="Enabled · Off" />
      <SwitchStateSample checked title="Enabled · On" />
      <SwitchStateSample checked readOnly title="Read only" />
      <SwitchStateSample disabled title="Disabled · Off" />
      <SwitchStateSample checked disabled title="Disabled · On" />
    </div>
  );
}`;
