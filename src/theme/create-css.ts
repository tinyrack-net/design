import {
  createTinyrackDaisyUiThemeCss,
  createTinyrackTailwindDaisyUiCss,
} from './css/daisyui.js';
import { createTinyrackMantineStylesCss } from './css/mantine.js';
import { createTinyrackStarlightThemeCss } from './css/starlight.js';
import {
  createTinyrackTailwindMantineCss,
  createTinyrackTailwindThemeCss,
} from './css/tailwind.js';

export {
  createTinyrackDaisyUiThemeCss,
  createTinyrackTailwindDaisyUiCss,
} from './css/daisyui.js';
export { createTinyrackMantineStylesCss } from './css/mantine.js';
export { createTinyrackStarlightThemeCss } from './css/starlight.js';
export {
  createTinyrackTailwindMantineCss,
  createTinyrackTailwindThemeCss,
} from './css/tailwind.js';

export type TinyrackGeneratedCssPath =
  | 'tailwind/theme.css'
  | 'tailwind/daisyui.css'
  | 'tailwind/mantine.css'
  | 'daisyui/theme.css'
  | 'mantine/styles.css'
  | 'astro/starlight/theme.css';

export function createTinyrackThemeCssFiles(): Record<
  TinyrackGeneratedCssPath,
  string
> {
  return {
    'tailwind/theme.css': createTinyrackTailwindThemeCss(),
    'tailwind/daisyui.css': createTinyrackTailwindDaisyUiCss(),
    'tailwind/mantine.css': createTinyrackTailwindMantineCss(),
    'daisyui/theme.css': createTinyrackDaisyUiThemeCss(),
    'mantine/styles.css': createTinyrackMantineStylesCss(),
    'astro/starlight/theme.css': createTinyrackStarlightThemeCss(),
  };
}
