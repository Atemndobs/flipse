import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true,
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          sw: './sw.js'
        }
      },
      assetsDir: '.',
      copyPublicDir: true
    },
    define: {
      __POSTHOG_KEY__: JSON.stringify(env.VITE_POSTHOG_KEY),
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    }
  }
})
