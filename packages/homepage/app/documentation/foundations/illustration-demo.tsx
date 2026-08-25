import './illustration-demo.css';

type Locale = 'en' | 'ko' | 'ja';

const copy = {
  en: {
    general: 'General vector illustration using the six illustration roles',
    isometric: 'Isometric server with a consistent upper-left light source',
    legend: 'Illustration color roles',
    primary: 'Primary fill',
    secondary: 'Secondary fill',
    tertiary: 'Tertiary fill',
    detail: 'Detail',
    stroke: 'Stroke',
    shadow: 'Shadow',
    front: 'front',
    top: 'top',
    side: 'side',
  },
  ko: {
    general: '여섯 가지 일러스트 역할을 사용한 일반 벡터 일러스트',
    isometric: '왼쪽 위 광원을 일관되게 적용한 아이소매트릭 서버',
    legend: '일러스트레이션 색상 역할',
    primary: '주요 면',
    secondary: '보조 면',
    tertiary: '세 번째 면',
    detail: '디테일',
    stroke: '외곽선',
    shadow: '그림자',
    front: '전면',
    top: '상단',
    side: '측면',
  },
  ja: {
    general: '6 つのイラストレーションロールを使ったベクター例',
    isometric: '左上の光源を一貫して適用したアイソメトリックサーバー',
    legend: 'イラストレーションのカラーロール',
    primary: '主面',
    secondary: '副面',
    tertiary: '第 3 面',
    detail: 'ディテール',
    stroke: '輪郭線',
    shadow: '影',
    front: '前面',
    top: '上面',
    side: '側面',
  },
} as const;

const roles = [
  ['primary', 'bg-tinyrack-illustration-fill-primary'],
  ['secondary', 'bg-tinyrack-illustration-fill-secondary'],
  ['tertiary', 'bg-tinyrack-illustration-fill-tertiary'],
  ['detail', 'bg-tinyrack-illustration-detail'],
  ['stroke', 'bg-tinyrack-illustration-stroke'],
  ['shadow', 'bg-tinyrack-illustration-shadow'],
] as const;

function GeneralIllustration({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <figure className="tr-illustration-demo-card">
      <svg
        aria-label={text.general}
        className="tr-illustration-demo-art"
        role="img"
        viewBox="0 0 320 220"
      >
        <ellipse
          className="fill-tinyrack-illustration-shadow"
          cx="160"
          cy="188"
          rx="112"
          ry="18"
        />
        <path
          className="fill-tinyrack-illustration-fill-secondary stroke-tinyrack-illustration-stroke"
          d="M70 70 Q160 22 250 70 L230 162 Q160 196 90 162 Z"
          strokeWidth="2"
        />
        <path
          className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
          d="M92 76 Q160 42 228 76 L216 148 Q160 174 104 148 Z"
          strokeWidth="2"
        />
        <path
          className="fill-tinyrack-illustration-fill-tertiary stroke-tinyrack-illustration-stroke"
          d="M160 42 Q208 50 228 76 L216 148 Q188 166 160 174 Z"
          strokeWidth="2"
        />
        <circle className="fill-tinyrack-illustration-detail" cx="132" cy="104" r="8" />
        <circle className="fill-tinyrack-success-foreground" cx="132" cy="132" r="8" />
        <path
          className="stroke-tinyrack-illustration-stroke"
          d="M155 104 H198 M155 132 H190"
          fill="none"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
      <figcaption>{text.general}</figcaption>
    </figure>
  );
}

function IsometricIllustration({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <figure className="tr-illustration-demo-card">
      <svg
        aria-label={text.isometric}
        className="tr-illustration-demo-art"
        role="img"
        viewBox="0 0 320 220"
      >
        <path
          className="fill-tinyrack-illustration-shadow"
          d="M64 166 L166 112 L264 166 L164 216 Z"
        />
        <path
          className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
          d="M64 82 L164 132 V190 L64 140 Z"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="fill-tinyrack-illustration-fill-secondary stroke-tinyrack-illustration-stroke"
          d="M64 82 L164 32 L264 82 L164 132 Z"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="fill-tinyrack-illustration-fill-tertiary stroke-tinyrack-illustration-stroke"
          d="M164 132 L264 82 V140 L164 190 Z"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-illustration-stroke"
          d="M82 112 L142 142 M82 126 L142 156"
          fill="none"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle className="fill-tinyrack-success-foreground" cx="148" cy="165" r="6" />
      </svg>
      <figcaption>
        {text.isometric}: {text.front} / {text.top} / {text.side}
      </figcaption>
    </figure>
  );
}

export function IllustrationExamples({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <section className="tr-illustration-demo" data-illustration-foundation>
      <div className="tr-illustration-demo-grid">
        <GeneralIllustration locale={locale} />
        <IsometricIllustration locale={locale} />
      </div>
      <ul aria-label={text.legend} className="tr-illustration-demo-legend">
        {roles.map(([role, className]) => (
          <li key={role}>
            <span
              aria-hidden="true"
              className={`tr-illustration-demo-swatch ${className}`}
            />
            {text[role]}
          </li>
        ))}
      </ul>
    </section>
  );
}
