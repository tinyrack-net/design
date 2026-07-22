import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const homepage = new URL('../../../../homepage/app/', import.meta.url);

function readHomepage(path: string) {
  return readFileSync(new URL(path, homepage), 'utf8');
}

test('keeps dialog previews and paste-ready sources structurally aligned', () => {
  const demo = readHomepage('documentation/components/dialog.demo.tsx');

  expect(demo).toContain('<TRDialog.Viewport>');
  expect(demo).toContain('data-dialog-scroll-body=""');
  expect(demo).toContain('open: false');
  expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');

  for (const locale of ['en', 'ko', 'ja']) {
    const docs = readHomepage(`content/${locale}/components/dialog.mdx`);
    const taskSource = docs.slice(docs.indexOf('function DeploymentDialog()'));
    expect(taskSource).toContain('<TRDialog.Viewport>');
    expect(taskSource).toContain('data-dialog-scroll-body=""');
    expect(taskSource.indexOf('<TRDialog.Viewport>')).toBeLessThan(
      taskSource.indexOf('<TRDialog.Popup placement="middle">'),
    );
    expect(taskSource.indexOf('</TRDialog.Popup>')).toBeLessThan(
      taskSource.indexOf('</TRDialog.Viewport>'),
    );
  }
});

test('localizes the dialog contract and API guidance in Korean and Japanese', () => {
  const ko = readHomepage('content/ko/components/dialog.mdx');
  const ja = readHomepage('content/ja/components/dialog.mdx');

  expect(ko).not.toContain('Base UI owns focus trapping');
  expect(ko).toContain('Base UI는 포커스 트랩');
  expect(ja).not.toContain('Base UI owns focus trapping');
  expect(ja).toContain('Base UI はフォーカストラップ');
});
