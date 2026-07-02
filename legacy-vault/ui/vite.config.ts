import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@daml/ledger',
      '@daml/types',
      '@daml.js/legacy-vault-0.1.0/lib/Vault',
      '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662',
      '@mojotech/json-type-validation',
      'lodash',
      'events',
      'cross-fetch',
      'isomorphic-ws',
    ],
  },
  server: {
    proxy: {
      '/v1': {
        target: process.env.VITE_DAML_PROXY_TARGET ?? 'http://localhost:7575',
        changeOrigin: true,
      },
    },
  },
})
