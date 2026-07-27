import {
  docsHighlighter,
  docsHighlightLanguages,
} from 'virtual:tinyrack-docs/highlighter';
import { docsManifest } from 'virtual:tinyrack-docs/manifest';
import { MDXProvider } from '@mdx-js/react';
import type { TRCodeHighlightFailure } from '@tinyrack/ui/components/code-block';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import {
  createTinyrackColorSchemeScript,
  resolveTinyrackColorScheme,
  TRColorSchemeProvider,
} from '@tinyrack/ui/providers/color-scheme';
import { TRCodeHighlighterProvider } from '@tinyrack/ui/providers/highlighter';
import { type ReactNode, useEffect } from 'react';
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  useLocation,
} from 'react-router';
import { DocsCallout } from './docs-callout.tsx';
import { DocsMdxWrapper } from './docs-mdx-wrapper.tsx';
import { TRDocsSiteShell } from './docs-site-shell.tsx';
import { createDocumentMeta, docsAssetPath, findDocsPage } from './document-seo.ts';
import { getFontPreloadLinks } from './font-preloads.ts';

const defaultTheme = resolveTinyrackColorScheme(docsManifest.theme.default, false);
const themeScript = createTinyrackColorSchemeScript({
  defaultPreference: docsManifest.theme.default,
});

function documentTheme() {
  if (typeof document === 'undefined') return defaultTheme;
  const theme = document.documentElement.dataset['theme'];
  return theme === 'tinyrack-light' || theme === 'tinyrack-dark' ? theme : defaultTheme;
}

const docsMdxComponents = createTinyrackMdxComponents({
  components: { DocsCallout, wrapper: DocsMdxWrapper },
});

const reportedLanguages = new Set<string>();

function reportHighlightFailure({ error, language, reason }: TRCodeHighlightFailure) {
  if (reportedLanguages.has(`${reason}:${language}`)) return;
  reportedLanguages.add(`${reason}:${language}`);

  if (reason === 'unsupported-language') {
    console.warn(
      `[tinyrack-docs] No grammar for "${language}", so the code block renders as plain text. Add it to \`highlight.languages\` in docs.config.ts. Enabled: ${docsHighlightLanguages.join(', ')}`,
    );
    return;
  }

  console.error(
    `[tinyrack-docs] Highlighting "${language}" failed (${reason}).`,
    error,
  );
}

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
    <html data-theme={documentTheme()} lang={language} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        {getFontPreloadLinks(language).map((link) => (
          <link {...link} key={link.href} />
        ))}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Authored bootstrap prevents a theme flash before hydration. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* TRAppShell owns scroll restoration in both page scroll postures, so
            React Router's <ScrollRestoration /> would be a second owner of the
            same policy and race it on POP. */}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function TRDocsApp() {
  return (
    <TRColorSchemeProvider defaultPreference={docsManifest.theme.default}>
      <TRCodeHighlighterProvider
        highlighter={docsHighlighter}
        onHighlightFailure={reportHighlightFailure}
      >
        <MDXProvider components={docsMdxComponents}>
          <HydrationMarker />
          <TRDocsSiteShell>
            <Outlet />
          </TRDocsSiteShell>
        </MDXProvider>
      </TRCodeHighlighterProvider>
    </TRColorSchemeProvider>
  );
}
