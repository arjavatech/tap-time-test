
document.getElementById('settingsForm').addEventListener('submit', function (event) {
    // Check if the form is valid before running custom code
    if (this.checkValidity()) {
        event.preventDefault(); // Prevent form from submitting immediately
        initializeFormSubmission(event); // Call your custom function
    } else {
        // Allow HTML5 validation messages to appear
        event.preventDefault(); // Prevent form from submitting if invalid
        this.reportValidity(); // Show the default browser validation messages
    }
});

const sidebar = document.getElementById('sidebar');
const toggler = document.querySelector('.navbar-toggler');

// Toggle sidebar open/close
toggler.addEventListener('click', function () {
    sidebar.classList.toggle('open');
});

document.addEventListener('click', function (event) {
    const isClickInside = sidebar.contains(event.target) || toggler.contains(event.target);
    if (!isClickInside) {
        sidebar.classList.remove('open'); // Close sidebar if the user clicks outside
    }
});


let profileData; // Variable to hold the profile data
let getCustomerDatasFromDb;
const cid = localStorage.getItem('companyID');
let customerId = localStorage.getItem('customerId');

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('overlay').style.display = 'flex';

    // Check if profile data is already loaded
    if (profileData) {
        // Use the already loaded data
        populateProfileData(profileData);
        document.getElementById('overlay').style.display = 'none';
    } else {
        // Load data from API
        loadProfileDataFromAPI();
    }
});

