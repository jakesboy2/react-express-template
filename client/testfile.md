import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      "process.env": JSON.stringify(env)
    },
    plugins: [react()],
    server: {
      port: 3000,
      hmr: { clientPort: 3000 },
      strictPort: true
    }
  }
})
