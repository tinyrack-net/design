import { TRButton } from '@tinyrack/ui/components/button';
import {
  TRToast,
  type TRToastPosition,
  type TRToastVariant,
  useToastManager,
} from '@tinyrack/ui/components/toast';
import { useCallback, useEffect, useRef } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type ToastStoryArgs = {
  description: string;
  initiallyOpen: boolean;
  position: TRToastPosition;
  title: string;
  variant: TRToastVariant;
};

export const toastBasicSource = `import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/toast.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRToast, useToastManager } from '@tinyrack/ui/components/toast';

function ToastList() {
  const manager = useToastManager();
  return <>
    <TRButton onClick={() => manager.add({
      title: 'Deployment complete',
      description: 'Rack A is healthy.',
      type: 'success',
    })}>Show toast</TRButton>
    <TRToast.Portal>
      <TRToast.Viewport aria-label="Deployment notifications">
        {manager.toasts.map((toast) => (
          <TRToast.Root key={toast.id} toast={toast}>
            <TRToast.Content>
              <TRToast.Title />
              <TRToast.Description />
              <TRToast.Action>View</TRToast.Action>
              <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
            </TRToast.Content>
          </TRToast.Root>
        ))}
      </TRToast.Viewport>
    </TRToast.Portal>
  </>;
}

export default function ToastExample() {
  return <TRToast.Provider><ToastList /></TRToast.Provider>;
}`;

export const toastVariantsSource = `import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/toast.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRToast, useToastManager } from '@tinyrack/ui/components/toast';

const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const;

function StatusToasts() {
  const manager = useToastManager();
  return <>
    {variants.map((type) => (
      <TRButton key={type} onClick={() => manager.add({ title: type, type })}>
        {type}
      </TRButton>
    ))}
    <TRToast.Portal>
      <TRToast.Viewport aria-label="Status notifications">
        {manager.toasts.map((toast) => (
          <TRToast.Root key={toast.id} toast={toast}>
            <TRToast.Content><TRToast.Title /></TRToast.Content>
            <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
          </TRToast.Root>
        ))}
      </TRToast.Viewport>
    </TRToast.Portal>
  </>;
}

export default function ToastVariants() {
  return <TRToast.Provider><StatusToasts /></TRToast.Provider>;
}`;

export const toastPositionsSource = `import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/toast.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRToast, useToastManager } from '@tinyrack/ui/components/toast';

function PositionedToast() {
  const manager = useToastManager();
  return <>
    <TRButton onClick={() => manager.add({ title: 'Saved', type: 'info' })}>
      Show toast
    </TRButton>
    <TRToast.Portal>
      <TRToast.Viewport
        aria-label="Saved notifications"
        position="block-start-center"
      >
        {manager.toasts.map((toast) => (
          <TRToast.Root key={toast.id} toast={toast}>
            <TRToast.Content><TRToast.Title /></TRToast.Content>
            <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
          </TRToast.Root>
        ))}
      </TRToast.Viewport>
    </TRToast.Portal>
  </>;
}

export default function ToastPosition() {
  return <TRToast.Provider><PositionedToast /></TRToast.Provider>;
}`;

export const toastLifecycleSource = `import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/toast.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRToast, useToastManager } from '@tinyrack/ui/components/toast';
import { useRef } from 'react';

function LifecycleToasts() {
  const manager = useToastManager();
  const toastId = useRef<string | null>(null);
  return <>
    <TRButton onClick={() => {
      toastId.current = manager.add({ title: 'Working', timeout: 5000 });
    }}>Show timed toast</TRButton>
    <TRButton onClick={() => {
      if (toastId.current) manager.update(toastId.current, {
        title: 'Complete', type: 'success',
      });
    }}>Update toast</TRButton>
    <TRButton onClick={() => manager.close()}>Dismiss all</TRButton>
    <TRToast.Portal>
      <TRToast.Viewport aria-label="Lifecycle notifications">
        {manager.toasts.map((toast) => (
          <TRToast.Root key={toast.id} toast={toast}>
            <TRToast.Content><TRToast.Title /></TRToast.Content>
            <TRToast.Action onClick={() => manager.close(toast.id)}>Undo</TRToast.Action>
            <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
          </TRToast.Root>
        ))}
      </TRToast.Viewport>
    </TRToast.Portal>
  </>;
}

export default function ToastLifecycle() {
  return <TRToast.Provider limit={2}><LifecycleToasts /></TRToast.Provider>;
}`;

