import type React from 'react';
import { createRoot } from 'react-dom/client';
import { TRAlert } from '../../../ui/src/components/alert/index.tsx';
import '../../../ui/src/components/alert/alert.css';
import { TRBadge } from '../../../ui/src/components/badge/index.tsx';
import '../../../ui/src/components/badge/badge.css';
import { TRButton } from '../../../ui/src/components/button/index.tsx';
import '../../../ui/src/components/button/button.css';
import { TRCard } from '../../../ui/src/components/card/index.tsx';
import '../../../ui/src/components/card/card.css';
import { TRField } from '../../../ui/src/components/field/index.tsx';
import '../../../ui/src/components/field/field.css';
import { TRIconButton } from '../../../ui/src/components/icon-button/index.tsx';
import '../../../ui/src/components/icon-button/icon-button.css';
import { TRInput } from '../../../ui/src/components/input/index.tsx';
import '../../../ui/src/components/input/input.css';
import { TRSpinner } from '../../../ui/src/components/spinner/index.tsx';
import '../../../ui/src/components/spinner/spinner.css';
import { TRText } from '../../../ui/src/components/text/index.tsx';
import '../../../ui/src/components/text/text.css';
import '../../../ui/src/core/core.css';
import './fixture.css';

let query = new URLSearchParams(location.search);
const component = query.get('component') ?? 'button';
const locale = query.get('locale') ?? 'en';
const arg = (name: string, fallback: string) => query.get(name) ?? fallback;
const flag = (name: string) => query.get(name) === 'true';
const copy = {
  en: {
    add: 'Add rack',
    description: 'The rack configuration is up to date.',
    field: 'Rack name',
    healthy: 'Healthy',
    loading: 'Loading',
    saved: 'Changes saved',
    status: 'Rack status',
  },
  ja: {
    add: 'ラックを追加',
    description: 'ラック構成は最新です。',
    field: 'ラック名',
    healthy: '正常',
    loading: '読み込み中',
    saved: '変更を保存しました',
    status: 'ラックの状態',
  },
  ko: {
    add: '랙 추가',
    description: '랙 구성이 최신 상태예요.',
    field: '랙 이름',
    healthy: '정상',
    loading: '불러오는 중',
    saved: '변경 사항을 저장했어요',
    status: '랙 상태',
  },
}[(locale in { en: 1, ja: 1, ko: 1 } ? locale : 'en') as 'en' | 'ja' | 'ko'];

document.documentElement.dataset['theme'] =
  query.get('theme') === 'dark' ? 'tinyrack-dark' : 'tinyrack-light';
document.documentElement.lang = locale;

function Fixture() {
  const intent = arg('intent', 'primary') as
    | 'neutral'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
  const appearance = arg('appearance', 'solid') as 'solid' | 'outline' | 'ghost';
  const uiSize = arg('uiSize', 'md') as 'sm' | 'md' | 'lg';
  const statusVariant = arg('variant', 'neutral') as
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
  const content = (() => {
    switch (component) {
      case 'alert':
        return (
          <TRAlert.Root variant={statusVariant}>
            <div className={flag('showIcon') ? 'parity-alert-row' : undefined}>
              {flag('showIcon') ? (
                <span aria-hidden="true" className="parity-alert-icon" />
              ) : null}
              <div>
                <TRAlert.Title>{copy.saved}</TRAlert.Title>
                {flag('showDescription') ? (
                  <TRAlert.Description>{copy.description}</TRAlert.Description>
                ) : null}
                {flag('showActions') ? (
                  <TRAlert.Actions>
                    <TRText variant="bodySm" weight="medium">
                      Review
                    </TRText>
                  </TRAlert.Actions>
                ) : null}
              </div>
            </div>
          </TRAlert.Root>
        );
      case 'badge':
        return (
          <TRBadge uiSize={uiSize} variant={statusVariant}>
            <span data-parity-part="label">{copy.healthy}</span>
          </TRBadge>
        );
      case 'card':
        return (
          <TRCard.Root
            padding={arg('padding', 'md') as 'none' | 'sm' | 'md' | 'lg'}
            variant={arg('variant', 'default') as 'default' | 'outlined' | 'elevated'}
          >
            <TRCard.Header>
              <TRCard.Title>Rack alpha</TRCard.Title>
              <TRCard.Description>4 services are healthy.</TRCard.Description>
            </TRCard.Header>
            <TRCard.Content>
              <TRText variant="bodySm">Latency 18 ms</TRText>
            </TRCard.Content>
            <TRCard.Footer>
              <TRText color="muted" variant="bodySm">
                Updated now
              </TRText>
            </TRCard.Footer>
          </TRCard.Root>
        );
      case 'icon-button':
        return (
          <TRIconButton
            aria-label={copy.add}
            appearance={appearance}
            disabled={flag('disabled')}
            intent={intent}
            loading={flag('loading')}
            loadingLabel={arg('loadingLabel', copy.loading)}
            uiSize={uiSize}
          >
            <span aria-hidden="true" className="parity-plus" />
          </TRIconButton>
        );
      case 'spinner':
        return (
          <TRSpinner
            label={copy.loading}
            uiSize={uiSize}
            variant={
              arg('variant', 'current') as 'current' | 'muted' | 'primary' | 'danger'
            }
          />
        );
      case 'text':
        return (
          <TRText
            {...(query.has('align')
              ? {
                  align: query.get('align') as 'start' | 'center' | 'end',
                }
              : {})}
            {...(query.has('color')
              ? {
                  color: query.get('color') as NonNullable<
                    React.ComponentProps<typeof TRText>['color']
                  >,
                }
              : {})}
            truncate={flag('truncate')}
            variant={
              arg('variant', 'headingMd') as NonNullable<
                React.ComponentProps<typeof TRText>['variant']
              >
            }
            {...(query.has('weight')
              ? {
                  weight: query.get('weight') as NonNullable<
                    React.ComponentProps<typeof TRText>['weight']
                  >,
                }
              : {})}
          >
            {copy.status}
          </TRText>
        );
      case 'text-field':
        return (
          <TRField.Root disabled={flag('disabled')} invalid={query.has('errorText')}>
            <TRField.Label>{copy.field}</TRField.Label>
            <TRInput
              aria-invalid={query.has('errorText') || undefined}
              disabled={flag('disabled')}
              placeholder={arg('placeholder', 'Rack alpha')}
              readOnly={flag('readOnly')}
              uiSize={uiSize}
              value={arg('value', '')}
            />
            {query.has('errorText') ? (
              <TRField.Error match>{query.get('errorText')}</TRField.Error>
            ) : null}
          </TRField.Root>
        );
      default:
        return (
          <TRButton
            appearance={appearance}
            disabled={flag('disabled')}
            intent={intent}
            loading={flag('loading')}
            loadingLabel={arg('loadingLabel', copy.loading)}
            uiSize={uiSize}
          >
            <span data-parity-part="label">
              {arg(
                'children',
                locale === 'ja' ? 'デプロイ' : locale === 'ko' ? '배포' : 'Deploy',
              )}
            </span>
          </TRButton>
        );
    }
  })();

  return <div data-parity-target={component}>{content}</div>;
}

const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Missing visual parity fixture root.');
const root = createRoot(rootElement);
(
  window as Window & {
    __setParityQuery?: (search: string) => void;
  }
).__setParityQuery = (search) => {
  query = new URLSearchParams(search);
  root.render(<Fixture />);
};
root.render(<Fixture />);
