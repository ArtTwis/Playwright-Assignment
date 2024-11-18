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
    this.locationDropdown = page.locator(".select2-selection__placeholder");
    this.dropdownSearchInput = page.locator("input[role='searchbox']");
    this.bengaluruDropDownOption = page.locator(
      "//li[contains(text(), 'Bengaluru, India')]"
    );
    this.jobSearchBtn = page.locator(
      ".serachButton.button_button__3HGS0.job_search"
    );
    this.firstOpenPositionJobCard = page.locator(
      "//body/main/section[@class='openPosition secondClass']/div[@class='container']/div[@id='openPositionJobRow']/div[@class='jobOpenPosition']/div[@id='all_jobs_div']/div[@class='row']/div[1]/div[1]"
    );
    this.actualJobTitle = "";
    this.actualExperience = "";
    this.careerDetailPageTitle = page.locator(".pageTitle");
    this.careerDetailExperienceTitle = page.locator(
      "//div[@class='jopOpenExperience']/span[1]/label[1]"
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
    await this.locationDropdown.waitFor({ state: "visible" });
    await this.locationDropdown.click();

    await this.dropdownSearchInput.fill(globalConstant.city);

    await this.bengaluruDropDownOption.waitFor({ state: "visible" });
    await this.bengaluruDropDownOption.click();

    await this.jobSearchBtn.waitFor({ state: "visible" });
    await this.jobSearchBtn.click();

    await this.page.waitForTimeout(globalConfig.longerTimeout);
  }

  async checkAndGet_FirstJob_Details() {
    const jobDetails = await this.page.evaluate(() => {
      const firstCard = document.querySelector(".row .flip-card-block");

      const jobTitle = firstCard.querySelector("h4")?.textContent.trim();
      const experienceSpan = firstCard.querySelector(".jopOpenExperience span");
      const experience = experienceSpan
        ? experienceSpan.textContent.trim()
        : "";

      return { jobTitle, experience };
    });

    this.actualJobTitle = jobDetails.jobTitle;
    this.actualExperience = jobDetails.experience;

    const viewDetailBtn = this.page.locator(".row .flip-card-block a").first();
    await viewDetailBtn.waitFor({ state: "visible" });
    await viewDetailBtn.click();

    await this.page.waitForTimeout(globalConfig.timeout);
  }

  async validateData() {
    const expectedPageTitle = await this.careerDetailPageTitle.textContent();
    await expect(expectedPageTitle).toBe(this.actualJobTitle);

    const expectedExperienceTitle =
      await this.careerDetailExperienceTitle.textContent();
    await expect(expectedExperienceTitle.trim().toLowerCase()).toBe(
      this.actualExperience
    );
  }
}
