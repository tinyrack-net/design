# Tinyrack Themes setup guide

`@tinyrack/themes`는 컴포넌트 라이브러리가 아니라 Tinyrack 브랜드 토큰과 UI 라이브러리별 adapter를 제공하는 패키지입니다.

지원하는 사용 환경은 다음과 같습니다.

| 환경 | 권장 import |
| --- | --- |
| Tailwind CSS 4 only | `@tinyrack/themes/tailwind.css` |
| Tailwind CSS 4 + daisyUI | `@tinyrack/themes/tailwind/daisyui.css` |
| Mantine only | `@tinyrack/themes/mantine`, `@tinyrack/themes/mantine.css` |
| Tailwind CSS 4 + Mantine | `@tinyrack/themes/tailwind/mantine.css` + Mantine provider |
| Tailwind CSS 4 + daisyUI + Mantine | explicit composition: Tailwind tokens + daisyUI theme + Mantine CSS |
| Astro Starlight | `withTinyrackStarlightTheme()` or `@tinyrack/themes/astro/starlight.css` |

## 1. 공통 설치

먼저 공통 테마 패키지를 설치합니다.

```bash
pnpm add @tinyrack/themes
```

그 다음 사용하는 UI 환경에 맞는 peer dependency를 추가합니다.

| 환경 | 추가 패키지 |
| --- | --- |
| Tailwind CSS 4 | `tailwindcss` |
| Vite + Tailwind CSS 4 | `tailwindcss @tailwindcss/vite` |
| daisyUI | `tailwindcss daisyui` |
| Mantine | `@mantine/core @mantine/hooks react react-dom` |
| Astro Starlight | `astro @astrojs/starlight` |

예시:

```bash
pnpm add tailwindcss daisyui
pnpm add @mantine/core @mantine/hooks react react-dom
pnpm add astro @astrojs/starlight
```

## 2. Tailwind CSS 4 only

Tailwind utility에서 Tinyrack 토큰만 쓰고 싶은 경우입니다.

### CSS entry

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
```

### 사용 가능한 utility 예시

```html
<section class="bg-tinyrack-surface text-tinyrack-text rounded-tinyrack-box">
  <h1 class="font-tinyrack-heading text-tinyrack-primary">Tinyrack</h1>
  <p class="text-tinyrack-text-muted">Dark brand surface</p>
</section>
```

### 제공되는 대표 토큰

| 종류 | 예시 |
| --- | --- |
| color | `bg-tinyrack-surface`, `text-tinyrack-primary`, `border-tinyrack-border` |
| font | `font-tinyrack-body`, `font-tinyrack-heading`, `font-tinyrack-mono` |
| radius | `rounded-tinyrack-field`, `rounded-tinyrack-box` |

`tailwind.css`는 Tailwind CSS 4의 `@theme static`을 사용하므로, 토큰 기반 utility가 안정적으로 생성됩니다.

## 3. Tailwind CSS 4 + daisyUI

Tailwind utility와 daisyUI 컴포넌트를 같이 쓰는 일반적인 제품 사이트 환경입니다.

### 권장 CSS entry

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind/daisyui.css";
```

`tailwind/daisyui.css`는 아래를 함께 포함합니다.

- Tinyrack Tailwind `@theme static` 토큰
- `tinyrack-light`, `tinyrack-dark` daisyUI theme 변수
- daisyUI plugin theme 등록

### 테마 선택

기본 dark theme는 `tinyrack-dark`입니다. 명시적으로 전환하려면 root에 `data-theme`를 둡니다.

```html
<html data-theme="tinyrack-dark">
  <body>
    <button class="btn btn-primary">Deploy</button>
  </body>
</html>
```

Light theme가 필요한 화면:

```html
<html data-theme="tinyrack-light">
  <body>
    <button class="btn btn-primary">Deploy</button>
  </body>
</html>
```

### 명시적 composition이 필요한 경우

