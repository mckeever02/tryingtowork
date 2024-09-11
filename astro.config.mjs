import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    define: {
      'import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY': JSON.stringify('AIzaSyBlz0UsXYm_NrCoKDjrHxlr9WX5OLB5u-4'),
      'import.meta.env.SUPABASE_URL': JSON.stringify('https://uqsorrbgasntikjgfokx.supabase.co'),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxc29ycmJnYXNudGlramdmb2t4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjA5MjI0OSwiZXhwIjoyMDQxNjY4MjQ5fQ.2yTv5iuKITB80rdbYXOaT84B7tzVCCvmky6p0WhpwVE')
    },
    plugins: []  // Ensure this is empty or remove it if you haven't added any Vite plugins
  }
});