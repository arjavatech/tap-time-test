
// document.getElementById('settingsForm').addEventListener('submit', function (event) {
//     // Check if the form is valid before running custom code
//     if (this.checkValidity()) {
//         event.preventDefault(); // Prevent form from submitting immediately
//         initializeFormSubmission(); // Call your custom function
//     } else {
//         // Allow HTML5 validation messages to appear
//         event.preventDefault(); // Prevent form from submitting if invalid
//         this.reportValidity(); // Show the default browser validation messages
//     }
// });

// document.addEventListener('DOMContentLoaded', function () {
//     let getAdminType = localStorage.getItem('adminType');
//     if (getAdminType === 'admin' || getAdminType === 'SuperAdmin') {
//         document.getElementById('adminDetails').style.display = 'block';
//         document.getElementById('customer').style.display = 'none';
//         document.getElementById('customerBtn').textContent = getAdminType === 'admin' ? 'Admin Details' : 'Super Admin Details';
//         let getAuthenticationEmail = localStorage.getItem('authenticationEmail');
//         let adminOrSuperAdminEmail = localStorage.getItem('adminMail');
//         let AdminDetails = JSON.parse(localStorage.getItem("allAdminDetails"));
//         AdminDetails.forEach(element => {
//             if (element.Email === adminOrSuperAdminEmail || element.Email === getAuthenticationEmail) {
//                 document.getElementById("adminPin").value = element.Pin;
//                 document.getElementById("adminFirstName").value = element.FName;
//                 document.getElementById("adminLastName").value = element.LName;
//                 document.getElementById("adminPhone").value = element.PhoneNumber;
//                 document.getElementById("adminEmail").value = element.Email;
//             }
//         })
//     }
//     else{
//          document.getElementById('adminDetails').style.display = 'none';
//          document.getElementById('customer').style.display = 'block';
//     }
// });


function changeThePassword() {
    // document.getElementById('password').disabled = false;
    document.getElementById('password').removeAttribute("readonly");
    document.getElementById('password').style.color = '#02066F';
    document.getElementById('password').style.backgroundColor = '#fff';
}

function generateRandomBytes(length) {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return randomValues;
}

async function encryptPasswordInput() {
    const password = document.getElementById("password").value;
    let getTheDecryptedPassword = localStorage.getItem('passwordDecryptedValue');
    // const secretKey = "mySecretKey123"; // You can store securely on server

    // const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString();

    // Optionally store or use it
    // localStorage.setItem("encryptedPassword", encrypted);
    // console.log("Encrypted Password:", encrypted);
    if (password == getTheDecryptedPassword) {
        let getTheEncryptedPassword = localStorage.getItem('password');
        return getTheEncryptedPassword;
    }
    const keyValue = new Uint8Array([16, 147, 220, 113, 166, 142, 22, 93, 241, 91, 13, 252, 112, 122, 119, 95]);
    const encrypted = await encrypt(password, keyValue);
    return encrypted.toString();
}

