import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import '../../src/showcase/showcase.css';

function DemoUse({
  children,
  className,
  id,
  inline = false,
}: {
  children: ReactNode;
  className?: string;
  id: string;
  inline?: boolean;
}) {
  const Element = inline ? 'span' : 'div';

  return (
    <Element className={className} data-demo-component={id}>
      {children}
    </Element>
  );
}

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
          <DemoUse id="daisyui-avatar">
            <div className="tinyrack-demo-brand">
              <div className="avatar avatar-placeholder">
                <div className="bg-primary text-primary-content w-8 rounded">
                  <span>TR</span>
                </div>
              </div>
              <div>
                <strong>Tinyrack</strong>
                <span>Containers</span>
              </div>
            </div>
          </DemoUse>
          <DemoUse id="daisyui-menu">
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
          </DemoUse>
          <DemoUse id="daisyui-dock">
            <div className="dock dock-xs relative">
              <button type="button">Lab</button>
              <button className="dock-active" type="button">
                TR
              </button>
            </div>
          </DemoUse>
          <div className="tinyrack-demo-sidebar-note">
            Keep backup-sync green before promoting the next container release.
          </div>
        </aside>

        <section className="tinyrack-demo-main">
          <DemoUse id="daisyui-navbar">
            <header className="navbar tinyrack-demo-header">
              <div>
                <DemoUse id="daisyui-badge" inline>
                  <span className="badge badge-primary badge-outline">
                    daisyUI homelab surface
                  </span>
                </DemoUse>
                <h1>Container workspace</h1>
                <p>
                  A Tailwind and daisyUI surface for local containers, routing, and
                  status review under Tinyrack themes.
                </p>
              </div>
              <div className="tinyrack-demo-header-actions">
                <DemoUse id="daisyui-tooltip">
                  <div className="tooltip tooltip-left" data-tip="Export logs">
                    <button className="btn btn-ghost" type="button">
                      Export logs
                    </button>
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-button">
                  <button className="btn btn-primary" type="button">
                    New service
                  </button>
                </DemoUse>
              </div>
            </header>
          </DemoUse>

          <section className="tinyrack-demo-grid">
            <DemoUse id="daisyui-stat" className="tinyrack-demo-kpi">
              <div className="stats">
                <div className="stat p-0">
                  <span className="stat-title">Running containers</span>
                  <strong className="stat-value text-xl">14</strong>
                  <small className="stat-desc">+2 this week</small>
                </div>
              </div>
            </DemoUse>
            <DemoUse id="daisyui-card" className="tinyrack-demo-kpi">
              <article className="card">
                <span>LAN routes</span>
                <strong>28</strong>
                <small className="tinyrack-demo-muted">all synced</small>
              </article>
            </DemoUse>
            {[
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
                  <DemoUse id="daisyui-breadcrumbs">
                    <div className="breadcrumbs text-sm">
                      <ul>
                        <li>
                          <a href="#rack">Rack</a>
                        </li>
                        <li>Services</li>
                      </ul>
                    </div>
                  </DemoUse>
                  <h2>Service health</h2>
                  <p>Container status, target node, and row density in one surface.</p>
                </div>
                <DemoUse id="daisyui-filter">
                  <div className="join">
                    <button className="btn btn-xs join-item" type="button">
                      All
                    </button>
                    <button className="btn btn-xs btn-active join-item" type="button">
                      Healthy
                    </button>
                  </div>
                </DemoUse>
              </div>
              <DemoUse id="daisyui-table" className="overflow-x-auto">
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
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Route guardrail</h2>
              <DemoUse id="daisyui-alert">
                <div className="alert alert-warning alert-soft" role="alert">
                  <span>Proxy route change is paused until health checks pass.</span>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-progress">
                <progress className="progress progress-primary" value="64" max="100" />
              </DemoUse>
              <DemoUse id="daisyui-input">
                <label className="form-control w-full">
                  <span className="label-text">Target node</span>
                  <input
                    className="input input-bordered input-primary"
                    defaultValue="edge-proxy"
                  />
                </label>
              </DemoUse>
              <DemoUse id="daisyui-toggle">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    checked
                    className="toggle toggle-primary"
                    readOnly
                    type="checkbox"
                  />
                  <span>Require review before full traffic</span>
                </label>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2>Release lane</h2>
                  <p>
                    Tabs, timeline, badges, and dropdown menus in one dense workflow.
                  </p>
                </div>
                <DemoUse id="daisyui-dropdown">
                  <div className="dropdown dropdown-end">
                    <button className="btn btn-xs" type="button">
                      Lane menu
                    </button>
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow">
                      <li>
                        <a href="#freeze">Freeze lane</a>
                      </li>
                      <li>
                        <a href="#export">Export events</a>
                      </li>
                    </ul>
                  </div>
                </DemoUse>
              </div>
              <DemoUse id="daisyui-tab">
                <div className="tabs tabs-box" role="tablist">
                  <a className="tab tab-active" href="#release" role="tab">
                    Release
                  </a>
                  <a className="tab" href="#checks" role="tab">
                    Checks
                  </a>
                  <a className="tab" href="#notes" role="tab">
                    Notes
                  </a>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-timeline">
                <ul className="timeline timeline-vertical lg:timeline-horizontal">
                  <li>
                    <div className="timeline-start text-xs">10:32</div>
                    <div className="timeline-middle">
                      <span className="badge badge-primary badge-xs" />
                    </div>
                    <div className="timeline-end timeline-box">Image pulled</div>
                    <hr />
                  </li>
                  <li>
                    <hr />
                    <div className="timeline-start text-xs">10:36</div>
                    <div className="timeline-middle">
                      <span className="badge badge-warning badge-xs" />
                    </div>
                    <div className="timeline-end timeline-box">Health probe</div>
                    <hr />
                  </li>
                  <li>
                    <hr />
                    <div className="timeline-start text-xs">02:00</div>
                    <div className="timeline-middle">
                      <span className="badge badge-ghost badge-xs" />
                    </div>
                    <div className="timeline-end timeline-box">Apply route</div>
                  </li>
                </ul>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Operator controls</h2>
              <div className="flex flex-wrap items-center gap-3">
                <DemoUse id="daisyui-rating">
                  <div className="rating rating-sm">
                    <input
                      aria-label="1 star"
                      className="mask mask-star-2 bg-primary"
                      name="release-rating"
                      type="radio"
                    />
                    <input
                      aria-label="2 stars"
                      className="mask mask-star-2 bg-primary"
                      defaultChecked
                      name="release-rating"
                      type="radio"
                    />
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-swap">
                  <label className="swap swap-rotate">
                    <input defaultChecked type="checkbox" />
                    <span className="swap-on">ON</span>
                    <span className="swap-off">OFF</span>
                  </label>
                </DemoUse>
              </div>
              <DemoUse id="daisyui-select">
                <select
                  className="select select-bordered select-primary w-full"
                  defaultValue="edge"
                >
                  <option value="edge">edge-proxy</option>
                  <option value="nas">nas-01</option>
                  <option value="node">node-01</option>
                </select>
              </DemoUse>
              <DemoUse id="daisyui-radio">
                <div className="join">
                  <button className="join-item btn btn-xs" type="button">
                    Dry run
                  </button>
                  <button className="join-item btn btn-xs btn-active" type="button">
                    Apply
                  </button>
                </div>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Diagnostics media</h2>
              <div className="tinyrack-demo-media-grid">
                <DemoUse id="daisyui-carousel">
                  <div className="carousel w-full">
                    <div className="carousel-item w-full">
                      <div className="bg-base-200 border border-base-300 grid place-content-center text-base-content w-full">
                        Thermal slide
                      </div>
                    </div>
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-diff">
                  <div className="diff aspect-video">
                    <div className="diff-item-1">
                      <div className="bg-base-200 text-base-content grid place-content-center text-sm">
                        before
                      </div>
                    </div>
                    <div className="diff-item-2">
                      <div className="bg-base-300 text-base-content grid place-content-center text-sm">
                        after
                      </div>
                    </div>
                    <div className="diff-resizer" />
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-hovergallery">
                  <div className="hovergallery">
                    <img
                      alt="Rack gallery"
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Crect width='160' height='90' fill='%23262626'/%3E%3Crect x='24' y='24' width='112' height='18' fill='%23fafafa' opacity='.22'/%3E%3Crect x='24' y='52' width='112' height='18' fill='%23fafafa' opacity='.12'/%3E%3C/svg%3E"
                    />
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-hover3d">
                  <div className="hover-3d">
                    <div className="bg-base-200 border border-base-300 rounded-box text-base-content p-4">
                      Rack card
                    </div>
                  </div>
                </DemoUse>
              </div>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Readiness</h2>
              <DemoUse id="daisyui-radialprogress">
                <div
                  aria-valuenow={74}
                  className="radial-progress text-primary"
                  role="progressbar"
                  style={{ '--value': 74 } as CSSProperties}
                >
                  74%
                </div>
              </DemoUse>
              <DemoUse id="daisyui-loading">
                <span className="loading loading-spinner loading-sm" />
              </DemoUse>
              <DemoUse id="daisyui-skeleton">
                <div className="skeleton h-10 w-full" />
              </DemoUse>
              <DemoUse id="daisyui-status">
                <div className="flex items-center gap-2">
                  <span className="status status-success" />
                  Ready
                </div>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Service intake</h2>
              <DemoUse id="daisyui-fieldset">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">New service</legend>
                  <div className="grid gap-3 md:grid-cols-2">
                    <DemoUse id="daisyui-label">
                      <label className="label">
                        <span className="label-text">Service name</span>
                        <input className="input" defaultValue="metrics-api" />
                      </label>
                    </DemoUse>
                    <DemoUse id="daisyui-fileinput">
                      <input
                        aria-label="Compose file"
                        className="file-input file-input-primary w-full"
                        type="file"
                      />
                    </DemoUse>
                    <DemoUse id="daisyui-validator">
                      <input
                        className="input validator"
                        defaultValue="ops@tinyrack.net"
                        required
                        type="email"
                      />
                    </DemoUse>
                    <DemoUse id="daisyui-textarea">
                      <textarea
                        className="textarea textarea-primary"
                        defaultValue="Check backup-sync before restarting nas-01."
                      />
                    </DemoUse>
                  </div>
                </fieldset>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Controls</h2>
              <DemoUse id="daisyui-checkbox">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    checked
                    className="checkbox checkbox-primary"
                    readOnly
                    type="checkbox"
                  />
                  <span>Snapshot complete</span>
                </label>
              </DemoUse>
              <DemoUse id="daisyui-range">
                <input
                  aria-label="Traffic percentage"
                  className="range range-primary"
                  defaultValue="60"
                  max="100"
                  min="0"
                  type="range"
                />
              </DemoUse>
              <DemoUse id="daisyui-kbd">
                <kbd className="kbd">Ctrl</kbd>
              </DemoUse>
              <DemoUse id="daisyui-link">
                <a className="link link-primary" href="#runbook">
                  Open runbook
                </a>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Runbook and logs</h2>
              <DemoUse id="daisyui-collapse">
                <div className="collapse collapse-arrow bg-base-200">
                  <input defaultChecked type="checkbox" />
                  <div className="collapse-title">Rollback steps</div>
                  <div className="collapse-content">
                    Verify DNS, drain traffic, restore previous route.
                  </div>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-list">
                <ul className="list bg-base-100 rounded-box">
                  <li className="list-row">Confirm snapshot age</li>
                  <li className="list-row">Check route probe</li>
                </ul>
              </DemoUse>
              <DemoUse id="daisyui-mockup">
                <div className="mockup-code">
                  <pre data-prefix="$">
                    <code>pnpm test</code>
                  </pre>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-divider">
                <div className="divider">Events</div>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Countdown and calendar</h2>
              <DemoUse id="daisyui-countdown">
                <span className="countdown font-mono text-2xl">
                  <span style={{ '--value': 2 } as CSSProperties} />h
                </span>
              </DemoUse>
              <DemoUse id="daisyui-calendar">
                <div className="mockup-code text-xs">
                  <pre data-prefix=">">
                    <code>calendar maintenance window</code>
                  </pre>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-textrotate">
                <span className="text-rotate">
                  <span>Rolling deploy</span>
                </span>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Remote support</h2>
              <DemoUse id="daisyui-chat">
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-primary">
                    backup-sync completed on nas-01.
                  </div>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-steps">
                <ul className="steps tinyrack-demo-steps">
                  <li className="step step-primary">Discover</li>
                  <li className="step step-primary">Configure</li>
                  <li className="step">Verify</li>
                </ul>
              </DemoUse>
              <DemoUse id="daisyui-stack">
                <div className="stack">
                  <div className="card bg-primary text-primary-content p-4">1</div>
                  <div className="card bg-base-300 p-4">2</div>
                </div>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Overlays</h2>
              <DemoUse id="daisyui-indicator">
                <div className="indicator">
                  <span className="indicator-item badge badge-secondary">new</span>
                  <button className="btn" type="button">
                    Inbox
                  </button>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-modal">
                <div className="modal modal-open relative">
                  <div className="modal-box">
                    <h3 className="font-bold">Restart service</h3>
                    <p>reverse-proxy will briefly interrupt local routing.</p>
                    <div className="modal-action">
                      <button className="btn btn-primary btn-sm" type="button">
                        Restart
                      </button>
                    </div>
                  </div>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-toast">
                <div className="toast toast-start relative">
                  <div className="alert alert-success">
                    <span>Config saved</span>
                  </div>
                </div>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--wide">
              <h2>Drawer and hero workspace</h2>
              <DemoUse id="daisyui-drawer">
                <div className="drawer drawer-open tinyrack-demo-drawer">
                  <input
                    aria-label="drawer"
                    checked
                    className="drawer-toggle"
                    readOnly
                    type="checkbox"
                  />
                  <div className="drawer-content p-4">Inspector content</div>
                  <div className="drawer-side relative">
                    <div aria-hidden="true" className="drawer-overlay" />
                    <ul className="menu bg-base-200 min-h-full w-36 p-2">
                      <li>
                        <a href="#drawer-node">node-01</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-hero">
                <div className="hero bg-base-200 min-h-32">
                  <div className="hero-content text-center">
                    <div>
                      <h3 className="text-xl font-bold">Rack console</h3>
                      <p>Node status preview</p>
                    </div>
                  </div>
                </div>
              </DemoUse>
            </section>

            <section className="tinyrack-demo-panel tinyrack-demo-panel--side">
              <h2>Masks and actions</h2>
              <DemoUse id="daisyui-mask">
                <div className="mask mask-squircle bg-primary h-14 w-14" />
              </DemoUse>
              <DemoUse id="daisyui-fab">
                <button
                  aria-label="Floating add service"
                  className="btn btn-circle btn-primary"
                  type="button"
                >
                  +
                </button>
              </DemoUse>
            </section>

            <DemoUse id="daisyui-footer" className="tinyrack-demo-panel--full">
              <footer className="footer bg-base-200 p-4">
                <aside>
                  <p>Tinyrack container workspace</p>
                </aside>
              </footer>
            </DemoUse>
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
