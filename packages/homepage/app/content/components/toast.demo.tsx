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
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type ToastStoryArgs = {
  description: string;
  initiallyOpen: boolean;
  position: TRToastPosition;
  title: string;
  variant: TRToastVariant;
};

function ToastCloseControl({ onClose }: { onClose?: () => void }) {
  return (
    <TRToast.Close aria-label="Dismiss notification" onClick={onClose}>
      ×
    </TRToast.Close>
  );
}

type ToastDemoProps = Partial<ToastStoryArgs> & {
  onOpenChange?: (open: boolean) => void;
};

export function ToastDemo({
  description = 'Rack A is healthy.',
  initiallyOpen = false,
  position = 'block-end-inline-end',
  title = 'Deployment complete',
  variant = 'success',
  onOpenChange,
}: ToastDemoProps) {
  const manager = useToastManager();
  const managerRef = useRef(manager);
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
    if (initiallyOpen) {
      syncToast();
      return;
    }
    if (!initiallyOpen && toastId.current !== null) {
      managerRef.current.close(toastId.current);
      toastId.current = null;
    }
  }, [initiallyOpen, syncToast]);

  return (
    <>
      <TRButton
        onClick={() => {
          syncToast();
          onOpenChange?.(true);
        }}
      >
        Show toast
      </TRButton>
      <TRToast.Portal>
        <TRToast.Viewport aria-label="Playground notifications" position={position}>
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title>{toast.title}</TRToast.Title>
                <TRToast.Description>{toast.description}</TRToast.Description>
              </TRToast.Content>
              <TRToast.Action>View</TRToast.Action>
              <ToastCloseControl
                onClose={() => {
                  toastId.current = null;
                  onOpenChange?.(false);
                }}
              />
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    </>
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
    <>
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
    </>
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
    <>
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
    </>
  );
}

export function ToastAnchoredDemo() {
  const manager = useToastManager();
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
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
      </TRToast.Portal>
    </>
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
  parameters: { layout: 'centered' },
  args: {
    description: 'Rack A is healthy.',
    initiallyOpen: false,
    position: 'block-end-inline-end',
    title: 'Deployment complete',
    variant: 'success',
  },
  argTypes: {
    description: { control: 'text' },
    initiallyOpen: { control: 'boolean' },
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
    const [, updateArgs] = useArgs<ToastStoryArgs>();

    return (
      <TRToast.Provider>
        <ToastDemo
          {...args}
          onOpenChange={(initiallyOpen) => updateArgs({ initiallyOpen })}
        />
      </TRToast.Provider>
    );
  },
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { initiallyOpen: true } };

export const playground = definePlayground(meta);
