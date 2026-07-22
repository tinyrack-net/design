import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function EnglishHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack Design System',
        description: 'Accessible React UI for dashboards and internal tools.',
        section: 'start',
        order: 0,
        layout: 'splash',
        navigation: false,
      }}
    >
      <WelcomePage locale="en" />
    </DocsPage>
  );
}
