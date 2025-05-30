
const isAlpha = /^[a-zA-Z\s]+$/; // Allow letters and spaces

function validateFirstName() {
    const firstName = document.getElementById('firstName').value;
    const errorFirstName = document.getElementById('errorFirstName');
    if (firstName.trim() === '') {
        errorFirstName.textContent = '';
        return false;
    } else if (!isAlpha.test(firstName)) {
        errorFirstName.textContent = 'Only use letters and spaces';
        return false;
    }
    errorFirstName.textContent = '';
    return true;
}

function validateLastName() {
    const lastName = document.getElementById('lastName').value;
    const errorLastName = document.getElementById('errorLastName');
    if (lastName.trim() === '') {
        errorLastName.textContent = '';
        return false;
    } else if (!isAlpha.test(lastName)) {
        errorLastName.textContent = 'Only use letters and spaces';
        return false;
    }
    errorLastName.textContent = '';
    return true;
}

// function validateAddress() {
//     const address = document.getElementById('address').value;
//     const errorAddress = document.getElementById('errorAddress');
//     if (address.trim() === '') {
//         errorAddress.textContent = 'Address is required';
//         return false;
//     }
//     errorAddress.textContent = '';
//     return true;
// }

function validatePhoneNumber() {
    const countryCode = iti.getSelectedCountryData().dialCode;
    const phoneNumber = input.value;
    const errorPhoneNumber = document.getElementById('error-msg');

    if (!iti.isValidNumber()) {
        const errorCode = iti.getValidationError();
        const msg = errorMap[errorCode] || "Invalid number";
        errorPhoneNumber.textContent = msg;
        return false;
    }

    errorPhoneNumber.textContent = '';
    return true;
}

// function validateEmail() {
//     const email = document.getElementById('email').value;
//     const errorEmail = document.getElementById('errorEmail');
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email.trim() === '') {
//         errorEmail.textContent = 'Email is required';
//         return false;
//     } else if (!emailPattern.test(email)) {
//         errorEmail.textContent = 'Invalid email format';
//         return false;
//     }
//     errorEmail.textContent = '';
//     return true;
// }

// API link 
// Signup second page link

const apiUrlBase = 'https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/customer';
const cid = uuid.v4();
const firstSignupPageapiUrlBase = `https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/company`;

async function validateForm(event) {
    event.preventDefault();
    document.getElementById('overlay').style.display = 'flex';
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    let isRequiredFieldsValid = true;
    let inputs = document.querySelectorAll('.all-input-style');

    // Required atribute validation check 
    inputs.forEach(input => {
        if (input.hasAttribute('required') && input.value.trim() === "") {
            isRequiredFieldsValid = false;
        }
    });

//     const custStreet =
//    requriedCheck(document.getElementById('customerStreet'),
//    document.getElementById('errorStreet'));
//    const custCity =
//    requriedCheck(document.getElementById('customerCity'),
//    document.getElementById('errorCity'));
//    const custState =
//    requriedCheck(document.getElementById('customerState'),
//    document.getElementById('errorState'));
//    const custpZip =
//    requriedCheck(document.getElementById('customerZip'),
//    document.getElementById('errorZip'));

    const isPhoneNumberValid = validPhoneno();
    // const isCentreNameValid = validateCentreName();
    // const isEmailValid = validateEmail();

    if (isFirstNameValid && isLastNameValid && 
         isPhoneNumberValid && isRequiredFieldsValid ) {
        document.querySelector('.progress-bar').style.width = '100%';

        const companyStreet = localStorage.getItem('companyStreet');
        const companyCity =localStorage.getItem('companyCity');
        const companyState =localStorage.getItem('companyState');
        const companyZip =localStorage.getItem('companyZip');

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = `${companyStreet}--${companyCity}--${companyState}--${companyZip}`;
        const phone = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;

        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('address', address);
        localStorage.setItem('phone', phone);
        localStorage.setItem('email', email);

        //COMPANY API CALL
        document.getElementById('overlay').style.display = 'none';
        const passwordEncrypted = await checkPassword();
        localStorage.setItem("passwordEncrypted",passwordEncrypted);
        await createCheckoutSession();
    } else {
        document.getElementById('totalError').textContent = 'Please fix the errors';
        document.getElementById('overlay').style.display = 'none';
    }
}

async function craeteFirstPageSignupAPiData() {
    const firstSignupPageapiUrl = `${firstSignupPageapiUrlBase}/create`;
    const cname = localStorage.getItem('companyName');
    const clogo = localStorage.getItem('companyLogo');
    // Address 
    const companyStreet = localStorage.getItem('companyStreet');
    const companyCity =localStorage.getItem('companyCity');
    const companyState =localStorage.getItem('companyState');
    const companyZip =localStorage.getItem('companyZip');

    const username = localStorage.getItem('username');

    // Call the asynchronous checkPassword function to get the encrypted password
    const passwordEncrypted = await checkPassword();

    const userData = {
        CID: cid,
        CName: cname,
        CLogo: clogo,
        CAddress: `
        ${companyStreet} -- 
        ${companyCity} -- 
        ${companyState} -- 
        ${companyZip} -- 
        `,
        UserName: username,
        Password: passwordEncrypted,
        ReportType: "Weekly",
        LastModifiedBy:'Admin'
    };
  

    try {
        const response = await fetch(firstSignupPageapiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        else {
            const data = await response.json();

            if (!data.error) {
                // Call Customer api
                createApiData();
            }
            else {
                setTimeout(() => {
                    window.location.href = "singup.html";
                    document.getElementById('overlay').style.display = 'flex';
                }, 100);
            }
        }
        //   .log(data);
    } catch (error) {
        
    }
}

//Create encrypt datas

async function encrypt(data, key) {
    // Convert data to ArrayBuffer (required by Web Crypto API)
    const dataBuffer = new TextEncoder().encode(data);

    // Import the encryption key (assuming it's already generated)
    const algorithm = { name: 'AES-GCM', iv: generateRandomBytes(12) }; // 12 bytes for IV
    const importedKey = await window.crypto.subtle.importKey(
        'raw', key, algorithm, false, ['encrypt']
    );

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
        algorithm, importedKey, dataBuffer
    );

    // Combine IV and encrypted data (concatenate into a single ArrayBuffer)
    const iv = algorithm.iv;
    const encryptedDataWithIV = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    encryptedDataWithIV.set(iv);
    encryptedDataWithIV.set(new Uint8Array(encryptedData), iv.byteLength);

    // Convert the combined buffer to Base64 for easier storage/transmission
    return btoa(String.fromCharCode(...new Uint8Array(encryptedDataWithIV)));
}



// Helper function to generate random bytes for IV
function generateRandomBytes(length) {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return randomValues;
}

// Generate a random key for encryption/decryption (should be stored securely)
const key = new Uint8Array([16, 147, 220, 113, 166, 142, 22, 93, 241, 91, 13, 252, 112, 122, 119, 95]);
localStorage.setItem('key', key);

//Create encrypt data in password
async function checkPassword() {
    const password = localStorage.getItem('password');
    // const output = document.getElementById('output');

    try {
        // Encrypt the password
        const encryptedPassword = await encrypt(password, key);

        return encryptedPassword.toString();
    } catch (error) {
    
    }
}

function createApiData() {
    const customerId = uuid.v4();
    const apiUrl = `${apiUrlBase}/create`;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    // Address 
    const customerStreet = document.getElementById('customerStreet').value;
    const customerCity = document.getElementById('customerCity').value;
    const customerState = document.getElementById('customerState').value;
    const customerZip = document.getElementById('customerZip').value;

    const phone = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;

    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    // Address 
    localStorage.setItem('customerStreet', customerStreet);
    localStorage.setItem('customerCity', customerCity);
    localStorage.setItem('customerState', customerState);
    localStorage.setItem('customerZip', customerZip);

    localStorage.setItem('phone', phone);
    localStorage.setItem('email', email);
    localStorage.setItem('customerID',customerId);

    const userData = {
        CustomerID: customerId.toString(), // Example value
        CID: cid, // Example value
        FName: firstName,
        LName: lastName,
        Address: `${customerStreet} -- 
        ${customerCity} -- 
        ${customerState} -- 
        ${customerZip} -- 
        `,
        PhoneNumber: phone,
        Email: email,
        IsActive: true, // Assuming this field is required and should be set to true
        LastModifiedBy:'Admin'
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
      
            window.location.href = "login.html";
        })
        .catch(error => {
           
        });
}


