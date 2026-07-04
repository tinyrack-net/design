import { daisyUiShowcaseEntries } from './daisyui-showcase.js';
import { mantineShowcaseEntries } from './mantine-showcase.js';
import { getShowcaseStory } from './scenarios.js';
import type {
  ShowcaseControlValues,
  ShowcaseEntry,
  ShowcaseLibrary,
  ShowcaseScenarioId,
  ShowcaseStoryKind,
} from './types.js';

function ShowcaseCard({
  controlValues,
  entry,
  library,
  scenarioId,
  storyKind,
}: {
  controlValues?: ShowcaseControlValues;
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId?: ShowcaseScenarioId;
  storyKind?: ShowcaseStoryKind;
}) {
  const requestedStoryKind = storyKind ?? scenarioId;
  const story =
    requestedStoryKind === undefined
      ? getShowcaseStory({ entry, library })
      : getShowcaseStory({ entry, library, storyKind: requestedStoryKind });

  return (
    <article
      className="grid w-full min-w-0 gap-3 overflow-hidden rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm"
      data-showcase-card="true"
      data-showcase-component={entry.name}
      data-showcase-entry-id={entry.id}
      data-showcase-library={library}
      data-showcase-scenario={story.id}
      data-showcase-story-kind={story.id}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="m-0 text-xs font-bold tracking-[0.08em] text-primary uppercase">
            {entry.category} · {story.name}
          </p>
          <h3 className="m-0 mt-0.5 text-[1.05rem]">{entry.name}</h3>
        </div>
        <code className="rounded bg-base-200 px-1.5 py-0.5 text-[0.7rem]">
          {entry.id}#{story.id}
        </code>
      </header>
      <div className="grid min-h-28 items-center justify-items-center overflow-auto rounded-md bg-base-200 p-3.5 [&:has([data-showcase-variant-matrix])]:justify-items-stretch [&_.dropdown.dropdown-open_.dropdown-content]:static [&_.dropdown.dropdown-open_.dropdown-content]:mt-2 [&_.hover-3d>_:first-child]:before:hidden">
        {story.render(controlValues)}
      </div>
      <p className="m-0 text-[0.85rem] text-base-content">{story.description}</p>
    </article>
  );
}

export function SingleShowcaseStory({
  controlValues,
  entry,
  library,
  scenarioId,
  storyKind,
}: {
  controlValues?: ShowcaseControlValues | undefined;
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
  scenarioId?: ShowcaseScenarioId;
  storyKind?: ShowcaseStoryKind;
}) {
  const requestedStoryKind = storyKind ?? scenarioId;
  const story =
    requestedStoryKind === undefined
      ? getShowcaseStory({ entry, library })
      : getShowcaseStory({ entry, library, storyKind: requestedStoryKind });

  return (
    <section
      className="box-border mx-auto w-[min(100%,calc(100vw-2rem))] max-w-6xl p-4 max-md:w-full [&_.hover-3d>_:first-child]:before:hidden"
      data-showcase-component={entry.name}
      data-showcase-entry-id={entry.id}
      data-showcase-library={library}
      data-showcase-story-kind={story.id}
    >
      {story.render(controlValues)}
    </section>
  );
}

export function SingleComponentStory({
  controlValues,
  entry,
  library,
}: {
  controlValues?: ShowcaseControlValues | undefined;
  entry: ShowcaseEntry;
  library: ShowcaseLibrary;
}) {
  return (
    <section
      className="grid min-h-32 w-full min-w-0 box-border items-center justify-items-center overflow-auto bg-base-100 p-4 text-base-content [&>*]:max-w-[min(100%,48rem)] [&_.hover-3d>_:first-child]:before:hidden"
      data-showcase-component={entry.name}
      data-showcase-entry-id={entry.id}
      data-showcase-library={library}
      data-showcase-story-kind="default"
    >
      <SingleShowcaseStory
        controlValues={controlValues}
        entry={entry}
        library={library}
      />
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
    <section className="grid gap-4">
      <header className="max-w-4xl">
        <p className="m-0 text-xs font-bold tracking-[0.08em] text-primary uppercase">
          {library}
        </p>
        <h2>{title}</h2>
        <p>{description}</p>
        <strong>{entries.length} previews</strong>
      </header>
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">
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
