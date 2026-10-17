import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS, MESSAGES } from '../data/testData';

test.describe('Q1 - locked_out_user', () => {
  test('login is rejected with the locked-out error message', async ({ page }) => {
    const login = new LoginPage(page);

    await test.step('Open the site and log in with locked_out_user', async () => {
      await login.goto();
      await login.login(USERS.lockedOut.username, USERS.lockedOut.password);
    });

    await test.step('Verify error message and that the user stays on the login page', async () => {
      await expect(login.error).toBeVisible();
      await expect(login.error).toHaveText(MESSAGES.lockedOut);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  });
});
