'use client';

import { TRButton } from '@tinyrack/ui/components/button';
import { ExternalLinkIcon, RefreshCwIcon } from 'lucide-react';
import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { type DemoArgs, usePlaygroundArgs } from '../../playground/demo.js';
import { demoCopy, useDemoLocale } from '../shared/demo-locale.js';

const channel = 'tinyrack.flutter-preview.v1';

type FlutterPreviewProps = {
  args: DemoArgs;
  component: string;
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
    component !== 'text-field' ||
    entries.length !== 1 ||
    entries[0]?.[0] !== 'value' ||
    typeof entries[0][1] !== 'string'
  ) {
    return {};
  }
  return matchingArgs(current, candidate);
}

export function FlutterPreview({ args, component }: FlutterPreviewProps) {
  const [, updateArgs] = usePlaygroundArgs();
  const locale = useDemoLocale();
  const copy = demoCopy[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const requestIdRef = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [runtimeError, setRuntimeError] = useState(false);
  const [visible, setVisible] = useState(false);
  const src = useMemo(
    () =>
      `/flutter-preview/index.html?component=${encodeURIComponent(
        component,
      )}&locale=${locale}`,
    [component, locale],
  );

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
      post('updateArgs', args);
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
            typeof event.data.payload === 'object' &&
            event.data.payload !== null &&
            typeof event.data.payload.args === 'object' &&
            event.data.payload.args !== null &&
            !Array.isArray(event.data.payload.args)
          ) {
            const patch = matchingInteractionArgs(
              component,
              args,
              event.data.payload.args as DemoArgs,
            );
            if (Object.keys(patch).length > 0) updateArgs(patch);
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
  }, [args, component, ready, updateArgs]);

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
      className="grid min-h-64 min-w-0 grid-rows-[1fr_auto] bg-tinyrack-surface"
      data-flutter-preview={component}
      ref={containerRef}
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
            className="block min-h-64 w-full border-0 bg-transparent"
            data-flutter-preview-frame=""
            key={attempt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            ref={iframeRef}
            sandbox="allow-same-origin allow-scripts"
            src={src}
            title={`${component} Flutter ${copy.preview}`}
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
