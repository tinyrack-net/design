'use client';

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { tinyrackMotion } from '../../core/tokens.js';
import { mergeClassNames } from '../../internal/component-class-name.js';
import {
  createAnimatedNumberTransitionFormatter,
  interpolateAnimatedNumber,
  normalizeAnimatedNumberDuration,
  serializeNumberFormat,
  type TokenizedAnimatedNumber,
  tokenizeAnimatedNumber,
} from './animated-number-format.js';

export type TRAnimatedNumberAnimation = 'roll' | 'count';
export type TRAnimatedNumberRollDirection = 'auto' | 'up' | 'down';
export type TRAnimatedNumberProps = Omit<ComponentProps<'span'>, 'children'> & {
  animation?: TRAnimatedNumberAnimation;
  duration?: number;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  rollDirection?: TRAnimatedNumberRollDirection;
  value: number;
};

type StaticPresentation = {
  kind: 'static';
  text: string;
};

type CountPresentation = {
  kind: 'count';
  text: string;
};

type RollPresentation = {
  direction: 'up' | 'down';
  id: number;
  kind: 'roll';
  next: TokenizedAnimatedNumber;
  previous: TokenizedAnimatedNumber;
};

type AnimatedNumberPresentation =
  | StaticPresentation
  | CountPresentation
  | RollPresentation;

type AnimatedNumberStyle = CSSProperties & {
  '--tr-animated-number-duration'?: string;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}

function resolvedRollDirection(
  direction: TRAnimatedNumberRollDirection,
  from: number,
  to: number,
): 'up' | 'down' {
  if (direction !== 'auto') return direction;
  return to < from ? 'down' : 'up';
}

function RollVisual({
  onComplete,
  presentation,
}: {
  onComplete: () => void;
  presentation: RollPresentation;
}) {
  const previousTokens = new Map(
    presentation.previous.tokens.map((token) => [token.key, token]),
  );
  const nextTokenKeys = new Set(presentation.next.tokens.map((token) => token.key));
  const hasRemovedTokens = presentation.previous.tokens.some(
    (token) => !nextTokenKeys.has(token.key),
  );

  return (
    <span
      className="tr-animated-number-visual tr-animated-number-roll"
      data-animating="true"
      data-direction={presentation.direction}
      key={presentation.id}
      onAnimationEnd={onComplete}
    >
      {hasRemovedTokens ? (
        <span className="tr-animated-number-removed">
          {presentation.previous.tokens.map((token) => (
            <span
              className={
                nextTokenKeys.has(token.key)
                  ? 'tr-animated-number-placeholder'
                  : 'tr-animated-number-departing'
              }
              key={token.key}
            >
              {token.value}
            </span>
          ))}
        </span>
      ) : null}
      {presentation.next.tokens.map((token) => {
        const previous = previousTokens.get(token.key);
        const changed = previous?.value !== token.value;

        if (token.kind === 'digit' && changed) {
          return (
            <span className="tr-animated-number-slot" key={token.key}>
              {previous?.kind === 'digit' ? (
                <span className="tr-animated-number-outgoing">{previous.value}</span>
              ) : null}
              <span className="tr-animated-number-incoming">{token.value}</span>
            </span>
          );
        }

        return (
          <span
            className={mergeClassNames(
              'tr-animated-number-character',
              previous === undefined ? 'tr-animated-number-entering' : undefined,
            )}
            key={token.key}
          >
            {token.value}
          </span>
        );
      })}
    </span>
  );
}

