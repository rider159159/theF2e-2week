import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite';
import * as path from 'path';

export default defineConfig({
  base: '/theF2e-2week/',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
    Unocss(),
    Pages(),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default'
    }),
    Components(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.js'
    }),
  ]
})
