export const WELCOME_MOTION_CYCLE_MS = 48_000;
export const WELCOME_MOTION_SAMPLE_MS = 80;
export const WELCOME_DEPLOYMENT_CYCLE_MS = 24_000;

export type WelcomeDeploymentPhase =
  | 'complete'
  | 'deploying'
  | 'resetting'
  | 'verifying';

export type WelcomeDeploymentDisplayPhase = Exclude<
  WelcomeDeploymentPhase,
  'resetting'
>;

export type WelcomeMotionFrame = {
  activeNodes: number;
  activityIndex: number;
  averageLoad: number;
  deploymentDisplayPhase: WelcomeDeploymentDisplayPhase;
  deploymentOpacity: number;
  deploymentPhase: WelcomeDeploymentPhase;
  deploymentProgress: number;
  serviceValues: readonly [number, number, number];
};

type Harmonic = {
  cycles: number;
  phase: number;
  weight: number;
};

const TAU = Math.PI * 2;
const DEPLOYMENT_FADE_OUT_START_MS = 2_500;
const DEPLOYMENT_RESET_MS = 2_900;
const DEPLOYMENT_FADE_IN_START_MS = 2_980;
const DEPLOYMENT_FADE_IN_END_MS = 3_300;
const DEPLOYMENT_VERIFY_START_MS = 16_500;
const DEPLOYMENT_COMPLETE_START_MS = 21_000;
const ACTIVITY_TIMES_MS = [3_600, 10_900, 19_800, 29_400, 40_600] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function cycleElapsed(elapsedMs: number, cycleMs: number) {
  return ((elapsedMs % cycleMs) + cycleMs) % cycleMs;
}

function smoothstep(value: number) {
  const clamped = clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * smoothstep(progress);
}

function sampleSignal(
  elapsedMs: number,
  minimum: number,
  maximum: number,
  harmonics: readonly Harmonic[],
) {
  const cycleProgress =
    cycleElapsed(elapsedMs, WELCOME_MOTION_CYCLE_MS) / WELCOME_MOTION_CYCLE_MS;
  const totalWeight = harmonics.reduce(
    (sum, harmonic) => sum + Math.abs(harmonic.weight),
    0,
  );
  const signal = harmonics.reduce(
    (sum, harmonic) =>
      sum +
      Math.sin(TAU * (harmonic.cycles * cycleProgress + harmonic.phase)) *
        harmonic.weight,
    0,
  );
  const normalized = totalWeight === 0 ? 0 : signal / totalWeight;
  const midpoint = (minimum + maximum) / 2;
  const amplitude = (maximum - minimum) / 2;

  return Math.round(clamp(midpoint + normalized * amplitude, minimum, maximum));
}

function sampleDeployment(elapsedMs: number) {
  const elapsed = cycleElapsed(elapsedMs, WELCOME_DEPLOYMENT_CYCLE_MS);

  if (elapsed < DEPLOYMENT_FADE_OUT_START_MS) {
    return {
      deploymentDisplayPhase: 'complete' as const,
      deploymentOpacity: 1,
      deploymentPhase: 'complete' as const,
      deploymentProgress: 100,
    };
  }

  if (elapsed < DEPLOYMENT_RESET_MS) {
    return {
      deploymentDisplayPhase: 'complete' as const,
      deploymentOpacity:
        1 -
        smoothstep(
          (elapsed - DEPLOYMENT_FADE_OUT_START_MS) /
            (DEPLOYMENT_RESET_MS - DEPLOYMENT_FADE_OUT_START_MS),
        ),
      deploymentPhase: 'resetting' as const,
      deploymentProgress: 100,
    };
  }

  if (elapsed < DEPLOYMENT_FADE_IN_START_MS) {
    return {
      deploymentDisplayPhase: 'deploying' as const,
      deploymentOpacity: 0,
      deploymentPhase: 'resetting' as const,
      deploymentProgress: 8,
    };
  }

  if (elapsed < DEPLOYMENT_FADE_IN_END_MS) {
    return {
      deploymentDisplayPhase: 'deploying' as const,
      deploymentOpacity: smoothstep(
        (elapsed - DEPLOYMENT_FADE_IN_START_MS) /
          (DEPLOYMENT_FADE_IN_END_MS - DEPLOYMENT_FADE_IN_START_MS),
      ),
      deploymentPhase: 'resetting' as const,
      deploymentProgress: 8,
    };
  }

  if (elapsed < DEPLOYMENT_VERIFY_START_MS) {
    return {
      deploymentDisplayPhase: 'deploying' as const,
      deploymentOpacity: 1,
      deploymentPhase: 'deploying' as const,
      deploymentProgress: Math.round(
        interpolate(
          8,
          82,
          (elapsed - DEPLOYMENT_FADE_IN_END_MS) /
            (DEPLOYMENT_VERIFY_START_MS - DEPLOYMENT_FADE_IN_END_MS),
        ),
      ),
    };
  }

  if (elapsed < DEPLOYMENT_COMPLETE_START_MS) {
    return {
      deploymentDisplayPhase: 'verifying' as const,
      deploymentOpacity: 1,
      deploymentPhase: 'verifying' as const,
      deploymentProgress: Math.round(
        interpolate(
          82,
          100,
          (elapsed - DEPLOYMENT_VERIFY_START_MS) /
            (DEPLOYMENT_COMPLETE_START_MS - DEPLOYMENT_VERIFY_START_MS),
        ),
      ),
    };
  }

  return {
    deploymentDisplayPhase: 'complete' as const,
    deploymentOpacity: 1,
    deploymentPhase: 'complete' as const,
    deploymentProgress: 100,
  };
}

export const WELCOME_REDUCED_MOTION_FRAME: WelcomeMotionFrame = {
  activeNodes: 12,
  activityIndex: 0,
  averageLoad: 48,
  deploymentDisplayPhase: 'complete',
  deploymentOpacity: 1,
  deploymentPhase: 'complete',
  deploymentProgress: 100,
  serviceValues: [92, 72, 86],
};

export function sampleWelcomeMotion(elapsedMs: number): WelcomeMotionFrame {
  const activityElapsed = cycleElapsed(elapsedMs, WELCOME_MOTION_CYCLE_MS);
  const activityIndex =
    ACTIVITY_TIMES_MS.filter((time) => activityElapsed >= time).length % 5;

  return {
    activeNodes: sampleSignal(elapsedMs, 10, 14, [
      { cycles: 2, phase: 0.08, weight: 0.65 },
      { cycles: 5, phase: 0.41, weight: 0.35 },
    ]),
    activityIndex,
    averageLoad: sampleSignal(elapsedMs, 36, 64, [
      { cycles: 3, phase: 0.17, weight: 0.62 },
      { cycles: 7, phase: 0.63, weight: 0.38 },
    ]),
    ...sampleDeployment(elapsedMs),
    serviceValues: [
      sampleSignal(elapsedMs, 84, 98, [
        { cycles: 4, phase: 0.11, weight: 0.58 },
        { cycles: 9, phase: 0.53, weight: 0.42 },
      ]),
      sampleSignal(elapsedMs, 60, 88, [
        { cycles: 2, phase: 0.46, weight: 0.55 },
        { cycles: 7, phase: 0.13, weight: 0.45 },
      ]),
      sampleSignal(elapsedMs, 74, 94, [
        { cycles: 5, phase: 0.74, weight: 0.6 },
        { cycles: 8, phase: 0.29, weight: 0.4 },
      ]),
    ],
  };
}
