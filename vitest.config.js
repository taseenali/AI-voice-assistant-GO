import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    browser: {
      enabled: true,
      provider: 'webdriverio',
      name: 'chrome',
      headless: true
    },
    include: ['tests/**/*.test.js']
  }
}));