function validPhoneno() {
    const input = document.querySelector("#phoneNumber");
    const phoneError = document.querySelector("#showMsg3");
    const phoneNumber = input.value;

    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (phoneNumber === "") {
        phoneError.textContent = '';
        return false;
    } else if (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = 'Invalid phone number.';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    } 
}

function formatPhoneNumber() {
    const inputField = document.getElementById('phoneNumber');
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
}


async function createCheckoutSession() {
    try {
        const link = "http://127.0.0.1:5504";
        const link2 = "https://tap-time.com";
        const link3 = "https://arunkavitha1982.github.io/icode"
        const response = await fetch(`https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "url": link2,
                "productName": "EMS Product",
                "amount": 2000
            })
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.error);
        }
        const session = await response.json();
        
        const stripe = Stripe('pk_test_51OB8JlIPoM7JHRT2DlaE8KmPRFkgeSXkqf4eQZxEahu0Lbno3vHzCTH5J4rDAfw53PjdWlLteNJNzPVdahkzTb8100DA6sqAp4');
        await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      
    }
}

// required filed 
// function requriedCheck(id,msg){
//     const getId = id.value;
//     if(getId.trim() === ''){
//       msg.textContent = 'This field is required';
//         return false;
//     }
//     msg.textContent = '';
//     return true;
// }

 // Side BAR 

 const sidebar = document.getElementById('sidebar');
 const toggler = document.querySelector('.navbar-toggler');

 // Toggle sidebar open/close
 toggler.addEventListener('click', function () {
     sidebar.classList.toggle('open');
 });

 document.addEventListener('click', function (event) {
     const isClickInside = sidebar.contains(event.target) || toggler.contains(event.target);
     if (!isClickInside) {
         sidebar.classList.remove('open');
     }
 });