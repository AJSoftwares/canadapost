
$(document).ready(async function () {
    // Your jQuery code here
    console.log('Document is ready.');
    // You can now safely interact with the DOM or perform other actions.

    try {
        // Make an asynchronous API call using fetch
        const response = await fetch('/logout', {
            method: 'GET',

        });


    } catch (error) {


        console.error('An unexpected error occurred:', error);
    } finally {
        // Hide loading image
        loadingDiv.style.display = 'none';
    }


});


const loadingDiv = document.getElementById('loading');
const radioContainer = document.getElementById('radioContainer');
const resetbtn = document.getElementById('resetbtn');
const connectionContainer = document.getElementById('connectionContainer');
const inputAccessCodeContainer = document.getElementById('inputAccessCodeContainer');

document.getElementById('canada-post-connection-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    var loginbtn = document.getElementById('loginbtn');
    // Check if the element exists before getting the inner text
    if (loginbtn) {
        // Get the inner text of the button
        var buttonText = loginbtn.innerText;

        if (buttonText == "Login") {




            // Show loading image
            loadingDiv.style.display = 'block';

            // Get form data
            const formData = new FormData(event.target);
            const postData = {};
            formData.forEach((value, key) => {
                postData[key] = value;
            });
            try {
                // Make an asynchronous API call using fetch
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(postData),
                });

                console.log(response);
                // Check if the response status is OK (status code 200)
                // Get the element by its ID



                if (response.ok) {
                    const dataArray = await response.json();
                    console.log('API Response:', dataArray);

                    // Set the text content to "done"
                    connectionContainer.textContent = "Your account is connected.";
                    connectionContainer.style.background = "#2dbf2d";
                    resetbtn.style.display = 'none';
                    loginbtn.textContent = 'Logout';

                    // Call the function with the sample array
                    generateRadioButtons(dataArray);


                } else {
                    // Set the text content to "done"
                    connectionContainer.textContent = response.statusText;
                    connectionContainer.style.background = "#bf2d2d";

                    console.error('API Error:', response.statusText);
                }
            } catch (error) {

                // Set the text content to "done"
                connectionContainer.textContent = 'An unexpected error occurred: ' + error;
                connectionContainer.style.background = "#bf2d2d";


                console.error('An unexpected error occurred:', error);
            } finally {
                // Hide loading image
                loadingDiv.style.display = 'none';
            }
        } else if (buttonText == "Logout") {

            location.reload();
        }

    }
});


document.getElementById('canada-post-verification-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission



    const selectedRadioButton = document.querySelector('input[name="communicationMethod"]:checked');
    const communicationContainer = document.getElementById('communicationContainer');


    if (selectedRadioButton) {
        const selectedValue = selectedRadioButton.value;



        if (selectedValue == 0 || selectedValue == 1) {

            const selectedRadioButtonLabelElement = selectedRadioButton.parentElement.querySelector('label');
            const selectedRadioButtonLabelText = selectedRadioButtonLabelElement.textContent.trim();

            radioContainer.style.display = 'none';

            if (selectedValue == 0) {

                // Assuming you have a valid phone number pattern
                const phonePattern = /(?<=Text message: )\S+/;

                // Extract the phone number from the string using the regex
                const phoneMatch = selectedRadioButtonLabelText.match(phonePattern);

                // Check if there is a match and extract the phone number
                const extractedPhoneNumber = phoneMatch ? phoneMatch[0] : null;

                communicationContainer.textContent = "We've sent a one-time access code to the mobile number ending in " + extractedPhoneNumber + ". It will expire in about 5 minutes.";

            } else if (selectedValue == 1) {

                // Assuming you have a valid email pattern
                const emailPattern = /(?<=Email: )\S+/;
                // Extract the email from the radio button's value using the regex
                const emailMatch = selectedRadioButtonLabelText.match(emailPattern);
                // Check if there is a match and extract the email
                const extractedEmail = emailMatch ? emailMatch[0] : null;

                communicationContainer.textContent = "We've sent a one-time access code to the email address " + extractedEmail + ". It will expire in about 30 minutes.";
            }

            // Check if "Access Code" input already exists
            const accessCodeInput = document.getElementById('accessCodeInput');
            // Check if "Access Code" input already exists
            const accessCodeSendButton = document.getElementById('accessCodeSendButton');
            accessCodeSendButton.textContent = 'Verify Code';
            // Get the element by its ID
            const messageContainer = document.getElementById('messageContainer');

            const cancelButton = document.getElementById('cancelButton');
            if (!accessCodeInput) {
                // Create "Access Code" input dynamically
                const newAccessCodeInput = document.createElement('input');
                newAccessCodeInput.type = 'text';
                newAccessCodeInput.id = 'accessCodeInput';
                newAccessCodeInput.name = 'accessCode';
                newAccessCodeInput.placeholder = 'Enter Access Code';

                // Append the div to the container
                inputAccessCodeContainer.appendChild(newAccessCodeInput);



                // Create "Back" button dynamically
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.type = 'button';
                cancelButton.id = 'cancelButton';
                cancelButton.name = 'cancelButton';

                // Add onclick event by referencing the function
                cancelButton.onclick = cancelButtonClickHandler;

                const form = document.getElementById('canada-post-verification-form-fieldset');
                form.appendChild(cancelButton);

                // Show loading image
                loadingDiv.style.display = 'block';

                // Get form data
                const formData = new FormData(event.target);
                const postData = {};
                formData.forEach((value, key) => {
                    postData[key] = value;
                });



                try {
                    // Make an asynchronous API call using fetch
                    const response = await fetch('/accesscode', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(postData),
                    });

                    console.log(response);



                    // Check if the response status is OK (status code 200)
                    if (response.ok) {
                        const data = await response.json();
                        console.log('API Response:', data);


                        if (data.status == 400) {
                            // Set the text content to "done"
                            messageContainer.textContent = data.message;
                            messageContainer.style.background = "#bf2d2d";
                        } else if (data.status == 200) {
                            messageContainer.textContent = "Verified";
                            messageContainer.style.background = "#2dbf2d";
                            accessCodeSendButton.style.display = 'none';
                            accessCodeInput.style.display = 'none';
                            cancelButton.style.display = 'none';

                        } else {
                            // Set the text content to "done"
                            messageContainer.textContent = "Enter your one-time access code";
                            messageContainer.style.background = "#2dbf2d";

                        }

                    } else {
                        console.error('API Error:', response.statusText);
                    }
                } catch (error) {
                    console.error('An unexpected error occurred:', error);
                    messageContainer.textContent = 'An unexpected error occurred: ' + error;
                    messageContainer.style.background = "#bf2d2d";

                } finally {
                    // Hide loading image
                    loadingDiv.style.display = 'none';
                }
            } else {
                // Show loading image
                loadingDiv.style.display = 'block';

                // Get form data
                const formData = new FormData(event.target);
                const postData = {};
                formData.forEach((value, key) => {
                    postData[key] = value;
                });

                try {
                    // Make an asynchronous API call using fetch
                    const response = await fetch('/accesscode', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(postData),
                    });

                    console.log(response);
                    // Check if the response status is OK (status code 200)
                    if (response.ok) {
                        const data = await response.json();
                        console.log('API Response:', data);

                        if (data.status == 400) {
                            // Set the text content to "done"
                            messageContainer.textContent = data.message;
                            messageContainer.style.background = "#bf2d2d";
                        } else if (data.status == 200) {
                            messageContainer.textContent = "Verified";
                            messageContainer.style.background = "#2dbf2d";
                            accessCodeSendButton.style.display = 'none';
                            accessCodeInput.style.display = 'none';
                            cancelButton.style.display = 'none';


                        } else {
                            // Set the text content to "done"
                            messageContainer.textContent = "Enter your one-time access code";
                            messageContainer.style.background = "#2dbf2d";

                        }



                    } else {
                        console.error('API Error:', response.statusText);
                    }
                } catch (error) {
                    console.error('An unexpected error occurred:', error);
                    messageContainer.textContent = 'An unexpected error occurred: ' + error;
                    messageContainer.style.background = "#bf2d2d";
                } finally {
                    // Hide loading image
                    loadingDiv.style.display = 'none';
                }
            }
        }
    } else {
        alert('Please select a communication method.');
    }
});

