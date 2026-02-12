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
        ws: true,
      },
    },
  },
})

export const createProjectConfig = ({
  projectRoot,
}: {
  projectRoot: string
}) => {
  const projectName = path.basename(projectRoot)
  const distRoot = path.resolve(projectRoot, '../../dist', projectName)
  const basePath = `/${projectName}/`

  return defineConfig(({ command }) =>
    mergeConfig(sharedConfig, {
      root: projectRoot,
      base: command === 'build' ? basePath : '/',
      appType: 'spa',
      build: {
        outDir: distRoot,
        assetsDir: 'static',
        emptyOutDir: true,
      },
    }),
  )
}

export default sharedConfig
