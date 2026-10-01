import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function inlineProductionStyles(): Plugin {
  return {
    name: 'inline-production-styles',
    apply: 'build',
    writeBundle(options, bundle) {
      const css = Object.values(bundle).find((entry) => entry.type === 'asset' && entry.fileName.endsWith('.css'))

      if (!options.dir || !css || css.type !== 'asset') return

      const cssText = typeof css.source === 'string' ? css.source : new TextDecoder().decode(css.source)
      const htmlPath = join(options.dir, 'index.html')
      const html = readFileSync(htmlPath, 'utf8').replace(/<link rel="stylesheet"[^>]*>/, `<style>${cssText}</style>`)
      writeFileSync(htmlPath, html)
      unlinkSync(join(options.dir, css.fileName))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineProductionStyles()],
})
