import type { Meta, StoryObj } from '@storybook/react-vite';
import { tinyrackRadii } from '../../src/exports/tokens.js';
import {
  DocsCard,
  DocsGrid,
  DocsPage,
  GuidanceList,
  TokenTable,
} from '../docs-components.js';

const radiusScale = [
  {
    name: 'xs',
    value: tinyrackRadii.xs,
    className: 'rounded-[0.125rem]',
    role: 'Micro detail',
    use: 'Keyboard hints, tiny badges, checkbox corners.',
  },
  {
    name: 'sm',
    value: tinyrackRadii.sm,
    className: 'rounded-[0.25rem]',
    role: 'Small control',
    use: 'Tags, compact buttons, table imagery, field edges.',
  },
  {
    name: 'md',
    value: tinyrackRadii.md,
    className: 'rounded-[0.375rem]',
    role: 'Default control',
    use: 'Buttons, inputs, navigation items, segmented controls.',
  },
  {
    name: 'lg',
    value: tinyrackRadii.lg,
    className: 'rounded-[0.5rem]',
    role: 'Surface',
    use: 'Cards, dropdowns, popovers, operational panels.',
  },
  {
    name: 'xl',
    value: tinyrackRadii.xl,
    className: 'rounded-[0.75rem]',
    role: 'Large surface',
    use: 'Modals, large containers, page-level panels.',
  },
  {
    name: 'full',
    value: tinyrackRadii.full,
    className: 'rounded-full',
    role: 'Pill or circle',
    use: 'Avatars, status capsules, circular indicators.',
  },
] as const;

function RadiusPage() {
  return (
    <DocsPage
      eyebrow="Foundations"
      title="Radius"
      description="Tinyrack radius keeps console UI crisp, with roundness used to signal component role."
    >
      <DocsGrid>
        <DocsCard title="Principle">
          <p>
            Radius should make interaction targets recognizable without softening the
            whole interface. Controls stay compact, surfaces stay measured, and full
            radius is reserved for pills or circles.
          </p>
          <GuidanceList
            items={[
              'Use md for the default interactive control shape.',
              'Use lg and xl for containers that sit above the page rhythm.',
              'Keep nested elements equal to or tighter than the surface around them.',
            ]}
          />
        </DocsCard>
        <DocsCard title="Shape scale">
          <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(7rem,1fr))]">
            {radiusScale.map((token) => (
              <div className="grid min-w-0 gap-2" key={token.name}>
                <div
                  className={`grid min-h-20 place-items-center border border-base-300 bg-base-100 text-tinyrack-sm shadow-sm ${token.className}`}
                >
                  {token.name}
                </div>
                <code className="text-tinyrack-xs text-primary">{token.value}</code>
              </div>
            ))}
          </div>
        </DocsCard>
      </DocsGrid>

      <DocsCard title="Usage map">
        <div className="grid gap-2">
          {radiusScale.map((token) => (
            <div
              className="grid min-w-0 gap-2 rounded-md border border-white/10 bg-base-100/50 p-2.5 [grid-template-columns:minmax(4rem,0.25fr)_minmax(8rem,0.45fr)_minmax(0,1fr)] max-md:grid-cols-1"
              key={token.name}
            >
              <strong>{token.name}</strong>
              <span className="text-primary">{token.role}</span>
              <span className="leading-tinyrack-md text-base-content/70">
                {token.use}
              </span>
            </div>
          ))}
        </div>
      </DocsCard>

      <DocsGrid>
        <DocsCard title="Applied control set">
          <div className="grid gap-3 rounded-lg border border-base-300 bg-base-100 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded-[0.375rem] border border-base-300 bg-base-200 px-3 py-2 text-base-content"
                type="button"
              >
                Restart
              </button>
              <button
                className="rounded-[0.375rem] bg-primary px-3 py-2 text-primary-content"
                type="button"
              >
                Deploy
              </button>
              <span className="rounded-full bg-success/15 px-2 py-1 text-tinyrack-xs text-success">
                ready
              </span>
            </div>
            <div className="rounded-[0.5rem] border border-base-300 bg-base-200/80 p-3">
              <div className="grid gap-2 rounded-[0.375rem] border border-base-300 bg-base-100 p-2">
                <strong>control radius md</strong>
                <span className="text-tinyrack-sm text-base-content/70">
                  Inner controls stay tighter than their containing surface.
                </span>
              </div>
            </div>
          </div>
        </DocsCard>
        <DocsCard title="Focus pairing">
          <div className="grid gap-3">
            <button
              className="w-fit rounded-[0.375rem] border border-base-300 bg-base-100 px-3 py-2 outline outline-2 outline-offset-2 outline-primary/60"
              type="button"
            >
              Focused control
            </button>
            <p>
              Match the focus ring to the component shape, then let the offset create
              the extra clearance. The ring should read as part of the control, not as a
              separate decoration.
            </p>
          </div>
        </DocsCard>
      </DocsGrid>

      <DocsGrid>
        <DocsCard title="Token values">
          <TokenTable
            items={radiusScale.map((token) => ({
              name: token.name,
              value: token.value,
              note: token.role,
            }))}
          />
        </DocsCard>
        <DocsCard title="Adapter guidance">
          <TokenTable
            items={[
              {
                name: 'daisyUI field',
                value: '--radius-field',
                note: 'Uses tinyrackRadii.sm for compact form edges.',
              },
              {
                name: 'daisyUI box',
                value: '--radius-box',
                note: 'Uses tinyrackRadii.lg for cards and panels.',
              },
              {
                name: 'Mantine',
                value: 'radius="md"',
                note: 'Use md as the default control radius.',
              },
            ]}
          />
        </DocsCard>
      </DocsGrid>
    </DocsPage>
  );
}

const meta = {
  title: 'Foundations/Radius',
  component: RadiusPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof RadiusPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
