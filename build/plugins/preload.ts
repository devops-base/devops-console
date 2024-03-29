import type { PluginOption } from 'vite'
import { lazyCss, lazyJs, preloadLoad } from '../config'
import {
  handleLazyCss,
  handleLazyJs,
  handlePreloadHtml
} from '../utils/helper'
import {
  handlePreload,
  getHtmlPath,
  firstLoad,
  createPreloadJs,
  createLazyJs,
  createCss,
  handleJs,
  handleCss,
  excludeLoad
} from '../utils/html'

/**
 * 预加载处理
 * @param paths - 路径
 */
export const preloadPlugin = (time = 1000): PluginOption => {
  return {
    name: 'vite-prefetch-plugin',
    async transformIndexHtml(html: string) {
      html = html.replace(/modulepreload/g, 'prefetch')

      if (!preloadLoad.length) return html

      // 预加载js
      preloadLoad.forEach((item) => {
        html = handlePreloadHtml(html, `/${item}`)
      })

      // 懒加载js
      const lazyJsArr: string[] = []
      lazyJs.forEach((item) => {
        const props = { html, path: `/${item}`, arr: lazyJsArr }
        html = handleLazyJs(props)
      })

      // 懒加载css
      const lazyCssArr: string[] = []
      lazyCss.forEach((item) => {
        const props = { html, path: `/${item}`, arr: lazyCssArr }
        html = handleLazyCss(props)
      })

      const timeout = `</body>
      <script>
        ${getHtmlPath}
        ${firstLoad}
        ${createPreloadJs}
        ${createLazyJs}
        ${createCss}
        ${handleJs}
        ${handleCss}
        ${excludeLoad}
        ${handlePreload}

        const params = {
          time: ${time},
          lazyJs: ${JSON.stringify(lazyJsArr)},
          lazyCss: ${JSON.stringify(lazyCssArr)}
        }

        handlePreload(params)
      </script>`

      return html.replace('</body>', timeout)
    }
  }
}
