import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from '../../src/components/button/index.js';
import {
  Toast,
  type ToastPosition,
  type ToastVariant,
  useToastManager,
} from '../../src/components/toast/index.js';

type ToastStoryArgs = {
  description: string;
  initiallyOpen: boolean;
  position: ToastPosition;
  title: string;
  variant: ToastVariant;
};

function ToastCloseControl() {
  return <Toast.Close aria-label="Dismiss notification">×</Toast.Close>;
}

export function ToastDemo({
  description = 'Rack A is healthy.',
  initiallyOpen = false,
  position = 'block-end-inline-end',
  title = 'Deployment complete',
  variant = 'success',
}: Partial<ToastStoryArgs>) {
  const manager = useToastManager();
  const added = useRef(false);

  const addToast = useCallback(() => {
    manager.add({ description, timeout: 0, title, type: variant });
  }, [description, manager, title, variant]);

  useEffect(() => {
    if (!initiallyOpen || added.current) return;
    added.current = true;
    addToast();
  }, [addToast, initiallyOpen]);

  return (
    <>
      <Button onClick={addToast}>Show toast</Button>
      <Toast.Portal>
        <Toast.Viewport position={position}>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <div>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <Toast.Action>View</Toast.Action>
              <ToastCloseControl />
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
        <Toast.Viewport position="block-end-inline-end">
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
        <Toast.Viewport position={position}>
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
  render: (args) => (
    <Toast.Provider>
      <ToastDemo {...args} />
    </Toast.Provider>
  ),
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { initiallyOpen: true } };