async function encrypt(data, key) {
    // Convert data to ArrayBuffer (required by Web Crypto API)
    const dataBuffer = new TextEncoder().encode(data);

    // Import the encryption key (assuming it's already generated)
    const algorithm = { name: 'AES-GCM', iv: generateRandomBytes(12) }; // 12 bytes for IV
    const importedKey = await window.crypto.subtle.importKey(
        'raw',
        key, // ✅ Already Uint8Array
        { name: 'AES-GCM' },
        false,
        ['encrypt']
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


function showSection(sectionId) {
    if (sectionId === 'company') {
        // Show company section and hide customer section
        document.getElementById('company').style.display = 'block';
        document.getElementById('customerOrAdminDetails').style.display = 'none';
        document.getElementById('customer').style.display = 'none';
        document.getElementById('customerBtn').classList.remove('activate');
        document.getElementById('companyBtn').classList.add('activate');
    }
    else {
        // Show customer section and hide company section
        // let adminDetails = JSON.parse(localStorage.getItem("AdminDetails"));
        document.getElementById('customerOrAdminDetails').style.display = 'block';
        if (localStorage.getItem('adminType') === 'customer') {
            document.getElementById('customer').style.display = 'block';
            document.getElementById('adminDetails').style.display = 'none';
        }
        else{
            document.getElementById('adminDetails').style.display = 'block';
            document.getElementById('customer').style.display = 'none';
        }
        document.getElementById('company').style.display = 'none';
        document.getElementById('customerBtn').classList.add('activate');
        document.getElementById('companyBtn').classList.remove('activate');
    }
}

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

// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById('overlay').style.display = 'flex';

//     // Check if profile data is already loaded
//     if (profileData) {
//         // Use the already loaded data
//         populateProfileData(profileData);
//         document.getElementById('overlay').style.display = 'none';
//     } else {
//         // Load data from API
//         loadProfileDataFromAPI();
//     }
// });

// // Function to load profile data from the API
// async function loadProfileDataFromAPI() {
//     const url = `https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/company/get/${cid}`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Error fetching data: ${response.statusText}`);
//         }
//         profileData = await response.json(); // Store data in the global variable

//         // Process and populate the response data
//         populateProfileData(profileData);

//         document.getElementById('overlay').style.display = 'none';
//     } catch (error) {
//         document.getElementById('overlay').style.display = 'none';

//     }

//     try {
//         const customerResponse = await fetch(`${customerAPIUrlBase}/getUsingCID/${cid}`);
//         if (!customerResponse.ok) {
//             throw new Error(`Error fetching data: ${customerResponse.statusText}`);
//         }
//         getCustomerDatasFromDb = await customerResponse.json(); // Store data in the global variable


//         // Process and populate the response data
//         customerDatasPopulate(getCustomerDatasFromDb);

//         document.getElementById('overlay').style.display = 'none';
//     } catch (error) {
//         document.getElementById('overlay').style.display = 'none';

//     }

// }

// function customerDatasPopulate(data) {

//     customerId = data.CustomerID || '';
//     // Customer datas 
//     document.getElementById('firstName').value = data.FName || '';
//     document.getElementById('lastName').value = data.LName || '';
//     document.getElementById('email').value = data.Email || '';
//     document.getElementById('phone').value = data.PhoneNumber || '';

//     let customerDatas = data.Address.split("--");
//     document.getElementById('customerStreet').value = customerDatas[0] || '';
//     document.getElementById('customerCity').value = customerDatas[1] || '';
//     document.getElementById('customerState').value = customerDatas[2] || '';
//     document.getElementById('customerZip').value = customerDatas[3] || '';
// }
// // Function to populate profile data into the form fields
// function populateProfileData(data) {
//     const comLoDataUrl = data.CLogo; // Assume this is the logo URL
//     const image = document.getElementById("logo-img");

//     if (comLoDataUrl.startsWith('data:image/')) {
//         image.src = comLoDataUrl; // Set the image source to the data URL
//         localStorage.setItem("imageFile", comLoDataUrl); // Save logo to localStorage
//     } else {

//     }

//     // Set other form fields with data
//     // Company datas 
//     document.getElementById('companyName').value = data.CName || '';
//     document.getElementById('username').value = data.UserName || '';
//     document.getElementById('password').value = localStorage.getItem('passwordDecryptedValue') || '';

//     // Add other fields similarly...

//     // Example for address
//     const address = data.CAddress.split("--");
//     document.getElementById('companyStreet').value = address[0] || '';
//     document.getElementById('companyCity').value = address[1] || '';
//     document.getElementById('companyState').value = address[2] || '';
//     document.getElementById('companyZip').value = address[3] || '';
// }


// Function to save form data to localStorage on submission


document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('overlay').style.display = 'flex';

    const companyData = localStorage.getItem("companyProfileData");
    const customerData = localStorage.getItem("customerProfileData");
    const adminData = localStorage.getItem("adminProfileData");

    if (companyData && (customerData || adminData)) {
        // ✅ Use already stored data
        populateProfileData(JSON.parse(companyData));
        customerDatasPopulate(JSON.parse(customerData));
        if( adminData){
        showAdminDetails(JSON.parse(adminData));
        }
        document.getElementById('overlay').style.display = 'none';
    } else {
        // ✅ Only call API if data not found
        await loadProfileDataFromAPI();
    }
});


