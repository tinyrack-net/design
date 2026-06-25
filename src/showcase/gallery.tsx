import { daisyUiShowcaseEntries } from './daisyui-showcase.js';
import { mantineShowcaseEntries } from './mantine-showcase.js';
import { getShowcaseScenario } from './scenarios.js';
import type { ShowcaseEntry, ShowcaseLibrary, ShowcaseScenarioId } from './types.js';

function ShowcaseCard({
  entry,
  library,
  scenarioId = 'preview',
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId?: ShowcaseScenarioId;
}) {
  const scenario = getShowcaseScenario({ entry, library, scenarioId });

  return (
    <article
      className="tinyrack-showcase-card"
      data-showcase-component={entry.name}
      data-showcase-library={library}
      data-showcase-scenario={scenario.id}
    >
      <header className="tinyrack-showcase-card__header">
        <div>
          <p className="tinyrack-showcase-card__category">
            {entry.category} · {scenario.name}
          </p>
          <h3>{entry.name}</h3>
        </div>
        <code>
          {entry.id}#{scenario.id}
        </code>
      </header>
      <div className="tinyrack-showcase-card__preview">{scenario.render()}</div>
      <p className="tinyrack-showcase-card__description">{scenario.description}</p>
    </article>
  );
}

export function SingleShowcaseStory({
  entry,
  library,
  scenarioId = 'preview',
}: {
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId?: ShowcaseScenarioId;
}) {
  return (
    <section className="tinyrack-showcase-single">
      <ShowcaseCard entry={entry} library={library} scenarioId={scenarioId} />
    </section>
  );
}

export function ShowcaseGallery({
  entries,
  library,
  title,
  description,
}: {
  entries: ShowcaseEntry[];
  library: ShowcaseLibrary;
  title: string;
  description: string;
}) {
  return (
    <section className="tinyrack-showcase">
      <header className="tinyrack-showcase__header">
        <p className="tinyrack-showcase__eyebrow">{library}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <strong>{entries.length} previews</strong>
      </header>
      <div className="tinyrack-showcase__grid">
        {entries.map((entry) => (
          <ShowcaseCard key={entry.id} entry={entry} library={library} />
        ))}
      </div>
    </section>
  );
}

export function MantineShowcaseGallery() {
  return (
    <ShowcaseGallery
      description="Every Mantine Core component selected for Tinyrack theme review is rendered below and covered by browser-mode tests."
      entries={mantineShowcaseEntries}
      library="mantine"
      title="Mantine components"
    />
  );
}

export function DaisyUiShowcaseGallery() {
  return (
    <ShowcaseGallery
      description="Every daisyUI component shipped in daisyUI 5.5 is rendered below and covered by browser-mode tests."
      entries={daisyUiShowcaseEntries}
      library="daisyui"
      title="daisyUI components"
    />
  );
}
