import puppeteer from "puppeteer";

export const CREDENTIALS = {
    USER: 'Test',
    PASS: 'Aa123456',
};

export const URL = 'http://localhost:3001/';

export async function openPage(){
    let browser = await puppeteer.launch({
        headless: true,
        slowMo: 8,

        // debug
        // headless: false,
        // slowMo: 30,
        // devtools: true,
    });
    let page = await browser.newPage();
    await page.goto(URL);
    return [browser, page];
}

export const userSelector = '[data-testid="username"]';
export const passwordSelector = '[data-testid="password"]';
export const buttonSelector = '[data-testid="submit"]';
export const registerSelector = '[data-testid="register"]';

export async function performLogin(page, hitEnter = false){
    await page.waitForSelector(userSelector);
    await page.$eval(userSelector, el => (el.value = '')); // clear the input field
    await page.click(userSelector);
    await page.keyboard.type(CREDENTIALS.USER);

    await page.waitForSelector(passwordSelector);
    await page.$eval(passwordSelector, el => (el.value = '')); // clear the input field
    await page.click(passwordSelector);
    await page.keyboard.type(CREDENTIALS.PASS);

    if (hitEnter){
        await page.click(passwordSelector);
        await page.keyboard.press('Enter');
    }
    else {
        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);
    }

    // delay
    await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 1000));
    // await page.waitForSelector('.header.content');

    return page;
}
