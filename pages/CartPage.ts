import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly itemNames: Locator;
  readonly checkoutBtn: Locator;

  constructor(private readonly page: Page) {
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutBtn = page.locator('[data-test="checkout"]');
  }

  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async checkout() {
    await this.checkoutBtn.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }
}
