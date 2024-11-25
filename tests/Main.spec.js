const { test, expect, chromium } = require("@playwright/test");
const { PageObjectManager } = require("../pageObjects.js/PomManager");

test.describe("Main Test Execution", () => {
  let pomManager, launchPage, careerpage, browser, context, page;

  test.beforeAll(async ({}) => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    pomManager = new PageObjectManager(page);
    launchPage = pomManager.getHomepage();
    careerpage = pomManager.getCareerpage();
    await launchPage.launchUrl();
  });

  test("HOME PAGE, To verify that consumer is able to see any cookie alert, if 'Yes' than accept cookie [bottom of the page]", async () => {
    await launchPage.ifCookieAlert_Accept();
  });

  test("HOME PAGE, To verify that consumer is able to see company logo at header [left top corner]", async () => {
    const isLogoVisible = await launchPage.isVisible_Quarks_Logo();
    await expect
      .soft(isLogoVisible, "Logo on homePage is visible as expected")
      .toBeTruthy();
  });

  test("HOME PAGE, Hover on each Nav-Item and wait for timeout [top center]", async () => {
    await launchPage.mouse_Hover_On_NavItems();
  });

  test("HOME PAGE, Check for Career button and then navigate to career page", async () => {
    await launchPage.checkAndNavigate_To_Career();
  });

  test("CAREERS PAGE, Check for Explore Jobs button and then navigate to Open Postions section", async () => {
    await careerpage.checkAndNavigate_To_OpenPosition_Section();
  });

  test("CAREERS PAGE, Check for Job Location dropdown and then select bengaluru option", async () => {
    await careerpage.checkAndSelect_Bengaluru_Option();
  });

  test("CAREERS PAGE, Check for first job in list and get details", async () => {
    await careerpage.checkAndGet_FirstJob_Details();
  });

  test("CAREERS DETAIL PAGE, After getting detail navigate to Career Detail page ", async () => {
    await careerpage.navigateTo_CareerDetailPage();
  });

  test("CAREER DETAIL PAGE, Validate data", async () => {
    const isValidated = await careerpage.validateData();
    await expect
      .soft(isValidated, "Data on career detail is as expected..")
      .toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
