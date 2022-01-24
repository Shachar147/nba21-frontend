import puppeteer from 'puppeteer';
import {
    buttonSelector,
    openPage,
    performLogin,
} from "../../../helpers/test.utils";

let browser, page;

const settingsLinkSelector = "a[href='/user/settings']";
const autoCalcOTSelector = "[data-testid='auto-calc-ot']";
const defaultGameLengthSelector = "[data-testid='default-game-length']";

describe("<UserSettings /> E2E test suite", () => {

    jest.setTimeout(60000);

    beforeAll(async () => {
        [browser,page] = await openPage();
        page = await performLogin(page);
        await page.$eval(settingsLinkSelector, el => el.click());
        await page.waitForSelector('[data-testid="general-settings"]');
    });

    // page loaded as expected
    test("page loaded as expected", async () => {
        const autoCalcOTLoaded = !!(await page.$(autoCalcOTSelector));
        const gameLengthLoaded = !!(await page.$(defaultGameLengthSelector));
        const buttonLoaded = !!(await page.$(buttonSelector));

        const buttonText = await page.$eval(buttonSelector, el => el.textContent);

        expect(autoCalcOTLoaded).toBe(true);
        expect(gameLengthLoaded).toBe(true);
        expect(buttonLoaded).toBe(true);
        expect(buttonText).toBe('Save');
    });

    // can change auto calc total overtimes flag
    test("can change auto calc total overtimes flag", async () => {
        const autoCalcOT = await page.$eval(autoCalcOTSelector, el => el.checked);
        await page.$eval('[data-testid="auto-calc-ot"]', el => el.click());
        const autoCalcOTAfterChange = await page.$eval(autoCalcOTSelector, el => el.checked);

        // expect our change to toggle the value of the setting.
        expect(autoCalcOT).toBe(!autoCalcOTAfterChange);
    });

    // can change default game length
    test("can change default game length", async () => {
        const gameLength = await page.$eval(defaultGameLengthSelector, el => el.value);
        await page.$eval(defaultGameLengthSelector, el => el.value = 8);
        const gameLengthAfterChange = await page.$eval(defaultGameLengthSelector, el => el.value);
        expect(gameLengthAfterChange).toEqual("8");
    });

    // game length option is numeric (can't use alphabeth)
    test("game length option is numeric (can't use alphabeth)", async () => {
        const gameLength = await page.$eval(defaultGameLengthSelector, el => el.value);
        await page.$eval(defaultGameLengthSelector, el => el.value = "abc");
        const gameLengthAfterChange = await page.$eval(defaultGameLengthSelector, el => el.value);
        expect(gameLengthAfterChange).toEqual("");
    });

    // test("make sure after save, 'Saved!' prompt appears", async () => {
    //     await page.$eval(buttonSelector, el => el.click());
    //
    //     await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 3000));
    //
    //     await page.$eval(buttonSelector, async (el) => {
    //         let message;
    //         await page.on('dialog', async dialog => {
    //             message = dialog.message();
    //             dialog.accept();
    //         });
    //
    //         expect(message).toEqual('Saved!');
    //     });
    // });

    // make sure save works
    test("make sure save works - auto calc ot", async () => {

        const originalAutoCalcOT = await page.$eval(autoCalcOTSelector, el => el.checked);

        // perform changes
        await page.$eval(autoCalcOTSelector, el => el.click());
        await page.$eval(buttonSelector, el => el.click());
        await page.on('dialog', async dialog => dialog.accept());

        // delay & reload
        await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 1000));
        await page.reload();

        // check if it was saved.
        let autoCalcOT = await page.$eval(autoCalcOTSelector, el => el.checked);
        expect(autoCalcOT).toEqual(!originalAutoCalcOT);

        // perform changes again
        await page.$eval(autoCalcOTSelector, el => el.click());
        await page.$eval(buttonSelector, el => el.click());
        await page.on('dialog', async dialog => dialog.accept());

        // delay & reload
        await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 1000));
        await page.reload();

        // check if it was saved.
        autoCalcOT = await page.$eval(autoCalcOTSelector, el => el.checked);
        expect(autoCalcOT).toEqual(originalAutoCalcOT);
    });

    // make sure save works2
    // test("make sure save works - default game length", async () => {
    //
    //     // if its off right now, turn it on first.
    //     const originalAutoCalcOT = await page.$eval(autoCalcOTSelector, el => el.checked);
    //     if (!originalAutoCalcOT){
    //         await page.$eval(autoCalcOTSelector, el => el.click());
    //     }
    //
    //     const originalGameLength = await page.$eval(defaultGameLengthSelector, el => el.value);
    //
    //     // perform changes
    //     await page.$eval(defaultGameLengthSelector, el => el.value = 8);
    //     await page.$eval(buttonSelector, el => el.click());
    //     await page.on('dialog', async dialog => dialog.accept());
    //
    //     // delay & reload
    //     await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 1000));
    //     await page.reload();
    //
    //     // check if it was saved.
    //     let gameLength = await page.$eval(defaultGameLengthSelector, el => el.value);
    //     expect(gameLength).toEqual("8");
    //     //
    //     // // perform changes again
    //     // if (!originalAutoCalcOT) {
    //     //     await page.$eval(autoCalcOTSelector, el => el.click());
    //     // }
    //     // await page.$eval(defaultGameLengthSelector, el => el.value = originalGameLength);
    //     // await page.$eval(buttonSelector, el => el.click());
    //     // await page.on('dialog', async dialog => dialog.accept());
    //     //
    //     // // delay & reload
    //     // await new Promise((resolve,reject) => setTimeout(() => resolve("resolved!"), 1000));
    //     // await page.reload();
    //     //
    //     // // check if it was saved.
    //     // const autoCalcOT = await page.$eval(autoCalcOTSelector, el => el.checked);
    //     // gameLength = await page.$eval(defaultGameLengthSelector, el => el.value);
    //     // expect(autoCalcOT).toEqual(originalAutoCalcOT);
    //     // expect(gameLength).toEqual(originalGameLength);
    // });

    afterAll(async () => {
        browser.close();
    });
});