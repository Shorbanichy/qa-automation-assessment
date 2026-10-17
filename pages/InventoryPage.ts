import { Page, Locator, expect } from '@playwright/test';
import { Product } from './types';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly sort: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.sort = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  /** value: az | za | lohi | hilo */
  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sort.selectOption(value);
  }

  async getAllNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /** Adds the product at position `index` (0-based) and returns its name + price. */
  async addItemByIndex(index: number): Promise<Product> {
    const item = this.items.nth(index);
    const name = (await item.locator('[data-test="inventory-item-name"]').textContent())!.trim();
    const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent())!;
    await item.locator('button[data-test^="add-to-cart"]').click();
    await expect(item.locator('button[data-test^="remove"]')).toBeVisible();
    return { name, price: parseFloat(priceText.replace('$', '')) };
  }

  async expectCartCount(n: number) {
    await expect(this.cartBadge).toHaveText(String(n));
  }

  async openCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }
}
