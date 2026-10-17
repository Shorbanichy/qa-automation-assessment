import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuComponent } from '../pages/MenuComponent';
import { USERS, CHECKOUT_INFO, MESSAGES } from '../data/testData';
import { Product } from '../pages/types';

test.describe('Q3 - performance_glitch_user', () => {
  test('sort Z-A, buy first product, verify overview, reset state and logout', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const menu = new MenuComponent(page);
    const added: Product[] = [];

    await test.step('Login as performance_glitch_user (slow login expected)', async () => {
      await login.goto();
      await login.login(USERS.performance.username, USERS.performance.password);
      await inventory.expectLoaded();
    });

    await test.step('Reset App State', async () => {
      await menu.resetAppState();
    });

    await test.step('Filter by name (Z to A) and verify order', async () => {
      await inventory.sortBy('za');
      const names = await inventory.getAllNames();
      expect(names).toEqual([...names].sort().reverse());
    });

    await test.step('Add the first product to the cart', async () => {
      added.push(await inventory.addItemByIndex(0));
      await inventory.expectCartCount(1);
    });

    await test.step('Go to checkout overview and verify product name(s) and total', async () => {
      await inventory.openCart();
      expect(await cart.getNames()).toEqual(added.map(p => p.name));
      await cart.checkout();
      await checkout.fillInfoAndContinue(CHECKOUT_INFO.firstName, CHECKOUT_INFO.lastName, CHECKOUT_INFO.postalCode);
      await checkout.verifyOverview(added);
    });

    await test.step('Finish purchase and verify success message', async () => {
      await checkout.finish();
      await expect(checkout.completeHeader).toHaveText(MESSAGES.orderComplete);
    });

    await test.step('Reset App State again and logout', async () => {
      await menu.resetAppState();
      await menu.logout();
    });
  });
});
