import { Page, Locator, expect } from '@playwright/test';
import { Product, toCents } from './types';
import { TAX_RATE } from '../data/testData';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueBtn: Locator;
  readonly finishBtn: Locator;
  readonly cartItems: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.finishBtn = page.locator('[data-test="finish"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillInfoAndContinue(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.continueBtn.click();
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  /**
   * On the final checkout (overview) page verify:
   *  - the exact set of product names and prices
   *  - item total == sum of prices
   *  - tax == 8% of item total
   *  - displayed Total == item total + tax
   */
  async verifyOverview(expected: Product[]) {
    await expect(this.cartItems).toHaveCount(expected.length);

    const names = (await this.page.locator('[data-test="inventory-item-name"]').allTextContents()).map(s => s.trim());
    expect([...names].sort()).toEqual(expected.map(p => p.name).sort());

    const prices = (await this.page.locator('[data-test="inventory-item-price"]').allTextContents()).map(toCents);
    expect([...prices].sort((a, b) => a - b)).toEqual(expected.map(p => Math.round(p.price * 100)).sort((a, b) => a - b));

    const expectedSubtotal = expected.reduce((s, p) => s + Math.round(p.price * 100), 0);
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE);
    const expectedTotal = expectedSubtotal + expectedTax;

    expect(toCents(await this.subtotal.innerText())).toBe(expectedSubtotal);
    expect(toCents(await this.tax.innerText())).toBe(expectedTax);
    expect(toCents(await this.total.innerText())).toBe(expectedTotal);
    await expect(this.total).toHaveText(`Total: $${(expectedTotal / 100).toFixed(2)}`);
  }

  async finish() {
    await this.finishBtn.click();
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
  }
}
