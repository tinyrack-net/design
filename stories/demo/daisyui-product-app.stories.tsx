import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

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

const routes = [
  {
    cache: '98.4%',
    latency: '136 ms',
    owner: 'Growth',
    region: 'iad1',
    route: '/pricing',
    runtime: 'edge-01',
    service: 'marketing',
    status: 'Live',
  },
  {
    cache: '91.2%',
    latency: '182 ms',
    owner: 'Checkout',
    region: 'sfo1',
    route: '/checkout',
    runtime: 'node-03',
    service: 'checkout',
    status: 'Guarded',
  },
  {
    cache: '99.1%',
    latency: '104 ms',
    owner: 'Accounts',
    region: 'fra1',
    route: '/account',
    runtime: 'edge-04',
    service: 'account',
    status: 'Live',
  },
  {
    cache: '84.6%',
    latency: '244 ms',
    owner: 'CMS',
    region: 'iad1',
    route: '/docs',
    runtime: 'node-02',
    service: 'docs',
    status: 'Review',
  },
] as const;

const deployEvents = [
  ['09:42', 'Build artifact signed', 'success'],
  ['09:47', 'Warm cache in iad1 and fra1', 'success'],
  ['09:51', 'Checkout route held at 40%', 'warning'],
  ['10:00', 'SRE approval window opens', 'neutral'],
] as const;

const supportMessages = [
  ['chat-start', 'Platform', 'Edge cache warmed for marketing-web.'],
  ['chat-end', 'SRE', 'Keep checkout-web guarded until card probes pass.'],
] as const;

