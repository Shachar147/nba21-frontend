import puppeteer from 'puppeteer';
import { openPage, buttonSelector, passwordSelector, userSelector, registerSelector } from "../../../helpers/test.utils";
import {sleep} from "../../../helpers/utils";

let browser, page;

const passwordAgainSelector = '[data-testid="passwordAgain"]';
const errorSelector = '[data-testid="error"]';
const loginSelector = '[data-testid="login"]';

const MESSAGES = {
    USER_EMPTY: "Username can't be empty",
    PASS_EMPTY: "Password can't be empty",
    NOT_MATCH: "Passwords do not match",
    WEAK_PASS: "password must be longer than or equal to 8 characters",
    ALREADY_EXIST: "Username already exists",
    SUCCESS: "Registered successfully!",
};

describe("<RegisterPage /> E2E test suite", () => {

    jest.setTimeout(60000);

    beforeAll(async () => {
        [browser,page] = await openPage();
        await page.click(registerSelector);
    });

    test('page loads correctly', async () => {
        const userLoaded = !!(await page.$(userSelector));
        const passLoaded = !!(await page.$(passwordSelector));
        const pass2Loaded = !!(await page.$(passwordAgainSelector));
        const buttonLoaded = !!(await page.$(buttonSelector));
        const loginLoaded = !!(await page.$(loginSelector));

        const buttonText = await page.$eval(buttonSelector, el => el.textContent);

        expect(userLoaded).toBe(true);
        expect(pass2Loaded).toBe(true);
        expect(passLoaded).toBe(true);
        expect(buttonLoaded).toBe(true);
        expect(loginLoaded).toBe(true);
        expect(buttonText).toBe('Register');
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

    // password again is mandatory
    test('password again is mandatory', async () => {
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
        expect(error).toBe(MESSAGES.NOT_MATCH);
    });

    // passwords must match
    test('passwords must match', async () => {
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));
        await page.keyboard.type('a fake user');

        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.$eval(passwordSelector, el => (el.value = ''));
        await page.keyboard.type('a fake pass');

        await page.waitForSelector(passwordAgainSelector);
        await page.click(passwordAgainSelector);
        await page.$eval(passwordAgainSelector, el => (el.value = ''));
        await page.keyboard.type('a different pass');

        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        const error = await page.$eval(errorSelector, el => el.textContent);
        expect(error).toBe(MESSAGES.NOT_MATCH);
    });

    // password complexity - weak password
    test('password complexity - password can\'t be weak', async () => {
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));
        await page.keyboard.type('a fake user');

        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.$eval(passwordSelector, el => (el.value = ''));
        await page.keyboard.type('1');

        await page.waitForSelector(passwordAgainSelector);
        await page.click(passwordAgainSelector);
        await page.$eval(passwordAgainSelector, el => (el.value = ''));
        await page.keyboard.type('1');

        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        const error = await page.$eval(errorSelector, el => el.textContent);
        expect(error).toContain(MESSAGES.WEAK_PASS);
    });

    // username already exist
    test('Username already exist', async () => {
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));
        await page.keyboard.type('Test');

        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.$eval(passwordSelector, el => (el.value = ''));
        await page.keyboard.type('Aa12345678');

        await page.waitForSelector(passwordAgainSelector);
        await page.click(passwordAgainSelector);
        await page.$eval(passwordAgainSelector, el => (el.value = ''));
        await page.keyboard.type('Aa12345678');

        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        // delay
        await sleep(1000);

        const error = await page.$eval(errorSelector, el => el.textContent);
        expect(error).toContain(MESSAGES.ALREADY_EXIST);
    });

    test('correct credentials', async () => {
        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));

        // get random user name
        const randNum = Math.ceil(Math.random() * 10000);
        await page.keyboard.type('testCase' + randNum);

        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.$eval(passwordSelector, el => (el.value = ''));
        await page.keyboard.type('Aa123456');

        await page.waitForSelector(passwordAgainSelector);
        await page.click(passwordAgainSelector);
        await page.$eval(passwordAgainSelector, el => (el.value = ''));
        await page.keyboard.type('Aa123456');

        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        // delay
        await sleep(1000);

        expect(page.url()).toContain("login");
    });

    test('correct credentials - hit Enter', async () => {

        browser.close();
        [browser,page] = await openPage(browser, page);
        await page.click(registerSelector);

        await page.waitForSelector(userSelector);
        await page.click(userSelector);
        await page.$eval(userSelector, el => (el.value = ''));

        // get random user name
        const randNum = Math.ceil(Math.random() * 10000);
        await page.keyboard.type('testCase' + randNum);

        await page.waitForSelector(passwordSelector);
        await page.click(passwordSelector);
        await page.$eval(passwordSelector, el => (el.value = ''));
        await page.keyboard.type('Aa123456');

        await page.waitForSelector(passwordAgainSelector);
        await page.click(passwordAgainSelector);
        await page.$eval(passwordAgainSelector, el => (el.value = ''));
        await page.keyboard.type('Aa123456');

        // hit Enter
        await page.keyboard.press('Enter');

        // delay
        await sleep(1000);

        expect(page.url()).toContain("login");
    });

    test('login link works', async () => {

        browser.close();
        [browser,page] = await openPage(browser, page);
        await page.click(registerSelector);

        await page.waitForSelector(loginSelector);
        await page.click(loginSelector);

        // delay
        await sleep(1000);

        expect(page.url()).toContain("login");
    });

    afterAll(async () => {
        browser.close();
    });
});