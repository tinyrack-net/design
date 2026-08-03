'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type DemoArgs, usePlaygroundArgs } from '../../playground/demo.js';
import { demoCopy, useDemoLocale } from '../shared/demo-locale.js';

const channel = 'tinyrack.flutter-preview.v1';

type FlutterFrameProps = {
  args?: DemoArgs;
  component: string;
  example?: string;
  onStateChanged?: (args: DemoArgs) => void;
  variant?: 'example' | 'playground';
};

type FlutterPreviewProps = {
  args: DemoArgs;
  component: string;
};

type FlutterExampleProps = {
  component: string;
  example: string;
};

function matchingArgs(current: DemoArgs, candidate: DemoArgs) {
  return Object.fromEntries(
    Object.entries(candidate).filter(([key, value]) => {
      if (!Object.hasOwn(current, key)) return false;
      const currentValue = current[key];
      return (
        typeof value === typeof currentValue &&
        (value === null || ['boolean', 'number', 'string'].includes(typeof value))
      );
    }),
  );
}

function matchingInteractionArgs(
  component: string,
  current: DemoArgs,
  candidate: DemoArgs,
) {
  const entries = Object.entries(candidate);
  if (component === 'app-shell') {
    return matchingArgs(
      current,
      Object.fromEntries(
        entries.filter(([key]) => key === 'open' || key === 'sidebarMode'),
      ),
    );
  }
  if (
    component === 'checkbox' &&
    entries.length > 0 &&
    entries.every(
      ([key, value]) =>
        (key === 'checked' || key === 'indeterminate') && typeof value === 'boolean',
    )
  ) {
    return matchingArgs(current, candidate);
  }
  if (
    component === 'toggle' &&
    entries.length === 1 &&
    entries[0]?.[0] === 'pressed' &&
    typeof entries[0][1] === 'boolean'
  ) {
    return { pressed: entries[0][1] };
  }
  if (
    (component === 'checkbox-group' || component === 'toggle-group') &&
    entries.length === 1 &&
    entries[0]?.[0] === 'selectedValues' &&
    Array.isArray(entries[0][1]) &&
    entries[0][1].every((value) => typeof value === 'string') &&
    Array.isArray(current['selectedValues'])
  ) {
    return { selectedValues: entries[0][1] };
  }
  if (
    (component !== 'text-field' && component !== 'otp-field') ||
    entries.length !== 1 ||
    entries[0]?.[0] !== 'value' ||
    typeof entries[0][1] !== 'string'
  ) {
    return {};
  }
  return matchingArgs(current, candidate);
}

/**
 * Hosts a Tinyrack Flutter web bundle in a sandboxed, lazily mounted iframe and
 * keeps its theme in sync. When `args` is provided the frame also streams
 * playground args in; when `example` is provided it renders a fixed docs
 * example composition instead.
 */
