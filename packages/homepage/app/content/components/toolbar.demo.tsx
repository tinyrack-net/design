import { Toggle } from '@tinyrack/ui/components/toggle';
import { Toolbar } from '@tinyrack/ui/components/toolbar';
import {
  AlignCenter,
  AlignLeft,
  Bold,
  CircleHelp,
  Italic,
  Redo2,
  Save,
  Underline,
  Undo2,
} from 'lucide-react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  label: string;
  disabled: boolean;
  loopFocus: boolean;
  orientation: 'horizontal' | 'vertical';
};

export function ToolbarPreview({ label, disabled, loopFocus, orientation }: StoryArgs) {
  const [result, setResult] = useState('No formatting command selected');

  return (
    <div>
      <Toolbar.Root
        aria-label={label}
        className="max-w-full"
        disabled={disabled}
        loopFocus={loopFocus}
        orientation={orientation}
      >
        <Toolbar.Group aria-label="Text style">
          <Toolbar.Button
            aria-label="Bold"
            render={
              <Toggle
                defaultPressed
                onPressedChange={(pressed) =>
                  setResult(`Bold ${pressed ? 'on' : 'off'}`)
                }
              />
            }
          >
            <Bold aria-hidden="true" />
          </Toolbar.Button>
          <Toolbar.Button
            aria-label="Italic"
            render={<Toggle />}
            onClick={() => setResult('Italic selected')}
          >
            <Italic aria-hidden="true" />
          </Toolbar.Button>
          <Toolbar.Button aria-label="Underline" render={<Toggle />}>
            <Underline aria-hidden="true" />
          </Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator
          orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        />
        <Toolbar.Group aria-label="Text alignment">
          <Toolbar.Button aria-label="Align left" render={<Toggle defaultPressed />}>
            <AlignLeft aria-hidden="true" />
          </Toolbar.Button>
          <Toolbar.Button aria-label="Align center" render={<Toggle />}>
            <AlignCenter aria-hidden="true" />
          </Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator
          orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        />
        <Toolbar.Link aria-label="Formatting help" href="#help">
          <CircleHelp aria-hidden="true" />
        </Toolbar.Link>
        <Toolbar.Input
          aria-label="Document title"
          className="w-20 max-w-full shrink-0"
          placeholder="Document title"
        />
      </Toolbar.Root>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

export function ToolbarStateComparisonPreview() {
  return (
    <div className="grid max-w-full gap-6 sm:grid-cols-2">
      <section className="sm:col-span-2">
        <strong className="mb-2 block text-sm">Horizontal</strong>
        <Toolbar.Root aria-label="Horizontal editor controls" className="max-w-full">
          <Toolbar.Group aria-label="Text formatting">
            <Toolbar.Button aria-label="Bold">
              <Bold aria-hidden="true" />
            </Toolbar.Button>
            <Toolbar.Button aria-label="Italic">
              <Italic aria-hidden="true" />
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Link aria-label="Formatting help" href="#help">
            <CircleHelp aria-hidden="true" />
          </Toolbar.Link>
        </Toolbar.Root>
      </section>

      <section>
        <strong className="mb-2 block text-sm">Vertical</strong>
        <Toolbar.Root aria-label="Vertical editor controls" orientation="vertical">
          <Toolbar.Group aria-label="Text formatting">
            <Toolbar.Button aria-label="Bold">
              <Bold aria-hidden="true" />
            </Toolbar.Button>
            <Toolbar.Button aria-label="Italic">
              <Italic aria-hidden="true" />
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Link aria-label="Formatting help" href="#help">
            <CircleHelp aria-hidden="true" />
          </Toolbar.Link>
          <Toolbar.Input
            aria-label="Document title"
            className="max-w-full"
            placeholder="Document title"
          />
        </Toolbar.Root>
      </section>

      <section>
        <strong className="mb-2 block text-sm">Disabled group</strong>
        <Toolbar.Root aria-label="Save history controls" orientation="vertical">
          <Toolbar.Group aria-label="Available commands">
            <Toolbar.Button aria-label="Save">
              <Save aria-hidden="true" />
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group aria-label="Unavailable history commands" disabled>
            <Toolbar.Button aria-label="Undo">
              <Undo2 aria-hidden="true" />
            </Toolbar.Button>
            <Toolbar.Button aria-label="Redo">
              <Redo2 aria-hidden="true" />
            </Toolbar.Button>
          </Toolbar.Group>
        </Toolbar.Root>
      </section>
    </div>
  );
}

const meta = {
  title: 'Components/Toolbar',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    label: 'Editor controls',
    disabled: false,
    loopFocus: true,
    orientation: 'horizontal',
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    loopFocus: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: (args) => <ToolbarPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
