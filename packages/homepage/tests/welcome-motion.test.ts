import { describe, expect, it } from 'vitest';
import {
  sampleWelcomeMotion,
  WELCOME_DEPLOYMENT_CYCLE_MS,
  WELCOME_MOTION_CYCLE_MS,
  WELCOME_MOTION_SAMPLE_MS,
  WELCOME_REDUCED_MOTION_FRAME,
} from '../app/documentation/shared/welcome-motion.js';

const cycleFrames = Array.from(
  { length: WELCOME_MOTION_CYCLE_MS / WELCOME_MOTION_SAMPLE_MS + 1 },
  (_, index) => sampleWelcomeMotion(index * WELCOME_MOTION_SAMPLE_MS),
);

describe('Welcome live motion sampler', () => {
  it('loops cleanly while keeping every live signal inside its operating range', () => {
    const firstFrame = sampleWelcomeMotion(0);
    const lastSampledFrame = sampleWelcomeMotion(
      WELCOME_MOTION_CYCLE_MS - WELCOME_MOTION_SAMPLE_MS,
    );
    expect(sampleWelcomeMotion(WELCOME_MOTION_CYCLE_MS)).toEqual(firstFrame);
    expect(
      [
        lastSampledFrame.activeNodes - firstFrame.activeNodes,
        lastSampledFrame.averageLoad - firstFrame.averageLoad,
        ...lastSampledFrame.serviceValues.map(
          (value, index) => value - (firstFrame.serviceValues[index] ?? value),
        ),
      ].every((difference) => Math.abs(difference) <= 1),
    ).toBe(true);

    for (const frame of cycleFrames) {
      expect(frame.activeNodes).toBeGreaterThanOrEqual(10);
      expect(frame.activeNodes).toBeLessThanOrEqual(14);
      expect(frame.averageLoad).toBeGreaterThanOrEqual(36);
      expect(frame.averageLoad).toBeLessThanOrEqual(64);
      expect(frame.serviceValues[0]).toBeGreaterThanOrEqual(84);
      expect(frame.serviceValues[0]).toBeLessThanOrEqual(98);
      expect(frame.serviceValues[1]).toBeGreaterThanOrEqual(60);
      expect(frame.serviceValues[1]).toBeLessThanOrEqual(88);
      expect(frame.serviceValues[2]).toBeGreaterThanOrEqual(74);
      expect(frame.serviceValues[2]).toBeLessThanOrEqual(94);
    }

    expect(new Set(cycleFrames.map((frame) => frame.activeNodes))).toEqual(
      new Set([10, 11, 12, 13, 14]),
    );
    expect(Math.min(...cycleFrames.map((frame) => frame.averageLoad))).toBe(36);
    expect(Math.max(...cycleFrames.map((frame) => frame.averageLoad))).toBe(64);
  });

  it('only resets deployment progress while the deployment content is hidden', () => {
    for (
      let cycleStart = 0;
      cycleStart < WELCOME_MOTION_CYCLE_MS;
      cycleStart += WELCOME_DEPLOYMENT_CYCLE_MS
    ) {
      const frames = Array.from(
        {
          length: WELCOME_DEPLOYMENT_CYCLE_MS / WELCOME_MOTION_SAMPLE_MS + 1,
        },
        (_, index) =>
          sampleWelcomeMotion(cycleStart + index * WELCOME_MOTION_SAMPLE_MS),
      );

      for (const [index, frame] of frames.entries()) {
        const previous = frames[index - 1];
        if (!previous || frame.deploymentProgress >= previous.deploymentProgress) {
          continue;
        }
        expect(frame.deploymentPhase).toBe('resetting');
        expect(frame.deploymentOpacity).toBeLessThan(0.2);
      }
    }
  });

  it('changes live values independently instead of replacing one global frame', () => {
    const changeTimelines = Array.from({ length: 5 }, () => [] as number[]);
    let partialChangeFrames = 0;

    for (let index = 1; index < cycleFrames.length; index += 1) {
      const previous = cycleFrames[index - 1];
      const current = cycleFrames[index];
      if (!previous || !current) continue;
      const previousValues = [
        previous.activeNodes,
        previous.averageLoad,
        ...previous.serviceValues,
      ];
      const currentValues = [
        current.activeNodes,
        current.averageLoad,
        ...current.serviceValues,
      ];
      const changed = currentValues.map(
        (value, valueIndex) => value !== previousValues[valueIndex],
      );
      const changeCount = changed.filter(Boolean).length;

      if (changeCount > 0 && changeCount < changed.length) partialChangeFrames += 1;
      changed.forEach((didChange, valueIndex) => {
        if (didChange) changeTimelines[valueIndex]?.push(index);
      });
    }

    expect(partialChangeFrames).toBeGreaterThan(100);
    expect(new Set(changeTimelines.map((timeline) => timeline.join(','))).size).toBe(5);
  });

  it('keeps reduced motion on one stable completed frame', () => {
    expect(WELCOME_REDUCED_MOTION_FRAME).toEqual({
      activeNodes: 12,
      activityIndex: 0,
      averageLoad: 48,
      deploymentDisplayPhase: 'complete',
      deploymentOpacity: 1,
      deploymentPhase: 'complete',
      deploymentProgress: 100,
      serviceValues: [92, 72, 86],
    });
  });
});
