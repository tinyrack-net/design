import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { Button } from '../../src/components/button/react.js';
import { tinyrackMotion } from '../../src/core/index.js';
import './motion-demo.css';

const durationExamples = [
  {
    name: 'fast',
    use: 'Feedback attached to a press',
    value: tinyrackMotion.duration.fast,
  },
  {
    name: 'normal',
    use: 'Menus, tooltips, and anchored layers',
    value: tinyrackMotion.duration.normal,
  },
  {
    name: 'slow',
    use: 'Modal entry and task-context changes',
    value: tinyrackMotion.duration.slow,
  },
] as const;

const easingExamples = [
  {
    name: 'standard',
    use: 'Two-way state changes',
    value: tinyrackMotion.easing.standard,
  },
  {
    name: 'easeOut',
    use: 'Content entering the interface',
    value: tinyrackMotion.easing.easeOut,
  },
  {
    name: 'linear',
    use: 'Repeating progress only',
    value: tinyrackMotion.easing.linear,
  },
] as const;

function useReplay() {
  const [active, setActive] = useState(false);
  const [run, setRun] = useState(0);
  const firstFrame = useRef<number | null>(null);
  const secondFrame = useRef<number | null>(null);

  const replay = () => {
    if (firstFrame.current !== null) {
      cancelAnimationFrame(firstFrame.current);
    }
    if (secondFrame.current !== null) {
      cancelAnimationFrame(secondFrame.current);
    }
    setActive(false);
    setRun((currentRun) => currentRun + 1);
    firstFrame.current = requestAnimationFrame(() => {
      secondFrame.current = requestAnimationFrame(() => setActive(true));
    });
  };

  useEffect(
    () => () => {
      if (firstFrame.current !== null) {
        cancelAnimationFrame(firstFrame.current);
      }
      if (secondFrame.current !== null) {
        cancelAnimationFrame(secondFrame.current);
      }
    },
    [],
  );

  return { active, replay, run };
}

function MotionTrack({
  active,
  duration,
  easing,
}: {
  active: boolean;
  duration: string;
  easing: string;
}) {
  return (
    <div
      className="grid gap-1"
      data-motion-active={active ? 'true' : 'false'}
      style={
        {
          '--tr-motion-demo-duration': duration,
          '--tr-motion-demo-easing': easing,
        } as CSSProperties
      }
    >
      <div className="flex justify-between text-tinyrack-xs text-tinyrack-text-muted">
        <span>start</span>
        <span>finish</span>
      </div>
      <div
        aria-hidden="true"
        className="h-3 overflow-hidden rounded-tinyrack-full bg-tinyrack-surface-muted"
      >
        <div className="tr-motion-demo-fill h-full rounded-tinyrack-full bg-tinyrack-primary" />
      </div>
    </div>
  );
}

