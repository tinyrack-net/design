import { DocsPage } from '@tinyrack/docs/runtime';
import { WelcomePage } from '../../documentation/shared/welcome-page.js';

export default function EnglishHomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Tinyrack UI',
        description:
          'Build compact operational interfaces without rebuilding the basics.',
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
