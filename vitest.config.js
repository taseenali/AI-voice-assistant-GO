import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Browser/WebDriver runner requires matching Chrome/Chromedriver; unit tests run in jsdom.
    browser: {
      enabled: false,
      provider: 'webdriverio',
      name: 'chrome',
      headless: true
    },
    include: ['tests/**/*.test.js']
  }
}));
