import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import EnglishSample from './mdx-sample.en.mdx';
import JapaneseSample from './mdx-sample.ja.mdx';
import KoreanSample from './mdx-sample.ko.mdx';

export type MdxDemoLocale = 'en' | 'ja' | 'ko';

function ArticleWrapper({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      {...props}
      className={['tr-mdx min-w-0 max-w-full', className].filter(Boolean).join(' ')}
      data-mdx-component-map-preview=""
    >
      {children}
    </article>
  );
}

const articleComponents = createTinyrackMdxComponents({
  components: { wrapper: ArticleWrapper },
});

const samples = {
  en: EnglishSample,
  ja: JapaneseSample,
  ko: KoreanSample,
} satisfies Record<MdxDemoLocale, ElementType>;

export function MdxComponentMapPreview({ locale }: { locale: MdxDemoLocale }) {
  const Sample = samples[locale];

  return <Sample components={articleComponents} />;
}