// Function to load profile data from the API
async function loadProfileDataFromAPI() {
    const url = `https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/company/get/${cid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        profileData = await response.json(); // Store data in the global variable

        // Process and populate the response data
        populateProfileData(profileData);

        document.getElementById('overlay').style.display = 'none';
    } catch (error) {
        document.getElementById('overlay').style.display = 'none';
    
    }

    try {
        const customerResponse = await fetch(`${customerAPIUrlBase}/getUsingCID/${cid}`);
        if (!customerResponse.ok) {
            throw new Error(`Error fetching data: ${customerResponse.statusText}`);
        }
        getCustomerDatasFromDb = await customerResponse.json(); // Store data in the global variable


        // Process and populate the response data
        customerDatasPopulate(getCustomerDatasFromDb);

        document.getElementById('overlay').style.display = 'none';
    } catch (error) {
        document.getElementById('overlay').style.display = 'none';
       
    }

}

function customerDatasPopulate(data){

    customerId = data.CustomerID || '';
     // Customer datas 
     document.getElementById('firstName').value = data.FName || '';
     document.getElementById('lastName').value = data.LName || '';
     document.getElementById('email').value = data.Email || '';
     document.getElementById('phone').value = data.PhoneNumber || '';
 
     let customerDatas = data.Address.split("--");
     document.getElementById('customerStreet').value = customerDatas[0] || '';
     document.getElementById('customerCity').value = customerDatas[1] || '';
     document.getElementById('customerState').value = customerDatas[2] || '';
     document.getElementById('customerZip').value = customerDatas[3] || '';
}
// Function to populate profile data into the form fields
function populateProfileData(data) {
    const comLoDataUrl = data.CLogo; // Assume this is the logo URL
    const image = document.getElementById("logo-img");

    if (comLoDataUrl.startsWith('data:image/')) {
        image.src = comLoDataUrl; // Set the image source to the data URL
        localStorage.setItem("imageFile", comLoDataUrl); // Save logo to localStorage
    } else {
      
    }

    // Set other form fields with data
    // Company datas 
    document.getElementById('companyName').value = data.CName || '';
    document.getElementById('username').value = data.UserName || '';
    // Add other fields similarly...

    // Example for address
    const address = data.CAddress.split("--");
    document.getElementById('companyStreet').value = address[0] || '';
    document.getElementById('companyCity').value = address[1] || '';
    document.getElementById('companyState').value = address[2] || '';
    document.getElementById('companyZip').value = address[3] || '';
}


// Function to save form data to localStorage on submission
function saveFormDataToLocalStorage() {
    const fields = [
        'companyName', 'username', 'firstName', 'lastName', 'phone', 'email'
    ];

    fields.forEach(field => {
        if (field === 'companyAddress') {
            localStorage.setItem(field, `${document.getElementById('companyStreet').value}--${document.getElementById('companyCity').value}--${document.getElementById('companyState').value}--${document.getElementById('companyZip').value}`);
        } else {
            localStorage.setItem(field, document.getElementById(field).value);
        }
    });
}


function initializeFormSubmission(event) {
    event.preventDefault();
    let button = document.getElementById("submiting");
    event.preventDefault();
    if (button.value === "Edit") {
        document.querySelectorAll('.disabledData').forEach(function (input) {
            input.disabled = false;
        });
        button.value = "Save"
    } else {
        let isPhone = validPhoneno();
        let isRequiredFieldsValid = true;
        let inputs = document.querySelectorAll('.all-input-style');

        // Required atribute validation check 
        inputs.forEach(input => {
            if (input.hasAttribute('required') && input.value.trim() === "") {
                isRequiredFieldsValid = false;
            }
        });

        if (isPhone && isRequiredFieldsValid) {
            saveFormDataToLocalStorage();
            updateApiData();
        }
    }


}



function validatePassword() {
    const password = document.getElementById('password').value;
    if (password.trim() === '' || password.length < 8) {
        showError(document.getElementById('password'), password.trim() === '' ? 'Password is required' : 'Password must be at least 8 characters');
        return false;
    }
    clearError(document.getElementById('password'));
    return true;
}

function showError(input, message) {
    clearError(input);
    const error = document.createElement('span');
    error.className = 'error';
    error.innerText = message;
    input.parentElement.appendChild(error);
}

function clearError(input) {
    const error = input.parentElement.querySelector('.error');
    if (error) {
        error.remove();
    }
}

function validPhoneno() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('showMsg3');
    const phoneNumber = phoneInput.value;
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
    const inputField = document.getElementById('phone');
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
    validPhoneno();
}

function formatPhoneNumber2(phoneNumber) {
    // Remove any non-digit characters from the input
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if the cleaned number has the expected length (10 digits for this format)
    if (cleaned.length !== 10) {
        // throw new Error('Invalid phone number length');
        return phoneNumber;
    }

    // Format the cleaned number
    const areaCode = cleaned.substring(0, 3);
    const centralOfficeCode = cleaned.substring(3, 6);
    const lineNumber = cleaned.substring(6);

    return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
}

function handleFileSelect(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('companyLogo').value = input.files[0].name;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function loadFile(event) {
    const logoImg = document.getElementById('logo-img');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            logoImg.src = e.target.result; // Set the image source to the file's data URL
            localStorage.setItem("imageFile", e.target.result); // Store the data URL in localStorage
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
}

function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const mimeType = parts[0].match(/:(.*?);/)[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeType });
}

function saveFormDataToLocalStorage() {
    const fields = [
        'companyName', 'companyAddress', 'username',
        'firstName', 'lastName', 'address', 'phone', 'email'
    ];

    fields.forEach(field => {
        if (field == 'companyAddress') {
            localStorage.setItem(field, `${document.getElementById('companyStreet').value}--${document.getElementById('companyCity').value}--${document.getElementById('companyState').value}--${document.getElementById('companyZip').value}--`);
        }
        else if (field == 'address') {
            localStorage.setItem(field, `${document.getElementById('customerStreet').value}--${document.getElementById('customerCity').value}--${document.getElementById('customerState').value}--${document.getElementById('customerZip').value}--`);
        }
        else {
           
            localStorage.setItem(field, document.getElementById(field).value);
        }
    });
}

const customerAPIUrlBase = `https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/customer`;
const companyAPIUrlBase = `https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/company`;

function updateApiData() {

    if (!cid || !customerId) {
        return;
    }

    const customerApiUrl = `${customerAPIUrlBase}/update/${customerId}`;
    const companyApiUrl = `${companyAPIUrlBase}/update/${cid}`;

    const customerData = {
        // Customer details 
        CustomerID: customerId,
        CID: cid,
        FName: document.getElementById('firstName').value,
        LName: document.getElementById('lastName').value,
        Address: `${document.getElementById('customerStreet').value}--${document.getElementById('customerCity').value}--${document.getElementById('customerState').value}--${document.getElementById('customerZip').value}`,
        PhoneNumber: document.getElementById('phone').value,
        Email: document.getElementById('email').value,
        IsActive: true,
        LastModifiedBy: 'Admin'
    };

    const companyData = {
        CID: cid,
        UserName: document.getElementById('username').value,
        CName: document.getElementById('companyName').value,
        CAddress: `${document.getElementById('companyStreet').value}--${document.getElementById('companyCity').value}--${document.getElementById('companyState').value}--${document.getElementById('companyZip').value}--`,
        CLogo: localStorage.getItem("imageFile"),
        Password: localStorage.getItem("password"),
        ReportType: "Weekly",
        LastModifiedBy: 'Admin'
    };

    Promise.all([
        fetch(customerApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        }),
        fetch(companyApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(companyData)
        })
    ])
        .then(responses => Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }


            else {
                const modalElement = document.getElementById('successModal');
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();
                document.getElementById("submiting").value = "Edit";

                setTimeout(() => {
                    modalInstance.hide();
                }, 2000);


                document.querySelectorAll('.disabledData').forEach(function (input) {
                    input.disabled = true;
                });
             
            }

            return response.json();
        })));
}


// When I click Logo go to home page 

function homePage() {
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click', function () {
    window.open('index.html', 'noopener, noreferrer');
})