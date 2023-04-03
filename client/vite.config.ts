import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      $: './src',
      '$/components': './src/components/*',
      '$/hooks': './src/hooks/index.ts',
      '$/helpers': './src/helpers/index.ts',
      '$/mixins': './src/mixins/*',
      '$/types': './src/types/index.ts',
      '$/views': './src/views/*',
    },
  },
});
