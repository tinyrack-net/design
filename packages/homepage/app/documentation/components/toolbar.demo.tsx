import { TRToggle } from '@tinyrack/ui/components/toggle';
import { TRToolbar } from '@tinyrack/ui/components/toolbar';
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
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
};

export function ToolbarPreview({ disabled, orientation }: StoryArgs) {
  const [result, setResult] = useState('No formatting command selected');

  return (
    <div>
      <TRToolbar.Root
        aria-label="Editor formatting controls"
        className="max-w-full"
        disabled={disabled}
        orientation={orientation}
      >
        <TRToolbar.Group aria-label="Text style">
          <TRToolbar.Button
            aria-label="Bold"
            render={
              <TRToggle
                defaultPressed
                onPressedChange={(pressed) =>
                  setResult(`Bold ${pressed ? 'on' : 'off'}`)
                }
              />
            }
          >
            <Bold aria-hidden="true" />
          </TRToolbar.Button>
          <TRToolbar.Button
            aria-label="Italic"
            render={<TRToggle />}
            onClick={() => setResult('Italic selected')}
          >
            <Italic aria-hidden="true" />
          </TRToolbar.Button>
          <TRToolbar.Button aria-label="Underline" render={<TRToggle />}>
            <Underline aria-hidden="true" />
          </TRToolbar.Button>
        </TRToolbar.Group>
        <TRToolbar.Separator
          orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        />
        <TRToolbar.Group aria-label="Text alignment">
          <TRToolbar.Button
            aria-label="Align left"
            render={<TRToggle defaultPressed />}
          >
            <AlignLeft aria-hidden="true" />
          </TRToolbar.Button>
          <TRToolbar.Button aria-label="Align center" render={<TRToggle />}>
            <AlignCenter aria-hidden="true" />
          </TRToolbar.Button>
        </TRToolbar.Group>
        <TRToolbar.Separator
          orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        />
        <TRToolbar.Link aria-label="Formatting help" href="#help">
          <CircleHelp aria-hidden="true" />
        </TRToolbar.Link>
        <TRToolbar.Input
          aria-label="Document title"
          className="w-20 max-w-full shrink-0"
          placeholder="Document title"
        />
      </TRToolbar.Root>
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
        <TRToolbar.Root aria-label="Horizontal editor controls" className="max-w-full">
          <TRToolbar.Group aria-label="Text formatting">
            <TRToolbar.Button aria-label="Bold">
              <Bold aria-hidden="true" />
            </TRToolbar.Button>
            <TRToolbar.Button aria-label="Italic">
              <Italic aria-hidden="true" />
            </TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Link aria-label="Formatting help" href="#help">
            <CircleHelp aria-hidden="true" />
          </TRToolbar.Link>
        </TRToolbar.Root>
      </section>

      <section>
        <strong className="mb-2 block text-sm">Vertical</strong>
        <TRToolbar.Root aria-label="Vertical editor controls" orientation="vertical">
          <TRToolbar.Group aria-label="Text formatting">
            <TRToolbar.Button aria-label="Bold">
              <Bold aria-hidden="true" />
            </TRToolbar.Button>
            <TRToolbar.Button aria-label="Italic">
              <Italic aria-hidden="true" />
            </TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Link aria-label="Formatting help" href="#help">
            <CircleHelp aria-hidden="true" />
          </TRToolbar.Link>
          <TRToolbar.Input
            aria-label="Document title"
            className="max-w-full"
            placeholder="Document title"
          />
        </TRToolbar.Root>
      </section>

      <section>
        <strong className="mb-2 block text-sm">Disabled group</strong>
        <TRToolbar.Root aria-label="Save history controls" orientation="vertical">
          <TRToolbar.Group aria-label="Available commands">
            <TRToolbar.Button aria-label="Save">
              <Save aria-hidden="true" />
            </TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Group aria-label="Unavailable history commands" disabled>
            <TRToolbar.Button aria-label="Undo">
              <Undo2 aria-hidden="true" />
            </TRToolbar.Button>
            <TRToolbar.Button aria-label="Redo">
              <Redo2 aria-hidden="true" />
            </TRToolbar.Button>
          </TRToolbar.Group>
        </TRToolbar.Root>
      </section>
    </div>
  );
}

const meta = {
  title: 'Components/Toolbar',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    orientation: 'horizontal',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: (args) => <ToolbarPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
