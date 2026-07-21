import { TRCode } from '@tinyrack/ui/components/code';
import { TRTable } from '@tinyrack/ui/components/table';
import { tinyrackBreakpoints } from '@tinyrack/ui/core';

const labels = {
  en: ['Token', 'Value', 'CSS media', 'Tailwind variant'],
  ko: ['토큰', '값', 'CSS media', 'Tailwind variant'],
  ja: ['Token', '値', 'CSS media', 'Tailwind variant'],
} as const;

export function BreakpointReference({ locale }: { locale: keyof typeof labels }) {
  return (
    <TRTable.Root containerClassName="tr-mdx-table-container" density="compact">
      <TRTable.Header>
        <TRTable.Row>
          {labels[locale].map((label) => (
            <TRTable.Head key={label} scope="col">
              {label}
            </TRTable.Head>
          ))}
        </TRTable.Row>
      </TRTable.Header>
      <TRTable.Body>
        {Object.entries(tinyrackBreakpoints).map(([name, value]) => (
          <TRTable.Row key={name}>
            <TRTable.Head scope="row">
              <TRCode>{name}</TRCode>
            </TRTable.Head>
            <TRTable.Cell>
              <TRCode>{value}</TRCode>
            </TRTable.Cell>
            <TRTable.Cell>
              <TRCode>{`--tinyrack-breakpoint-${name}-min`}</TRCode>
            </TRTable.Cell>
            <TRTable.Cell>
              <TRCode>{`${name}:*`}</TRCode>
            </TRTable.Cell>
          </TRTable.Row>
        ))}
      </TRTable.Body>
    </TRTable.Root>
  );
}
