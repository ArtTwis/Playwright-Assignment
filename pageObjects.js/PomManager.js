import { Homepage } from "./Homepage.js";
import { CareerPage } from "./CareerPage.js";

export class PageObjectManager {
  constructor(page) {
    this.page = page;
    this.homepage = new Homepage(page);
    this.careerpage = new CareerPage(page);
  }

  getHomepage() {
    return this.homepage;
  }

  getCareerpage() {
    return this.careerpage;
  }
}
