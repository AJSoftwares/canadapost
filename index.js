// Imports
const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser');

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, () => console.info(`App listening on port ${port}`));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

class BrowserController {
    constructor() {
        this.browser = null;
        this.pages = [];
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({
            headless: false,
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
            timeout: 0,
            defaultViewport: null, // Set to null for full screen
        });
    }

    async createPage(pageNumber) {
        if (!this.browser) {
            await this.launchBrowser();
        }

        // Check if the requested page number is within the existing pages array
        if (pageNumber > 0 && pageNumber <= this.pages.length) {
            // Return the specified page
            return this.pages[pageNumber - 1];
        }

        // If the specified page number is not available, create a new one
        const page = await this.browser.newPage();
        this.pages.push(page);
        return page;
    }

    async closeBrowser() {
        for (const page of this.pages) {
            await page.close();
        }

        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    getTotalPages() {
        return this.pages.length;
    }
}

const browserController = new BrowserController();


app.get("/logout", async (req, res) => {

    if (browserController.getTotalPages() > 0) {
        await browserController.closeBrowser();
        res.send({ message: 'Logout', status: 200 });
    }

})


app.get("/back", async (req, res) => {

    /*console.log("total pages: " + browserController.getTotalPages());
    if (browserController.getTotalPages() == 2) {
        const page2 = await browserController.createPage(2);

        await page2.goto('https://sso-osu.canadapost-postescanada.ca/pfe-pap/en/profile/mfa', {
            timeout: 0,
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });

        res.send({ page: 2 });
    } else if (browserController.getTotalPages() == 1) {

        const page = await browserController.createPage(1);
        // Navigate the page to a URL
        await page.goto('https://sso-osu.canadapost-postescanada.ca/lfe-cap/en/login', {
            timeout: 0,
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });

        res.send({ page: 1 });
    }*/

    const page2 = await browserController.createPage(browserController.getTotalPages());

    const buttonText = 'choose a different way';

    const buttonChooseDifferentWaySelector = 'p.mb-0 > button.by-keyboard:nth-child(2)';

    //  const buttonChooseDifferentWayElement = await page2.$(buttonChooseDifferentWaySelector);

    // Clicking the second option using page2
    await page2.evaluate((selector) => {
        const ChooseDifferentWayButton = document.querySelector(selector);

        if (ChooseDifferentWayButton) {
            ChooseDifferentWayButton.click();
        }
    }, buttonChooseDifferentWaySelector);

    res.send({ message: "Choose a different way.", status: 200 });

})

app.post("/login", async (req, res) => {

    //const username = await req.body.username
    //const password = await req.body.password

    const { username, passwordConnect } = await req.body;


    //  console.log("u: " + username + ", " + "p: " + password);

    // Launch the browser and open a new blank page
    /* const browser = await puppeteer.launch({
         headless: false,
         waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
         timeout: 0
     });*/
    //const page = await browser.newPage();
    const page = await browserController.createPage();

    // Navigate the page to a URL
    await page.goto('https://sso-osu.canadapost-postescanada.ca/lfe-cap/en/login', {
        timeout: 0,
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });

    // Wait for the username input field to be present
    await page.waitForSelector('input[id=f-username]');

    // Type into search box
    await page.type("input[id=f-username]", username);
    await page.type("input[id=f-password]", passwordConnect);

    // Query for an element handle.
    const SignInResultSelector = '.f-button-group > button' /* '.f-button-group > button'*/;
    // await page.click(searchSignInResultSelector);

    // does work
    await page.evaluate((SignInResultSelector) => document.querySelector(SignInResultSelector).click(), SignInResultSelector);

    const RadioButtonSelector = "cpc-radio-control";


    // Wait for the selector to appear after clicking the button
    const RadioButton = await page.waitForSelector(RadioButtonSelector, { timeout: 10000, visible: true })
        .then(() => true)
        .catch(() => false);

    if (RadioButton) {

        // page2.click(EditProfileResultSelector);
        // page2.waitForNavigation();

        const verifyYourIdentityResult = await page.evaluate(() => {

            let verifyYourIdentityResultSelector = document.querySelectorAll('.cpc-radio-label');
            const verifyYourIdentityArray = [...verifyYourIdentityResultSelector];
            return verifyYourIdentityArray.map(h => h.innerText);


        });

        res.send(verifyYourIdentityResult);

    } else {

        // await page.waitForNavigation();

        const page2 = await browserController.createPage();

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

        res.send(verifyYourIdentityResult);
    }





    //console.log(verifyYourIdentityResult);

    // res.send(verifyYourIdentityResult);



    //await browser.close();

})



app.post("/accesscode", async (req, res) => {

    const { communication, accessCode } = await req.body;

    if (accessCode == "") {
        if (communication == 0) {

            // Assuming you have the selector for the second option
            const phoneRadioButtonSelector = ".cpc-radio-group input[value='SMS']";
            const sendAccessCodeButtonSelector = '.f-button-group > button';

            const page2 = await browserController.createPage(browserController.getTotalPages());



            // does work
            //await page2.evaluate((sendAccessCodeButton) => document.querySelector(sendAccessCodeButton).click(), sendAccessCodeButton);

            //res.send({ status: "Access code sent in your phone number." });


            // Clicking the second option using page2
            await page2.evaluate((selector) => {
                const phoneRadioButton = document.querySelector(selector);
                if (phoneRadioButton) {
                    phoneRadioButton.click();

                }
            }, phoneRadioButtonSelector);


            // Clicking the second option using page2
            await page2.evaluate((selector) => {
                const sendAccessCodeButton = document.querySelector(selector);

                if (sendAccessCodeButton) {
                    sendAccessCodeButton.click();
                }
            }, sendAccessCodeButtonSelector);


            res.send({ message: "Access code sent in your phone number.", status: 200 });


        } else if (communication == 1) {

            // Assuming you have the selector for the second option
            const emailRadioButtonSelector = ".cpc-radio-group input[value='EMAIL']";
            const sendAccessCodeButtonSelector = '.f-button-group > button';


            const page2 = await browserController.createPage(browserController.getTotalPages());

            // Clicking the second option using page2
            await page2.evaluate((selector) => {
                const emailRadioButton = document.querySelector(selector);
                if (emailRadioButton) {
                    emailRadioButton.click();

                }
            }, emailRadioButtonSelector);


            // Clicking the second option using page2
            await page2.evaluate((selector) => {
                const sendAccessCodeButton = document.querySelector(selector);

                if (sendAccessCodeButton) {
                    sendAccessCodeButton.click();
                }
            }, sendAccessCodeButtonSelector);


            res.send({ message: "Access code sent in your email inbox.", status: 200 });

        }
    } else {

        const page2 = await browserController.createPage(browserController.getTotalPages());

        const ManageDashoardSelector = '.sso-username';

        // Wait for the selector to appear after clicking the button
        const ManageDashoard = await page2.waitForSelector(ManageDashoardSelector, { timeout: 10000, visible: true })
            .then(() => true)
            .catch(() => false);


        if (ManageDashoard) {
            res.send({ message: 'Success', status: 200 });
        } else {


            const ManageTwoStepProfileSelector = 'cpc-mfa-manage-form';

            // Find the selector without waiting
            const ManageTwoStepProfileForm = await page2.$(ManageTwoStepProfileSelector);


            if (ManageTwoStepProfileForm) {

                res.send({ message: 'Success', status: 200 });

            } else {

                const ContinueButtonSelector = '.f-button-group > button';


                // Type into search box

                // Assuming you want to clear the input with id "f-otp"
                const inputOTPSelector = "input[id=f-otp]";

                // Use page2.$ to get an ElementHandle
                const inputOTPTextClear = await page2.$(inputOTPSelector);

                // Use evaluate on the ElementHandle
                await inputOTPTextClear.evaluate((input) => {
                    // Your evaluation code here
                    input.value = ''; // Example: Clear the input field
                });


                await page2.type(inputOTPSelector, accessCode);

                // Get the current page URL
                const currentUrl = page2.url();


                // Clicking the second option using page2
                await page2.evaluate((selector) => {
                    const ContinueButton = document.querySelector(selector);

                    if (ContinueButton) {
                        ContinueButton.click();

                    }
                }, ContinueButtonSelector);


                try {
                    // Wait for the navigation to complete with a longer timeout
                    await page2.waitForNavigation({ timeout: 5000, waitUntil: 'domcontentloaded' });

                    // Get the new page URL after clicking the button
                    const newUrl = page2.url();
                    //console.log('New URL after clicking the button (2):', newUrl);
                    // Check if the new page URL is equal to the current one
                    if (newUrl == currentUrl) {
                        res.send({ message: 'Sorry, but this code did not work. It could be incorrect, or may have expired. Please try again.', status: 400 });

                        // Your logic goes here for the "if" condition

                    } else {
                        res.send({ message: 'Success', status: 200 });

                        // Your logic goes here for the "else" condition

                    }
                } catch (error) {
                    //console.error('Navigation timeout exceeded. Proceeding to get the new URL.');
                    const newUrl = page2.url();
                    //console.log('New URL after clicking the button:', newUrl);

                    if (newUrl == currentUrl) {
                        res.send({ message: 'Sorry, but this code did not work. It could be incorrect, or may have expired. Please try again.', status: 400 });
                    } else {

                        // Check if the new URL contains a specific string
                        const targetString = 'https://www.canadapost-postescanada.ca/cpc/en/home.page';
                        if (newUrl.includes(targetString)) {
                            res.send({ message: 'Success', status: 200 });
                        } else {
                            res.send({ message: 'Sorry, but this code did not work. It could be incorrect, or may have expired. Please try again.', status: 400 });
                        }

                    }

                }

            }

        }
    }

})
