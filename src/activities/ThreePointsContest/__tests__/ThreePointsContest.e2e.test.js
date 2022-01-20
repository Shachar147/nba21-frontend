import puppeteer from 'puppeteer';
import { openPage, performLogin } from "../../../../src/helpers/test.utils";

let browser, page;

const cardSelector = '[data-testid="three-points"]';

describe("<ThreePointsContest /> E2E test suite", () => {

    jest.setTimeout(60000);

    beforeAll(async () => {
        [browser,page] = await openPage();
        page = await performLogin(page);
        // await page.waitForSelector(cardSelector);
        await page.$eval(cardSelector, el => el.click());

        await page.waitForSelector('[data-testid="Team-One"]');

        // await new Promise((resolve) => setTimeout(resolve, 5000));
        //await page.click(cardSelector);
        // await page.waitForNavigation();
    });

    // ------------------------------------
    // settings page
    // ------------------------------------
    let scope = 'settings page';
    test(`${scope} - make sure players loaded`, async () => {
        const loadedPlayers = (await page.$$('.player.card')).length; // console.log(loadedPlayers);
        expect(loadedPlayers).toBeGreaterThan(100);
    });

    test(`${scope} - can choose players`, async () => {
        const players = [
            "Seth Curry",
            "Stephen Curry",
            "Tyler Herro",
            "Klay Thompson",
        ];
        for (const player of players) {
            await page.$eval(`img[alt='${player}']`, el => el.click());
        }

        let idx = 1;
        const teamSelector = {
            1: '[data-testid="Team-One"]',
            2: '[data-testid="Team-Two"]'
        }
        for (const player of players) {
            let test = (await page.$(`${teamSelector[idx]} [data-testid="Selected-${player.replace(/\s/g,'-')}"]`)); // console.log(player, test);
            expect(test).not.toBeNull();
            idx++; if (idx > 2) idx = 1;
        }
    });

    test(`${scope} - can change computer level`, async () => {
        const computerLevelSelector = '[data-testid="computer-level"]';
        const original = await page.$eval(computerLevelSelector, selectedValue=> selectedValue.value)
        await page.type(computerLevelSelector, 'Hard');
        const changed = await page.$eval(computerLevelSelector, selectedValue=> selectedValue.value)

        expect(original).not.toEqual(changed);
        expect(changed).toEqual("Hard");
    });

    test(`${scope} - can change round length`, async () => {
        const roundLengthSelector = '[data-testid="round-length"]';
        const original = await page.$eval(roundLengthSelector, selectedValue=> selectedValue.value);
        await page.$eval(roundLengthSelector, el => el.value = 5);
        const changed = await page.$eval(roundLengthSelector, selectedValue=> selectedValue.value)

        expect(original).not.toEqual(changed);
        expect(changed).toEqual("5");
    });

    // test(`${scope} - can change order by`, async () => {
    //     // todo complete
    // });

    // test(`${scope} - can choose random`, async () => {
    //     // todo complete
    // });
    //
    // test(`${scope} - can choose computer`, async () => {
    //     // todo complete
    // });

    // ------------------------------------

    // await page.evaluate(() => { debugger; });

    afterAll(async () => {
        browser.close();
    });
});