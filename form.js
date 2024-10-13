
// Get all fields id's
let firstName = document.getElementById("fname");
let lastName = document.getElementById("lname");
let email = document.getElementById("email");
let phoneNumber = document.getElementById("phone");
let street = document.getElementById("street");
let state = document.getElementById("state");
let city = document.getElementById("city");
let subject = document.getElementById("sub");
let message = document.getElementById("msg");
let zip = document.getElementById('zipCode');

// When the submit button click then called this function 
async function actionFun(event) {
    event.preventDefault();
    // Start loading indicator 
    document.getElementById('overlaying').style.display = 'flex';
    // Checking the validation 
    let isFirstNameValid = validName(document.getElementById("errorMsgFName"), firstName);
    let isLastNameValid = validName(document.getElementById("errorMsgLName"), lastName);
    let isValidateZipCode = validateZipCode(zip, document.getElementById("zipError"));
    let isValidatePhone = validatePhone(phoneNumber, document.getElementById("phoneError"));
    let isRequiredFieldsValid = true;
    let inputs = document.querySelectorAll('.all-input-style');

    // Required atribute validation check 
    inputs.forEach(input => {
        if (input.hasAttribute('required') && input.value.trim() === "") {
            isRequiredFieldsValid = false;
        }
    });

    if (isFirstNameValid && isLastNameValid
         && isRequiredFieldsValid && isValidateZipCode 
         &&  isValidatePhone) {
            const apiLink = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/web_contact_us/create`;

            const userData = {
                FirstName: firstName.value, 
                LastName: lastName.value, 
                Email: email.value,
                WhatsappNumber: null, 
                Subject: subject.value, 
                PhoneNumber: phoneNumber.value, 
                Address: `${street.value}--${city.value}--${state.value}--${zip.value}`,
                Message: message.value,
                LastModifiedBy:'Admin'
            };
        
            try {
                const response = await fetch(apiLink, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
        
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
        
                const data = await response.json();
                document.getElementById('overlaying').style.display = 'none';
                const modalElement = document.getElementById('addEntryModal');
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();
        
                if (!data.error) {
                    firstName.value = "";
                    lastName.value = "";
                    email.value = "";
                    phoneNumber.value = "";
                    street.value = "";
                    subject.value = "";
                    city.value = "";
                    zip.value = "";
                    message.value = "";
                }
            } catch (error) {
                console.error('Error:', error);
            }
    }
    else{
        document.getElementById('overlaying').style.display = 'none';
    }
}

// IsAlpha check
var isAlpha = /^[a-zA-Z\s]+$/;
function validName(errorElement, inputElement) {
    if (inputElement.value.trim() === '') {
        errorElement.textContent = 'Name is required';
        return false;
    } else if (!isAlpha.test(inputElement.value)) {  // Fix: Only show error if the input contains non-letter characters
        errorElement.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorElement.textContent = '';  // Clear the error if validation passes
    return true;
}


// Zip Code Validation 
function validateZipCode(zipCodeInput, errorElement) {
    const zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/; // US ZIP code format (5 digits or 5+4 digits)
    const zipCodeValue = zipCodeInput.value.trim();

    if (zipCodePattern.test(zipCodeValue) || zipCodeInput.value == "") {
        errorElement.textContent = ""; // Clear any error message
        return true;
    } else {
        errorElement.textContent = "Invalid ZIP Code"; // Display error message
        return false;
    }
}

// Phone number field format 
function formatPhoneNumber(id) {
    const inputField = document.getElementById(id);
    let value = inputField.value;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    // Format the phone number
    if (value.length > 3 && value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    inputField.value = value;
    validatePhone(inputField,document.getElementById("phoneError"));
}

// Phone number field validation 
function validatePhone(inputElement, errorElement) {
    const pNumber = inputElement.value;
    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (pNumber === "") {
        // errorElement.textContent = 'This is required field';
        return false;
    } else if (!phoneRegex.test(pNumber)) {
        errorElement.textContent = 'Invalid phone number format';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// When I click submit button
document.getElementById('emp_form').addEventListener('submit', function(event) {
    console.log("Submit event triggered"); // Check if this logs
    
    if (this.checkValidity()) {
        event.preventDefault(); // Prevent default form submission
        actionFun(event);       // Call your custom function
    } else {
        event.preventDefault(); // Prevent form submission if invalid
        this.reportValidity();  // Show browser validation messages
    }
});
