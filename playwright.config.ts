import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Sequential execution: q1 -> q2 -> q3 (alphabetical file order, one worker)
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000, // performance_glitch_user is slow
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
