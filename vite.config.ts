import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Served from https://rahulsindia.com/ — an apex custom domain, so assets
// resolve from the root and `base` stays '/' in every mode.
// public/CNAME rides along into dist/ on each build: with Pages deploying from
// an Actions artifact there is no branch for GitHub to keep the domain in, so
// the artifact has to carry it or the custom domain is dropped on deploy.
// GitHub Pages has no SPA fallback: a deep link like /indicator/43 is a real
// 404 unless the same document is also served as 404.html.
export default defineConfig(() => ({
  base: '/',
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
