import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 导入自动配置组件,需要的包
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/my-path/',
  plugins: [
    vue(),
    // 自动导入的插件配置
    Components({
      // TypeScript 类型检查
      // 不开起自动生成声明文件
      dts: false,
      // 解析器配置我们项目中配置的是 Vant 组件库的解析。也可以是其他 UI 组件库。
      // importStyle: false 配置参数说明：
      // Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了这里关闭自动引入
      resolvers: [VantResolver({ importStyle: false })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
