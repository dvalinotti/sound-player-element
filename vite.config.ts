import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: 'modules',
    outDir: 'dist',
    assetsDir: '',
    sourcemap: process.env.NODE_ENV === 'production',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SoundPlayer'
    }
  },
});