프로젝트에서 daisyUI plugin 순서를 직접 관리해야 한다면 combined preset 대신 아래처럼 구성할 수 있습니다.

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
@import "@tinyrack/themes/daisyui.css";

@plugin "daisyui" {
  themes:
    tinyrack-light,
    tinyrack-dark --default --prefersdark;
}
```

## 4. Mantine only

Mantine 기반 앱에서 Tinyrack Mantine theme만 쓰는 경우입니다.

### App entry

```tsx
import '@mantine/core/styles.css';
import '@tinyrack/themes/mantine.css';
import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';

export function App({ children }: { children: React.ReactNode }) {
  return <TinyrackMantineProvider>{children}</TinyrackMantineProvider>;
}
```

`TinyrackMantineProvider`는 기본적으로 `defaultColorScheme="dark"`를 사용합니다.

### 기존 MantineProvider를 유지하고 싶은 경우

```tsx
import '@mantine/core/styles.css';
import '@tinyrack/themes/mantine.css';
import { MantineProvider } from '@mantine/core';
import { tinyrackMantineTheme } from '@tinyrack/themes/mantine';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark" theme={tinyrackMantineTheme}>
      {children}
    </MantineProvider>
  );
}
```

### Scoped CSS variables

브라우저 extension/content script처럼 theme 변수 scope를 제한해야 하는 경우:

```tsx
import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';

export function ExtensionRoot() {
  return (
    <TinyrackMantineProvider cssVariablesSelector="#tiny-translate-root">
      <div id="tiny-translate-root">
        <App />
      </div>
    </TinyrackMantineProvider>
  );
}
```

## 5. Tailwind CSS 4 + Mantine

Tailwind utility와 Mantine 컴포넌트를 같은 앱에서 쓰는 경우입니다.

### CSS entry

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind/mantine.css";
```

`tailwind/mantine.css`는 아래를 포함합니다.

- Tinyrack Tailwind `@theme static` 토큰
- Mantine 주변부에서 공유할 Tinyrack CSS variables

### App entry

```tsx
import '@mantine/core/styles.css';
import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';
import './styles.css';

export function App({ children }: { children: React.ReactNode }) {
  return <TinyrackMantineProvider>{children}</TinyrackMantineProvider>;
}
```

Tailwind token과 Mantine theme는 서로 다른 시스템입니다. 따라서 Tailwind CSS import만으로 Mantine component theme가 적용되지 않습니다. Mantine component에는 반드시 `TinyrackMantineProvider` 또는 `MantineProvider theme={tinyrackMantineTheme}`가 필요합니다.

## 6. Tailwind CSS 4 + daisyUI + Mantine

세 시스템을 모두 함께 쓰는 앱에서는 combined preset 두 개를 동시에 import하지 말고, 명시적 composition을 권장합니다. `tailwind/daisyui.css`와 `tailwind/mantine.css`를 둘 다 import하면 Tailwind theme token을 중복 import하게 됩니다.

### CSS entry

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
@import "@tinyrack/themes/daisyui.css";
@import "@tinyrack/themes/mantine.css";

@plugin "daisyui" {
  themes:
    tinyrack-light,
    tinyrack-dark --default --prefersdark;
}
```

### App entry

```tsx
import '@mantine/core/styles.css';
import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';
import './styles.css';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <TinyrackMantineProvider>
      <main data-theme="tinyrack-dark">{children}</main>
    </TinyrackMantineProvider>
  );
}
```

### 사용 예시

```tsx
import { Button } from '@mantine/core';

export function MixedSurface() {
  return (
    <section className="bg-tinyrack-surface text-tinyrack-text rounded-tinyrack-box p-6">
      <button className="btn btn-primary" type="button">
        daisyUI action
      </button>
      <Button mt="md">Mantine action</Button>
    </section>
  );
}
```

## 7. Astro Starlight

Starlight docs site에서 Tinyrack docs theme를 쓰는 경우입니다.

### 권장 config

```js
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { withTinyrackStarlightTheme } from '@tinyrack/themes/astro/starlight';

