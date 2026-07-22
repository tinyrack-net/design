import '../../core/core.css';
import './card.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  TRCard,
  TRCardContent,
  TRCardDescription,
  TRCardFooter,
  TRCardHeader,
  TRCardRoot,
  TRCardTitle,
} from './index.js';

test('assembles the semantic card parts', async () => {
  expect(TRCard.Root).toBe(TRCardRoot);
  expect(TRCard.Header).toBe(TRCardHeader);
  expect(TRCard.Title).toBe(TRCardTitle);
  expect(TRCard.Description).toBe(TRCardDescription);
  expect(TRCard.Content).toBe(TRCardContent);
  expect(TRCard.Footer).toBe(TRCardFooter);
  await render(
    <TRCard.Root data-testid="card" padding="lg" variant="elevated">
      <TRCard.Header>
        <TRCard.Title>Server</TRCard.Title>
        <TRCard.Description>Healthy</TRCard.Description>
      </TRCard.Header>
      <TRCard.Content>Details</TRCard.Content>
      <TRCard.Footer>Updated now</TRCard.Footer>
    </TRCard.Root>,
  );
  const root = document.querySelector<HTMLElement>('[data-testid="card"]');
  expect(root?.dataset['padding']).toBe('lg');
  expect(root?.querySelector('header')).not.toBeNull();
  expect(root?.querySelector('footer')).not.toBeNull();
  expect(getComputedStyle(root as HTMLElement).boxShadow).not.toBe('none');
  expect(
    getComputedStyle(root?.querySelector('.tr-card-header') as HTMLElement).display,
  ).toBe('grid');
  expect(
    getComputedStyle(root?.querySelector('.tr-card-footer') as HTMLElement).flexWrap,
  ).toBe('wrap');
});

test('styles every public card variant and padding value', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <TRCard.Root
          data-testid={`padding-${padding}`}
          key={padding}
          padding={padding}
        />
      ))}
      {(['default', 'outlined', 'elevated'] as const).map((variant) => (
        <TRCard.Root
          data-testid={`variant-${variant}`}
          key={variant}
          variant={variant}
        />
      ))}
    </div>,
  );

  const paddingValues = (['none', 'sm', 'md', 'lg'] as const).map((padding) => {
    const element = document.querySelector(
      `[data-testid="padding-${padding}"]`,
    ) as HTMLElement;
    expect(element.dataset['padding']).toBe(padding);
    return Number.parseFloat(getComputedStyle(element).paddingTop);
  });
  expect(paddingValues[0]).toBe(0);
  expect(paddingValues[1]).toBeLessThan(paddingValues[2] as number);
  expect(paddingValues[2]).toBeLessThan(paddingValues[3] as number);

  const standard = document.querySelector(
    '[data-testid="variant-default"]',
  ) as HTMLElement;
  const outlined = document.querySelector(
    '[data-testid="variant-outlined"]',
  ) as HTMLElement;
  const elevated = document.querySelector(
    '[data-testid="variant-elevated"]',
  ) as HTMLElement;
  expect(getComputedStyle(outlined).backgroundColor).not.toBe(
    getComputedStyle(standard).backgroundColor,
  );
  expect(getComputedStyle(elevated).backgroundColor).not.toBe(
    getComputedStyle(standard).backgroundColor,
  );
  expect(getComputedStyle(elevated).boxShadow).not.toBe('none');
  expect(getComputedStyle(elevated).borderColor).toBe('rgba(0, 0, 0, 0)');
  delete document.documentElement.dataset['theme'];
});

test('uses the semantic border token by default while preserving overrides', async () => {
  document.documentElement.style.setProperty('--tinyrack-border', '#123456');
  document.documentElement.style.setProperty('--tinyrack-control-border', '#abcdef');
  await render(<TRCard.Root data-testid="semantic-border" />);

  expect(
    getComputedStyle(
      document.querySelector('[data-testid="semantic-border"]') as HTMLElement,
    ).borderColor,
  ).toBe('rgb(18, 52, 86)');

  document.documentElement.style.removeProperty('--tinyrack-border');
  document.documentElement.style.removeProperty('--tinyrack-control-border');
});

test('preserves the consumer border token on elevated cards', async () => {
  await render(
    <TRCard.Root
      data-testid="custom-elevated-border"
      style={{ '--tr-card-border': 'rgb(18, 52, 86)' } as CSSProperties}
      variant="elevated"
    />,
  );

  expect(
    getComputedStyle(
      document.querySelector('[data-testid="custom-elevated-border"]') as HTMLElement,
    ).borderColor,
  ).toBe('rgb(18, 52, 86)');
});

test('preserves consumer styling tokens across variants', async () => {
  await render(
    <TRCard.Root
      data-testid="custom-card"
      style={
        {
          '--tr-card-background': 'rgb(1, 2, 3)',
          '--tr-card-border': 'rgb(4, 5, 6)',
          '--tr-card-color': 'rgb(7, 8, 9)',
          '--tr-card-padding': '23px',
          '--tr-card-radius': '17px',
          '--tr-card-shadow': 'rgb(10, 11, 12) 0px 2px 4px 0px',
        } as CSSProperties
      }
      variant="elevated"
    >
      Details
    </TRCard.Root>,
  );

  const card = document.querySelector('[data-testid="custom-card"]') as HTMLElement;
  const style = getComputedStyle(card);
  expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
  expect(style.borderColor).toBe('rgb(4, 5, 6)');
  expect(style.color).toBe('rgb(7, 8, 9)');
  expect(style.paddingTop).toBe('23px');
  expect(style.borderRadius).toBe('17px');
  expect(style.boxShadow).toContain('rgb(10, 11, 12)');
});

