import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    define: {
      'import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY': JSON.stringify('AIzaSyBlz0UsXYm_NrCoKDjrHxlr9WX5OLB5u-4')
    },
    plugins: []  // Ensure this is empty or remove it if you haven't added any Vite plugins
  }
});