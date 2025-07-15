
const apiUrlBase = 'https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/employee';
var adminCount = 0;
let employeesData = JSON.parse(localStorage.getItem("allAdminDetails"));


// When I click close modal with have any error in this form we need to clear all error msg 
$('#myModal').on('hidden.bs.modal', function () {
    // Clear error messages
    $('#showMsg1').text(''); // Clear First Name error
    $('#showMsg2').text(''); // Clear Last Name error
    $('#showMsg3').text(''); // Clear Phone Number error

});

// Fetch employee,admin,super admin data 
async function fetchEmployeeData() {
    console.log("Fetching employee data...");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getall/${company_id}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        console.log("Login data:", data);
        localStorage.setItem("allAdminDetails", JSON.stringify(data));
        viewEmpdetails();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}


document.getElementById('emp_form').addEventListener('submit', function (event) {
    // Check if the form is valid before running custom code
    if (this.checkValidity()) {
        event.preventDefault(); // Prevent form from submitting immediately
        addEmpdetails(event); // Call your custom function
    } else {
        // Allow HTML5 validation messages to appear
        event.preventDefault(); // Prevent form from submitting if invalid
        this.reportValidity(); // Show the default browser validation messages
    }
});

document.getElementById('admin_form').addEventListener('submit', function (event) {
    event.preventDefault();
    addAdminDetails(event);
});

document.getElementById('superadmin_form').addEventListener('submit', function (event) {
    event.preventDefault();
    addSuperAdminDetails(event);
});

// Remove Data

function dataRemove(getid) {
    if (getid == 'empDetail') {
        // document.getElementById('Dropdown').classList.add('none');
    }
    else {
        document.getElementById('myModalLabel').textContent = 'Admin Details';
        // document.getElementById('Dropdown').classList.remove('none');
    }
    document.getElementById('mainBtn').value = 'Submit';
    const formModalElement = document.getElementById('myModal');
    const formModalInstance = new bootstrap.Modal(formModalElement);
    formModalInstance.show();
    document.getElementById("instructor").value = "";
    document.getElementById("fName").value = "";
    document.getElementById("lName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("savebtn").value = "";
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
        sidebar.classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.sidebar a');

    menuItems.forEach(item => {
        if (item.href === currentLocation) {
            item.classList.add('active');
        }
    });
    console.log("check emplyee data",employeesData)
    if (employeesData.length === 0) {
        fetchEmployeeData();
    }
    else {
        // Get employee,admin,super admin details 
        viewEmpdetails();
    }
});

// Create Data

