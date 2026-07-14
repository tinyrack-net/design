import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-700.css';
import './styles/fonts.css';
import './styles/app.css';
import { documentSeoManifest } from 'virtual:tinyrack-document-seo';
import { MDXProvider } from '@mdx-js/react';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { SiteShell } from './components/site-shell.js';
import { createDocumentMeta, releaseFeedUrl } from './seo/document-seo.js';

const themeScript = `(() => {
  const saved = localStorage.getItem('tinyrack-theme');
  const theme = saved === 'tinyrack-light' ? saved : 'tinyrack-dark';
  document.documentElement.dataset.theme = theme;
})();`;

function RouteMdxWrapper({ children, className }: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      className={['tr-mdx', className].filter(Boolean).join(' ')}
      data-pagefind-body=""
    >
      {children}
    </article>
  );
}

const homepageMdxComponents = createTinyrackMdxComponents({
  components: { wrapper: RouteMdxWrapper },
});

export const links: LinksFunction = () => [
  { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
  {
    href: releaseFeedUrl,
    rel: 'alternate',
    title: 'Tinyrack UI releases',
    type: 'application/atom+xml',
  },
];

export const meta: MetaFunction = ({ location }) =>
  createDocumentMeta(location.pathname, documentSeoManifest);

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html data-theme="tinyrack-dark" lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: This static, authored bootstrap prevents a theme flash before hydration. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MDXProvider components={homepageMdxComponents}>
      <SiteShell>
        <Outlet />
      </SiteShell>
    </MDXProvider>
  );
}
