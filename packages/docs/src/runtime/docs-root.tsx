import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { MDXProvider } from '@mdx-js/react';
import { Callout } from '@tinyrack/ui/components/callout';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import { type ReactNode, useEffect } from 'react';
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import { DocsMdxWrapper } from './docs-mdx-wrapper.tsx';
import { DocsSiteShell } from './docs-site-shell.tsx';
import { createDocumentMeta, docsAssetPath, findDocsPage } from './document-seo.ts';

const defaultTheme = `tinyrack-${docsManifest.theme.default}`;
const themeScript = `(() => {
  const saved = localStorage.getItem('tinyrack-theme');
  const theme = saved === 'tinyrack-light' || saved === 'tinyrack-dark' ? saved : ${JSON.stringify(defaultTheme)};
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === 'tinyrack-dark' ? 'dark' : 'light';
})();`;

const docsMdxComponents = createTinyrackMdxComponents({
  components: { Callout, wrapper: DocsMdxWrapper },
});

function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset['hydrated'] = 'true';
  }, []);
  return null;
}

export const links: LinksFunction = () => [
  {
    href: docsAssetPath(docsManifest.site.favicon, docsManifest),
    rel: 'icon',
    type: 'image/svg+xml',
  },
];

export const meta: MetaFunction = ({ location }) =>
  createDocumentMeta(location.pathname, docsManifest);

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const page = findDocsPage(location.pathname, docsManifest);
  const language =
    docsManifest.locales[page?.locale ?? docsManifest.defaultLocale]?.language ??
    docsManifest.site.locale.language;
  return (
    <html data-theme={defaultTheme} lang={language} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Authored bootstrap prevents a theme flash before hydration. */}
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

export default function DocsApp() {
  return (
    <MDXProvider components={docsMdxComponents}>
      <HydrationMarker />
      <DocsSiteShell>
        <Outlet />
      </DocsSiteShell>
    </MDXProvider>
  );
}
