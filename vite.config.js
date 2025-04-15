import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');

  // use api URL from .env file if available,otherwise use a default value
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000/api';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        }
      }
    },
  }
});
