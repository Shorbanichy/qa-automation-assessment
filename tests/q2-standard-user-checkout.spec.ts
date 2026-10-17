import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuComponent } from '../pages/MenuComponent';
import { USERS, CHECKOUT_INFO, MESSAGES } from '../data/testData';
import { Product } from '../pages/types';

test.describe('Q2 - standard_user end-to-end purchase', () => {
  test('add 3 items, verify checkout overview, finish order, reset state and logout', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const menu = new MenuComponent(page);
    const added: Product[] = [];

    await test.step('Login as standard_user', async () => {
      await login.goto();
      await login.login(USERS.standard.username, USERS.standard.password);
      await inventory.expectLoaded();
    });

    await test.step('Reset App State from hamburger menu', async () => {
      await menu.resetAppState();
    });

    await test.step('Add three items to the cart', async () => {
      for (const i of [0, 1, 2]) added.push(await inventory.addItemByIndex(i));
      await inventory.expectCartCount(3);
    });

    await test.step('Open cart and verify items', async () => {
      await inventory.openCart();
      expect((await cart.getNames()).sort()).toEqual(added.map(p => p.name).sort());
    });

    await test.step('Checkout: fill info and verify product names + total price on final page', async () => {
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
