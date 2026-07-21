import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function JapaneseHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack UI',
        description:
          '基本を再構築せずに、コンパクトな運用インターフェースを構築します。',
        section: 'start',
        order: 0,
        layout: 'splash',
        navigation: false,
      }}
    >
      <WelcomePage locale="ja" />
    </DocsPage>
  );
}