function addEmpdetails(event) {
    event.preventDefault();

    const isValidFName = validFName();
    const isValidLName = validLName();
    const isValidPhoneNumber = formatPhoneNumber();
    let isRequiredFieldsValid = true;


    if (isValidFName && isValidLName && isValidPhoneNumber && isRequiredFieldsValid) {
        $('#myModal').modal('hide');

        const empupdateid = document.getElementById("savebtn").value;
        const empfname = document.getElementById("fName").value;
        const emplname = document.getElementById("lName").value;
        const empphoneno = document.getElementById("phoneNumber").value;
        const empinst = document.getElementById("instructor").value;
        const empactive = true;

        const empid = 'eid_' + Math.random().toString(36).substr(2, 12);
        const empcid = localStorage.getItem('companyID');

        if (empupdateid == "") {
            const apiUrl = `${apiUrlBase}/create`;

            const employeeObject = {
                EmpID: empid,
                CID: empcid,
                FName: empfname,
                LName: emplname,
                IsActive: empactive,
                PhoneNumber: empphoneno,
                Email: null,
                Pin: empinst,
                IsAdmin: 0,
                LastModifiedBy: 'Admin'
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        document.querySelector(".e-msg").textContent = data.error;
                        // $(".error-msg").show();
                        setTimeout(function () {
                            // $(".error-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    } else {
                        document.querySelector(".s-msg").textContent = data.message;
                        // $(".success-msg").show();
                        setTimeout(function () {
                            // $(".success-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    }

                })
                .catch(error => {

                });
        } else {
            const apiUrl = `${apiUrlBase}/update/${empupdateid}`;

            const updateEmployeeObject = {
                EmpID: empid,
                CID: empcid,
                FName: empfname,
                LName: emplname,
                IsActive: empactive,
                PhoneNumber: empphoneno,
                Email: null,
                Pin: empinst,
                IsAdmin: 0,
                LastModifiedBy: 'Admin'
            };

            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateEmployeeObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        document.querySelector(".e-msg").textContent = data.error;
                        // $(".error-msg").show();
                        setTimeout(function () {
                            // $(".error-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    } else {
                        document.querySelector(".s-msg").textContent = data.message;
                        // $(".success-msg").show();
                        setTimeout(function () {
                            // $(".success-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    }

                })
                .catch(error => {

                });
        }

    }
    else {
        alert('Please fix the errors in the form');
    }
}

// Pagination variables
const rowsPerPage = 10;
let currentPage = 1;


async function viewEmpdetails() {
    const adminType = localStorage.getItem('adminType');
    const employeeSection = document.getElementById('employee-section');
    const adminSection = document.getElementById('admin-section');
    const superAdminSection = document.getElementById('superadmin-section');

    if (adminType === 'Admin') {
        employeeSection.style.display = 'block';
        adminSection.style.display = 'none';
        superAdminSection.style.display = 'none';
    } else if (adminType === 'SuperAdmin') {
        employeeSection.style.display = 'block';
        adminSection.style.display = 'block';
        superAdminSection.style.display = 'block';
    }

    const tableBody = document.getElementById("tBody");
    const tableBody2 = document.getElementById("tBody2");
    const tableBody3 = document.getElementById("tBody3");

    tableBody.innerHTML = '';
    tableBody2.innerHTML = '';
    tableBody3.innerHTML = '';

    
    if (!employeesData) {
        // Data not in localStorage, fetch it
        document.getElementById('overlay').style.display = 'block';
        employeesData = await fetchEmployeeData();
    }

    if (!employeesData) {
        document.getElementById('overlay').style.display = 'none';
        return; // Stop if still no data
    }

    let index = 1;
    let adminCount = 0;

    employeesData.forEach(element => {
        if (element.Email != null) {
            localStorage.setItem("AdminDetails", JSON.stringify(element));
        }

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="pin-column">${element.Pin}</td>
            <td class="name-column">${element.FName + " " + element.LName}</td>
            <td class="phone-column">${element.PhoneNumber}</td>
            <td class="action-column">
                <button class="btn icon-button" style="color: #02066F;" onclick="${element.IsAdmin == 0 ? `editEmpdetails('${element.EmpID}')` : element.IsAdmin == 1 ? `editAdmindetails('${element.EmpID}')` : `editSuperAdmindetails('${element.EmpID}')`}" data-bs-toggle="modal" data-bs-target="${element.IsAdmin == 0 ? "#myModal" : element.IsAdmin == 1 ? "#myModal2" : "#myModal3"}">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn icon-button" style="color: #02066F;" onclick="showLogoutModal('${element.EmpID}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        if (element.IsAdmin == 0) {
            tableBody.appendChild(newRow);
        } else if (element.IsAdmin == 1) {
            if (adminCount < 3) {
                tableBody2.appendChild(newRow);
            }
            adminCount++;
        } else if (element.IsAdmin == 2) {
            tableBody3.appendChild(newRow);
        }

        if (adminCount > 2) {
            const btn = document.getElementById('add-entry-admin');
            btn.disabled = true;
            btn.style.backgroundColor = '#A0A0A0';
            btn.style.color = '#141414';
            btn.style.cursor = 'not-allowed';
        }

        index++;
    });

    $('#employeeTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true
    });

    document.getElementById('overlay').style.display = 'none';
}




// Call fetchData when the page is fully loaded
document.getElementById('overlay').style.display = 'flex';
// Edit Data

function editEmpdetails(emId) {
    document.getElementById("showMsg1").textContent = "";
    document.getElementById("showMsg2").textContent = "";
    document.getElementById('savebtn').value = "Update";
    const apiUrl = `${apiUrlBase}/get/` + emId;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(formvalue => {
                document.getElementById("instructor").value = formvalue.Pin;
                document.getElementById("fName").value = formvalue.FName;
                document.getElementById("lName").value = formvalue.LName;
                document.getElementById("phoneNumber").value = formvalue.PhoneNumber;
                // document.getElementById("Dropdown").value = (formvalue.IsAdmin == 0 ? false : true) 
                document.getElementById("savebtn").value = formvalue.EmpID;
            });
        })
        .catch(error => {

        });
}

function editAdmindetails(emId) {
    document.getElementById("showAdminMsg1").textContent = "";
    document.getElementById("showAdminMsg2").textContent = "";
    document.getElementById('saveAdminBtn').textContent = "Update";
    const apiUrl = `${apiUrlBase}/get/` + emId;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(formvalue => {
                document.getElementById("adminInstructor").value = formvalue.Pin;
                document.getElementById("adminFName").value = formvalue.FName;
                document.getElementById("adminLName").value = formvalue.LName;
                document.getElementById("adminPhoneNumber").value = formvalue.PhoneNumber;
                document.getElementById("adminEmail").value = formvalue.Email;
                // document.getElementById("Dropdown").value = (formvalue.IsAdmin == 0 ? false : true) 
                document.getElementById("saveAdminBtn").setAttribute('data-empid', formvalue.EmpID);
            });
        })
        .catch(error => {

        });
}


