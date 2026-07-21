import postcssGlobalData from '@csstools/postcss-global-data';
import postcss, { type AcceptedPlugin } from 'postcss';
import postcssCustomMedia from 'postcss-custom-media';

const breakpointData = new URL('../packages/ui/src/core/core.css', import.meta.url)
  .pathname;

export function breakpointPostcssPlugins(): AcceptedPlugin[] {
  return [
    postcssGlobalData({ files: [breakpointData] }),
    postcssCustomMedia({ preserve: false }),
  ];
}

export async function transformBreakpointCss(css: string, from: string) {
  const result = await postcss(breakpointPostcssPlugins()).process(css, { from });
  if (
    result.css.includes('@custom-media') ||
    /@media\s*\(\s*--tinyrack-breakpoint-/.test(result.css)
  ) {
    throw new Error(`Unable to resolve Tinyrack breakpoint media in ${from}`);
  }
  return result.css;
}

export function breakpointCustomMediaPlugin() {
  return {
    name: 'tinyrack-breakpoint-custom-media',
    config: () => ({
      css: {
        postcss: { plugins: breakpointPostcssPlugins() },
      },
    }),
  };
}
