// Function to validate company name
var isAlpha = /^[a-zA-Z\s]+$/;

function validateCompanyName() {
    const companyName = document.getElementById('companyName').value;
    const errorCompanyName = document.getElementById('errorCompanyName');
    if (companyName =='') {
        errorCompanyName.textContent = '';
        return false;
    } else if (!isAlpha.test(companyName)) {
        errorCompanyName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorCompanyName.textContent = '';
    return true;
}


function validateUsername() {
    const username = document.getElementById('username').value;
    const errorUsername = document.getElementById('errorUsername');
    if (username == '') {
        errorUsername.textContent = '';
        return false;
    } else if (!isAlpha.test(username)) {
        errorUsername.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorUsername.textContent = '';
    return true;
}

// Function to validate password
function validatePassword() {
    const password = document.getElementById('password').value;
    const errorPassword = document.getElementById('errorPassword');
    if (password == '') {
        errorPassword.textContent = '';
        return false;
    } else if (password.length < 8) {
        errorPassword.textContent = 'Password must be at least 8 characters';
        return false;
    }
    errorPassword.textContent = '';
    return true;
}


// Function to validate the entire form
function validateForm(event) {
    event.preventDefault();

    document.getElementById('overlaying').style.display = 'flex';
    const isCompanyNameValid = validateCompanyName();
    // const isCompanyLogoValid = validateCompanyLogo();
    let isRequiredFieldsValid = true;
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    let inputs = document.querySelectorAll('.all-input-style');

    // Required atribute validation check 
    inputs.forEach(input => {
        if (input.hasAttribute('required') && input.value.trim() === "") {
            isRequiredFieldsValid = false;
        }
    });


    if (isCompanyNameValid &&
        isRequiredFieldsValid &&
        isUsernameValid &&
        isPasswordValid) {
      
        document.querySelector('.progress-bar').style.width = '50%';
        // Store the values in localStorage
        const companyName = document.getElementById('companyName').value;

        // Address 
        const companyStreet = document.getElementById('companyStreet').value;
        const companyCity = document.getElementById('companyCity').value;
        const companyState = document.getElementById('companyState').value;
        const companyZip = document.getElementById('companyZip').value;

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const logoInput = document.getElementById('companyLogo');

       
        // Check if a file is selected
        if (logoInput.files.length > 0) {
            const file = logoInput.files[0];
            const reader = new FileReader();

            // Read the file and convert it to a Data URL
            reader.onloadend = function () {
                const companyLogo = reader.result; // This is the base64 URL
                localStorage.setItem('companyLogo', companyLogo);
                // Store other fields
                localStorage.setItem('companyName', companyName);
                // Address 
                localStorage.setItem('companyStreet', companyStreet);
                localStorage.setItem('companyCity', companyCity);
                localStorage.setItem('companyState', companyState);
                localStorage.setItem('companyZip', companyZip);

                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
            };

            reader.readAsDataURL(file); // Read the file as a Data URL

            // Simulate a delay for the progress bar
        } else {
          
        }

        setTimeout(() => {
            window.location.href = "signup2.html";
            document.getElementById('overlay').style.display = 'none';
        }, 100);    

    } else {
        // alert('Please fix the errors in the form');
        document.getElementById('totalError').textContent = 'Please fix the errors';
        document.getElementById('overlaying').style.display = 'none';
    }
}

// required filed 
// function requriedCheck(id,msg){
//   const getId = id.value;
//   if(getId.trim() === ''){
//     msg.textContent = 'This field is required';
//       return false;
//   }
//   msg.textContent = '';
//   return true;
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