export const toastAnchoredSource = `import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/toast.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRToast, useToastManager } from '@tinyrack/ui/components/toast';
import { useRef } from 'react';

function AnchoredToast() {
  const manager = useToastManager();
  const anchorRef = useRef<HTMLButtonElement>(null);
  return <>
    <TRButton ref={anchorRef} onClick={() => manager.add({
      description: 'Copied to clipboard.',
      positionerProps: { anchor: anchorRef.current, side: 'top', sideOffset: 8 },
      type: 'info',
    })}>Copy</TRButton>
    <TRToast.Portal>
      <TRToast.Viewport aria-label="Anchored notifications">
        {manager.toasts.map((toast) => (
          <TRToast.Positioner key={toast.id} toast={toast} {...toast.positionerProps}>
            <TRToast.Root toast={toast}>
              <TRToast.Arrow />
              <TRToast.Content><TRToast.Description /></TRToast.Content>
              <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
            </TRToast.Root>
          </TRToast.Positioner>
        ))}
      </TRToast.Viewport>
    </TRToast.Portal>
  </>;
}

export default function ToastAnchored() {
  return <TRToast.Provider><AnchoredToast /></TRToast.Provider>;
}`;

function ToastCloseControl({ onClose }: { onClose?: () => void }) {
  const locale = useDemoLocale();
  return (
    <TRToast.Close
      aria-label={
        locale === 'ko'
          ? '알림 닫기'
          : locale === 'ja'
            ? '通知を閉じる'
            : 'Dismiss notification'
      }
      onClick={onClose}
    >
      ×
    </TRToast.Close>
  );
}

type ToastDemoProps = Partial<ToastStoryArgs>;

export function ToastDemo({
  description = 'Rack A is healthy.',
  initiallyOpen = false,
  position = 'block-end-inline-end',
  title = 'Deployment complete',
  variant = 'success',
}: ToastDemoProps) {
  const locale = useDemoLocale();
  const copy =
    locale === 'ko'
      ? { action: '보기', show: '토스트 보기', viewport: '플레이그라운드 알림' }
      : locale === 'ja'
        ? { action: '表示', show: 'トーストを表示', viewport: 'プレイグラウンド通知' }
        : { action: 'View', show: 'Show toast', viewport: 'Playground notifications' };
  const manager = useToastManager();
  const managerRef = useRef(manager);
  const initialOpenHandled = useRef(false);
  const toastId = useRef<string | null>(null);
  managerRef.current = manager;

  const syncToast = useCallback(() => {
    const currentManager = managerRef.current;
    if (toastId.current === null) {
      toastId.current = currentManager.add({
        description,
        timeout: 0,
        title,
        type: variant,
      });
      return;
    }

    currentManager.update(toastId.current, { description, title, type: variant });
  }, [description, title, variant]);

  useEffect(() => {
    if (initialOpenHandled.current) return;
    initialOpenHandled.current = true;
    if (initiallyOpen) syncToast();
  }, [initiallyOpen, syncToast]);

  useEffect(() => {
    if (toastId.current === null) return;
    managerRef.current.update(toastId.current, { description, title, type: variant });
  }, [description, title, variant]);

  return (
    <div data-docs-example-item="">
      <TRButton
        onClick={() => {
          syncToast();
        }}
      >
        {copy.show}
      </TRButton>
      <TRToast.Portal>
        <TRToast.Viewport aria-label={copy.viewport} position={position}>
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title>{toast.title}</TRToast.Title>
                <TRToast.Description>{toast.description}</TRToast.Description>
              </TRToast.Content>
              <TRToast.Action>{copy.action}</TRToast.Action>
              <ToastCloseControl
                onClose={() => {
                  toastId.current = null;
                }}
              />
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </div>
  );
}

export function ToastVariantGallery() {
  const manager = useToastManager();
  const variants = [
    ['neutral', 'Neutral update'],
    ['info', 'Maintenance scheduled'],
    ['success', 'Deployment complete'],
    ['warning', 'Storage nearing capacity'],
    ['danger', 'Deployment failed'],
  ] as const;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map(([type, title]) => (
          <TRButton
            data-docs-example-item=""
            key={type}
            onClick={() =>
              manager.add({
                description: 'Rack A status notification.',
                title,
                type,
              })
            }
          >
            {title}
          </TRButton>
        ))}
      </div>
      <TRToast.Portal>
        <TRToast.Viewport
          aria-label="Status variant notifications"
          position="block-end-inline-end"
        >
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title>{toast.title}</TRToast.Title>
                <TRToast.Description>{toast.description}</TRToast.Description>
              </TRToast.Content>
              <ToastCloseControl />
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </>
  );
}

