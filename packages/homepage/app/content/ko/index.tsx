import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function KoreanHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack UI',
        description:
          '기본 기능을 다시 만들지 않고 컴팩트한 운영 인터페이스를 구축하세요.',
        section: 'start',
        order: 0,
        layout: 'splash',
        navigation: false,
      }}
    >
      <WelcomePage locale="ko" />
    </DocsPage>
  );
}
