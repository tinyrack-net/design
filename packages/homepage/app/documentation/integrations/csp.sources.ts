export const cspNonceSource = `import { randomBytes } from 'node:crypto';
import type { ReactNode } from 'react';
import { TRCSPProvider } from '@tinyrack/ui/providers/csp';

export function createRequestCsp() {
  const nonce = randomBytes(16).toString('base64');

  return {
    nonce,
    header: [
      "default-src 'self'",
      \`style-src-elem 'self' 'nonce-\${nonce}'\`,
      \`script-src 'self' 'nonce-\${nonce}'\`,
    ].join('; '),
  };
}

export function AppProviders({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce: string;
}) {
  return <TRCSPProvider nonce={nonce}>{children}</TRCSPProvider>;
}`;

export const cspDisableStyleElementsSource = `import type { ReactNode } from 'react';
import { TRCSPProvider } from '@tinyrack/ui/providers/csp';

export function AppProviders({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce: string;
}) {
  return (
    <TRCSPProvider disableStyleElements nonce={nonce}>
      {children}
    </TRCSPProvider>
  );
}`;

export const cspScrollbarSource = `.base-ui-disable-scrollbar {
  scrollbar-width: none;
}

.base-ui-disable-scrollbar::-webkit-scrollbar {
  display: none;
}`;
