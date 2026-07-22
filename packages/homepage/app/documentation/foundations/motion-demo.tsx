import { TRButton } from '@tinyrack/ui/components/button';
import { TRCode } from '@tinyrack/ui/components/code';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { tinyrackMotion } from '@tinyrack/ui/core';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import './motion-demo.css';

type Locale = 'en' | 'ko' | 'ja';

const copy = {
  en: {
    start: 'start',
    finish: 'finish',
    durationTitle: 'One change, three response speeds',
    durationBody: 'These tracks use production durations and play only after Replay.',
    replayDuration: 'Replay durations',
    durationLabel: 'Motion duration comparison',
    durationReady: 'Duration comparison ready.',
    durationRun: 'Duration replay started.',
    easingTitle: 'Same duration, different rhythm',
    easingBody:
      'This study uses 480ms to expose each curve; product components use the duration tokens.',
    replayEasing: 'Replay easing',
    easingLabel: 'Motion easing comparison',
    easingReady: 'Easing comparison ready.',
    easingRun: 'Easing replay started.',
    fast: [
      'Feedback attached to a press',
      'Menus, tooltips, and anchored layers',
      'Task-context changes',
    ],
    ease: [
      'Two-way state changes',
      'Content entering the interface',
      'Repeating progress only',
    ],
    online: 'online',
    paused: 'paused',
    toggle: 'Toggle rack state',
    reducedTitle: 'Remove travel, preserve the state change',
    reducedBody:
      'System follows prefers-reduced-motion. Reduced preview removes decorative travel while preserving the result.',
    modeLabel: 'Motion preview mode',
    system: 'System motion',
    reduced: 'Reduced preview',
    replayState: 'Replay state change',
    complete: 'Deployment complete',
    completeBody: 'The result stays clear when decorative travel is removed.',
    reducedReady: 'Reduced motion preview ready.',
    reducedRun: 'Motion preview replay started.',
  },
  ko: {
    start: '시작',
    finish: '완료',
    durationTitle: '하나의 변화, 세 가지 반응 속도',
    durationBody: '실제 제품 지속 시간을 사용하며 재생을 선택한 뒤에만 움직여요.',
    replayDuration: '지속 시간 재생',
    durationLabel: '모션 지속 시간 비교',
    durationReady: '지속 시간 비교를 재생할 준비가 됐어요.',
    durationRun: '지속 시간 재생을 시작했어요.',
    easingTitle: '같은 시간, 다른 리듬',
    easingBody:
      '곡선을 비교하기 위해 480ms를 사용해요. 제품 컴포넌트는 지속 시간 토큰을 사용해요.',
    replayEasing: '이징 재생',
    easingLabel: '모션 이징 비교',
    easingReady: '이징 비교를 재생할 준비가 됐어요.',
    easingRun: '이징 비교 재생을 시작했어요.',
    fast: [
      '누름에 연결된 피드백',
      '메뉴, 툴팁, 기준점이 있는 레이어',
      '작업 맥락 변화',
    ],
    ease: ['양방향 상태 변화', '인터페이스에 들어오는 콘텐츠', '반복 진행 상태만'],
    online: '온라인',
    paused: '일시 중지',
    toggle: '랙 상태 전환',
    reducedTitle: '이동은 줄이고 상태 변화는 유지',
    reducedBody:
      '시스템의 모션 줄이기 설정을 따라요. 모션 줄이기 미리보기는 결과를 유지하면서 장식 이동을 제거해요.',
    modeLabel: '모션 미리보기 모드',
    system: '시스템 모션',
    reduced: '모션 줄이기 미리보기',
    replayState: '상태 변화 재생',
    complete: '배포 완료',
    completeBody: '장식 이동을 제거해도 결과는 분명하게 남아요.',
    reducedReady: '모션 줄이기 미리보기를 재생할 준비가 됐어요.',
    reducedRun: '모션 줄이기 미리보기 재생을 시작했어요.',
  },
  ja: {
    start: '開始',
    finish: '完了',
    durationTitle: '1 つの変化、3 つの反応速度',
    durationBody:
      '実際のプロダクトで使う持続時間を使用し、「再生」を選んだ後だけ動きます。',
    replayDuration: '持続時間を再生',
    durationLabel: 'モーション持続時間の比較',
    durationReady: '持続時間の比較を再生できます。',
    durationRun: '持続時間の再生を開始しました。',
    easingTitle: '同じ時間、異なるリズム',
    easingBody:
      '曲線を比較しやすくするため、ここでは 480 ms を使います。実際のプロダクトコンポーネントでは、持続時間トークンを使います。',
    replayEasing: 'イージングを再生',
    easingLabel: 'モーションイージングの比較',
    easingReady: 'イージングの比較を再生できます。',
    easingRun: 'イージングの再生を開始しました。',
    fast: [
      '押下に結び付くフィードバック',
      'メニュー、ツールチップ、アンカー付きレイヤー',
      'タスクの文脈の変化',
    ],
    ease: ['双方向の状態変化', '画面に表示されるコンテンツ', '反復する進捗のみ'],
    online: 'オンライン',
    paused: '一時停止',
    toggle: 'ラックの状態を切り替える',
    reducedTitle: '動きを抑え、状態変化を保つ',
    reducedBody:
      'システム設定は prefers-reduced-motion に従います。モーション軽減プレビューでは、結果を保ちながら装飾的な動きを取り除きます。',
    modeLabel: 'モーションプレビューモード',
    system: 'システム設定に従う',
    reduced: 'モーション軽減プレビュー',
    replayState: '状態変化を再生',
    complete: 'デプロイ完了',
    completeBody: '装飾的な動きを取り除いても、結果を確認できます。',
    reducedReady: 'モーション軽減プレビューを再生できます。',
    reducedRun: 'モーションプレビューの再生を開始しました。',
  },
} as const;