function editSuperAdmindetails(emId) {
    document.getElementById("showSuperAdminMsg1").textContent = "";
    document.getElementById("showSuperAdminMsg2").textContent = "";
    document.getElementById('saveSuperAdminBtn').textContent = "Update";
    const apiUrl = `${apiUrlBase}/get/` + emId;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(formvalue => {
                document.getElementById("superAdminInstructor").value = formvalue.Pin;
                document.getElementById("superAdminFName").value = formvalue.FName;
                document.getElementById("superAdminLName").value = formvalue.LName;
                document.getElementById("superAdminPhoneNumber").value = formvalue.PhoneNumber;
                document.getElementById("superAdminEmail").value = formvalue.Email;
                document.getElementById("saveSuperAdminBtn").setAttribute('data-empid', formvalue.EmpID);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Delete Data

function deleteEmpdetails(emId) {
    const apiUrl = `${apiUrlBase}/delete/${emId}/Admin`;
    fetch(apiUrl, {
        method: 'PUT'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                document.querySelector(".e-msg").textContent = data.error;
                // $(".error-msg").show();
                setTimeout(function () {
                    // $(".error-msg").hide();
                    window.location.href = "employee_list.html";
                }, 1000);
            } else {
                document.querySelector(".s-msg").textContent = data.message;
                // $(".success-msg").show();
                setTimeout(function () {
                    // $(".success-msg").hide();
                    window.location.href = "employee_list.html";
                }, 1000);
            }
        })
        .catch(error => {


        });
}



// Validation
var isAlpha = /^[a-zA-Z\s]+$/;

function validFName() {
    const fname = document.getElementById('fName').value;
    const errorFName = document.getElementById('showMsg1');
    if (fname.trim() === '') {
        errorFName.textContent = '';
        return false;
    }
    else if (!isAlpha.test(fname)) {
        errorFName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorFName.textContent = '';
    return true;
}

function validLName() {
    const lname = document.getElementById('lName').value;
    const errorLName = document.getElementById('showMsg2');
    if (lname.trim() === '') {
        errorLName.textContent = '';
        return false;
    }
    else if (!isAlpha.test(lname)) {
        errorLName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorLName.textContent = '';
    return true;
}



// function validateInstructerPin() {
//     const instructerPin = document.getElementById('instructor').value;
//     const errorInstructerPin = document.getElementById('showMsg');
//     if (instructerPin.trim() === '') {
//         errorInstructerPin.textContent = 'Instructer pin is required';
//         return false;
//     }
//     errorInstructerPin.textContent = '';
//     return true;
// }


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
    const input = document.querySelector("#phoneNumber");
    const phoneError = document.querySelector("#showMsg3");
    const employePin = document.getElementById("instructor");
    const phoneNumber = input.value;

    employePin.value = (input.value).substring((input.value).length - 4);

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

function showLogoutModal(empId) {
    const modalHTML = `
        <div class="modal fade" id="addEntryModal2" tabindex="-1" aria-labelledby="addEntryModalLabel2" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addEntryModalLabel2" style="text-align: center; width: 100%;">Delete</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h5 class="fw-bold mb-3 text-center">Are you sure, you want to remove the employee?</h5>
                        <p class="d-flex justify-content-center mt-4">
                            <button class="btn yes" style="margin-left: 15px;" onclick="deleteEmpdetails('${empId}')">Yes</button>
                            <button class="btn btn-outline-green" data-bs-dismiss="modal">No</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;

    // Append the modal to the body
    document.body.innerHTML += modalHTML;

    // Show the modal using Bootstrap's modal plugin
    const modalElement = document.getElementById('addEntryModal2');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
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
function filterAdmin() {
    const searchInput = document.getElementById('searchAdmin').value.toLowerCase();
    const rows = document.querySelectorAll('#tBody2 tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const nameCell = cells[1].textContent.toLowerCase(); // Assuming the name is in the second column
        if (nameCell.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showSuperAdminModal() {
    document.getElementById('superAdminFName').value = '';
    document.getElementById('superAdminLName').value = '';
    document.getElementById('superAdminPhoneNumber').value = '';
    document.getElementById('superAdminInstructor').value = '';
    document.getElementById('superAdminEmail').value = '';
    document.getElementById('showSuperAdminMsg1').textContent = '';
    document.getElementById('showSuperAdminMsg2').textContent = '';
    document.getElementById('showSuperAdminMsg3').textContent = '';
    document.getElementById('showSuperAdminMsg').textContent = '';
    document.getElementById('showSuperAdminMsg4').textContent = '';
    const modal = new bootstrap.Modal(document.getElementById('myModal3'));
    modal.show();
}

function formatSuperAdminPhoneNumber() {
    const inputField = document.getElementById('superAdminPhoneNumber');
    let value = inputField.value;
    value = value.replace(/\D/g, '');
    if (value.length > 3 && value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    inputField.value = value;

    const superAdminPin = document.getElementById('superAdminInstructor');
    superAdminPin.value = (inputField.value).substring((inputField.value).length - 4);

    const phoneError = document.getElementById('showSuperAdminMsg3');
    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (inputField.value === '') {
        phoneError.textContent = '';
        return false;
    } else if (!phoneRegex.test(inputField.value)) {
        phoneError.textContent = 'Invalid phone number.';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    }
}

function validSuperAdminFName() {
    const fname = document.getElementById('superAdminFName').value;
    const errorFName = document.getElementById('showSuperAdminMsg1');
    if (fname.trim() === '') {
        errorFName.textContent = '';
        return false;
    }
    else if (!isAlpha.test(fname)) {
        errorFName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorFName.textContent = '';
    return true;
}

function validSuperAdminLName() {
    const lname = document.getElementById('superAdminLName').value;
    const errorLName = document.getElementById('showSuperAdminMsg2');
    if (lname.trim() === '') {
        errorLName.textContent = '';
        return false;
    }
    else if (!isAlpha.test(lname)) {
        errorLName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorLName.textContent = '';
    return true;
}

function validSuperAdminEmail() {
    const email = document.getElementById('superAdminEmail').value;
    const errorEmail = document.getElementById('showSuperAdminMsg4');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === '') {
        errorEmail.textContent = '';
        return false;
    }
    else if (!emailRegex.test(email)) {
        errorEmail.textContent = 'Please enter a valid email address';
        return false;
    }
    errorEmail.textContent = '';
    return true;
}

function addSuperAdminDetails(event) {
    event.preventDefault();

    const isValidFName = validSuperAdminFName();
    const isValidLName = validSuperAdminLName();
    const isValidPhoneNumber = formatSuperAdminPhoneNumber();
    const isValidEmail = validSuperAdminEmail();

    if (isValidFName && isValidLName && isValidPhoneNumber && isValidEmail) {
        $('#myModal3').modal('hide');

        const superAdminFName = document.getElementById('superAdminFName').value;
        const superAdminLName = document.getElementById('superAdminLName').value;
        const superAdminPhoneNumber = document.getElementById('superAdminPhoneNumber').value;
        const superAdminPin = document.getElementById('superAdminInstructor').value;
        const superAdminEmail = document.getElementById('superAdminEmail').value;
        const companyId = localStorage.getItem('companyID');
        const updateEmpId = document.getElementById('saveSuperAdminBtn').getAttribute('data-empid');
        const empId = updateEmpId || 'eid_' + Math.random().toString(36).substr(2, 12);

        const superAdminObject = {
            EmpID: empId,
            CID: companyId,
            FName: superAdminFName,
            LName: superAdminLName,
            IsActive: true,
            PhoneNumber: superAdminPhoneNumber,
            Pin: superAdminPin,
            Email: superAdminEmail,
            IsAdmin: 2,
            LastModifiedBy: 'Admin'
        };

        const apiUrl = updateEmpId ? `${apiUrlBase}/update/${updateEmpId}` : `${apiUrlBase}/create`;
        const method = updateEmpId ? 'PUT' : 'POST';

        fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(superAdminObject)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    document.querySelector(".e-msg").textContent = data.error;
                    setTimeout(() => {
                        window.location.href = "employee_list.html";
                    }, 1000);
                } else {
                    document.querySelector(".s-msg").textContent = data.message;
                    setTimeout(() => {
                        window.location.href = "employee_list.html";
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function filterSuperAdmin() {
    const searchInput = document.getElementById('searchSuperAdmin').value.toLowerCase();
    const rows = document.querySelectorAll('#tBody3 tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const nameCell = cells[1].textContent.toLowerCase();
        if (nameCell.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showAdminModal() {
    document.getElementById('adminFName').value = '';
    document.getElementById('adminLName').value = '';
    document.getElementById('adminPhoneNumber').value = '';
    document.getElementById('adminInstructor').value = '';
    document.getElementById('adminEmail').value = '';
    document.getElementById('showAdminMsg1').textContent = '';
    document.getElementById('showAdminMsg2').textContent = '';
    document.getElementById('showAdminMsg3').textContent = '';
    document.getElementById('showAdminMsg').textContent = '';
    document.getElementById('showAdminMsg4').textContent = '';
    const modal = new bootstrap.Modal(document.getElementById('myModal2'));
    modal.show();
}

function formatAdminPhoneNumber() {
    const inputField = document.getElementById('adminPhoneNumber');
    let value = inputField.value;
    value = value.replace(/\D/g, '');
    if (value.length > 3 && value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    inputField.value = value;

    const adminPin = document.getElementById('adminInstructor');
    adminPin.value = (inputField.value).substring((inputField.value).length - 4);

    const phoneError = document.getElementById('showAdminMsg3');
    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (inputField.value === '') {
        phoneError.textContent = '';
        return false;
    } else if (!phoneRegex.test(inputField.value)) {
        phoneError.textContent = 'Invalid phone number.';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    }
}

function validAdminFName() {
    const fname = document.getElementById('adminFName').value;
    const errorFName = document.getElementById('showAdminMsg1');
    if (fname.trim() === '') {
        errorFName.textContent = '';
        return false;
    }
    else if (!isAlpha.test(fname)) {
        errorFName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorFName.textContent = '';
    return true;
}

function validAdminLName() {
    const lname = document.getElementById('adminLName').value;
    const errorLName = document.getElementById('showAdminMsg2');
    if (lname.trim() === '') {
        errorLName.textContent = '';
        return false;
    }
    else if (!isAlpha.test(lname)) {
        errorLName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorLName.textContent = '';
    return true;
}

function validAdminEmail() {
    const email = document.getElementById('adminEmail').value;
    const errorEmail = document.getElementById('showAdminMsg4');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === '') {
        errorEmail.textContent = '';
        return false;
    }
    else if (!emailRegex.test(email)) {
        errorEmail.textContent = 'Please enter a valid email address';
        return false;
    }
    errorEmail.textContent = '';
    return true;
}

function addAdminDetails(event) {
    event.preventDefault();

    const isValidFName = validAdminFName();
    const isValidLName = validAdminLName();
    const isValidPhoneNumber = formatAdminPhoneNumber();
    const isValidEmail = validAdminEmail();

    if (isValidFName && isValidLName && isValidPhoneNumber && isValidEmail) {
        $('#myModal2').modal('hide');

        const adminFName = document.getElementById('adminFName').value;
        const adminLName = document.getElementById('adminLName').value;
        const adminPhoneNumber = document.getElementById('adminPhoneNumber').value;
        const adminPin = document.getElementById('adminInstructor').value;
        const adminEmail = document.getElementById('adminEmail').value;
        const companyId = localStorage.getItem('companyID');
        const updateEmpId = document.getElementById('saveAdminBtn').getAttribute('data-empid');
        const empId = updateEmpId || 'eid_' + Math.random().toString(36).substr(2, 12);

        const adminObject = {
            EmpID: empId,
            CID: companyId,
            FName: adminFName,
            LName: adminLName,
            IsActive: true,
            PhoneNumber: adminPhoneNumber,
            Pin: adminPin,
            Email: adminEmail,
            IsAdmin: 1,
            LastModifiedBy: 'Admin'
        };

        const apiUrl = updateEmpId ? `${apiUrlBase}/update/${updateEmpId}` : `${apiUrlBase}/create`;
        const method = updateEmpId ? 'PUT' : 'POST';

        fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminObject)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    document.querySelector(".e-msg").textContent = data.error;
                    setTimeout(() => {
                        window.location.href = "employee_list.html";
                    }, 1000);
                } else {
                    document.querySelector(".s-msg").textContent = data.message;
                    setTimeout(() => {
                        window.location.href = "employee_list.html";
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}