async function loadProfileDataFromAPI() {
    const company_id = localStorage.getItem('companyID');
    const adminOrSuperAdminEmail = localStorage.getItem('adminMail');
    const getAuthenticationEmail = localStorage.getItem('authenticationEmail');

    try {
        // ✅ 1. Company profile
        const companyResponse = await fetch(`${companyAPIUrlBase}/get/${company_id}`);
        if (!companyResponse.ok) throw new Error(`Company fetch failed`);

        const companyData = await companyResponse.json();
        localStorage.setItem("companyProfileData", JSON.stringify(companyData));
        populateProfileData(companyData);
    } catch (error) {
        console.error("Company error:", error);
    }

    try {
        // ✅ 2. Customer profile
        const customerResponse = await fetch(`${customerAPIUrlBase}/getUsingCID/${company_id}`);
        if (!customerResponse.ok) throw new Error(`Customer fetch failed`);

        const customerData = await customerResponse.json();
        localStorage.setItem("customerProfileData", JSON.stringify(customerData));
        customerDatasPopulate(customerData);
    } catch (error) {
        console.error("Customer error:", error);
    }

    try {
        // ✅ 3. Admin/SuperAdmin (from employee list)
        const userResponse = await fetch(`https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/employee/getall/${company_id}`);
        if (!userResponse.ok) throw new Error(`Employee fetch failed`);

        const allUsers = await userResponse.json();
        localStorage.setItem("allAdminDetails", JSON.stringify(allUsers)); // full list

        const loggedAdmin = allUsers.find(user =>
            (user.IsAdmin === 1 || user.IsAdmin === 2) &&
            (user.Email === adminOrSuperAdminEmail || user.Email === getAuthenticationEmail)
        );

        if (loggedAdmin) {
            localStorage.setItem("adminProfileData", JSON.stringify(loggedAdmin));
            showAdminDetails(loggedAdmin);
        } else {
            document.getElementById('adminDetails').style.display = 'none';
            document.getElementById('customer').style.display = 'block';
        }
    } catch (error) {
        console.error("Admin fetch error:", error);
    }

    document.getElementById('overlay').style.display = 'none';
}

function showAdminDetails(element) {
    const getAdminType = localStorage.getItem("adminType");

    document.getElementById('adminDetails').style.display = 'block';
    document.getElementById('customer').style.display = 'none';
    document.getElementById('customerBtn').textContent =
        getAdminType === 'admin' ? 'Admin Details' : 'Super Admin Details';

    document.getElementById("adminPin").value = element.Pin || '';
    document.getElementById("adminFirstName").value = element.FName || '';
    document.getElementById("adminLastName").value = element.LName || '';
    document.getElementById("adminPhone").value = element.PhoneNumber || '';
    document.getElementById("adminEmail").value = element.Email || '';
}



function populateProfileData(data) {
    const image = document.getElementById("logo-img");
    if (data.CLogo && data.CLogo.startsWith('data:image/')) {
        image.src = data.CLogo;
        localStorage.setItem("imageFile", data.CLogo);
    }

    document.getElementById('companyName').value = data.CName || '';
    document.getElementById('username').value = data.UserName || '';
    document.getElementById('password').value = localStorage.getItem('passwordDecryptedValue') || '';

    const address = (data.CAddress || "").split("--");
    document.getElementById('companyStreet').value = address[0] || '';
    document.getElementById('companyCity').value = address[1] || '';
    document.getElementById('companyState').value = address[2] || '';
    document.getElementById('companyZip').value = address[3] || '';
}

