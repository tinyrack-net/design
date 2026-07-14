export type ComponentGuidanceProps = {
  accessibility: readonly string[];
  avoid: readonly string[];
  whenToUse: readonly string[];
};

export function ComponentGuidance({
  accessibility,
  avoid,
  whenToUse,
}: ComponentGuidanceProps) {
  const guidanceGroups = [
    { items: whenToUse, title: 'When to use' },
    { items: avoid, title: 'Avoid' },
    { items: accessibility, title: 'Accessibility' },
  ] as const;

  return (
    <section
      aria-label="Component guidance"
      className="grid gap-3 lg:grid-cols-3"
      data-component-guidance=""
    >
      {guidanceGroups.map((group) => (
        <section
          className="grid content-start gap-2 border border-tinyrack-border bg-tinyrack-surface p-3"
          key={group.title}
        >
          <h3 className="m-0 text-tinyrack-sm font-semibold leading-tinyrack-sm">
            {group.title}
          </h3>
          <ul className="m-0 grid gap-2 pl-5 text-tinyrack-sm leading-tinyrack-md text-tinyrack-text-muted">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
