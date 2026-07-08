export const tinyrackStarlightTheme = {
  customCss: ['@tinyrack/themes/astro/starlight.css'],
  colorMode: 'system',
} as const;

export type StarlightThemeConfig = {
  customCss?: string[];
};

export function withTinyrackStarlightTheme<TConfig extends StarlightThemeConfig>(
  config: TConfig,
): TConfig & { customCss: string[] } {
  return {
    ...config,
    customCss: ['@tinyrack/themes/astro/starlight.css', ...(config.customCss ?? [])],
  };
}
