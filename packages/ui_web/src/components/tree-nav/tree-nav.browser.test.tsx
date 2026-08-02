import '../../core/core.css';
import './tree-nav.css';
import { createElement } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRTreeNav, type TRTreeNavItem } from './index.js';

const items: readonly TRTreeNavItem<{ label: string }>[] = [
  {
    activeBranch: true,
    children: [
      { data: { label: 'Leaf one' }, key: 'l1', type: 'leaf' },
      {
        children: [{ data: { label: 'Leaf two' }, key: 'l2', type: 'leaf' }],
        key: 'g2',
        label: 'Group two',
        type: 'group',
      },
    ],
    forceOpen: true,
    key: 'g1',
    label: 'Group one',
    type: 'group',
  },
];

function renderLeaf(
  { data }: { data: { label: string } },
  { depth }: { depth: number },
) {
  return createElement(
    'a',
    { 'data-depth': depth, href: `#${data.label}` },
    data.label,
  );
}

test('renders recursive groups with depth, guide rails, and a custom group label', async () => {
  const view = await render(
    <TRTreeNav
      defaultGroupsOpen
      items={items}
      renderGroupLabel={(item) => <span data-group="">{item.label}</span>}
      renderLeaf={renderLeaf}
    />,
  );
  expect(document.querySelector('nav.tr-tree-nav')).toHaveAccessibleName('Navigation');
  expect(document.querySelectorAll('.tr-tree-nav-group')).toHaveLength(2);
  expect(document.querySelector('[data-group]')).toHaveTextContent('Group one');
  expect(document.querySelector('.tr-tree-nav-list[data-depth="1"]')).not.toBeNull();
  expect(document.querySelector('[data-active-branch]')).not.toBeNull();
  expect(document.querySelector('a[href="#Leaf two"]')).not.toBeNull();
  await view.unmount();
});

test('uses a provided label and default group label rendering', async () => {
  const view = await render(
    <TRTreeNav items={items} label="Docs" renderLeaf={renderLeaf} />,
  );
  expect(document.querySelector('nav')).toHaveAccessibleName('Docs');
  const trigger = document.querySelector('.tr-tree-nav-group-trigger');
  expect(trigger).toHaveTextContent('Group one');
  expect(trigger).toHaveAttribute('data-active-branch');
  await view.unmount();
});