function useReplay() {
  const [active, setActive] = useState(false);
  const [run, setRun] = useState(0);
  const frames = useRef<number[]>([]);
  const replay = () => {
    frames.current.forEach(cancelAnimationFrame);
    setActive(false);
    setRun((value) => value + 1);
    frames.current = [
      requestAnimationFrame(() => {
        frames.current.push(requestAnimationFrame(() => setActive(true)));
      }),
    ];
  };
  useEffect(() => () => frames.current.forEach(cancelAnimationFrame), []);
  return { active, replay, run };
}

function MotionTrack({
  active,
  duration,
  easing,
  locale,
}: {
  active: boolean;
  duration: string;
  easing: string;
  locale: Locale;
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
        <span>{copy[locale].start}</span>
        <span>{copy[locale].finish}</span>
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

export function MotionDurationComparison({ locale }: { locale: Locale }) {
  const { active, replay, run } = useReplay();
  const text = copy[locale];
  const rows = [
    ['fast', text.fast[0], tinyrackMotion.duration.fast],
    ['normal', text.fast[1], tinyrackMotion.duration.normal],
    ['slow', text.fast[2], tinyrackMotion.duration.slow],
  ] as const;
  return (
    <section
      className="grid gap-tinyrack-lg border border-tinyrack-border p-tinyrack-lg"
      data-motion-duration-comparison
      data-motion-run={run}
    >
      <header className="flex flex-wrap items-start justify-between gap-tinyrack-md">
        <div className="grid gap-tinyrack-lg">
          <h3 className="m-0 text-tinyrack-lg font-semibold">{text.durationTitle}</h3>
          <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
            {text.durationBody}
          </p>
        </div>
        <TRButton intent="primary" onClick={replay}>
          {text.replayDuration}
        </TRButton>
      </header>
      <ul
        aria-label={text.durationLabel}
        className="m-0 grid list-none gap-tinyrack-sm p-0"
      >
        {rows.map(([name, use, value]) => (
          <li
            className="grid gap-2 border-t border-tinyrack-border pt-2 md:grid-cols-[12rem_minmax(0,1fr)]"
            key={name}
          >
            <div>
              <strong>{name}</strong> <TRCode>{value}</TRCode>
              <div className="text-tinyrack-sm text-tinyrack-text-muted">{use}</div>
            </div>
            <MotionTrack
              active={active}
              duration={value}
              easing={tinyrackMotion.easing.easeOut}
              locale={locale}
            />
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {run === 0 ? text.durationReady : text.durationRun}
      </p>
    </section>
  );
}

export function MotionEasingComparison({ locale }: { locale: Locale }) {
  const { active, replay, run } = useReplay();
  const text = copy[locale];
  const rows = [
    ['standard', text.ease[0], tinyrackMotion.easing.standard],
    ['easeOut', text.ease[1], tinyrackMotion.easing.easeOut],
    ['linear', text.ease[2], tinyrackMotion.easing.linear],
  ] as const;
  return (
    <section
      className="grid gap-tinyrack-lg border border-tinyrack-border p-tinyrack-lg"
      data-motion-easing-comparison
      data-motion-run={run}
    >
      <header className="flex flex-wrap items-start justify-between gap-tinyrack-md">
        <div className="grid gap-tinyrack-lg">
          <h3 className="m-0 text-tinyrack-lg font-semibold">{text.easingTitle}</h3>
          <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
            {text.easingBody}
          </p>
        </div>
        <TRButton onClick={replay}>{text.replayEasing}</TRButton>
      </header>
      <ul
        aria-label={text.easingLabel}
        className="m-0 grid list-none gap-tinyrack-sm p-0"
      >
        {rows.map(([name, use, value]) => (
          <li
            className="grid gap-2 border-t border-tinyrack-border pt-2 md:grid-cols-[12rem_minmax(0,1fr)]"
            key={name}
          >
            <div>
              <strong>{name}</strong> <TRCode>{value}</TRCode>
              <div className="text-tinyrack-sm text-tinyrack-text-muted">{use}</div>
            </div>
            <MotionTrack
              active={active}
              duration="480ms"
              easing={value}
              locale={locale}
            />
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {run === 0 ? text.easingReady : text.easingRun}
      </p>
    </section>
  );
}

export function FastFeedbackExample({ locale }: { locale: Locale }) {
  const [online, setOnline] = useState(false);
  const text = copy[locale];
  return (
    <div className="grid gap-tinyrack-md" data-motion-fast-feedback>
      <div
        className={`flex items-center justify-between gap-2 rounded-tinyrack-md border border-tinyrack-border p-3 ${online ? 'bg-tinyrack-success-surface-subtle' : 'bg-tinyrack-surface-muted'}`}
        style={{
          transition: `background-color ${tinyrackMotion.duration.fast} ${tinyrackMotion.easing.standard}`,
        }}
      >
        <span>rack-a</span>
        <strong>{online ? text.online : text.paused}</strong>
      </div>
      <TRButton aria-pressed={online} onClick={() => setOnline((value) => !value)}>
        {text.toggle}
      </TRButton>
    </div>
  );
}

export function ReducedMotionPreview({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<'system' | 'reduce'>('system');
  const { active, replay, run } = useReplay();
  const text = copy[locale];
  const select = (value: 'system' | 'reduce') => {
    setMode(value);
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
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-tinyrack-lg">
          <h3 className="m-0 text-tinyrack-lg font-semibold">{text.reducedTitle}</h3>
          <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
            {text.reducedBody}
          </p>
        </div>
        <TRFieldset.Root className="m-0 flex flex-wrap gap-2 border-0 p-0">
          <TRFieldset.Legend className="sr-only">{text.modeLabel}</TRFieldset.Legend>
          <TRButton
            appearance={mode === 'system' ? 'solid' : 'outline'}
            aria-pressed={mode === 'system'}
            onClick={() => select('system')}
          >
            {text.system}
          </TRButton>
          <TRButton
            appearance={mode === 'reduce' ? 'solid' : 'outline'}
            aria-pressed={mode === 'reduce'}
            onClick={() => select('reduce')}
          >
            {text.reduced}
          </TRButton>
          <TRButton intent="primary" onClick={replay}>
            {text.replayState}
          </TRButton>
        </TRFieldset.Root>
      </header>
      <div className="min-h-28 overflow-hidden rounded-tinyrack-lg bg-tinyrack-surface-muted p-4">
        <div className="tr-motion-reduced-preview-panel grid gap-1 rounded-tinyrack-md border border-tinyrack-border bg-tinyrack-surface p-4">
          <strong>{text.complete}</strong>
          <span className="text-tinyrack-sm text-tinyrack-text-muted">
            {text.completeBody}
          </span>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {run === 0 ? text.reducedReady : text.reducedRun}
      </p>
    </section>
  );
}
