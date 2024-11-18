import { Homepage } from "./Homepage.js";

export class PageObjectManager {
  constructor(page) {
    this.page = page;
    this.homepage = new Homepage(page);
  }

  getHomepage() {
    return this.homepage;
  }
}
