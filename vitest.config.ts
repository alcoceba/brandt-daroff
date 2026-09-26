import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig(async (env) => {
  const resolvedViteConfig = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig;

  return mergeConfig(
    resolvedViteConfig,
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json-summary', 'html'],
          include: ['src/**/*.{ts,tsx}'],
          exclude: [
            'src/**/*.test.{ts,tsx}',
            'src/setupTests.ts',
            'src/types/**',
            'src/main.tsx',
            'src/vite-env.d.ts',
          ],
        },
      },
    })
  );
});
