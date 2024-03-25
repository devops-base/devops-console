import { defineConfig, loadEnv } from 'vite'
import { handleEnv } from './build/utils/helper'
import { createProxy } from './build/vite/proxy'
import { createVitePlugins } from './build/plugins'
import { buildOptions } from './build/vite/build'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

const NODE_ENV = process.env.NODE_ENV || 'development'
const envFiles = [`.env.${NODE_ENV}`]
for (const file of envFiles) {
  const envConfig = dotenv.parse(fs.readFileSync(file))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = handleEnv(env)
  const { VITE_SERVER_PORT, VITE_PROXY } = viteEnv

  return {
    plugins: createVitePlugins(),
    resolve: {
      alias: {
        '@': '/src',
        '#': '/types'
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        },
      },
    },
    server: {
      open: true,
      port: VITE_SERVER_PORT,
      // 跨域处理
      proxy: createProxy(VITE_PROXY)
    },
    build: buildOptions()
  }
})