export function MotionDurationComparison() {
  const { active, replay, run } = useReplay();

  return (
    <section
      className="grid gap-tinyrack-lg border border-tinyrack-border p-tinyrack-lg"
      data-motion-duration-comparison
      data-motion-run={run}
    >
      <header className="flex flex-wrap items-start justify-between gap-tinyrack-md">
        <div className="grid max-w-2xl gap-1">
          <h3 className="m-0 text-tinyrack-lg font-semibold leading-tinyrack-sm">
            One change, three response speeds
          </h3>
          <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
            Motion runs only after you choose Replay. The tracks use production
            durations, not a slowed-down illustration.
          </p>
        </div>
        <Button onClick={replay} variant="primary">
          Replay durations
        </Button>
      </header>

      <ul
        aria-label="Motion duration comparison"
        className="m-0 grid list-none gap-tinyrack-sm p-0"
      >
        {durationExamples.map(({ name, use, value }) => (
          <li
            className="grid gap-tinyrack-sm border-t border-tinyrack-border pt-tinyrack-sm md:grid-cols-[12rem_minmax(0,1fr)] md:items-center"
            key={name}
          >
            <div className="grid gap-1">
              <div className="flex items-baseline gap-2">
                <strong>{name}</strong>
                <code>{value}</code>
              </div>
              <span className="text-tinyrack-sm text-tinyrack-text-muted">{use}</span>
            </div>
            <MotionTrack
              active={active}
              duration={value}
              easing={tinyrackMotion.easing.easeOut}
            />
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        {run === 0 ? 'Duration comparison ready.' : `Duration replay ${run} started.`}
      </p>
    </section>
  );
}

export function MotionEasingComparison() {
  const { active, replay, run } = useReplay();

  return (
    <section
      className="grid gap-tinyrack-lg border border-tinyrack-border p-tinyrack-lg"
      data-motion-easing-comparison
      data-motion-run={run}
    >
      <header className="flex flex-wrap items-start justify-between gap-tinyrack-md">
        <div className="grid max-w-2xl gap-1">
          <h3 className="m-0 text-tinyrack-lg font-semibold leading-tinyrack-sm">
            Same duration, different rhythm
          </h3>
          <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
            This study view uses 480ms so the easing curves are easy to compare. Product
            components still use the duration tokens above, and nothing plays until you
            choose Replay.
          </p>
        </div>
        <Button onClick={replay}>Replay easing</Button>
      </header>

      <ul
        aria-label="Motion easing comparison"
        className="m-0 grid list-none gap-tinyrack-sm p-0"
      >
        {easingExamples.map(({ name, use, value }) => (
          <li
            className="grid gap-tinyrack-sm border-t border-tinyrack-border pt-tinyrack-sm md:grid-cols-[12rem_minmax(0,1fr)] md:items-center"
            key={name}
          >
            <div className="grid gap-1">
              <div className="flex items-baseline gap-2">
                <strong>{name}</strong>
                <code>{value}</code>
              </div>
              <span className="text-tinyrack-sm text-tinyrack-text-muted">{use}</span>
            </div>
            <MotionTrack active={active} duration="480ms" easing={value} />
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        {run === 0 ? 'Easing comparison ready.' : `Easing replay ${run} started.`}
      </p>
    </section>
  );
}

export function FastFeedbackExample() {
  const [online, setOnline] = useState(false);

  return (
    <div className="grid gap-tinyrack-md" data-motion-fast-feedback>
      <div
        className="flex items-center justify-between gap-tinyrack-sm rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-surface-muted p-tinyrack-md"
        style={{
          transition: `background-color ${tinyrackMotion.duration.fast} ${tinyrackMotion.easing.standard}`,
        }}
      >
        <span>rack-a</span>
        <strong>{online ? 'online' : 'paused'}</strong>
      </div>
      <Button aria-pressed={online} onClick={() => setOnline((current) => !current)}>
        Toggle rack state
      </Button>
    </div>
  );
}

export function ReducedMotionPreview() {
  const [mode, setMode] = useState<'system' | 'reduce'>('system');
  const { active, replay, run } = useReplay();

  const selectMode = (nextMode: 'system' | 'reduce') => {
    setMode(nextMode);
    replay();
  };

  return (
    <section
      className="grid gap-tinyrack-lg border border-tinyrack-border p-tinyrack-lg"
      data-motion-active={active ? 'true' : 'false'}
      data-motion-preview-mode={mode}
      data-motion-reduced-preview
      data-motion-run={run}
    >
      <header className="flex flex-wrap items-start justify-between gap-tinyrack-md">
        <div className="grid max-w-2xl gap-1">
          <h3 className="m-0 text-tinyrack-lg font-semibold leading-tinyrack-sm">
            Remove travel, preserve the state change
          </h3>
          <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
            System mode follows prefers-reduced-motion. Reduced preview removes
            decorative movement while keeping the result visible.
          </p>
        </div>
        <fieldset className="m-0 flex flex-wrap gap-tinyrack-sm border-0 p-0">
          <legend className="sr-only">Motion preview mode</legend>
          <Button
            appearance={mode === 'system' ? 'solid' : 'outline'}
            aria-pressed={mode === 'system'}
            onClick={() => selectMode('system')}
          >
            System motion
          </Button>
          <Button
            appearance={mode === 'reduce' ? 'solid' : 'outline'}
            aria-pressed={mode === 'reduce'}
            onClick={() => selectMode('reduce')}
          >
            Reduced preview
          </Button>
          <Button onClick={replay} variant="primary">
            Replay state change
          </Button>
        </fieldset>
      </header>

      <div className="min-h-28 overflow-hidden rounded-tinyrack-lg bg-tinyrack-surface-muted p-tinyrack-lg">
        <div className="tr-motion-reduced-preview-panel grid gap-1 rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-surface-raised p-tinyrack-lg">
          <strong>Deployment complete</strong>
          <span className="text-tinyrack-sm text-tinyrack-text-muted">
            The result remains clear even when decorative travel is removed.
          </span>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {run === 0
          ? 'Reduced motion preview ready.'
          : `${mode} motion replay ${run} started.`}
      </p>
    </section>
  );
}
