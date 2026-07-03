import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../src/astro/starlight/theme.css';
import '../../src/showcase/showcase.css';

function StarlightDocsSite() {
  return (
    <main
      className="tinyrack-demo-page tinyrack-starlight-demo"
      data-demo-starlight="true"
    >
      <div className="tinyrack-starlight-shell">
        <aside className="tinyrack-starlight-sidebar">
          <div className="tinyrack-demo-brand">
            <span className="tinyrack-demo-brand-mark">TR</span>
            <div>
              <strong>Tinyrack Docs</strong>
              <span>Starlight theme</span>
            </div>
          </div>
          <nav className="tinyrack-starlight-nav" aria-label="Docs navigation">
            <a href="#start" aria-current="page">
              Rack setup
            </a>
            <a href="#nodes">Nodes</a>
            <a href="#network">Network</a>
            <a href="#backups">Backups</a>
            <a href="#patterns">Patterns</a>
            <a href="#reference">Reference</a>
          </nav>
        </aside>

        <article className="tinyrack-starlight-content">
          <header className="tinyrack-starlight-topbar">
            <span className="tinyrack-demo-muted">Homelab runbook</span>
            <div className="tinyrack-starlight-search">Search runbooks</div>
          </header>

          <section>
            <h1>Document the rack, not the theme</h1>
            <p>
              Starlight keeps setup notes, node inventory, backup checks, and local
              network runbooks readable while the Tinyrack adapter applies compact
              surfaces, strong borders, and status-first contrast.
            </p>
          </section>

          <aside className="tinyrack-starlight-callout">
            <strong>First rack setup</strong>
            <p>
              Keep the core guide short: add nodes, label services, verify backups, and
              document rollback steps before changing live containers.
            </p>
          </aside>

          <section className="tinyrack-starlight-components" id="patterns">
            <div className="tinyrack-starlight-section-heading">
              <h2>Runbook patterns</h2>
              <p>
                Dense documentation samples for cards, badges, links, tabs, and steps.
              </p>
            </div>
            <div className="tinyrack-starlight-card-grid">
              {[
                ['Node card', 'node-01', 'CPU 31 C, load 0.42'],
                ['Backup card', 'nas-01', 'Snapshot age 3 h'],
                ['Network card', 'edge-proxy', 'Route probe 18 ms'],
              ].map(([title, badge, copy]) => (
                <article className="tinyrack-starlight-card" key={title}>
                  <span>{badge}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <a href={`#${badge}`}>Open runbook</a>
                </article>
              ))}
            </div>
            <div className="tinyrack-starlight-tabs">
              <div role="tablist" aria-label="Runbook tabs">
                <button aria-selected="true" role="tab" type="button">
                  Checklist
                </button>
                <button aria-selected="false" role="tab" type="button">
                  Commands
                </button>
                <button aria-selected="false" role="tab" type="button">
                  Rollback
                </button>
              </div>
              <div className="tinyrack-starlight-tab-panel">
                <ol className="tinyrack-starlight-steps">
                  <li>
                    <strong>Confirm backups</strong>
                    <span>Verify latest snapshot and retention lock.</span>
                  </li>
                  <li>
                    <strong>Drain traffic</strong>
                    <span>Move local routes to edge-proxy standby.</span>
                  </li>
                  <li>
                    <strong>Apply change</strong>
                    <span>
                      Restart only the target service and watch health checks.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2>Starlight adapter</h2>
            <pre className="tinyrack-starlight-code">{`import starlight from '@astrojs/starlight';
import { withTinyrackStarlightTheme } from '@tinyrack/themes/astro/starlight';

starlight(
  withTinyrackStarlightTheme({
    title: 'Rack Runbook',
    customCss: ['./src/styles/global.css'],
  }),
);`}</pre>
          </section>

          <section className="tinyrack-demo-grid" id="reference">
            <div className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Runbook checks</h2>
              <p>
                Long prose, inline links, command snippets, and warning callouts stay
                readable without turning documentation into a marketing surface.
              </p>
              <div className="tinyrack-starlight-table">
                <table>
                  <thead>
                    <tr>
                      <th>Check</th>
                      <th>Status</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Backup snapshot</td>
                      <td>
                        <span className="tinyrack-status-pill tinyrack-status-pill--healthy">
                          Ready
                        </span>
                      </td>
                      <td>storage</td>
                    </tr>
                    <tr>
                      <td>DNS route</td>
                      <td>
                        <span className="tinyrack-status-pill tinyrack-status-pill--warning">
                          Review
                        </span>
                      </td>
                      <td>network</td>
                    </tr>
                    <tr>
                      <td>UPS window</td>
                      <td>
                        <span className="tinyrack-status-pill tinyrack-status-pill--healthy">
                          Ready
                        </span>
                      </td>
                      <td>power</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Token mapping</h2>
              <p>Accent: --sl-color-accent</p>
              <p>Surface: --sl-color-black</p>
              <p>Text: --sl-color-gray-1</p>
              <div className="tinyrack-starlight-file-tree">
                <span>src/</span>
                <span>content/docs/runbooks/rack.md</span>
                <span>content/docs/reference/tokens.md</span>
                <span>styles/global.css</span>
              </div>
            </div>
          </section>
        </article>

        <aside className="tinyrack-starlight-toc">
          <h2>On this page</h2>
          <nav aria-label="Table of contents">
            <a href="#start">Rack setup</a>
            <a href="#configuration">Adapter config</a>
            <a href="#checks">Runbook checks</a>
            <a href="#patterns">Patterns</a>
            <a href="#reference">Reference</a>
          </nav>
        </aside>
      </div>
    </main>
  );
}

const meta = {
  title: 'Demo/Starlight Docs Site',
  component: StarlightDocsSite,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StarlightDocsSite>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
