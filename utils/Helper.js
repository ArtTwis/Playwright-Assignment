export class Helpers {
  constructor(page) {
    this.page = page;
  }

  async waitForSometime(timeout) {
    // Wait for the specified timeout
    await this.page.waitForTimeout(timeout);
  }
}
