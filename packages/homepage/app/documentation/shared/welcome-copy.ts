export type WelcomeLocale = 'en' | 'ja' | 'ko';

type SystemItem = {
  description: string;
  id: 'components' | 'themes' | 'tokens';
  linkLabel: string;
  path: string;
  title: string;
};

type ExploreItem = {
  description: string;
  href: string;
  title: string;
};

export type WelcomeCopy = {
  components: {
    alertAction: string;
    alertDescription: string;
    alertTitle: string;
    badge: string;
    button: string;
    description: string;
    docsLink: string;
    eyebrow: string;
    inputLabel: string;
    inputPlaceholder: string;
    switchLabel: string;
    tabs: {
      controls: string;
      feedback: string;
      label: string;
    };
    title: string;
  };
  explore: {
    description: string;
    eyebrow: string;
    items: readonly ExploreItem[];
    title: string;
  };
  hero: {
    componentCount: (count: number) => string;
    description: string;
    foundations: string;
    installation: string;
    label: string;
    title: readonly [string, string];
  };
  start: {
    buttonLabel: string;
    description: string;
    eyebrow: string;
    guideLink: string;
    installLabel: string;
    title: string;
  };
  system: {
    description: string;
    eyebrow: string;
    items: readonly SystemItem[];
    title: string;
  };
};

