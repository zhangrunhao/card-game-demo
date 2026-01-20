import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, mergeConfig } from 'vite'

const sharedConfig = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
})

const toAbsoluteEntry = (projectRoot: string, entry: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(entry).map(([name, entryPath]) => [name, path.resolve(projectRoot, entryPath)]),
  )

const scanHtmlEntries = (projectRoot: string) =>
  Object.fromEntries(
    fs
      .readdirSync(projectRoot)
      .filter((name) => name.endsWith('.html'))
      .map((name) => [path.parse(name).name, path.resolve(projectRoot, name)]),
  )

export const createProjectConfig = ({
  projectRoot,
  entry,
}: {
  projectRoot: string
  entry?: Record<string, string>
}) => {
  const projectName = path.basename(projectRoot)
  const htmlInputs = entry ? toAbsoluteEntry(projectRoot, entry) : scanHtmlEntries(projectRoot)
  const isMultiPage = Object.keys(htmlInputs).length > 1
  const distRoot = path.resolve(projectRoot, '../../dist', projectName)

  if (Object.keys(htmlInputs).length === 0) {
    throw new Error(`No HTML entry files found in ${projectRoot}.`)
  }

  return defineConfig(({ command }) =>
    mergeConfig(sharedConfig, {
      root: projectRoot,
      base: command === 'build' ? './' : '/',
      appType: isMultiPage ? 'mpa' : 'spa',
      build: {
        outDir: path.join(distRoot, 'html'),
        assetsDir: '../static',
        emptyOutDir: true,
        rollupOptions: {
          input: htmlInputs,
        },
      },
    }),
  )
}

export default sharedConfig
