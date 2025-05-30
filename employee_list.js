
const apiUrlBase = 'https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/employee';
var adminCount = 0;

// When I click close modal with have any error in this form we need to clear all error msg 
$('#myModal').on('hidden.bs.modal', function () {
    // Clear error messages
    $('#showMsg1').text(''); // Clear First Name error
    $('#showMsg2').text(''); // Clear Last Name error
    $('#showMsg3').text(''); // Clear Phone Number error

});

document.getElementById('emp_form').addEventListener('submit', function(event) {
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

// Remove Data

function dataRemove(getid) {
    if(getid == 'empDetail'){
        document.getElementById('Dropdown').classList.add('none');
    }
    else{
        document.getElementById('myModalLabel').textContent = 'Admin Details';
        document.getElementById('Dropdown').classList.remove('none');
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
});

// Create Data

function addEmpdetails(event) {
    event.preventDefault();

    const isValidFName = validFName();
    const isValidLName = validLName();
    const isValidPhoneNumber = formatPhoneNumber();
    let isRequiredFieldsValid = true;
    let inputs = document.querySelectorAll('.all-input-style');

    // Required atribute validation check 
    inputs.forEach(input => {
        if (input.hasAttribute('required') && input.value.trim() === "") {
            isRequiredFieldsValid = false;
        }
    });

    if (isValidFName && isValidLName && isValidPhoneNumber && isRequiredFieldsValid) {
        $('#myModal').modal('hide');

        const empupdateid = document.getElementById("savebtn").value;
        const empfname = document.getElementById("fName").value;
        const emplname = document.getElementById("lName").value;
        const empphoneno = document.getElementById("phoneNumber").value;
        const empinst = document.getElementById("instructor").value;
        const empactive = true;
        const admin  = document.getElementById("Dropdown").value==='true' ? true : false;
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
                Pin: empinst,
                IsAdmin: admin,
                LastModifiedBy:'Admin'
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
                Pin: empinst,
                IsAdmin: admin,
                LastModifiedBy:'Admin'
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
        // alert('Please fix the errors in the form');
        document.getElementById('selectError').textContent = null;
    }
}



// Pagination variables
const rowsPerPage = 10;
let currentPage = 1;
let employeesData = [];  // Variable to store fetched employee data


// Function to fetch and display employee data
function viewEmpdetails() {
    // document.getElementById("footer_id").style.position = "fixed";
    const tableBody = document.getElementById("tBody");
    const tableBody2 = document.getElementById("tBody2");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getall/${company_id}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            let index = 1;
            // Store the fetched data
            employeesData = data;

            // Clear any existing DataTables instance
            if ($.fn.DataTable.isDataTable('#employeeTable')) {
                $('#employeeTable').DataTable().clear().destroy();
            }

            // Clear the existing table body content
            tableBody.innerHTML = '';
            tableBody2.innerHTML = '';
            adminCount = 0;
            // Populate the table body with fetched data
            employeesData.forEach(element => {
                    document.getElementById("Dropdown").disabled = false;
                    document.getElementById("Dropdown").value = "false";
                
               
                 if(adminCount > 2)
                {
                    
                    document.getElementById('add-entry-admin').disabled = true;
                    document.getElementById('add-entry-admin').style.backgroundColor = '#A0A0A0';
                    document.getElementById('add-entry-admin').style.color = '	#141414';
                    document.getElementById('add-entry-admin').style.cursor = 'not-allowed';
                    document.getElementById("Dropdown").disabled = true;
                    document.getElementById("Dropdown").value = "false";
                }
                else
                {
                    document.getElementById("Dropdown").disabled = false;
                    document.getElementById("Dropdown").value = "false";
                }

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="pin-column">${element.Pin}</td>
                    <td class="name-column">${element.FName}</td>
                    <td class="phone-column">${element.PhoneNumber}</td>
                    <td class="action-column">
                    <button class="btn icon-button" style="color: #02066F;" onclick="editEmpdetails('${element.EmpID}')" data-bs-toggle="modal" data-bs-target="#myModal">
                    <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn icon-button" style="color: #02066F;" onclick="showLogoutModal('${element.EmpID}')">
                    <i class="fas fa-trash"></i>
                    </button>
                    </td>
                `;
                // tableBody.appendChild(newRow);
                if(element.IsAdmin == 0){
                   
                    tableBody.appendChild(newRow);
                }
                else{
                    if(adminCount<3){
                       
                    tableBody2.appendChild(newRow);
                    
                    }
                    adminCount+=1;  
                }
                index++;
                if(index===5){
                //   document.getElementById("footer_id").style.position = "unset";
                }
           
            });

            // Initialize DataTables
            $('#employeeTable').DataTable({
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true
            });

            document.getElementById('overlay').style.display = 'none';
        })
        .catch(error => {
        
            document.getElementById('overlay').style.display = 'none';
        });
}

// Call viewEmpdetails to fetch data and initialize the table
viewEmpdetails();


// Call fetchData when the page is fully loaded
document.addEventListener('DOMContentLoaded', viewEmpdetails);
document.getElementById('overlay').style.display = 'flex';
// Edit Data

function editEmpdetails(emId) {
    document.getElementById("showMsg1").textContent = "";
    document.getElementById("showMsg2").textContent = "";
    document.getElementById('mainBtn').value = "Update";
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
                document.getElementById("Dropdown").value = (formvalue.IsAdmin == 0 ? false : true) 
                document.getElementById("savebtn").value = formvalue.EmpID;
            });
        })
        .catch(error => {
       
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
function homePage(){
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click',function (){
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


