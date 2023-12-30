$(document).ready(async function () {

    showLoading();

    try {
        // Make an asynchronous API call using fetch
        const response = await fetch('/logout', {
            method: 'GET',

        });


    } catch (error) {


        console.error('An unexpected error occurred:', error);
    } finally {
        // Hide loading image
        hideLoading();
    }


});


async function step2Form() {

    // Get form data
    const currentForm = document.getElementById(`step2Form`);

    if (currentForm) {

        showLoading();

        // Initialize an empty object to store form data
        const formData = {};

        // Iterate over form elements and add them to the formData object
        for (const element of currentForm.elements) {
            // Exclude buttons and other non-input elements
            if (element.type != 'button' && element.type != 'submit') {
                // Handle radio buttons separately
                if (element.type == 'radio') {
                    // Check if the radio button is checked
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                } else {
                    // For other input types (text, email, etc.)
                    formData[element.name] = element.value;
                }
            }
        }

        try {
            // Make an asynchronous API call using fetch
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status == 400) {
                    displayStepError(2, data.message);
                } else {
                    //console.log(data);
                    // Call the function with the sample array
                    generateRadioButtons(data);

                    moveToNextStep();
                }



            } else {

                displayStepError(2, 'API Error: ' + response.statusText);
            }
        } catch (error) {

            displayStepError(2, 'An unexpected error occurred: ' + error);

        } finally {
            // Hide loading image
            hideLoading();
        }

    }
}



async function step3Form() {

    // Get form data
    const currentForm = document.getElementById(`step3Form`);

    if (currentForm) {

        showLoading();

        // Initialize an empty object to store form data
        const formData = {};

        // Iterate over form elements and add them to the formData object
        for (const element of currentForm.elements) {
            // Exclude buttons and other non-input elements
            if (element.type != 'button' && element.type != 'submit') {
                // Handle radio buttons separately
                if (element.type == 'radio') {
                    // Check if the radio button is checked
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                } else {
                    // For other input types (text, email, etc.)
                    formData[element.name] = element.value;
                }
            }
        }

        // Append accessCode with an empty value
        formData['accessCode'] = '';

        try {
            // Make an asynchronous API call using fetch
            const response = await fetch('/accesscode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status == 200) {
                    moveToNextStep();
                }


            } else {

                displayStepError(3, 'API Error: ' + response.statusText);
            }
        } catch (error) {

            displayStepError(3, 'An unexpected error occurred: ' + error);

        } finally {
            // Hide loading image
            hideLoading();
        }

    }
}

async function step4Form() {

    // Get form data
    const currentForm = document.getElementById(`step4Form`);

    if (currentForm) {

        showLoading();

        // Initialize an empty object to store form data
        const formData = {};

        // Iterate over form elements and add them to the formData object
        for (const element of currentForm.elements) {
            // Exclude buttons and other non-input elements
            if (element.type != 'button' && element.type != 'submit') {
                // Handle radio buttons separately
                if (element.type == 'radio') {
                    // Check if the radio button is checked
                    if (element.checked) {
                        formData[element.name] = element.value;
                    }
                } else {
                    // For other input types (text, email, etc.)
                    formData[element.name] = element.value;
                }
            }
        }


        try {
            // Make an asynchronous API call using fetch
            const response = await fetch('/accesscode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status == 200) {

                    moveToNextStep();

                    showLoading();
                } else {

                    displayStepError(4, data.message);
                }



            } else {

                displayStepError(4, 'API Error: ' + response.statusText);
            }
        } catch (error) {


            if (error.status == 200) {

                // moveToNextStep();
            } else {

                displayStepError(4, 'An unexpected error occurred: ' + error);
            }


        } finally {
            // Hide loading image
            hideLoading();
        }

    }
}

async function stepLogout() {

    location.reload();

}

async function step4FormBack() {

    showLoading();

    try {
        // Make an asynchronous API call using fetch
        const response = await fetch('/back', {
            method: 'GET',
        });

        if (response.ok) {
            // Additional logic if needed
            const data = await response.json();

            if (data.status == 200) {
                return true;

            } else {
                return false;
            }

        } else {

            displayStepError(4, 'API Error: ' + response.statusText);
            return false;
        }
    } catch (error) {

        displayStepError(4, 'An unexpected error occurred: ' + error);
        return false;

    } finally {
        // Hide loading image
        hideLoading();
    }

}


async function step5Form() {


    showLoading();

    try {
        // Make an asynchronous API call using fetch
        const response = await fetch('/profile', {
            method: 'GET',
        });

        if (response.ok) {
            // Additional logic if needed
            const data = await response.json();

            if (data.status == 200) {

                const customerNumber = document.getElementById('customerNumber');
                customerNumber.textContent = data.customerInfo.customerNumber;

                const contractNumber = document.getElementById('contractNumber');
                contractNumber.textContent = data.customerInfo.contractNumber;

            } else {
                displayStepError(5, 'API Error: ' + response.statusText);
            }

        } else {

            displayStepError(5, 'API Error: ' + response.statusText);

        }
    } catch (error) {

        displayStepError(5, 'An unexpected error occurred: ' + error);

    } finally {
        // Hide loading image
        hideLoading();
    }
}


function displayStepError(step, errorMessage) {
    const errorDiv = document.getElementById(`error-step${step}`);
    if (errorDiv) {
        errorDiv.textContent = errorMessage;
    }
}



// Function to generate dynamic radio buttons
function generateRadioButtons(dataArray) {

    const communicationMethodContainer = document.getElementById('communicationMethodContainer');

    // Check if the element exists
    if (communicationMethodContainer) {
        // Remove all inner child elements by emptying the content
        communicationMethodContainer.innerHTML = '';

        dataArray.forEach((item, index) => {

            const lowercasedItem = item.toLowerCase();

            if (lowercasedItem.includes("email")) {

                // Create the radio button and label HTML
                const radioHtml = `<div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="communication" id="emailRadio"
                                        value="1" required>
                                    <label class="form-check-label" for="emailRadio">${item}</label>
                                </div>
                                </div>`;

                // Append the HTML to the container
                communicationMethodContainer.innerHTML += radioHtml;

            } else if (lowercasedItem.includes("text message")) {

                // Create the radio button and label HTML
                const radioHtml = `<div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="communication" id="smsRadio"
                                        value="0" checked required>
                                    <label class="form-check-label" for="smsRadio">${item}</label>
                                </div>
                                </div>`;

                // Append the HTML to the container
                communicationMethodContainer.innerHTML += radioHtml;
            }
        });
    }

}