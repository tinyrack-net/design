'use client';

import { TRButton } from '@tinyrack/ui/components/button';
import { ExternalLinkIcon, RefreshCwIcon } from 'lucide-react';
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  if (
    component === 'checkbox-group' &&
    entries.length === 1 &&
    entries[0]?.[0] === 'selectedValues' &&
    Array.isArray(entries[0][1]) &&
    entries[0][1].every((value) => typeof value === 'string') &&
    Array.isArray(current['selectedValues'])
  ) {
    return { selectedValues: entries[0][1] };
  }
  if (
    component !== 'text-field' ||
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
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
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
  const openLabel = {
    en: 'Open preview in a new window',
    ja: 'プレビューを新しいウィンドウで開く',
    ko: '새 창에서 미리보기 열기',
  }[locale];
  const errorLabel = {
    en: 'The Flutter preview reported an error. Retry the preview.',
    ja: 'Flutter プレビューでエラーが発生しました。再試行してください。',
    ko: 'Flutter 미리보기에서 오류가 발생했어요. 다시 시도해 주세요.',
  }[locale];

  return (
    <div
      className="grid h-full min-h-64 w-full min-w-0 grid-rows-[1fr_auto] bg-tinyrack-surface"
      ref={containerRef}
      {...{ [containerAttr]: component }}
    >
      <div className="relative min-h-64">
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
            className="block h-full min-h-64 w-full border-0 bg-transparent"
            key={attempt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            ref={iframeRef}
            sandbox="allow-same-origin allow-scripts"
            src={src}
            title={`${component} Flutter ${copy.preview}`}
            {...{ [frameAttr]: '' }}
          />
        ) : null}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-tinyrack-border p-2">
        {loaded && (!ready || runtimeError) ? (
          <TRButton
            appearance="ghost"
            aria-label={copy.reset}
            onClick={() => {
              setAttempt((value) => value + 1);
              setLoaded(false);
              setReady(false);
              setRuntimeError(false);
            }}
            uiSize="sm"
          >
            <RefreshCwIcon aria-hidden="true" className="h-4 w-4" />
          </TRButton>
        ) : null}
        <TRButton
          appearance="ghost"
          aria-label={openLabel}
          nativeButton={false}
          render={createElement('a', {
            href: src,
            rel: 'noreferrer',
            target: '_blank',
          })}
          uiSize="sm"
        >
          <ExternalLinkIcon aria-hidden="true" className="h-4 w-4" />
        </TRButton>
      </div>
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
