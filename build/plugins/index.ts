import type { PluginOption } from 'vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import { visualizer } from 'rollup-plugin-visualizer'
import { timePlugin } from './time'
import react from '@vitejs/plugin-react-swc'
import Unocss from 'unocss/vite'
import viteCompression from 'vite-plugin-compression'
import {versionUpdatePlugin} from "./version"

export function createVitePlugins() {
  // 插件参数
  const vitePlugins: PluginOption[] = [
    react(),
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons()
      ],
    }),
    // 版本控制
    versionUpdatePlugin(),
  ];

  if (process.env["VITE_ENV"]==='production') {
    // 包分析
    visualizer({
      gzipSize: true,
      brotliSize: true,
    })
    timePlugin()
    vitePlugins.push(viteCompression())
  }
  return vitePlugins
}
