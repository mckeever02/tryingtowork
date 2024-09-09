import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
          'import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY': JSON.stringify('AIzaSyBlz0UsXYm_NrCoKDjrHxlr9WX5OLB5u-4')
    }
  }
});