export default defineConfig({
  integrations: [
    starlight(
      withTinyrackStarlightTheme({
        title: 'Docs',
        customCss: ['./src/styles/global.css'],
      }),
    ),
  ],
});
```

`withTinyrackStarlightTheme()`는 `@tinyrack/themes/astro/starlight.css`를 site-local CSS 앞에 prepend합니다. 프로젝트별 화면 스타일은 CSS override보다 inline Tailwind class를 우선합니다.

### subpath CSS resolution이 안 되는 경우

Astro/Starlight 버전에 따라 package subpath CSS를 `customCss`에서 직접 resolve하지 못하면, site-local global CSS에서 import합니다.

```css
@import "@tinyrack/themes/astro/starlight.css";
```

## 8. JS token metadata

테스트, 문서 생성, design tooling에서는 JS token export를 직접 사용할 수 있습니다.

```ts
import { tinyrackPalettes, tinyrackTokens } from '@tinyrack/themes/tokens';
import { tinyrackDaisyUiThemes } from '@tinyrack/themes/daisyui';
import { tinyrackMantineTheme } from '@tinyrack/themes/mantine';
```

## 9. Import decision table

| 내가 원하는 것 | CSS import | JS/React setup |
| --- | --- | --- |
| Tailwind utility만 | `@tinyrack/themes/tailwind.css` | 없음 |
| daisyUI 컴포넌트 + Tailwind utility | `@tinyrack/themes/tailwind/daisyui.css` | `data-theme="tinyrack-dark"` 선택 가능 |
| Mantine 컴포넌트만 | `@tinyrack/themes/mantine.css` | `TinyrackMantineProvider` |
| Tailwind utility + Mantine | `@tinyrack/themes/tailwind/mantine.css` | `TinyrackMantineProvider` |
| Tailwind utility + daisyUI + Mantine | `tailwind.css` + `daisyui.css` + `mantine.css` + daisyUI `@plugin` | `TinyrackMantineProvider` + `data-theme` |
| Starlight docs | `astro/starlight.css` | `withTinyrackStarlightTheme()` |

## 10. Common pitfalls

### `@plugin "daisyui"`를 두 번 선언하지 마세요

`@tinyrack/themes/tailwind/daisyui.css`는 이미 daisyUI plugin registration을 포함합니다. 이 preset을 쓸 때는 앱 CSS에서 별도로 `@plugin "daisyui"`를 다시 선언하지 않는 것을 권장합니다.

### `tailwind/daisyui.css`와 `tailwind/mantine.css`를 동시에 import하지 마세요

둘 다 `tailwind.css`를 포함하는 combined preset입니다. 세 시스템을 모두 쓸 때는 explicit composition을 사용하세요.

### Mantine은 provider가 필요합니다

Tailwind CSS 변수와 utility가 있어도 Mantine component theme는 자동 적용되지 않습니다. `TinyrackMantineProvider` 또는 `MantineProvider theme={tinyrackMantineTheme}`를 사용하세요.

### CSS import 순서

Tailwind CSS 4 환경에서는 대체로 아래 순서를 지키세요.

1. `@import "tailwindcss";`
2. Tinyrack Tailwind/theme CSS
3. library-specific CSS variables
4. library plugin registration, 필요 시
5. app-local overrides

## 11. Verification checklist

새 앱에 적용한 뒤 최소한 아래를 확인합니다.

- Tailwind utility: `bg-tinyrack-surface`, `text-tinyrack-primary`, `rounded-tinyrack-box`가 실제 CSS로 생성되는가?
- daisyUI: `btn btn-primary`가 `tinyrack-dark`에서 achromatic primary로 보이는가?
- Mantine: `Button`, `Card`, `Stepper`가 dark surface에서 achromatic primary와 작은 radius를 쓰는가?
- Starlight: docs shell 배경/텍스트/primary accent가 Tinyrack palette와 맞는가?
- build: `pnpm build` 또는 앱의 production build가 package subpath CSS를 resolve하는가?
