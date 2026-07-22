import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function JapaneseHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack UI',
        description:
          '基礎部分を作り直すことなく、コンパクトな運用インターフェースを構築できます。',
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
