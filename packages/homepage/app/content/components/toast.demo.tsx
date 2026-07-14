import { Button } from '@tinyrack/ui/components/button';
import {
  Toast,
  type ToastPosition,
  type ToastVariant,
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
  position: ToastPosition;
  title: string;
  variant: ToastVariant;
};

function ToastCloseControl({ onClose }: { onClose?: () => void }) {
  return (
    <Toast.Close aria-label="Dismiss notification" onClick={onClose}>
      ×
    </Toast.Close>
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
      <Button
        onClick={() => {
          syncToast();
          onOpenChange?.(true);
        }}
      >
        Show toast
      </Button>
      <Toast.Portal>
        <Toast.Viewport aria-label="Playground notifications" position={position}>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <div>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <Toast.Action>View</Toast.Action>
              <ToastCloseControl
                onClose={() => {
                  toastId.current = null;
                  onOpenChange?.(false);
                }}
              />
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
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
          <Button
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
          </Button>
        ))}
      </div>
      <Toast.Portal>
        <Toast.Viewport
          aria-label="Status variant notifications"
          position="block-end-inline-end"
        >
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <div>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <ToastCloseControl />
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
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
        <Button onClick={show}>Show timed toast</Button>
        <Button
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
        </Button>
        <Button
          onClick={() => {
            void manager.promise(Promise.resolve('Rack A'), {
              error: { title: 'Deployment failed', type: 'danger' },
              loading: { title: 'Deploying rack', type: 'info' },
              success: (rack) => ({ title: `${rack} deployed`, type: 'success' }),
            });
          }}
        >
          Run promise
        </Button>
        <Button
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
        </Button>
      </div>
      <Toast.Portal>
        <Toast.Viewport
          aria-label="Lifecycle notifications"
          position="block-end-inline-end"
        >
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <div>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <Toast.Action onClick={() => manager.close(toast.id)}>Undo</Toast.Action>
              <ToastCloseControl />
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
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
] as const satisfies readonly (readonly [ToastPosition, string])[];

function ToastPositionDemo({
  label,
  position,
}: {
  label: string;
  position: ToastPosition;
}) {
  const manager = useToastManager();

  return (
    <>
      <Button
        onClick={() =>
          manager.add({
            description: `${label} viewport.`,
            title: label,
            type: 'info',
          })
        }
      >
        {label}
      </Button>
      <Toast.Portal>
        <Toast.Viewport aria-label={`${label} notifications`} position={position}>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <div>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <ToastCloseControl />
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </>
  );
}

export function ToastPositionGallery() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {positions.map(([position, label]) => (
        <Toast.Provider key={position} limit={1}>
          <ToastPositionDemo label={label} position={position} />
        </Toast.Provider>
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
      <Toast.Provider>
        <ToastDemo
          {...args}
          onOpenChange={(initiallyOpen) => updateArgs({ initiallyOpen })}
        />
      </Toast.Provider>
    );
  },
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { initiallyOpen: true } };

export const playground = definePlayground(meta);
