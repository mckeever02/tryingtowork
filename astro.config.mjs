import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    define: {
      'import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.PUBLIC_GOOGLE_MAPS_API_KEY),
      'import.meta.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY)
    },
    plugins: []  // Ensure this is empty or remove it if you haven't added any Vite plugins
  }
});