export function ToastLifecycleDemo() {
  const manager = useToastManager();
  const activeToast = useRef<string | null>(null);

  const show = () => {
    activeToast.current = manager.add({
      description: 'Waiting for a lifecycle action.',
      timeout: 5000,
      title: 'Rack operation',
      type: 'info',
    });
  };

  return (
    <div data-docs-example-item="">
      <div className="flex flex-wrap gap-2">
        <TRButton onClick={show}>Show timed toast</TRButton>
        <TRButton
          onClick={() => {
            if (activeToast.current === null) show();
            if (activeToast.current !== null) {
              manager.update(activeToast.current, {
                description: 'The existing toast was updated in place.',
                title: 'Rack operation updated',
                type: 'success',
              });
            }
          }}
        >
          Update toast
        </TRButton>
        <TRButton
          onClick={() => {
            void manager.promise(Promise.resolve('Rack A'), {
              error: { title: 'Deployment failed', type: 'danger' },
              loading: { title: 'Deploying rack', type: 'info' },
              success: (rack) => ({ title: `${rack} deployed`, type: 'success' }),
            });
          }}
        >
          Run promise
        </TRButton>
        <TRButton
          onClick={() => {
            for (let index = 1; index <= 4; index += 1) {
              manager.add({
                description: 'Queued with provider limit 2.',
                title: `Queued toast ${index}`,
                type: 'neutral',
              });
            }
          }}
        >
          Queue four
        </TRButton>
        <TRButton
          appearance="ghost"
          onClick={() => {
            manager.close();
            activeToast.current = null;
          }}
        >
          Reset toasts
        </TRButton>
      </div>
      <TRToast.Portal>
        <TRToast.Viewport
          aria-label="Lifecycle notifications"
          position="block-end-inline-end"
        >
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title>{toast.title}</TRToast.Title>
                <TRToast.Description>{toast.description}</TRToast.Description>
              </TRToast.Content>
              <TRToast.Action onClick={() => manager.close(toast.id)}>
                Undo
              </TRToast.Action>
              <ToastCloseControl />
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </div>
  );
}

const positions = [
  ['block-start-inline-start', 'Start / Start'],
  ['block-start-center', 'Start / Center'],
  ['block-start-inline-end', 'Start / End'],
  ['block-end-inline-start', 'End / Start'],
  ['block-end-center', 'End / Center'],
  ['block-end-inline-end', 'End / End'],
] as const satisfies readonly (readonly [TRToastPosition, string])[];

function ToastPositionDemo({
  label,
  position,
}: {
  label: string;
  position: TRToastPosition;
}) {
  const manager = useToastManager();

  return (
    <div data-docs-example-item="">
      <TRButton
        onClick={() =>
          manager.add({
            description: `${label} viewport.`,
            title: label,
            type: 'info',
          })
        }
      >
        {label}
      </TRButton>
      <TRToast.Portal>
        <TRToast.Viewport aria-label={`${label} notifications`} position={position}>
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title>{toast.title}</TRToast.Title>
                <TRToast.Description>{toast.description}</TRToast.Description>
              </TRToast.Content>
              <ToastCloseControl />
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </div>
  );
}

export function ToastAnchoredDemo() {
  const manager = useToastManager();
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div data-docs-example-item="">
      <TRButton
        ref={anchorRef}
        onClick={() =>
          manager.add({
            description: 'The notification follows its action trigger.',
            positionerProps: { anchor: anchorRef.current, side: 'top', sideOffset: 8 },
            title: 'Anchored deployment',
            type: 'info',
          })
        }
      >
        Show anchored toast
      </TRButton>
      <TRToast.Portal>
        <TRToast.Viewport aria-label="Anchored notifications">
          {manager.toasts.map((toast) => (
            <TRToast.Positioner key={toast.id} toast={toast} {...toast.positionerProps}>
              <TRToast.Root toast={toast}>
                <TRToast.Arrow />
                <TRToast.Content>
                  <TRToast.Title>{toast.title}</TRToast.Title>
                  <TRToast.Description>{toast.description}</TRToast.Description>
                </TRToast.Content>
                <ToastCloseControl />
              </TRToast.Root>
            </TRToast.Positioner>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </div>
  );
}

export function ToastPositionGallery() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {positions.map(([position, label]) => (
        <TRToast.Provider key={position} limit={1}>
          <ToastPositionDemo label={label} position={position} />
        </TRToast.Provider>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Toast',
  excludeStories: /.*Source$/,
  parameters: { layout: 'centered' },
  args: {
    description: 'Rack A is healthy.',
    initiallyOpen: false,
    position: 'block-end-inline-end',
    title: 'Deployment complete',
    variant: 'success',
  },
  localizedArgs: {
    ja: { description: 'ラック A は正常です。', title: 'デプロイが完了しました' },
    ko: { description: '랙 A가 정상이에요.', title: '배포가 완료됐어요' },
  },
  argTypes: {
    description: { control: 'text' },
    position: {
      control: 'select',
      options: [
        'block-start-inline-start',
        'block-start-center',
        'block-start-inline-end',
        'block-end-inline-start',
        'block-end-center',
        'block-end-inline-end',
      ],
    },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: function Render(args) {
    return (
      <TRToast.Provider>
        <ToastDemo {...args} />
      </TRToast.Provider>
    );
  },
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { initiallyOpen: true } };

export const playground = definePlayground(meta);
