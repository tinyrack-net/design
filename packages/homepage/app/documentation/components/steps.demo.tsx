import { TRCode } from '@tinyrack/ui/components/code';
import { TRSteps } from '@tinyrack/ui/components/steps';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const stepsCopy = {
  en: { basic: ['Install the package', 'Create the config', 'Build the site'], headings: ['Create a project', 'Install and configure', 'Write the guide'], prose: ['Start with a React app and add the Tinyrack packages.', 'Install the UI package, then import the Steps styles.', 'Use normal React children inside each item.'] },
  ko: { basic: ['패키지 설치', '설정 만들기', '사이트 빌드'], headings: ['프로젝트 만들기', '설치 및 설정', '가이드 작성'], prose: ['React 앱을 만들고 Tinyrack 패키지를 추가하세요.', 'UI 패키지를 설치한 다음 Steps 스타일을 불러오세요.', '각 항목 안에 일반 React 자식을 사용하세요.'] },
  ja: { basic: ['パッケージをインストール', '設定を作成', 'サイトをビルド'], headings: ['プロジェクトを作成', 'インストールと設定', 'ガイドを作成'], prose: ['React アプリを作成し、Tinyrack パッケージを追加してください。', 'UI パッケージをインストールし、Steps のスタイルを読み込んでください。', '各項目には通常の React 子要素を使用してください。'] },
} as const;

type Args = Record<string, never>;

export function StepsPreview() {
  const locale = useDemoLocale();
  const copy = stepsCopy[locale];
  return (
    <TRSteps.Root className="!my-0" data-docs-example-item="">
      {copy.basic.map((item) => <TRSteps.Item key={item}>{item}</TRSteps.Item>)}
    </TRSteps.Root>
  );
}

export function StepsGuidePreview() {
  const locale = useDemoLocale();
  const copy = stepsCopy[locale];
  return (
    <TRSteps.Root className="!my-0 w-full max-w-2xl" data-docs-example-item="">
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">{copy.headings[0]}</h3>
        <p>{copy.prose[0]}</p>
        <TRCode>pnpm create vite my-app --template react-ts</TRCode>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">{copy.headings[1]}</h3>
        <p>{copy.prose[1]}</p>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3 className="text-tinyrack-lg font-semibold">{copy.headings[2]}</h3>
        <p>{copy.prose[2]}</p>
      </TRSteps.Item>
    </TRSteps.Root>
  );
}

export const stepsBasicSource = `import '@tinyrack/ui/components/steps.css';
import { TRSteps } from '@tinyrack/ui/components/steps';

export function InstallationSteps() {
  return (
    <TRSteps.Root aria-label="Installation">
      <TRSteps.Item>Install the package</TRSteps.Item>
      <TRSteps.Item>Create the config</TRSteps.Item>
      <TRSteps.Item>Build the site</TRSteps.Item>
    </TRSteps.Root>
  );
}`;

export const stepsRichContentSource = `import '@tinyrack/ui/components/code.css';
import '@tinyrack/ui/components/steps.css';
import { TRCode } from '@tinyrack/ui/components/code';
import { TRSteps } from '@tinyrack/ui/components/steps';

export function ProjectGuide() {
  return (
    <TRSteps.Root aria-label="Create a project">
      <TRSteps.Item>
        <h3>Create a project</h3>
        <p>Start with a React app and add the Tinyrack packages.</p>
        <TRCode>pnpm create vite my-app --template react-ts</TRCode>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3>Install and configure</h3>
        <p>Install the UI package, then import the Steps styles.</p>
      </TRSteps.Item>
      <TRSteps.Item>
        <h3>Write the guide</h3>
        <p>Use normal React children inside each item.</p>
      </TRSteps.Item>
    </TRSteps.Root>
  );
}`;

const meta = {
  args: {},
  argTypes: {},
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  render: StepsGuidePreview,
  title: 'Components/Steps',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