test('spaces only between the semantic sections that are present', async () => {
  await render(
    <div>
      <TRCard.Root data-testid="content-only">
        <TRCard.Content data-testid="only-content">Details</TRCard.Content>
      </TRCard.Root>
      <TRCard.Root data-testid="header-footer">
        <TRCard.Header>Summary</TRCard.Header>
        <TRCard.Footer data-testid="direct-footer">Updated now</TRCard.Footer>
      </TRCard.Root>
    </div>,
  );

  const root = document.querySelector('[data-testid="content-only"]') as HTMLElement;
  const content = document.querySelector('[data-testid="only-content"]') as HTMLElement;
  const footer = document.querySelector('[data-testid="direct-footer"]') as HTMLElement;
  expect(content.getBoundingClientRect().top - root.getBoundingClientRect().top).toBe(
    Number.parseFloat(getComputedStyle(root).borderTopWidth) +
      Number.parseFloat(getComputedStyle(root).paddingTop),
  );
  expect(getComputedStyle(footer).marginBlockStart).not.toBe('0px');
});

test('renders semantic root and title elements without wrapper nodes', async () => {
  await render(
    <TRCard.Root data-testid="article" render={<article />}>
      <TRCard.Title render={<h3>Runtime health</h3>} />
    </TRCard.Root>,
  );
  const root = document.querySelector<HTMLElement>('[data-testid="article"]');
  expect(root?.tagName).toBe('ARTICLE');
  expect(root?.classList.contains('tr-card')).toBe(true);
  expect(root?.querySelector('h3.tr-card-title')?.textContent).toBe('Runtime health');
  expect(root?.querySelector('div')).toBeNull();
});

test('forwards refs, native props, and events from every public part', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const headerRef = createRef<HTMLElement>();
  const titleRef = createRef<HTMLHeadingElement>();
  const descriptionRef = createRef<HTMLParagraphElement>();
  const contentRef = createRef<HTMLDivElement>();
  const footerRef = createRef<HTMLElement>();
  let clicks = 0;

  await render(
    <TRCard.Root
      aria-label="Runtime health"
      className="consumer-root"
      onClick={() => clicks++}
      ref={rootRef}
    >
      <TRCard.Header data-section="header" ref={headerRef}>
        <TRCard.Title ref={titleRef}>Rack A</TRCard.Title>
        <TRCard.Description ref={descriptionRef}>Healthy</TRCard.Description>
      </TRCard.Header>
      <TRCard.Content ref={contentRef}>Details</TRCard.Content>
      <TRCard.Footer ref={footerRef}>Updated now</TRCard.Footer>
    </TRCard.Root>,
  );

  rootRef.current?.click();
  expect(clicks).toBe(1);
  expect(rootRef.current).toHaveClass('tr-card', 'consumer-root');
  expect(rootRef.current).toHaveAttribute('aria-label', 'Runtime health');
  expect(headerRef.current).toHaveAttribute('data-section', 'header');
  expect(titleRef.current).toHaveClass('tr-card-title');
  expect(descriptionRef.current).toHaveClass('tr-card-description');
  expect(contentRef.current).toHaveClass('tr-card-content');
  expect(footerRef.current).toHaveClass('tr-card-footer');
});

test('allows media to reach the inner edge when padding is none', async () => {
  await render(
    <TRCard.Root
      data-testid="edge-card"
      padding="none"
      style={{ overflow: 'hidden', width: 240 }}
      variant="outlined"
    >
      <div data-testid="edge-media" style={{ height: 40 }} />
    </TRCard.Root>,
  );

  const card = document.querySelector('[data-testid="edge-card"]') as HTMLElement;
  const media = document.querySelector('[data-testid="edge-media"]') as HTMLElement;
  const cardRect = card.getBoundingClientRect();
  const mediaRect = media.getBoundingClientRect();
  const border = Number.parseFloat(getComputedStyle(card).borderLeftWidth);
  expect(getComputedStyle(card).padding).toBe('0px');
  expect(mediaRect.left - cardRect.left).toBe(border);
  expect(cardRect.right - mediaRect.right).toBe(border);
});

test('gives elevated cards a distinct semantic surface in both themes', async () => {
  for (const theme of ['tinyrack-light', 'tinyrack-dark']) {
    document.documentElement.dataset['theme'] = theme;
    const view = await render(
      <div>
        <TRCard.Root data-testid="default-surface" />
        <TRCard.Root data-testid="elevated" variant="elevated" />
      </div>,
    );
    const standard = document.querySelector<HTMLElement>(
      '[data-testid="default-surface"]',
    );
    const elevated = document.querySelector<HTMLElement>('[data-testid="elevated"]');
    expect(getComputedStyle(elevated as HTMLElement).backgroundColor).not.toBe(
      getComputedStyle(standard as HTMLElement).backgroundColor,
    );
    await view.unmount();
  }
  delete document.documentElement.dataset['theme'];
});
