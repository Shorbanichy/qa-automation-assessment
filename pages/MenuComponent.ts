import { Page, Locator, expect } from '@playwright/test';

export class MenuComponent {
  readonly openBtn: Locator;
  readonly closeBtn: Locator;
  readonly resetLink: Locator;
  readonly logoutLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.openBtn = page.locator('#react-burger-menu-btn');
    this.closeBtn = page.locator('#react-burger-cross-btn');
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async open() {
    await this.openBtn.click();
    await expect(this.resetLink).toBeVisible();
  }

  /** Hamburger menu -> Reset App State, then closes the menu and checks the cart is empty. */
  async resetAppState() {
    await this.open();
    await this.resetLink.click();
    await this.closeBtn.click();
    await expect(this.cartBadge).toHaveCount(0);
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(this.page.locator('[data-test="login-button"]')).toBeVisible();
  }
}