export function TRAnimatedNumber({
  animation = 'roll',
  className,
  duration,
  format,
  locale,
  rollDirection = 'auto',
  style,
  value,
  ...props
}: TRAnimatedNumberProps) {
  const formatKey = serializeNumberFormat(locale, format);
  // formatKey captures supported Intl option primitives without requiring
  // consumers to memoize the options object.
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable serialized input
  const formatter = useMemo(() => new Intl.NumberFormat(locale, format), [formatKey]);
  const normalizedDuration = normalizeAnimatedNumberDuration(duration);
  const targetText = formatter.format(value);
  const [presentation, setPresentation] = useState<AnimatedNumberPresentation>({
    kind: 'static',
    text: targetText,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationFrameRef = useRef<number | null>(null);
  const currentVisualValueRef = useRef(value);
  const layoutAnimationRef = useRef<Animation | null>(null);
  const previousWidthRef = useRef<number | null>(null);
  const presentationRef = useRef<HTMLSpanElement>(null);
  const previousFormatKeyRef = useRef(formatKey);
  const previousTargetValueRef = useRef(value);
  const transitionIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      layoutAnimationRef.current?.cancel();
    };
  }, []);

  useLayoutEffect(() => {
    // These nodes and the initial static width are structural invariants of the
    // rendered presentation before a roll transition can begin.
    const element = presentationRef.current as HTMLSpanElement;
    const visual = element.firstElementChild as HTMLElement;
    const targetWidth = visual.getBoundingClientRect().width;
    const stableWidth = (element.parentElement as HTMLElement).getBoundingClientRect()
      .width;
    if (
      presentation.kind !== 'roll' ||
      prefersReducedMotion ||
      normalizedDuration === 0
    ) {
      layoutAnimationRef.current?.cancel();
      layoutAnimationRef.current = null;
      // The inline-grid root includes the rendered tracking geometry that the
      // nested visual span omits. Capture the public box so a same-width roll
      // does not snap inward at its 0ms frame.
      previousWidthRef.current = stableWidth;
      return;
    }
    if (presentation.previous.text.length === presentation.next.text.length) {
      layoutAnimationRef.current?.cancel();
      layoutAnimationRef.current = null;
      previousWidthRef.current = targetWidth;
      return;
    }

    const currentWidth =
      layoutAnimationRef.current === null
        ? (previousWidthRef.current as number)
        : element.getBoundingClientRect().width;
    layoutAnimationRef.current?.cancel();
    previousWidthRef.current = targetWidth;
    if (currentWidth === targetWidth) return;
    layoutAnimationRef.current = element.animate(
      [{ width: `${currentWidth}px` }, { width: `${targetWidth}px` }],
      {
        duration: normalizedDuration,
        easing: tinyrackMotion.easing.easeOut,
      },
    );
  }, [normalizedDuration, prefersReducedMotion, presentation]);

  useEffect(() => {
    const cancelActiveAnimation = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    const settle = () => {
      cancelActiveAnimation();
      currentVisualValueRef.current = value;
      setPresentation({ kind: 'static', text: targetText });
    };

    const formatChanged = previousFormatKeyRef.current !== formatKey;
    const previousTarget = previousTargetValueRef.current;
    previousFormatKeyRef.current = formatKey;
    previousTargetValueRef.current = value;

    if (
      formatChanged ||
      prefersReducedMotion ||
      normalizedDuration === 0 ||
      !Number.isFinite(value) ||
      !Number.isFinite(currentVisualValueRef.current)
    ) {
      settle();
      return;
    }

    if (Object.is(previousTarget, value)) return;

    cancelActiveAnimation();
    const from = currentVisualValueRef.current;
    const startedAt = performance.now();
    const transitionFormatter = createAnimatedNumberTransitionFormatter(
      formatter,
      previousTarget,
      value,
    );

    if (animation === 'roll') {
      const previous = tokenizeAnimatedNumber(transitionFormatter, from);
      const next = tokenizeAnimatedNumber(formatter, value);
      if (previous.text === next.text) {
        settle();
        return;
      }
      transitionIdRef.current += 1;
      setPresentation({
        direction: resolvedRollDirection(rollDirection, from, value),
        id: transitionIdRef.current,
        kind: 'roll',
        next,
        previous,
      });
      return;
    }

    const update = () => {
      // Keep the elapsed clock in the same time domain as `startedAt`.
      // Browser automation and background throttling may virtualize rAF's
      // callback timestamp independently from `performance.now()`.
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / normalizedDuration);
      const interpolated = interpolateAnimatedNumber(from, value, progress);
      currentVisualValueRef.current = interpolated;

      // Roll mode returns before scheduling this callback, so this path is
      // exclusively the count animation.
      setPresentation({
        kind: 'count',
        text: transitionFormatter.format(interpolated),
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(update);
        return;
      }

      animationFrameRef.current = null;
      currentVisualValueRef.current = value;
      setPresentation({ kind: 'static', text: targetText });
    };

    animationFrameRef.current = requestAnimationFrame(update);
  }, [
    animation,
    formatKey,
    formatter,
    normalizedDuration,
    prefersReducedMotion,
    rollDirection,
    targetText,
    value,
  ]);

  const componentStyle: AnimatedNumberStyle = { ...style };
  if (duration !== undefined) {
    componentStyle['--tr-animated-number-duration'] = `${normalizedDuration}ms`;
  }

  return (
    <span
      {...props}
      className={mergeClassNames('tr-animated-number', className)}
      data-animation={animation}
      data-roll-direction={rollDirection}
      style={componentStyle}
    >
      <span className="tr-animated-number-accessible">{targetText}</span>
      <span
        aria-hidden="true"
        className="tr-animated-number-presentation"
        ref={presentationRef}
      >
        {presentation.kind === 'roll' ? (
          <RollVisual
            onComplete={() => {
              currentVisualValueRef.current = value;
              setPresentation({ kind: 'static', text: targetText });
            }}
            presentation={presentation}
          />
        ) : (
          <span
            className="tr-animated-number-visual"
            data-animating={presentation.kind === 'count' ? 'true' : undefined}
          >
            {presentation.text}
          </span>
        )}
      </span>
    </span>
  );
}
