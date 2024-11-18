const { expect } = require("@playwright/test");
import { globalConfig } from "../config/global.config.js";
import { globalConstant } from "../constants/globalConstant.js";
import { Helpers } from "../utils/Helper.js";

export class CareerPage {
  constructor(page) {
    this.page = page;
    this.helpers = new Helpers(page);
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

    await this.page.waitForTimeout(globalConfig.timeout);
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
  }

  async navigateTo_CareerDetailPage() {
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

    return true;
  }
}
