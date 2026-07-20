import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { extname, join, parse } from 'node:path'

const mobileRoot = fileURLToPath(new URL('.', import.meta.url))
const htmlPages = Object.fromEntries(
  readdirSync(mobileRoot)
    .filter((file) => extname(file) === '.html')
    .map((file) => [parse(file).name, join(mobileRoot, file)]),
)

export default ({ command }) => ({
  root: mobileRoot,
  base: command === 'serve' ? '/mobile/' : '/qiezi-admin/mobile/',
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
  },
  build: {
    outDir: join(mobileRoot, '../dist/mobile'),
    emptyOutDir: true,
    rollupOptions: {
      input: htmlPages,
    },
  },
})
