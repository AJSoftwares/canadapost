const puppeteer = require("puppeteer");

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
        timeout: 0
    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://sso-osu.canadapost-postescanada.ca/lfe-cap/en/login', {
        timeout: 0,
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });

    // Type into search box
    const username = await page.type("input[id=f-username]", "advanced_compu");
    const password = await page.type("input[id=f-password]", "P@ssp0rt!@#$");

    // Query for an element handle.
    const SignInResultSelector = '.f-button-group > button' /* '.f-button-group > button'*/;
    // await page.click(searchSignInResultSelector);

    // does work
    await page.evaluate((SignInResultSelector) => document.querySelector(SignInResultSelector).click(), SignInResultSelector);
    await page.waitForNavigation();


    const page2 = await browser.newPage();

    await page2.goto('https://sso-osu.canadapost-postescanada.ca/pfe-pap/en/profile/mfa', {
        timeout: 0,
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });


    // page2.click(EditProfileResultSelector);
    // page2.waitForNavigation();

    const verifyYourIdentityResult = await page2.evaluate(() => {

        let verifyYourIdentityResultSelector = document.querySelectorAll('.cpc-radio-label');
        const verifyYourIdentityArray = [...verifyYourIdentityResultSelector];
        return verifyYourIdentityArray.map(h => h.innerText);


    });



    console.log(verifyYourIdentityResult);





    await browser.close();
})();