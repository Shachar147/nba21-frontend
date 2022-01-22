import puppeteer from 'puppeteer';
import { openPage, performLogin, buttonSelector, passwordSelector, userSelector } from "../../../src/helpers/test.utils";

let browser, page;

const errorSelector = '[data-testid="error"]';
const messageSelector = '[data-testid="message"]';
const registerSelector = '[data-testid="register"]';

const MESSAGES = {
    USER_EMPTY: "Username can't be empty",
    PASS_EMPTY: "Password can't be empty",
    INCORRECT: "Username or Password are incorrect.",
    SUCCESS: "Logged in successfully!",
};

describe("<LoginPage /> E2E test suite", () => {

    jest.setTimeout(60000);

    beforeAll(async () => {
        [browser,page] = await openPage();
    });

    test('page loads correctly', async () => {
        const userLoaded = !!(await page.$(userSelector));
        const passLoaded = !!(await page.$(passwordSelector));
        const buttonLoaded = !!(await page.$(buttonSelector));
        const registerLoaded = !!(await page.$(registerSelector));

        const buttonText = await page.$eval(buttonSelector, el => el.textContent);

        expect(userLoaded).toBe(true);
        expect(passLoaded).toBe(true);
        expect(buttonLoaded).toBe(true);
        expect(registerLoaded).toBe(true);
        expect(buttonText).toBe('Login');
    });

    test('username is mandatory', async () => {
        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        const error = await page.$eval(errorSelector, el => el.textContent);
        expect(error).toBe(MESSAGES.USER_EMPTY);
    });

    test('password is mandatory', async () => {
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));
        await page.keyboard.type('a fake user');

        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        const error = await page.$eval(errorSelector, el => el.textContent);
        expect(error).toBe(MESSAGES.PASS_EMPTY);
    });

    test('invalid credentials', async () => {
        await page.reload();
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));
        await page.keyboard.type('a fake user');

        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.$eval(passwordSelector, el => (el.value = ''));
        await page.keyboard.type('a fake pass');

        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        const error = await page.$eval(errorSelector, el => el.textContent);
        expect(error).toBe(MESSAGES.INCORRECT);
    });

    test('correct credentials', async () => {

        page = await performLogin(page);

        const home = await page.$eval('.header.content', el => el.textContent);

        expect(home).toContain('Hello! Choose the activity you want to use:');
    });

    test('correct credentials - hit Enter', async () => {

        browser.close();
        [browser,page] = await openPage(browser, page);

        page = await performLogin(page,true);
        const home = await page.$eval('.header.content', el => el.textContent);
        expect(home).toContain('Hello! Choose the activity you want to use:');
    });

    test('register button works', async () => {

        browser.close();
        [browser,page] = await openPage(browser, page);

        await page.waitForSelector(registerSelector);
        await page.click(registerSelector);

        // delay
        await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 1000));

        expect(page.url()).toContain("register");
    });

    afterAll(async () => {
        browser.close();
    });
});