function CalendarPreview() {
  const days = [
    ['empty-start-1', 'empty-start-2', '1', '2', '3', '4', '5'],
    ['6', '7', '8', '9', '10', '11', '12'],
    ['13', '14', '15', '16', '17', '18', '19'],
    ['20', '21', '22', '23', '24', '25', '26'],
    ['27', '28', '29', '30', '31', 'empty-end-1', 'empty-end-2'],
  ];

  return (
    <fieldset className="react-day-picker block w-full max-w-full overflow-hidden">
      <legend className="px-1 text-xs font-semibold text-base-content/65">
        July deploy calendar
      </legend>
      <div className="rdp-months !grid !max-w-full !gap-0 !p-1">
        <div className="rdp-month w-full">
          <div className="rdp-month_caption !h-9">
            <span className="rdp-caption_label">July 2026</span>
          </div>
          <table className="rdp-month_grid w-full table-fixed">
            <thead>
              <tr>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                  <th className="rdp-weekday !h-6 !w-6 !py-1 text-[0.65rem]" key={day}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((week) => (
                <tr key={week.join('-')}>
                  {week.map((day) => {
                    const isEmptyDay = day.startsWith('empty');

                    return (
                      <td
                        className={
                          day === '22'
                            ? 'rdp-day rdp-selected !h-6 !w-6'
                            : day === '24'
                              ? 'rdp-day rdp-today !h-6 !w-6'
                              : 'rdp-day !h-6 !w-6'
                        }
                        key={day}
                      >
                        {isEmptyDay ? null : (
                          <button
                            className="rdp-day_button !h-6 !w-6 text-[0.68rem]"
                            type="button"
                          >
                            {day}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rdp-footer text-xs">Freeze: July 22-24</div>
        </div>
      </div>
    </fieldset>
  );
}

function DaisyUiProductApp() {
  return (
    <main
      className="min-h-screen overflow-y-auto bg-base-100 p-2 text-base-content"
      data-demo-daisyui="true"
    >
      <div className="mx-auto grid min-h-[calc(100vh-1rem)] max-w-[96rem] grid-cols-1 overflow-clip rounded-lg border border-base-300 bg-base-200/90 md:grid-cols-[minmax(12rem,15rem)_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col gap-3 border-base-300 bg-base-100/70 p-3 md:border-r">
          <DemoUse id="daisyui-avatar">
            <div className="flex min-w-0 items-center gap-2">
              <div className="avatar avatar-placeholder">
                <div className="w-9 rounded bg-primary text-primary-content">
                  <span>TR</span>
                </div>
              </div>
              <div className="min-w-0">
                <strong className="block truncate">Tinyrack</strong>
                <span className="block truncate text-sm text-base-content/65">
                  SSR Console
                </span>
              </div>
            </div>
          </DemoUse>

          <DemoUse id="daisyui-menu">
            <ul className="menu grid gap-1 p-0" aria-label="daisyUI demo navigation">
              <li>
                <a
                  className="flex items-center justify-between rounded px-2 py-2 text-sm text-base-content/75"
                  href="#overview"
                  aria-current="page"
                >
                  Overview
                  <span className="badge badge-primary badge-xs">Live</span>
                </a>
              </li>
              <li>
                <a
                  className="rounded px-2 py-2 text-sm text-base-content/75"
                  href="#routes"
                >
                  Routes
                </a>
              </li>
              <li>
                <a
                  className="rounded px-2 py-2 text-sm text-base-content/75"
                  href="#deployments"
                >
                  Deployments
                </a>
              </li>
              <li>
                <a
                  className="rounded px-2 py-2 text-sm text-base-content/75"
                  href="#reviews"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a
                  className="rounded px-2 py-2 text-sm text-base-content/75"
                  href="#settings"
                >
                  Settings
                </a>
              </li>
            </ul>
          </DemoUse>

          <div className="grid min-w-0 gap-2 rounded-md border border-base-300 p-2">
            <span className="text-xs font-extrabold tracking-wide text-base-content/65 uppercase">
              Traffic window
            </span>
            <DemoUse id="daisyui-calendar">
              <CalendarPreview />
            </DemoUse>
          </div>

          <DemoUse id="daisyui-dock">
            <div className="dock dock-xs relative">
              <button type="button">Ops</button>
              <button className="dock-active" type="button">
                SSR
              </button>
              <button type="button">Logs</button>
            </div>
          </DemoUse>

          <div className="mt-auto rounded border border-base-300 p-2 text-sm leading-6 text-base-content/70">
            Production SSR deploys stay guarded until cache warmup, card probes, and
            rollback snapshots are all green.
          </div>
        </aside>

        <section className="grid min-w-0 content-start gap-3 overflow-hidden p-3">
          <DemoUse id="daisyui-navbar">
            <header className="navbar !grid min-w-0 grid-cols-1 items-start gap-3 rounded-md border border-base-300 bg-base-100 p-3 xl:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <DemoUse id="daisyui-badge" inline>
                  <span className="badge badge-primary badge-outline">
                    daisyUI production SSR surface
                  </span>
                </DemoUse>
                <h1 className="m-0 mt-2 text-2xl leading-tight font-semibold text-balance">
                  SSR release control room
                </h1>
                <p className="m-0 max-w-3xl text-base-content/70 leading-6">
                  A dense production dashboard for route health, cache readiness,
                  guarded deploys, incident review, and operator handoff.
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap items-start justify-start gap-2 xl:justify-end">
                <DemoUse id="daisyui-dropdown">
                  <div className="dropdown dropdown-open">
                    <button className="btn btn-sm" type="button">
                      Queue menu
                    </button>
                    <ul className="dropdown-content menu !static z-1 mt-2 w-48 rounded-box bg-base-100 p-2 shadow">
                      <li>
                        <a href="#freeze">Freeze deploys</a>
                      </li>
                      <li>
                        <a href="#export">Export timeline</a>
                      </li>
                      <li>
                        <a href="#handoff">Create handoff</a>
                      </li>
                    </ul>
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-tooltip">
                  <div
                    className="tooltip tooltip-open tooltip-bottom"
                    data-tip="Copy deploy command"
                  >
                    <button className="btn btn-ghost btn-sm" type="button">
                      Copy command
                    </button>
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-button">
                  <button className="btn btn-primary btn-sm" type="button">
                    Approve rollout
                  </button>
                </DemoUse>
              </div>
            </header>
          </DemoUse>

          <section className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-4 xl:grid-cols-12">
            <DemoUse id="daisyui-hero" className="md:col-span-4 xl:col-span-12">
              <section className="hero min-h-64 overflow-hidden rounded-md border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-base-100">
                <div className="hero-content !grid w-full max-w-none grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)]">
                  <div className="grid min-w-0 gap-3">
                    <DemoUse id="daisyui-breadcrumbs">
                      <div className="breadcrumbs text-sm">
                        <ul>
                          <li>
                            <a href="#apps">Apps</a>
                          </li>
                          <li>
                            <a href="#checkout">checkout-web</a>
                          </li>
                          <li>Canary deploy</li>
                        </ul>
                      </div>
                    </DemoUse>
                    <h2 className="m-0 text-3xl leading-tight font-extrabold text-balance xl:text-4xl">
                      Checkout SSR is serving 40% canary traffic.
                    </h2>
                    <p className="m-0 max-w-3xl text-base-content/70 leading-7">
                      Cache hit rate is stable, but card authorization probes need one
                      more pass before this release can move to 100%.
                    </p>
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <DemoUse id="daisyui-countdown">
                        <span className="countdown font-mono text-2xl">
                          <span className="[--value:2]" />h
                        </span>
                      </DemoUse>
                      <DemoUse id="daisyui-textrotate">
                        <span className="text-rotate font-semibold">
                          <span>
                            <span>Guarded rollout</span>
                            <span>Cache warming</span>
                            <span>SRE review</span>
                          </span>
                        </span>
                      </DemoUse>
                    </div>
                  </div>
                  <div className="grid min-w-0 place-items-center gap-3">
                    <DemoUse id="daisyui-radialprogress">
                      <div
                        aria-valuenow={76}
                        className="radial-progress text-primary [--value:76]"
                        role="progressbar"
                      >
                        76%
                      </div>
                    </DemoUse>
                    <DemoUse id="daisyui-stack">
                      <div className="stack w-full max-w-52">
                        <div className="card bg-primary p-4 text-primary-content">
                          Rollback ready
                        </div>
                        <div className="card bg-base-300 p-4">Snapshot signed</div>
                        <div className="card bg-base-200 p-4">Route warmed</div>
                      </div>
                    </DemoUse>
                  </div>
                </div>
              </section>
            </DemoUse>

            <DemoUse
              id="daisyui-stat"
              className="grid min-w-0 content-start gap-1 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-1 xl:col-span-3"
            >
              <div className="stats overflow-hidden">
                <div className="stat p-0">
                  <span className="stat-title">SSR p95</span>
                  <strong className="stat-value text-xl">164 ms</strong>
                  <small className="stat-desc">12 ms faster today</small>
                </div>
              </div>
            </DemoUse>
            <DemoUse
              id="daisyui-card"
              className="grid min-w-0 content-start gap-1 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-1 xl:col-span-3"
            >
              <article className="card min-w-0">
                <span className="text-base-content/65">Cache hit rate</span>
                <strong className="text-lg">96.8%</strong>
                <small className="text-base-content/65">edge regions warmed</small>
              </article>
            </DemoUse>
            <DemoUse
              id="daisyui-indicator"
              className="grid min-w-0 content-start gap-1 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-1 xl:col-span-3"
            >
              <div className="indicator w-full">
                <span className="indicator-item badge badge-warning top-2 right-2 h-5 min-w-5 translate-0">
                  2
                </span>
                <div className="grid min-w-0 gap-1 pr-8">
                  <span className="text-base-content/65">Guarded routes</span>
                  <strong className="text-lg">2</strong>
                  <small className="text-base-content/65">checkout and docs</small>
                </div>
              </div>
            </DemoUse>
            <DemoUse
              id="daisyui-skeleton"
              className="grid min-w-0 content-start gap-1 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-1 xl:col-span-3"
            >
              <span className="text-base-content/65">Hydration budget</span>
              <strong className="text-lg">82 KB</strong>
              <div className="skeleton h-2 w-full" />
            </DemoUse>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-8">
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 max-w-2xl">
                  <h2 className="m-0 text-base font-semibold">
                    Route health and SSR runtime
                  </h2>
                  <p className="m-0 text-base-content/70 leading-6">
                    Server-rendered routes, cache health, runtime target, and owner in
                    one review surface.
                  </p>
                </div>
                <DemoUse id="daisyui-filter">
                  <div className="filter">
                    <input
                      aria-label="All routes"
                      className="btn btn-xs filter-reset"
                      name="route-filter"
                      type="radio"
                    />
                    <input
                      aria-label="Live"
                      className="btn btn-xs"
                      defaultChecked
                      name="route-filter"
                      type="radio"
                    />
                    <input
                      aria-label="Guarded"
                      className="btn btn-xs"
                      name="route-filter"
                      type="radio"
                    />
                  </div>
                </DemoUse>
              </div>
              <DemoUse id="daisyui-table" className="min-w-0 overflow-x-auto">
                <table className="table table-zebra table-sm min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap px-2">Service</th>
                      <th className="whitespace-nowrap px-2">Route</th>
                      <th className="whitespace-nowrap px-2">Status</th>
                      <th className="whitespace-nowrap px-2">Runtime</th>
                      <th className="whitespace-nowrap px-2">Region</th>
                      <th className="whitespace-nowrap px-2">p95</th>
                      <th className="whitespace-nowrap px-2">Cache</th>
                      <th className="whitespace-nowrap px-2">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route) => (
                      <tr key={route.service}>
                        <td className="whitespace-nowrap px-2">{route.service}</td>
                        <td className="whitespace-nowrap px-2">
                          <code>{route.route}</code>
                        </td>
                        <td className="whitespace-nowrap px-2">
                          <span
                            className={
                              route.status === 'Live'
                                ? 'badge badge-success badge-outline badge-xs whitespace-nowrap'
                                : route.status === 'Guarded'
                                  ? 'badge badge-warning badge-outline badge-xs whitespace-nowrap'
                                  : 'badge badge-error badge-outline badge-xs whitespace-nowrap'
                            }
                          >
                            {route.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2">{route.runtime}</td>
                        <td className="whitespace-nowrap px-2">{route.region}</td>
                        <td className="whitespace-nowrap px-2">{route.latency}</td>
                        <td className="whitespace-nowrap px-2">{route.cache}</td>
                        <td className="whitespace-nowrap px-2">{route.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-4">
              <h2 className="m-0 text-base font-semibold">Guardrails</h2>
              <DemoUse id="daisyui-alert">
                <div className="alert alert-warning alert-soft" role="alert">
                  <span>
                    Checkout remains guarded until authorization probes pass twice.
                  </span>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-progress">
                <progress className="progress progress-primary" max="100" value="76" />
              </DemoUse>
              <DemoUse id="daisyui-steps">
                <ul className="steps steps-horizontal w-full overflow-x-auto">
                  <li className="step step-primary">Build</li>
                  <li className="step step-primary">Warm</li>
                  <li className="step step-primary">Canary</li>
                  <li className="step">Promote</li>
                </ul>
              </DemoUse>
              <DemoUse id="daisyui-status">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="status status-warning" />
                  SRE review pending
                </div>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-8">
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="m-0 text-base font-semibold">Release lane</h2>
                  <p className="m-0 text-base-content/70 leading-6">
                    Tabs, timeline, deploy events, and rollback logs in context.
                  </p>
                </div>
                <DemoUse id="daisyui-loading">
                  <span
                    aria-label="Syncing release lane"
                    className="loading loading-spinner loading-sm"
                    role="status"
                  />
                </DemoUse>
              </div>
              <DemoUse id="daisyui-tab">
                <div className="tabs tabs-box" role="tablist">
                  <button className="tab tab-active" role="tab" type="button">
                    Release
                  </button>
                  <button className="tab" role="tab" type="button">
                    Probes
                  </button>
                  <button className="tab" role="tab" type="button">
                    Handoff
                  </button>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-timeline">
                <ul className="timeline timeline-vertical lg:timeline-horizontal">
                  {deployEvents.map(([time, label, tone], index) => (
                    <li key={label}>
                      {index > 0 ? <hr /> : null}
                      <div className="timeline-start text-xs">{time}</div>
                      <div className="timeline-middle">
                        <span
                          className={
                            tone === 'success'
                              ? 'badge badge-success badge-xs'
                              : tone === 'warning'
                                ? 'badge badge-warning badge-xs'
                                : 'badge badge-ghost badge-xs'
                          }
                        />
                      </div>
                      <div className="timeline-end timeline-box">{label}</div>
                      {index < deployEvents.length - 1 ? <hr /> : null}
                    </li>
                  ))}
                </ul>
              </DemoUse>
              <DemoUse id="daisyui-mockup">
                <div className="mockup-code max-w-full overflow-auto">
                  <pre data-prefix="$">
                    <code>tinyrack promote checkout-web --traffic 100</code>
                  </pre>
                  <pre data-prefix=">">
                    <code>blocked: card-probe requires one more pass</code>
                  </pre>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-divider">
                <div className="divider">Rollback note</div>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-4">
              <h2 className="m-0 text-base font-semibold">Operator controls</h2>
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <DemoUse id="daisyui-rating">
                  <div className="rating rating-sm">
                    <input
                      aria-label="Low risk"
                      className="mask mask-star-2 bg-warning"
                      name="release-rating"
                      type="radio"
                    />
                    <input
                      aria-label="Medium risk"
                      className="mask mask-star-2 bg-warning"
                      defaultChecked
                      name="release-rating"
                      type="radio"
                    />
                    <input
                      aria-label="High risk"
                      className="mask mask-star-2 bg-warning"
                      name="release-rating"
                      type="radio"
                    />
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-swap">
                  <label className="swap swap-rotate">
                    <input defaultChecked type="checkbox" />
                    <span className="swap-on">Armed</span>
                    <span className="swap-off">Paused</span>
                  </label>
                </DemoUse>
              </div>
              <DemoUse id="daisyui-select">
                <select
                  className="select select-bordered select-primary w-full"
                  defaultValue="canary"
                >
                  <option value="canary">40% canary</option>
                  <option value="hold">Hold traffic</option>
                  <option value="promote">Promote to 100%</option>
                </select>
              </DemoUse>
              <DemoUse id="daisyui-radio">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <label className="label cursor-pointer gap-2">
                    <input
                      className="radio radio-primary radio-sm"
                      defaultChecked
                      name="deploy-mode"
                      type="radio"
                    />
                    <span>Manual</span>
                  </label>
                  <label className="label cursor-pointer gap-2">
                    <input
                      className="radio radio-primary radio-sm"
                      name="deploy-mode"
                      type="radio"
                    />
                    <span>Auto</span>
                  </label>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-range">
                <input
                  aria-label="Traffic percentage"
                  className="range range-primary"
                  defaultValue="40"
                  max="100"
                  min="0"
                  type="range"
                />
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-8">
              <h2 className="m-0 text-base font-semibold">Experience preview</h2>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <DemoUse
                  id="daisyui-carousel"
                  className="min-h-40 overflow-hidden rounded-md border border-base-300 bg-base-200/60"
                >
                  <div className="carousel h-40 w-full">
                    <div className="carousel-item h-full w-full">
                      <article className="grid h-full w-full content-center gap-2 bg-base-200 p-4">
                        <span className="badge badge-success badge-soft">
                          Server rendered
                        </span>
                        <strong>Pricing route</strong>
                        <small className="text-base-content/65">
                          Fresh content, 98.4% cache hit rate
                        </small>
                      </article>
                    </div>
                    <div className="carousel-item h-full w-full">
                      <article className="grid h-full w-full content-center gap-2 bg-base-200 p-4">
                        <span className="badge badge-warning badge-soft">Guarded</span>
                        <strong>Checkout route</strong>
                        <small className="text-base-content/65">
                          Card probes still warming
                        </small>
                      </article>
                    </div>
                  </div>
                </DemoUse>
                <DemoUse
                  id="daisyui-diff"
                  className="min-h-40 overflow-hidden rounded-md border border-base-300 bg-base-200/60"
                >
                  <div className="diff h-40 w-full">
                    <div className="diff-item-1">
                      <div className="grid h-full place-content-center bg-base-200 text-sm text-base-content">
                        old SSR bundle
                      </div>
                    </div>
                    <div className="diff-item-2">
                      <div className="grid h-full place-content-center bg-primary text-sm text-primary-content">
                        new SSR bundle
                      </div>
                    </div>
                    <div className="diff-resizer" />
                  </div>
                </DemoUse>
                <DemoUse
                  id="daisyui-hovergallery"
                  className="min-h-40 overflow-hidden rounded-md border border-base-300 bg-base-200/60"
                >
                  <figure className="hovergallery h-40 w-full">
                    <img
                      className="h-full w-full object-cover"
                      alt="Server rack overview"
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=520&q=80"
                    />
                    <img
                      className="h-full w-full object-cover"
                      alt="Operations monitors"
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=520&q=80"
                    />
                    <img
                      className="h-full w-full object-cover"
                      alt="Production deployment workspace"
                      src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=520&q=80"
                    />
                  </figure>
                </DemoUse>
                <DemoUse
                  id="daisyui-hover3d"
                  className="min-h-40 overflow-hidden rounded-md border border-base-300 bg-base-200/60"
                >
                  <div className="hover-3d h-40 w-full overflow-hidden">
                    <div className="card grid h-full content-center gap-2 border border-base-300 bg-base-200 p-4">
                      <span className="badge badge-primary badge-soft">
                        Cache region
                      </span>
                      <strong>iad1 edge</strong>
                      <small className="text-base-content/65">136 ms SSR p95</small>
                    </div>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </DemoUse>
              </div>
              <DemoUse id="daisyui-mask">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="mask mask-squircle h-12 w-12 bg-primary" />
                  <span className="text-base-content/65">
                    Masked deploy token is scoped to checkout-web.
                  </span>
                </div>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-4">
              <h2 className="m-0 text-base font-semibold">Support room</h2>
              <DemoUse id="daisyui-chat">
                <div className="grid gap-2">
                  {supportMessages.map(([align, sender, message]) => (
                    <div className={`chat ${align}`} key={message}>
                      <div className="chat-header">{sender}</div>
                      <div className="chat-bubble chat-bubble-primary">{message}</div>
                    </div>
                  ))}
                </div>
              </DemoUse>
              <DemoUse id="daisyui-list">
                <ul className="list rounded-box bg-base-100">
                  <li className="list-row">Confirm checkout payment probe</li>
                  <li className="list-row">Notify Growth before promotion</li>
                  <li className="list-row">Archive rollback snapshot</li>
                </ul>
              </DemoUse>
              <DemoUse id="daisyui-collapse">
                <div className="collapse collapse-arrow bg-base-200">
                  <input defaultChecked type="checkbox" />
                  <div className="collapse-title">Incident handoff</div>
                  <div className="collapse-content">
                    Keep the canary route guarded if authorization latency exceeds 220
                    ms.
                  </div>
                </div>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-8">
              <h2 className="m-0 text-base font-semibold">Release request</h2>
              <DemoUse id="daisyui-fieldset">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Promote SSR route</legend>
                  <div className="grid gap-3 md:grid-cols-2">
                    <DemoUse id="daisyui-label">
                      <label className="label grid gap-1">
                        <span className="label-text">Service name</span>
                        <input className="input w-full" defaultValue="checkout-web" />
                      </label>
                    </DemoUse>
                    <DemoUse id="daisyui-input">
                      <label className="grid gap-1">
                        <span className="label-text">Route</span>
                        <input
                          className="input input-bordered input-primary w-full"
                          defaultValue="/checkout"
                        />
                      </label>
                    </DemoUse>
                    <DemoUse id="daisyui-fileinput">
                      <label className="grid gap-1">
                        <span className="label-text">Evidence bundle</span>
                        <input
                          aria-label="Evidence bundle"
                          className="file-input file-input-primary w-full"
                          type="file"
                        />
                      </label>
                    </DemoUse>
                    <DemoUse id="daisyui-validator">
                      <label className="grid gap-1">
                        <span className="label-text">Reviewer email</span>
                        <input
                          className="input validator w-full"
                          defaultValue="sre@tinyrack.net"
                          required
                          type="email"
                        />
                      </label>
                    </DemoUse>
                    <DemoUse id="daisyui-textarea" className="md:col-span-2">
                      <label className="grid gap-1">
                        <span className="label-text">Release note</span>
                        <textarea
                          className="textarea textarea-primary w-full"
                          defaultValue="Promote after card authorization probes pass twice in iad1 and sfo1."
                        />
                      </label>
                    </DemoUse>
                  </div>
                </fieldset>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-4">
              <h2 className="m-0 text-base font-semibold">Review checklist</h2>
              <DemoUse id="daisyui-checkbox">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    checked
                    className="checkbox checkbox-primary"
                    readOnly
                    type="checkbox"
                  />
                  <span>Rollback snapshot signed</span>
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
                  <span>Require SRE approval</span>
                </label>
              </DemoUse>
              <DemoUse id="daisyui-kbd">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <kbd className="kbd">Ctrl</kbd>
                  <kbd className="kbd">K</kbd>
                  <span className="text-base-content/65">Open command palette</span>
                </div>
              </DemoUse>
              <DemoUse id="daisyui-link">
                <a className="link link-primary" href="#runbook">
                  Open checkout SSR runbook
                </a>
              </DemoUse>
            </section>

            <section className="grid min-w-0 content-start gap-2 rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-8">
              <h2 className="m-0 text-base font-semibold">
                Inspector drawer and restart dialog
              </h2>
              <DemoUse id="daisyui-drawer">
                <div className="drawer drawer-open relative h-44 overflow-hidden rounded-md border border-base-300">
                  <input
                    aria-label="drawer"
                    checked
                    className="drawer-toggle"
                    readOnly
                    type="checkbox"
                  />
                  <div className="drawer-content !block min-w-0 p-4 pl-40">
                    <strong className="block">Route inspector</strong>
                    <span className="text-base-content/65">
                      checkout-web is pinned to node-ssr-03.
                    </span>
                  </div>
                  <div className="drawer-side !absolute !inset-y-0 !left-0 !h-full !w-36">
                    <div aria-hidden="true" className="drawer-overlay" />
                    <ul className="menu min-h-full w-36 bg-base-200 p-2">
                      <li>
                        <a href="#drawer-route">Route</a>
                      </li>
                      <li>
                        <a href="#drawer-cache">Cache</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </DemoUse>
              <div className="grid min-w-0 grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
                <DemoUse id="daisyui-modal">
                  <div className="modal modal-open !visible !relative !inset-auto !grid min-h-48 !bg-transparent !opacity-100">
                    <div className="modal-box max-w-full p-3">
                      <h3 className="font-bold">Restart SSR runtime</h3>
                      <p>node-ssr-03 will drain active requests before restarting.</p>
                      <div className="modal-action">
                        <button className="btn btn-ghost btn-sm" type="button">
                          Cancel
                        </button>
                        <button className="btn btn-primary btn-sm" type="button">
                          Restart
                        </button>
                      </div>
                    </div>
                  </div>
                </DemoUse>
                <DemoUse id="daisyui-toast">
                  <div className="toast toast-start !static p-0">
                    <div className="alert alert-success">
                      <span>Release request saved</span>
                    </div>
                  </div>
                </DemoUse>
              </div>
            </section>

            <section className="relative grid min-h-52 min-w-0 content-start gap-2 overflow-hidden rounded-md border border-base-300 bg-base-100 p-2 md:col-span-4 xl:col-span-4">
              <h2 className="m-0 text-base font-semibold">Floating actions</h2>
              <p className="m-0 text-base-content/70 leading-6">
                Focus the action cluster to reveal fast recovery commands.
              </p>
              <DemoUse id="daisyui-fab">
                <div className="fab fab-flower absolute right-4 bottom-4">
                  <button
                    className="btn btn-circle btn-primary"
                    tabIndex={0}
                    type="button"
                  >
                    Act
                  </button>
                  <button className="btn btn-circle fab-main-action" type="button">
                    Go
                  </button>
                  <button className="btn btn-circle btn-sm" type="button">
                    Logs
                  </button>
                  <button className="btn btn-circle btn-sm" type="button">
                    Hold
                  </button>
                </div>
              </DemoUse>
            </section>

            <DemoUse id="daisyui-footer" className="md:col-span-4 xl:col-span-12">
              <footer className="footer rounded-md border border-base-300 bg-base-200 p-4">
                <aside>
                  <p>Tinyrack SSR release control room</p>
                  <p>Theme verification surface for every daisyUI component.</p>
                </aside>
                <nav>
                  <a className="link link-hover" href="#audit">
                    Audit log
                  </a>
                  <a className="link link-hover" href="#status">
                    Status page
                  </a>
                </nav>
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