export const welcomeCopy = {
  en: {
    hero: {
      componentCount: (count) => `${count} components`,
      description: 'Accessible React UI for dashboards and internal tools.',
      foundations: 'Foundations',
      installation: 'Get started',
      label: 'Tinyrack Design System introduction',
      title: ['TINYRACK', 'DESIGN SYSTEM'],
    },
    system: {
      eyebrow: '01 / System',
      title: 'Move from design rules to product UI.',
      description:
        'Tinyrack connects semantic tokens, light and dark themes, and documented component contracts.',
      items: [
        {
          description:
            'Use shared color, type, spacing, and elevation roles across product surfaces.',
          id: 'tokens',
          linkLabel: 'Explore foundations',
          path: '/foundations/',
          title: 'Semantic tokens',
        },
        {
          description:
            'Keep the same component intent when a surface switches between light and dark.',
          id: 'themes',
          linkLabel: 'View colors and themes',
          path: '/foundations/colors/',
          title: 'Theme-aware UI',
        },
        {
          description:
            'Build on public React APIs with documented states, behavior, and accessibility.',
          id: 'components',
          linkLabel: 'Browse components',
          path: '/components/button/',
          title: 'Component contracts',
        },
      ],
    },
    components: {
      alertAction: 'View details',
      alertDescription: 'All required checks have passed.',
      alertTitle: 'Deployment ready',
      badge: 'Live',
      button: 'Save settings',
      description:
        'Use the same interaction patterns for forms, selection, status, and feedback.',
      docsLink: 'Browse all components',
      eyebrow: '02 / Components',
      inputLabel: 'Environment name',
      inputPlaceholder: 'production',
      switchLabel: 'Enable health monitoring',
      tabs: {
        controls: 'Form controls',
        feedback: 'Status feedback',
        label: 'Component examples',
      },
      title: 'Build familiar product flows.',
    },
    start: {
      buttonLabel: 'Primary button example',
      description:
        'Preview the package and component API here. The installation guide covers Vite, styles, and theme setup.',
      eyebrow: '03 / Start',
      guideLink: 'Follow the installation guide',
      installLabel: 'Package installation command',
      title: 'Start with the complete setup.',
    },
    explore: {
      description: 'Choose the path that matches what you want to build next.',
      eyebrow: '04 / Explore',
      items: [
        {
          description: 'Install Tinyrack UI in an existing React and Vite project.',
          href: '/installation/',
          title: 'Installation',
        },
        {
          description: 'Understand the visual and interaction rules behind the system.',
          href: '/foundations/',
          title: 'Foundations',
        },
        {
          description:
            'Review component APIs, states, examples, and accessibility guidance.',
          href: '/components/button/',
          title: 'Components',
        },
        {
          description: 'Read the source, open an issue, or contribute on GitHub.',
          href: 'https://github.com/tinyrack-net/design',
          title: 'GitHub',
        },
      ],
      title: 'Continue with the right level of detail.',
    },
  },
  ko: {
    hero: {
      componentCount: (count) => `컴포넌트 ${count}개`,
      description: '대시보드와 사내 도구를 위한 접근성 높은 React UI예요.',
      foundations: '파운데이션',
      installation: '시작하기',
      label: 'Tinyrack 디자인 시스템 소개',
      title: ['TINYRACK', '디자인 시스템'],
    },
    system: {
      eyebrow: '01 / 시스템',
      title: '디자인 규칙부터 제품 화면까지 이어서 만드세요.',
      description:
        'Tinyrack은 시맨틱 토큰과 밝은·어두운 테마, 문서화된 컴포넌트 계약을 하나로 연결해요.',
      items: [
        {
          description:
            '색상, 글꼴, 간격, 입체감에 공통 역할을 사용해 제품 화면의 기준을 맞춰요.',
          id: 'tokens',
          linkLabel: '파운데이션 살펴보기',
          path: '/foundations/',
          title: '시맨틱 토큰',
        },
        {
          description:
            '밝은 화면과 어두운 화면을 오가도 컴포넌트의 의미와 상태를 유지해요.',
          id: 'themes',
          linkLabel: '색상과 테마 보기',
          path: '/foundations/colors/',
          title: '테마에 맞게 바뀌는 UI',
        },
        {
          description:
            '상태와 동작, 접근성 기준이 문서화된 공개 React API로 화면을 만들어요.',
          id: 'components',
          linkLabel: '컴포넌트 살펴보기',
          path: '/components/button/',
          title: '컴포넌트 계약',
        },
      ],
    },
    components: {
      alertAction: '세부 정보 보기',
      alertDescription: '필수 검사를 모두 통과했어요.',
      alertTitle: '배포 준비 완료',
      badge: '실시간',
      button: '설정 저장',
      description: '폼, 선택, 상태, 피드백에 같은 상호작용 패턴을 적용할 수 있어요.',
      docsLink: '모든 컴포넌트 보기',
      eyebrow: '02 / 컴포넌트',
      inputLabel: '환경 이름',
      inputPlaceholder: 'production',
      switchLabel: '상태 모니터링 사용',
      tabs: {
        controls: '폼 컨트롤',
        feedback: '상태와 피드백',
        label: '컴포넌트 예시',
      },
      title: '익숙한 제품 흐름을 바로 구성하세요.',
    },
    start: {
      buttonLabel: '기본 버튼 예시',
      description:
        '여기서는 패키지와 컴포넌트 API를 먼저 살펴보세요. Vite, 스타일, 테마 설정은 설치 가이드에서 모두 안내해요.',
      eyebrow: '03 / 시작하기',
      guideLink: '설치 가이드 따라 하기',
      installLabel: '패키지 설치 명령',
      title: '설치 가이드를 따라 시작하세요.',
    },
    explore: {
      description: '다음에 만들 내용에 맞는 문서로 이동하세요.',
      eyebrow: '04 / 더 살펴보기',
      items: [
        {
          description: '기존 React와 Vite 프로젝트에 Tinyrack UI를 설치해요.',
          href: '/installation/',
          title: '설치',
        },
        {
          description: '시스템의 시각 규칙과 상호작용 기준을 이해해요.',
          href: '/foundations/',
          title: '파운데이션',
        },
        {
          description: '컴포넌트 API와 상태, 예시, 접근성 안내를 확인해요.',
          href: '/components/button/',
          title: '컴포넌트',
        },
        {
          description: '소스 코드를 확인하고 이슈나 기여 내용을 공유해요.',
          href: 'https://github.com/tinyrack-net/design',
          title: 'GitHub',
        },
      ],
      title: '필요한 깊이의 문서로 이어서 살펴보세요.',
    },
  },
  ja: {
    hero: {
      componentCount: (count) => `${count} 個のコンポーネント`,
      description: 'ダッシュボードや社内ツール向けの、アクセシブルな React UI です。',
      foundations: '基礎',
      installation: 'はじめる',
      label: 'Tinyrack デザインシステムの紹介',
      title: ['TINYRACK', 'デザインシステム'],
    },
    system: {
      eyebrow: '01 / システム',
      title: 'デザインルールからプロダクト UI まで一貫して構築できます。',
      description:
        'Tinyrack は、セマンティックトークン、ライト・ダークテーマ、文書化されたコンポーネントの仕様をつなぎます。',
      items: [
        {
          description:
            'カラー、文字、余白、エレベーションに共通の役割を使い、画面全体の基準を揃えます。',
          id: 'tokens',
          linkLabel: '基礎を見る',
          path: '/foundations/',
          title: 'セマンティックトークン',
        },
        {
          description:
            'ライトとダークを切り替えても、コンポーネントの意味と状態を維持します。',
          id: 'themes',
          linkLabel: 'カラーとテーマを見る',
          path: '/foundations/colors/',
          title: 'テーマ対応 UI',
        },
        {
          description:
            '状態、動作、アクセシビリティが文書化された公開 React API を利用できます。',
          id: 'components',
          linkLabel: 'コンポーネントを見る',
          path: '/components/button/',
          title: 'コンポーネントの仕様',
        },
      ],
    },
    components: {
      alertAction: '詳細を見る',
      alertDescription: '必要なチェックはすべて完了しています。',
      alertTitle: 'デプロイの準備ができました',
      badge: 'ライブ',
      button: '設定を保存',
      description:
        'フォーム、選択、ステータス、フィードバックに共通の操作パターンを使えます。',
      docsLink: 'すべてのコンポーネントを見る',
      eyebrow: '02 / コンポーネント',
      inputLabel: '環境名',
      inputPlaceholder: 'production',
      switchLabel: 'ヘルスモニタリングを有効にする',
      tabs: {
        controls: 'フォームコントロール',
        feedback: 'ステータスとフィードバック',
        label: 'コンポーネント例',
      },
      title: '使い慣れたプロダクトフローを構築できます。',
    },
    start: {
      buttonLabel: '主要なボタンの例',
      description:
        'ここではパッケージとコンポーネント API を確認できます。Vite、スタイル、テーマの設定はインストールガイドで説明します。',
      eyebrow: '03 / はじめる',
      guideLink: 'インストールガイドに進む',
      installLabel: 'パッケージのインストールコマンド',
      title: '必要な設定を順番に進めます。',
    },
    explore: {
      description: '次に作りたい内容に合ったドキュメントへ進んでください。',
      eyebrow: '04 / 詳しく見る',
      items: [
        {
          description: '既存の React と Vite プロジェクトに Tinyrack UI を導入します。',
          href: '/installation/',
          title: 'インストール',
        },
        {
          description: 'システムのビジュアルルールと操作の基準を確認します。',
          href: '/foundations/',
          title: '基礎',
        },
        {
          description:
            'コンポーネント API、状態、例、アクセシビリティの説明を確認します。',
          href: '/components/button/',
          title: 'コンポーネント',
        },
        {
          description: 'ソースコードの確認、Issue の作成、開発への参加ができます。',
          href: 'https://github.com/tinyrack-net/design',
          title: 'GitHub',
        },
      ],
      title: '必要な情報へ続けて進めます。',
    },
  },
} satisfies Record<WelcomeLocale, WelcomeCopy>;