function customerDatasPopulate(data) {
    customerId = data.CustomerID || '';
    document.getElementById('firstName').value = data.FName || '';
    document.getElementById('lastName').value = data.LName || '';
    document.getElementById('email').value = data.Email || '';
    document.getElementById('phone').value = data.PhoneNumber || '';

    const customerAddress = (data.Address || "").split("--");
    document.getElementById('customerStreet').value = customerAddress[0] || '';
    document.getElementById('customerCity').value = customerAddress[1] || '';
    document.getElementById('customerState').value = customerAddress[2] || '';
    document.getElementById('customerZip').value = customerAddress[3] || '';
}



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



async function initializeFormSubmission(getId, event) {
    event.preventDefault(); // Prevent default form submission behavior
    let button;
    let fieldClass;

    if (getId == 'companyEditBtn') {
        button = document.getElementById("companyEditBtn");
        fieldClass = "disabledData";
    } else if (getId == 'customerEditBtn') {
        button = document.getElementById("customerEditBtn");
        fieldClass = "customerDisablefield";
    } else {
        button = document.getElementById("adminEditBtn");
        fieldClass = "adminDisablefield";
    }

    console.log(getId, button.value, fieldClass);

    const inputs = document.querySelectorAll(`.${fieldClass}`);

    if (button.value === "Edit") {
        inputs.forEach(input => {
            input.removeAttribute("readonly");  // Use readonly instead of disabled
            input.style.color = '#02066F'; // Change text color to blue
            input.style.backgroundColor = '#fff'; // Change background color to white
        });
        button.value = "Save";
    } else {
        let isPhone = validPhoneno();
        let isRequiredFieldsValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && input.value.trim() === "") {
                isRequiredFieldsValid = false;
                input.reportValidity(); // Show browser's default required validation
            }
        });

        if ((getId == 'customerEditBtn' ? isPhone : true) && isRequiredFieldsValid) {
            saveFormDataToLocalStorage();
            if (getId == 'companyEditBtn') {
                await callCompanyAPI();
            } else if (getId == 'customerEditBtn') {
                callCustomerAPI();
            }
            // Optional: turn fields back to readonly after saving
            inputs.forEach(input => {
                input.setAttribute("readonly", true);
            });
            button.value = "Edit";
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

const customerAPIUrlBase = `https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/customer`;
const companyAPIUrlBase = `https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/company`;

function callCustomerAPI() {
    if (!cid || !customerId) return;

    const customerApiUrl = `${customerAPIUrlBase}/update/${customerId}`;

    const customerData = {
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

    fetch(customerApiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Customer update failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            showSuccessModal();
        })
        .catch(error => {
            console.error("Customer API Error:", error);
        });
}

async function callCompanyAPI() {
    if (!cid) return;

    const companyApiUrl = `${companyAPIUrlBase}/update/${cid}`;
    const getTheEncryptedPassword = await encryptPasswordInput();

    const companyData = {
        CID: cid,
        UserName: document.getElementById('username').value,
        CName: document.getElementById('companyName').value,
        CAddress: `${document.getElementById('companyStreet').value}--${document.getElementById('companyCity').value}--${document.getElementById('companyState').value}--${document.getElementById('companyZip').value}--`,
        CLogo: localStorage.getItem("imageFile"),
        Password: getTheEncryptedPassword,
        ReportType: "Weekly",
        LastModifiedBy: 'Admin'
    };

    fetch(companyApiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Company update failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            showSuccessModal();
        })
        .catch(error => {
            console.error("Company API Error:", error);
        });
}

function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    setTimeout(() => {
        successModal.hide();
        window.location.reload(); // Reload the page after showing the success message
    }, 2000); // Adjust the timeout duration as needed
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