// Side bar menu 
// Get sidemar menu section id 
const sidebar = document.getElementById('sidebar');
// Get Hamburger menu icon element
const toggler = document.querySelector('.navbar-toggler');

// When I click the hamburger menu icon button then run this action 
// Toggle sidebar open/close
toggler.addEventListener('click', function () {
    // Nav bar menu's opening and closing action 
    sidebar.classList.toggle('open');
});

// When I click the body then I hidden the nav bar menu 
document.addEventListener('click', function (event) {
    // Check If click this rest of the body or inside menu bar 
    const isClickInside = sidebar.contains(event.target) || toggler.contains(event.target);
    if (!isClickInside) {
        sidebar.classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const currentLocation = location.href; 
    // Get all sidebar menu links 
    const menuItems = document.querySelectorAll('.sidebar a');

    // Which one is active the nav bar and add style 
    menuItems.forEach(item => {
        if (item.href === currentLocation) {
            item.classList.add('active'); 
        }
    });
});
// End side bar menu 

// Is Alpha condition checking 
var isAlpha = /^[a-zA-Z\s]+$/;
// Validate Name Field 
function validCName() {
    // Get Name Input Element 
    const cname = document.getElementById('cname').value;
    // Get Name Error Element 
    const errorcName = document.getElementById('error-name');

    // If this field is empty then do it nothing because this field required field 
    if (cname.trim() === '') {
        errorcName.textContent = '';
        return false;
    // Check this field only have letters 
    } else if (!isAlpha.test(cname)) {
        errorcName.textContent = 'Only use letters, don\'t use digits';
        return false;
    } else {
        errorcName.textContent = '';
        return true;
    }
}

// Validate messege field 
function validCQueries() {
    // Get messege field input 
    const cQuestion = document.getElementById('question');
    // Get messege field error element 
    const errorcQuestion = document.getElementById('error-textarea');
    // Maximum character limit
    const maxLength = 500;
    // Get messge field input length 
    const currentLength = cQuestion.value.length;
    // Get messge field input value  
    const quesvalue = cQuestion.value;

    // If this field is empty then do it nothing because this field required field 
    if (quesvalue.trim() === '') {
        errorcQuestion.textContent = '';
        return false;
    // Check this input get Maximum character 
    } else if (currentLength >= maxLength) {
        errorcQuestion.textContent = 'Maximum character limit reached.';
        // This field only have Maximum character only 
        cQuestion.value = cQuestion.value.substring(0, maxLength);
        return false;
    } else {
        errorcQuestion.textContent = '';
        return true;
    }
}

// Phone number input change to number format 
function formatPhoneNumber() {
    // Get Phone number input field 
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
    // Phone number field Set to the format phone number value 
    inputField.value = value;
}

// Validate Phone number input field 
function validatePhoneNumber() {
    // Get Phone number input field 
    const phoneNumber = document.getElementById('phoneNumber').value;
    // Get Phone number Error element
    const phoneError = document.getElementById('error-phone');
    // The phone number validate numbers 
    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (phoneNumber.trim() === '') {
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

// When the submit button clicked the run this action 
// Validate Full Fields in Form 
function validateForm(event) {
    event.preventDefault();
    // Checked Name field 
    const isNameValid = validCName();
    // Checked Messge field 
    const isValidMessage = validCQueries();
    // Checked Phone number field 
    const isPhoneNumberValid = validatePhoneNumber();
    // Checked All inputs required field 
    let isRequiredFieldsValid = true;
    // Get all inputs 
    let inputs = document.querySelectorAll('.all-input-style');

    // Required atribute validation check 
    inputs.forEach(input => {
        if (input.hasAttribute('required') && input.value.trim() === "") {
            isRequiredFieldsValid = false;
        }
    });

    // If all inputs are correct 
    if (isNameValid
        && isValidMessage && 
        isPhoneNumberValid
    && isRequiredFieldsValid) {
        // Simulate API call
        // Call the api for all datas put to db 
        callContactUsCreateAPiData();

        // Show modal
        // When this fields submited successful and these datas went to db then run this modal 
        const modalElement = document.getElementById('addEntryModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
        setTimeout(() => {
            modalInstance.hide();
        }, 2000);
    }
}

// All fields datas get successfully then these datas go to db 
async function callContactUsCreateAPiData() {
    // Get contact db api link 
    const apiLink = `https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/contact-us/create`;

    const requestID = uuid.v4();
    const cid = localStorage.getItem('companyID');
    const name = document.getElementById("cname").value;
    const requestorEmail = document.getElementById("cemail").value;
    const concernsQuestions = document.getElementById("question").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const status = "pending";

    const userData = {
        RequestID: requestID,
        CID: cid,
        Name: name,
        RequestorEmail: requestorEmail,
        ConcernsQuestions: concernsQuestions,
        PhoneNumber: phoneNumber,
        Status: status,
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

        if (!data.error) {
            // Clear form fields
            document.getElementById("cname").value = "";
            document.getElementById("cemail").value = "";
            document.getElementById("question").value = "";
            document.getElementById("phoneNumber").value = "";
        } else {
            alert(data.error);
        }
    } catch (error) {
        
    }
}

// When I click Logo go to home page 

function homePage(){
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click',function (){
    window.open('index.html', 'noopener, noreferrer');
})


document.getElementById('emp_form').addEventListener('submit', function(event) {
    // Check if the form is valid before running custom code
    if (this.checkValidity()) {
        event.preventDefault(); // Prevent form from submitting immediately
        validateForm(event); // Call your custom function
    } else {
        // Allow HTML5 validation messages to appear
        event.preventDefault(); // Prevent form from submitting if invalid
        this.reportValidity(); // Show the default browser validation messages
    }
});