function FlutterFrame({
  args,
  component,
  example,
  onStateChanged,
  variant = 'playground',
}: FlutterFrameProps) {
  const locale = useDemoLocale();
  const containerAttr =
    variant === 'example' ? 'data-flutter-example' : 'data-flutter-preview';
  const frameAttr =
    variant === 'example' ? 'data-flutter-example-frame' : 'data-flutter-preview-frame';
  const copy = demoCopy[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const requestIdRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [runtimeError, setRuntimeError] = useState(false);
  const [visible, setVisible] = useState(false);
  const src = useMemo(() => {
    const query = new URLSearchParams({ component, locale });
    if (example !== undefined) query.set('example', example);
    return `/flutter-preview/index.html?${query.toString()}`;
  }, [component, example, locale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function post(type: 'setTheme' | 'updateArgs', payload: DemoArgs) {
      requestIdRef.current += 1;
      iframeRef.current?.contentWindow?.postMessage(
        {
          channel,
          component,
          payload,
          requestId: requestIdRef.current,
          type,
        },
        window.location.origin,
      );
    }
    function sync() {
      const theme = document.documentElement.dataset['theme']?.endsWith('dark')
        ? 'dark'
        : 'light';
      post('setTheme', { theme });
      if (args !== undefined) post('updateArgs', args);
    }
    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        typeof event.data !== 'object' ||
        event.data === null ||
        event.data.channel !== channel ||
        event.data.component !== component
      ) {
        return;
      }
      switch (event.data.type) {
        case 'ready':
          setReady(true);
          setRuntimeError(false);
          sync();
          break;
        case 'stateChanged':
          if (
            onStateChanged !== undefined &&
            typeof event.data.payload === 'object' &&
            event.data.payload !== null &&
            typeof event.data.payload.args === 'object' &&
            event.data.payload.args !== null &&
            !Array.isArray(event.data.payload.args)
          ) {
            onStateChanged(event.data.payload.args as DemoArgs);
          }
          break;
        case 'error':
          setRuntimeError(true);
          break;
      }
    }
    window.addEventListener('message', onMessage);
    const themeObserver = new MutationObserver(sync);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
      attributes: true,
    });
    if (ready) sync();
    return () => {
      window.removeEventListener('message', onMessage);
      themeObserver.disconnect();
    };
  }, [args, component, onStateChanged, ready]);

  const loadingLabel = {
    en: 'Loading the Flutter preview',
    ja: 'Flutter プレビューを読み込んでいます',
    ko: 'Flutter 미리보기를 불러오는 중이에요',
  }[locale];
  const errorLabel = {
    en: 'The Flutter preview reported an error. Reload the page to try again.',
    ja: 'Flutter プレビューでエラーが発生しました。ページを再読み込みしてください。',
    ko: 'Flutter 미리보기에서 오류가 발생했어요. 페이지를 새로고침해 주세요.',
  }[locale];

  return (
    <div
      className={`relative h-full w-full min-w-0 bg-tinyrack-surface ${
        component === 'app-shell' ? 'min-h-[22.5rem]' : 'min-h-64'
      }`}
      ref={containerRef}
      {...{ [containerAttr]: component }}
    >
      {!ready ? (
        <div
          aria-live="polite"
          className="absolute inset-0 grid place-items-center text-tinyrack-sm text-tinyrack-text-muted"
        >
          {loadingLabel}
        </div>
      ) : null}
      {runtimeError ? (
        <div
          className="absolute inset-0 grid place-items-center bg-tinyrack-surface px-6 text-center text-tinyrack-sm text-tinyrack-danger"
          role="alert"
        >
          {errorLabel}
        </div>
      ) : null}
      {visible ? (
        <iframe
          className={`block h-full w-full border-0 bg-transparent ${
            component === 'app-shell' ? 'min-h-[22.5rem]' : 'min-h-64'
          }`}
          loading="lazy"
          ref={iframeRef}
          sandbox="allow-same-origin allow-scripts"
          src={src}
          title={`${component} Flutter ${copy.preview}`}
          {...{ [frameAttr]: '' }}
        />
      ) : null}
    </div>
  );
}

/** Interactive playground preview: streams the current args into the bundle. */
export function FlutterPreview({ args, component }: FlutterPreviewProps) {
  const [, updateArgs] = usePlaygroundArgs();
  const onStateChanged = useCallback(
    (nextArgs: DemoArgs) => {
      const patch = matchingInteractionArgs(component, args, nextArgs);
      if (Object.keys(patch).length > 0) updateArgs(patch);
    },
    [args, component, updateArgs],
  );
  return (
    <FlutterFrame args={args} component={component} onStateChanged={onStateChanged} />
  );
}

/**
 * Static docs example preview: renders a fixed example composition from the
 * bundle. Unlike {@link FlutterPreview} it needs no playground context, so it
 * is safe to render inside a page template or MDX example block.
 */
export function FlutterExample({ component, example }: FlutterExampleProps) {
  return <FlutterFrame component={component} example={example} variant="example" />;
}
