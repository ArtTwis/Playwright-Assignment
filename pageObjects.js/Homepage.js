const { expect } = require("@playwright/test");
import { globalConfig } from "../config/global.config.js";
import { globalConstant } from "../constants/globalConstant.js";
import { Helpers } from "../utils/Helper.js";

export class Homepage {
  constructor(page) {
    this.page = page;
    this.helpers = new Helpers(page);
    this.quarks_Logo = page
      .getByRole("img", { name: "Quarks Technosoft" })
      .first();
    this.cookies = page.locator("div[class='cookies']");
    this.cookie_Accept_Btn = page.locator(".setCookie");
    this.navItems = page.locator("//li[@class='nav-item dropMenuOpen']");
    this.career_NavLink = page.locator(
      "//a[@class='nav-link'][normalize-space()='Careers']"
    );
    this.exploreJobsBtn = page.locator("//a[normalize-space()='Explore Jobs']");
    this.locationDropdown = page.locator("//select[@id='locationDropdown']");
    this.bengaluruDropDownOption = page.locator(
      "#select2-locationDropdown-result-74fc-Bengaluru, India"
    );
  }

  async launchUrl() {
    await this.page.goto(globalConfig.baseUrl);
  }

  async ifCookieAlert_Accept() {
    const isCookieAlert_Visible = await this.cookies.isVisible();
    if (isCookieAlert_Visible) {
      await this.cookie_Accept_Btn.click();
    }
    await this.helpers.waitForSometime(globalConfig.timeout);
  }

  async isVisible_Quarks_Logo() {
    return await this.quarks_Logo.isVisible();
  }

  async mouse_Hover_On_NavItems() {
    const navItemCount = await this.navItems.count();

    for (let i = 0; i < navItemCount; i++) {
      const navItem = this.navItems.nth(i);
      await navItem.hover();
      await this.page.waitForTimeout(globalConfig.timeout);
    }
  }

  async checkAndNavigate_To_Career() {
    const isCareerNavLinkVisible = await this.career_NavLink.isVisible();

    if (isCareerNavLinkVisible) {
      await this.career_NavLink.click();
      await this.page.waitForTimeout(globalConfig.timeout);
    }
  }

  async checkAndNavigate_To_OpenPosition_Section() {
    await expect(this.page).toHaveURL(globalConstant.careerPageURL);
    await expect(this.page).toHaveTitle(globalConstant.careerPageTitle);

    const isExploreJobsBtnVisible = await this.exploreJobsBtn.isVisible();

    if (isExploreJobsBtnVisible) {
      await this.exploreJobsBtn.click();
    }
  }

  async checkAndSelect_Bengaluru_Option() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.locationDropdown.waitFor({ state: "visible" });

    const isLocationDropdownVisible = await this.locationDropdown.isVisible();

    if (isLocationDropdownVisible) {
      await this.locationDropdown.click({ force: true });
      await this.page.waitForTimeout(globalConfig.);
    }
  }
}
