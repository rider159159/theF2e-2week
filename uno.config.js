import { defineConfig } from '@unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';

export default defineConfig({
  exclude: ['node_modules', 'dist', '.git', 'public'],
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  rules: [
    // 文字顏色搭配 theme
    [/^text-(.*)$/, function textColor([, c], { theme }) {
      if (theme.colors[c]) return { color: theme.colors[c] };
      return false;
    }],
    // 背景顏色搭配 theme
    [/^bg-(.*)$/, function bgColor([, c], { theme }) {
      if (theme.colors[c]) return { 'background-color': theme.colors[c] };
      return false;
    }],
  ],
  theme: {
      colors: {
      primary: '#215F78',
      secondary1: '#E99170',
      secondary2: '#F2EFEF',
    }
  }
})