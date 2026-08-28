import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/button.css';
import { TRButton } from '@tinyrack/ui/components/button';
import type { ComponentType, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { PlaygroundArgsProvider } from '../../../app/playground/demo.js';

import.meta.glob('../../../../ui_web/src/components/*/*.css', { eager: true });

type DemoDefinition = {
  args: Record<string, unknown>;
  argTypes: Record<string, { options?: readonly unknown[] }>;
  render(args: Record<string, unknown>): ReactNode;
};

const demoModules = import.meta.glob(
  '../../../app/documentation/components/*.demo.tsx',
  { eager: true },
) as Record<string, { default?: DemoDefinition; playground?: DemoDefinition }>;

const playgrounds = new Map<string, DemoDefinition>();
for (const [path, module] of Object.entries(demoModules)) {
  const component = path.match(/\/([^/]+)\.demo\.tsx$/)?.[1];
  const definition = module.playground ?? module.default;
  if (component !== undefined && definition !== undefined) {
    playgrounds.set(component, definition);
  }
}

type Bounds = { height: number; width: number; x: number; y: number };
type ButtonArgs = {
  appearance: 'ghost' | 'outline' | 'solid';
  children: string;
  disabled: boolean;
  intent: 'danger' | 'info' | 'neutral' | 'primary' | 'success' | 'warning';
  loading: boolean;
  loadingLabel: string;
  uiSize: 'lg' | 'md' | 'sm';
};

const defaultButtonArgs: ButtonArgs = {
  appearance: 'solid',
  children: 'Deploy',
  disabled: false,
  intent: 'primary',
  loading: false,
  loadingLabel: 'Deploying',
  uiSize: 'md',
};

function colorHex(value: string) {
  const normalized = value.trim().toLowerCase();
  if (/^#[\da-f]{6}$/.test(normalized) || normalized === 'transparent') {
    return normalized;
  }
  const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
  if ((channels[3] ?? 1) === 0) return 'transparent';
  return `#${channels
    .slice(0, 3)
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`;
}

function pixels(value: string) {
  const result = Number.parseFloat(value);
  return Number.isFinite(result) ? result : null;
}

function bounds(element: Element, root?: DOMRect): Bounds {
  const box = element.getBoundingClientRect();
  return {
    height: box.height,
    width: box.width,
    x: root === undefined ? box.x : box.x - root.x,
    y: root === undefined ? box.y : box.y - root.y,
  };
}

function parityElements(component: string) {
  const target = document.querySelector('#react-target');
  if (target === null) throw new Error('React parity target is missing.');
  const preferred = target.querySelector(`.tr-${component}`);
  const root =
    preferred ?? target.querySelector('[class*="tr-"]') ?? target.firstElementChild;
  if (root === null) throw new Error(`React ${component} did not render an element.`);
  return { root, target };
}

function measure(component: string, activations: number) {
  const { root, target } = parityElements(component);
  const box = root.getBoundingClientRect();
  const style = getComputedStyle(root);
  const tokens = getComputedStyle(document.documentElement);
  const parts: Record<string, { bounds: Bounds }> = { root: { bounds: bounds(root) } };
  for (const element of target.querySelectorAll('[class*="tr-"]')) {
    const partName = [...element.classList].find((name) => name.startsWith('tr-'));
    if (partName !== undefined && parts[partName] === undefined) {
      parts[partName] = { bounds: bounds(element, box) };
    }
  }
  const control = root as HTMLButtonElement;
  return {
    bounds: bounds(root),
    interaction: {
      activations,
      enabled: !control.matches(':disabled,[aria-disabled="true"]'),
      focusVisible: root.matches(':focus-visible'),
      focused: root.matches(':focus-within'),
      hovered: root.matches(':hover'),
      loading: root.getAttribute('aria-busy') === 'true',
      pressed: root.matches(':active,[data-pressed]'),
    },
    parts,
    style: {
      backgroundColor: colorHex(style.backgroundColor),
      borderColor: colorHex(style.borderColor),
      borderWidth: pixels(style.borderTopWidth),
      disabledOpacity: Number(style.opacity),
      focusColor: colorHex(style.outlineColor),
      focusOffset: pixels(style.outlineOffset),
      focusWidth: pixels(style.outlineWidth),
      fontFamily: style.fontFamily,
      fontSize: pixels(style.fontSize),
      fontWeight: Number(style.fontWeight),
      foregroundColor: colorHex(style.color),
      gap: pixels(style.gap),
      lineHeight: pixels(style.lineHeight),
      paddingInline: pixels(style.paddingInlineStart),
      pressDistance: root.matches(':active')
        ? new DOMMatrixReadOnly(style.transform).m42
        : 0,
      radius: pixels(style.borderTopLeftRadius),
      tokenBorderWidth: pixels(
        tokens.getPropertyValue('--tinyrack-border-width-default'),
      ),
      tokenDisabledOpacity: Number(
        tokens.getPropertyValue('--tinyrack-opacity-disabled'),
      ),
      tokenFocusColor: colorHex(tokens.getPropertyValue('--tinyrack-focus')),
      tokenFocusOffset: pixels(tokens.getPropertyValue('--tinyrack-focus-offset')),
      tokenFocusWidth: pixels(tokens.getPropertyValue('--tinyrack-focus-width')),
    },
  };
}

function App() {
  const [component, setComponent] = useState('button');
  const [args, setArgs] = useState<Record<string, unknown>>(defaultButtonArgs);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const activationsRef = useRef(0);

  useEffect(() => {
    window.__tinyrackParity = {
      components: [...playgrounds.keys()].sort(),
      measure: () => measure(component, activationsRef.current),
      setArgs(next) {
        const defaults =
          component === 'button'
            ? defaultButtonArgs
            : (playgrounds.get(component)?.args ?? {});
        setArgs({ ...defaults, ...next });
      },
      setComponent(nextComponent, nextArgs = {}) {
        const playground = playgrounds.get(nextComponent);
        if (nextComponent !== 'button' && playground === undefined) {
          throw new Error(`Missing React playground for ${nextComponent}.`);
        }
        setComponent(nextComponent);
        setArgs({
          ...(nextComponent === 'button'
            ? defaultButtonArgs
            : (playground?.args ?? {})),
          ...nextArgs,
        });
        activationsRef.current = 0;
      },
      supportedOptions(nextComponent) {
        const playground = playgrounds.get(nextComponent);
        return Object.fromEntries(
          Object.keys({
            ...(playground?.args ?? {}),
            ...(playground?.argTypes ?? {}),
          }).map((name) => [name, playground?.argTypes[name]?.options ?? []]),
        );
      },
    };
  }, [component]);

  let content: ReactNode;
  if (component === 'button') {
    content = (
      <TRButton
        {...(args as ButtonArgs)}
        onClick={() => {
          activationsRef.current += 1;
        }}
        ref={buttonRef}
      />
    );
  } else {
    const playground = playgrounds.get(component);
    const DemoRenderer = playground?.render as
      | ComponentType<Record<string, unknown>>
      | undefined;
    content = DemoRenderer ? (
      <MemoryRouter initialEntries={['/en']}>
        <PlaygroundArgsProvider args={args} updateArgs={setArgs}>
          <DemoRenderer {...args} />
        </PlaygroundArgsProvider>
      </MemoryRouter>
    ) : null;
  }

  return (
    <main data-parity-component={component} id="react-target">
      {content}
    </main>
  );
}

declare global {
  interface Window {
    __tinyrackParity?: {
      components: string[];
      measure(): {
        bounds: Bounds;
        interaction: Record<string, boolean | number>;
        parts: Record<string, { bounds: Bounds }>;
        style: Record<string, number | string | null>;
      };
      setArgs(args: Record<string, unknown>): void;
      setComponent(component: string, args?: Record<string, unknown>): void;
      supportedOptions(component: string): Record<string, readonly unknown[]>;
    };
  }
}

document.documentElement.dataset['theme'] = 'tinyrack-light';
document.body.style.margin = '0';
document.body.style.padding = '48px';
document
  .querySelector<HTMLIFrameElement>('#flutter-preview')
  ?.setAttribute('src', '/flutter-preview/index.html?component=button&locale=en');
const root = document.querySelector('#root');
if (root === null) throw new Error('Parity harness root is missing.');
createRoot(root).render(<App />);
