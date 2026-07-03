import starlight from '@astrojs/starlight';
import { withTinyrackStarlightTheme } from '@tinyrack/themes/astro/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://themes.fixture.local',
  integrations: [
    starlight(
      withTinyrackStarlightTheme({
        title: 'Tinyrack Themes Fixture',
        customCss: ['./src/styles/global.css'],
      }),
    ),
  ],
});
