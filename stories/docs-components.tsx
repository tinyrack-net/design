import type { ReactNode } from 'react';

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
    <main className="mx-auto grid min-h-screen w-[min(100%,76rem)] box-border content-start items-start gap-3.5 bg-tinyrack-surface px-4 py-5 text-tinyrack-text max-md:p-5">
      <header className="flex max-w-[54rem] flex-col items-start gap-2.5">
        <p className="m-0 text-tinyrack-xs leading-tinyrack-xs font-extrabold tracking-tinyrack-xl text-tinyrack-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="m-0 text-tinyrack-4xl leading-tinyrack-sm text-balance [overflow-wrap:anywhere] max-md:text-tinyrack-3xl">
          {title}
        </h1>
        <p className="m-0 text-tinyrack-md leading-tinyrack-md text-tinyrack-text/70">
          {description}
        </p>
      </header>
      {children}
    </main>
  );
}

export function DocsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))]">
      {children}
    </div>
  );
}

export function DocsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid min-w-0 items-start gap-3 rounded-lg border border-tinyrack-border bg-tinyrack-surface-muted/80 p-3.5 shadow-sm [&_p]:m-0 [&_p]:leading-tinyrack-md [&_p]:text-tinyrack-text/70">
      <h2 className="m-0 text-tinyrack-md font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function DocsSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="grid gap-2.5">
      <h2 className="m-0 text-tinyrack-md">{title}</h2>
      {children}
    </section>
  );
}

export function DocsCallout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <aside className="grid gap-1.5 rounded-lg border border-tinyrack-primary/25 bg-tinyrack-primary/10 p-3">
      <strong className="m-0">{title}</strong>
      <p className="m-0 leading-tinyrack-md text-tinyrack-text/70">{children}</p>
    </aside>
  );
}

export function DocsTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-auto rounded-lg border border-tinyrack-border">
      <table className="w-full min-w-[42rem] border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className="border-b border-tinyrack-border bg-tinyrack-surface-muted/90 px-2.5 py-2 text-left align-top text-tinyrack-xs text-tinyrack-text uppercase"
                key={column}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, index) => {
                const column = columns[index] ?? `Column ${index + 1}`;

                return (
                  <td
                    className="border-b border-tinyrack-border px-2.5 py-2 text-left align-top leading-tinyrack-md text-tinyrack-text/70 last:border-b-0"
                    data-label={column}
                    key={`${column}-${cell}`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TokenTable({ items }: { items: TokenItem[] }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          className="grid min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] p-2 [grid-template-columns:minmax(6rem,0.45fr)_minmax(10rem,1fr)_minmax(0,0.8fr)] max-md:grid-cols-1"
          key={item.name}
        >
          <strong>{item.name}</strong>
          <code className="text-tinyrack-xs text-tinyrack-primary [overflow-wrap:anywhere]">
            {item.value}
          </code>
          {item.note ? (
            <span className="leading-tinyrack-md text-tinyrack-text/70">
              {item.note}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function CodeSnippet({ children }: { children: string }) {
  return (
    <pre className="m-0 overflow-auto whitespace-pre-wrap rounded-md border border-tinyrack-primary/20 bg-tinyrack-surface p-3 font-tinyrack-mono text-tinyrack-sm leading-tinyrack-lg text-tinyrack-text">
      {children}
    </pre>
  );
}

export function GuidanceList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 grid gap-1.5 pl-[1.1rem] leading-tinyrack-md text-tinyrack-text/70">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
