'use client';

import { TRButton } from '@tinyrack/ui/components/button';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRSlider } from '@tinyrack/ui/components/slider';
import { TRDirectionProvider, useDirection } from '@tinyrack/ui/providers/direction';
import { useState } from 'react';
import { useDemoLocale } from '../shared/demo-locale.js';

type Direction = 'ltr' | 'rtl';

const copy = {
  en: {
    context: 'Provider direction',
    directionControls: 'Text direction',
    language: 'Language',
    ltr: 'Left to right',
    rtl: 'Right to left',
    slider: 'Deployment priority',
  },
  ja: {
    context: 'プロバイダーの方向',
    directionControls: 'テキストの方向',
    language: '言語',
    ltr: '左から右',
    rtl: '右から左',
    slider: 'デプロイの優先度',
  },
  ko: {
    context: '프로바이더 방향',
    directionControls: '텍스트 방향',
    language: '언어',
    ltr: '왼쪽에서 오른쪽',
    rtl: '오른쪽에서 왼쪽',
    slider: '배포 우선순위',
  },
} as const;

const languages = {
  en: 'en',
  ja: 'ja',
  ko: 'ko',
} as const;

function DirectionValue({ label }: { label: string }) {
  const direction = useDirection();
  return (
    <output className="text-tinyrack-sm" data-direction-value="">
      {label}: <bdi>{direction}</bdi>
    </output>
  );
}

export function TextDirectionDemo() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const language = languages[locale];
  const [direction, setDirection] = useState<Direction>('ltr');

  return (
    <section
      className="grid w-full max-w-lg gap-5 rounded-tinyrack-md border border-tinyrack-border p-5"
      data-docs-example-item=""
      data-direction-scope=""
      dir={direction}
      lang={language}
    >
      <TRDirectionProvider direction={direction}>
        <TRFieldset.Root>
          <TRFieldset.Legend>{text.directionControls}</TRFieldset.Legend>
          <div className="flex flex-wrap gap-2">
            <TRButton
              appearance={direction === 'ltr' ? 'solid' : 'outline'}
              aria-pressed={direction === 'ltr'}
              onClick={() => setDirection('ltr')}
              type="button"
            >
              {text.ltr}
            </TRButton>
            <TRButton
              appearance={direction === 'rtl' ? 'solid' : 'outline'}
              aria-pressed={direction === 'rtl'}
              onClick={() => setDirection('rtl')}
              type="button"
            >
              {text.rtl}
            </TRButton>
          </div>
        </TRFieldset.Root>

        <TRSlider.Root defaultValue={[40]} name="deployment-priority">
          <TRSlider.Label>{text.slider}</TRSlider.Label>
          <TRSlider.Value />
          <TRSlider.Control>
            <TRSlider.Track>
              <TRSlider.Indicator />
            </TRSlider.Track>
            <TRSlider.Thumb aria-label={text.slider} />
          </TRSlider.Control>
        </TRSlider.Root>

        <div className="grid gap-1 text-tinyrack-sm">
          <span>
            {text.language}: <bdi>{language}</bdi>
          </span>
          <DirectionValue label={text.context} />
        </div>
      </TRDirectionProvider>
    </section>
  );
}

export const textDirectionDocumentSource = `import type { ReactNode } from 'react';
import {
  TRDirectionProvider,
  type TextDirection,
} from '@tinyrack/ui/providers/direction';

export function DirectionDocument({
  children,
  direction,
  language,
}: {
  children: ReactNode;
  direction: TextDirection;
  language: string;
}) {
  return (
    <html dir={direction} lang={language}>
      <body>
        <TRDirectionProvider direction={direction}>
          {children}
        </TRDirectionProvider>
      </body>
    </html>
  );
}`;

export const textDirectionCompositionSource = `import { useState } from 'react';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/fieldset.css';
import '@tinyrack/ui/components/slider.css';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import { TRSlider } from '@tinyrack/ui/components/slider';
import {
  TRDirectionProvider,
  useDirection,
  type TextDirection,
} from '@tinyrack/ui/providers/direction';

function DirectionValue() {
  const direction = useDirection();
  return <output>Provider direction: {direction}</output>;
}

export function DirectionPreview({ language }: { language: string }) {
  const [direction, setDirection] = useState<TextDirection>('ltr');

  return (
    <section dir={direction} lang={language}>
      <TRDirectionProvider direction={direction}>
        <TRFieldset.Root>
          <TRFieldset.Legend>Text direction</TRFieldset.Legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <TRButton
              appearance={direction === 'ltr' ? 'solid' : 'outline'}
              aria-pressed={direction === 'ltr'}
              onClick={() => setDirection('ltr')}
              type="button"
            >
              Left to right
            </TRButton>
            <TRButton
              appearance={direction === 'rtl' ? 'solid' : 'outline'}
              aria-pressed={direction === 'rtl'}
              onClick={() => setDirection('rtl')}
              type="button"
            >
              Right to left
            </TRButton>
          </div>
        </TRFieldset.Root>

        <TRSlider.Root defaultValue={[40]} name="deployment-priority">
          <TRSlider.Label>Deployment priority</TRSlider.Label>
          <TRSlider.Value />
          <TRSlider.Control>
            <TRSlider.Track><TRSlider.Indicator /></TRSlider.Track>
            <TRSlider.Thumb aria-label="Deployment priority" />
          </TRSlider.Control>
        </TRSlider.Root>

        <div>
          <span>Language: {language}</span>
          <DirectionValue />
        </div>
      </TRDirectionProvider>
    </section>
  );
}`;

export const textDirectionDemoSource = textDirectionCompositionSource;
