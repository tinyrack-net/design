import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function KoreanHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack Design System',
        description: '대시보드와 사내 도구를 위한 접근성 높은 React UI예요.',
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
