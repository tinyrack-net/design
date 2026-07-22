import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function JapaneseHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack Design System',
        description: 'ダッシュボードや社内ツール向けの、アクセシブルな React UI です。',
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