// Function to generate dynamic radio buttons
function generateRadioButtons(dataArray) {


    // Clear existing content in the container
    radioContainer.innerHTML = '';

    // Loop through the array and create radio buttons
    dataArray.forEach((item, index) => {
        const radioId = `radio_${index}`;

        // Create radio button and label
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.id = radioId;
        radioButton.name = 'communicationMethod';
        radioButton.value = index.toString();

        const label = document.createElement('label');
        label.htmlFor = radioId;
        label.textContent = item;

        // Create a div to hold the radio button and label
        const radioDiv = document.createElement('div');
        radioDiv.appendChild(radioButton);
        radioDiv.appendChild(label);

        // Append the div to the container
        radioContainer.appendChild(radioDiv);


    });


    // Create "Send Code" button dynamically
    const sendCodeButton = document.createElement('button');
    sendCodeButton.textContent = 'Send Code';
    sendCodeButton.type = 'submit';
    sendCodeButton.id = 'accessCodeSendButton';
    sendCodeButton.name = 'accessCodeSendButton';



    // Append the dynamic submit button to the form
    const form = document.getElementById('canada-post-verification-form-fieldset');
    form.appendChild(sendCodeButton);



}



async function cancelButtonClickHandler() {

    const communicationContainer = document.getElementById('communicationContainer');
    const accessCodeSendButton = document.getElementById('accessCodeSendButton');
    const accessCodeInput = document.getElementById('accessCodeInput');
    const cancelButton = document.getElementById('cancelButton');
    const messageContainer = document.getElementById('messageContainer');
    // Check if the element exists before attempting to remove it
    if (accessCodeInput) {
        // Remove the element
        accessCodeInput.remove();
    } else {
        console.log('Element with id "accessCodeInput" not found');
    }

    // Check if the element exists before attempting to remove it
    if (cancelButton) {
        // Remove the element
        cancelButton.remove();
    } else {
        console.log('Element with id "cancelButton" not found');
    }

    communicationContainer.textContent = '';
    messageContainer.textContent = '';
    messageContainer.style.background = "";
    radioContainer.style.display = 'block';

    accessCodeSendButton.style.display = 'block';
    accessCodeSendButton.textContent = 'Send Code';
    accessCodeInput.style.display = 'none';

    console.log('Cancel button clicked!');

    //loadingDiv.style.display = 'block';

    try {
        // Make an asynchronous API call using fetch
        const response = await fetch('/back', {
            method: 'GET',

        });


        if (response.ok) {
            const data = await response.json();


        }
    } catch (error) {


        console.error('An unexpected error occurred:', error);
    } finally {
        // Hide loading image
        loadingDiv.style.display = 'none';
    }
}
