import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Served from https://renjithr.github.io/rahulsindia/ — assets must resolve
// under that sub-path, so `base` is set for production builds only.
// GitHub Pages has no SPA fallback: a deep link like /indicator/43 is a real
// 404 unless the same document is also served as 404.html.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/rahulsindia/' : '/',
  plugins: [
    react(),
    {
      name: 'spa-fallback-404',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
}))
