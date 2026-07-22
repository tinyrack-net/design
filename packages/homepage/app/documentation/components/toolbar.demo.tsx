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
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type StoryArgs = {
  boldPressed: boolean;
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
};

type ToolbarPreviewProps = Pick<StoryArgs, 'disabled' | 'orientation'> &
  Partial<Omit<StoryArgs, 'disabled' | 'orientation'>> & {
    onBoldPressedChange?: (pressed: boolean) => void;
  };

export function ToolbarPreview({
  boldPressed = true,
  disabled,
  onBoldPressedChange,
  orientation,
}: ToolbarPreviewProps) {
  const locale = useDemoLocale();
  const copy =
    locale === 'ko'
      ? {
          editor: '편집기 서식 컨트롤',
          none: '선택한 서식 명령이 없어요',
          title: '문서 제목',
        }
      : locale === 'ja'
        ? {
            editor: 'エディターの書式設定',
            none: '書式コマンドは選択されていません。',
            title: '文書タイトル',
          }
        : {
            editor: 'Editor formatting controls',
            none: 'No formatting command selected',
            title: 'Document title',
          };
  const [result, setResult] = useState(copy.none);

  return (
    <div data-docs-example-item="">
      <TRToolbar.Root
        aria-label={copy.editor}
        className="max-w-full"
        disabled={disabled}
        orientation={orientation}
      >
        <TRToolbar.Group aria-label="Text style">
          <TRToolbar.Button
            aria-label="Bold"
            render={
              <TRToggle
                onPressedChange={(pressed) => {
                  onBoldPressedChange?.(pressed);
                  setResult(`Bold ${pressed ? 'on' : 'off'}`);
                }}
                pressed={boldPressed}
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
          aria-label={copy.title}
          className="w-20 max-w-full shrink-0"
          placeholder={copy.title}
        />
      </TRToolbar.Root>
      <output aria-live="polite" className="mt-3 block text-sm">
        {result}
      </output>
    </div>
  );
}

export const toolbarBasicSource = `import { useState } from 'react';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/toggle.css';
import '@tinyrack/ui/components/toolbar.css';
import { TRToggle } from '@tinyrack/ui/components/toggle';
import { TRToolbar } from '@tinyrack/ui/components/toolbar';

export function FormattingToolbar() {
  const [bold, setBold] = useState(true);

  return (
    <TRToolbar.Root aria-label="Editor controls">
      <TRToolbar.Group aria-label="Text formatting">
        <TRToolbar.Button render={<TRToggle pressed={bold} onPressedChange={setBold} />}>
          Bold
        </TRToolbar.Button>
        <TRToolbar.Button render={<TRToggle />}>Italic</TRToolbar.Button>
      </TRToolbar.Group>
      <TRToolbar.Separator />
      <TRToolbar.Link href="#help">Help</TRToolbar.Link>
      <TRToolbar.Input aria-label="Document title" name="title" />
    </TRToolbar.Root>
  );
}`;

export const toolbarStatesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/toolbar.css';
import { TRToolbar } from '@tinyrack/ui/components/toolbar';

export function ToolbarStates() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="sm:col-span-2" data-docs-example-item="">
        <strong>Horizontal</strong>
        <TRToolbar.Root aria-label="Horizontal editor controls" loopFocus={false}>
          <TRToolbar.Group aria-label="Text formatting">
            <TRToolbar.Button>Bold</TRToolbar.Button>
            <TRToolbar.Button disabled focusableWhenDisabled>Italic unavailable</TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Link href="#help">Help</TRToolbar.Link>
        </TRToolbar.Root>
      </section>

      <section data-docs-example-item="">
        <strong>Vertical</strong>
        <TRToolbar.Root aria-label="Vertical editor controls" orientation="vertical">
          <TRToolbar.Group aria-label="Text formatting">
            <TRToolbar.Button>Bold</TRToolbar.Button>
            <TRToolbar.Button>Italic</TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Link href="#help">Help</TRToolbar.Link>
          <TRToolbar.Input aria-label="Document title" placeholder="Document title" />
        </TRToolbar.Root>
      </section>

      <section data-docs-example-item="">
        <strong>Disabled group</strong>
        <TRToolbar.Root aria-label="Save history controls" orientation="vertical">
          <TRToolbar.Group aria-label="Available commands">
            <TRToolbar.Button>Save</TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Group aria-label="Unavailable history commands" disabled>
            <TRToolbar.Button>Undo</TRToolbar.Button>
            <TRToolbar.Button>Redo</TRToolbar.Button>
          </TRToolbar.Group>
        </TRToolbar.Root>
      </section>
    </div>
  );
}`;

export function ToolbarStateComparisonPreview() {
  return (
    <div className="grid max-w-full gap-6 sm:grid-cols-2">
      <section className="sm:col-span-2" data-docs-example-item="">
        <strong className="mb-2 block text-sm">Horizontal</strong>
        <TRToolbar.Root
          aria-label="Horizontal editor controls"
          className="max-w-full"
          loopFocus={false}
        >
          <TRToolbar.Group aria-label="Text formatting">
            <TRToolbar.Button aria-label="Bold">
              <Bold aria-hidden="true" />
            </TRToolbar.Button>
            <TRToolbar.Button aria-label="Italic unavailable" disabled>
              <Italic aria-hidden="true" />
            </TRToolbar.Button>
          </TRToolbar.Group>
          <TRToolbar.Separator />
          <TRToolbar.Link aria-label="Formatting help" href="#help">
            <CircleHelp aria-hidden="true" />
          </TRToolbar.Link>
        </TRToolbar.Root>
      </section>

      <section data-docs-example-item="">
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

      <section data-docs-example-item="">
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
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    boldPressed: true,
    disabled: false,
    orientation: 'horizontal',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { options: ['horizontal', 'vertical'], control: 'radio' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();

    return (
      <ToolbarPreview
        {...args}
        onBoldPressedChange={(pressed) => updateArgs({ boldPressed: pressed })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
