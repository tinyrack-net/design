import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../src/showcase/showcase.css';

function DaisyUiProductApp() {
  const services = [
    ['home-assistant', '2026.7', 'Healthy', 'node-01'],
    ['reverse-proxy', 'v18.04', 'Updating', 'edge-proxy'],
    ['backup-sync', 'v7.11', 'Healthy', 'nas-01'],
  ];
  const statusClass = (status: string) =>
    status === 'Healthy'
      ? 'tinyrack-status-pill tinyrack-status-pill--healthy'
      : 'tinyrack-status-pill tinyrack-status-pill--updating';

  return (
    <main className="tinyrack-demo-page" data-demo-daisyui="true">
      <div className="tinyrack-demo-shell">
        <aside className="tinyrack-demo-sidebar">
          <div className="tinyrack-demo-brand">
            <span className="tinyrack-demo-brand-mark">TR</span>
            <div>
              <strong>Tinyrack</strong>
              <span>Containers</span>
            </div>
          </div>
          <ul className="menu tinyrack-demo-nav" aria-label="daisyUI demo navigation">
            <li>
              <a href="#overview" aria-current="page">
                Overview
              </a>
            </li>
            <li>
              <a href="#containers">Containers</a>
            </li>
            <li>
              <a href="#network">Network</a>
            </li>
            <li>
              <a href="#secrets">Secrets</a>
            </li>
          </ul>
          <div className="tinyrack-demo-sidebar-note">
            daisyUI classes inherit compact Tinyrack colors from the active data-theme.
          </div>
        </aside>

        <section className="tinyrack-demo-main">
          <header className="tinyrack-demo-header">
            <div>
              <div className="badge badge-primary badge-outline">
                daisyUI homelab surface
              </div>
              <h1>Container workspace</h1>
              <p>
                A Tailwind and daisyUI surface for local containers, routing, and status
                review under Tinyrack themes.
              </p>
            </div>
            <div className="tinyrack-demo-header-actions">
              <button className="btn btn-ghost" type="button">
                Export logs
              </button>
              <button className="btn btn-primary" type="button">
                New service
              </button>
            </div>
          </header>

          <section className="tinyrack-demo-grid">
            {[
              ['Running containers', '14', '+2 this week'],
              ['LAN routes', '28', 'all synced'],
              ['Open alerts', '1', 'storage review'],
              ['Secrets rotated', '3', 'last 24h'],
            ].map(([label, value, note]) => (
              <article className="tinyrack-demo-kpi" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small className="tinyrack-demo-muted">{note}</small>
              </article>
            ))}

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2>Service health</h2>
                  <p>Container status, target node, and row density in one surface.</p>
                </div>
                <div className="join">
                  <button className="btn btn-xs join-item btn-active" type="button">
                    Rack
                  </button>
                  <button className="btn btn-xs join-item" type="button">
                    Lab
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Node</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(([service, version, status, node]) => (
                      <tr key={service}>
                        <td>{service}</td>
                        <td>
                          <code>{version}</code>
                        </td>
                        <td>
                          <span className={statusClass(status)}>{status}</span>
                        </td>
                        <td>{node}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Route guardrail</h2>
              <div role="alert" className="alert alert-warning alert-soft">
                <span>Proxy route change is paused until health checks pass.</span>
              </div>
              <progress className="progress progress-primary" value="64" max="100" />
              <label className="form-control w-full">
                <span className="label-text">Target node</span>
                <input
                  className="input input-bordered input-primary"
                  defaultValue="edge-proxy"
                />
              </label>
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  defaultChecked
                />
                <span>Require review before full traffic</span>
              </label>
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}

const meta = {
  title: 'Demo/daisyUI Product App',
  component: DaisyUiProductApp,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DaisyUiProductApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
