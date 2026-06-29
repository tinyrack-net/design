import type { ReactNode } from 'react';
import '../src/showcase/showcase.css';

export type TokenItem = {
  name: string;
  value: string;
  note?: string;
};

export function DocsPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="tinyrack-docs-page">
      <header className="tinyrack-docs-hero">
        <p className="tinyrack-docs-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

export function DocsGrid({ children }: { children: ReactNode }) {
  return <div className="tinyrack-docs-grid">{children}</div>;
}

export function DocsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="tinyrack-docs-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function TokenTable({ items }: { items: TokenItem[] }) {
  return (
    <div className="tinyrack-docs-table">
      {items.map((item) => (
        <div className="tinyrack-docs-row" key={item.name}>
          <strong>{item.name}</strong>
          <code>{item.value}</code>
          {item.note ? <span>{item.note}</span> : null}
        </div>
      ))}
    </div>
  );
}

export function CodeSnippet({ children }: { children: string }) {
  return <pre className="tinyrack-docs-code">{children}</pre>;
}

export function GuidanceList({ items }: { items: string[] }) {
  return (
    <ul className="tinyrack-docs-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
