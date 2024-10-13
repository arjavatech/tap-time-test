
const apiUrlBase = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/company-report-type';

document.addEventListener("DOMContentLoaded", function () {
    selectedValue = localStorage.getItem('reportType');
    document.getElementById("reportViewType").textContent = selectedValue;
});

// Remove Data

function dataRemove(e) {
    document.getElementById("remail").value = "";
    document.getElementById("frequencySelect").value = "";
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

// Create Data and Update Data

function addreportdetails() {
    const isValidRdays = validReportDays();
    const isValidEmail = validREmail();

    if (isValidRdays && isValidEmail) {
        const reportUpdateid = document.getElementById("savebtn").value;
        const reportEmail = document.getElementById("remail").value;
        const reportSelect = document.getElementById("frequencySelect");
        const selectedValues = Array.from(reportSelect.selectedOptions).map(option => option.value);
        let DailyReportActive = false;
        let WeeklyReportActive = false;
        let BiWeeklyReportActive = false;
        let MonthlyReportActive = false;
        let BiMonthlyReportActive = false;
        const company_id = localStorage.getItem('companyID');


        selectedValues.forEach(element => {
            if (element == 'Daily') {
                DailyReportActive = true;
            } else if (element == 'Weekly') {
                WeeklyReportActive = true;
            } else if (element == 'Biweekly') {
                BiWeeklyReportActive = true;
            } else if (element == 'Monthly') {
                MonthlyReportActive = true;
            } else if (element == 'Bimonthly') {
                BiMonthlyReportActive = true;
            }
        });

        if (reportUpdateid == "") {
            const apiUrl = `${apiUrlBase}/create`;

            const reportObject = {
                CompanyReporterEmail: reportEmail,
                CID: company_id,
                IsDailyReportActive: DailyReportActive,
                IsWeeklyReportActive: WeeklyReportActive,
                IsBiWeeklyReportActive: BiWeeklyReportActive,
                IsMonthlyReportActive: MonthlyReportActive,
                IsBiMonthlyReportActive: BiMonthlyReportActive,
                LastModifiedBy:'Admin'
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    } else {
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            const apiUrl = `${apiUrlBase}/update/${reportUpdateid}/${company_id}`;

            const updateReportObject = {
                CompanyReporterEmail: reportEmail,
                CID: company_id,
                IsDailyReportActive: DailyReportActive,
                IsWeeklyReportActive: WeeklyReportActive,
                IsBiWeeklyReportActive: BiWeeklyReportActive,
                IsMonthlyReportActive: MonthlyReportActive,
                IsBiMonthlyReportActive: BiMonthlyReportActive,
            LastModifiedBy:'Admin'
            };

            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateReportObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    } else {
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

    }
    else {
        // alert('Please fix the errors in the form');
       
    }
}


// View Data

function viewReportdetails() {
    document.getElementById('overlay').style.display = 'flex';
    const tableBody = document.getElementById("tBody");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getAllReportEmail/${company_id}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            data.forEach(element => {
                const ReportActive = [];
                if (element.IsDailyReportActive == 1) {
                    ReportActive.push('Daily');
                }   
                if (element.IsWeeklyReportActive == 1) {
                    ReportActive.push('Weekly');
                } 
                if (element.IsBiWeeklyReportActive == 1) {
                    ReportActive.push('Biweekly');
                }
                if (element.IsMonthlyReportActive == 1) {
                    ReportActive.push('Monthly');
                } 
                if (element.IsBiMonthlyReportActive == 1) {
                    ReportActive.push('Bimonthly');
                }
                
              // Convert the array to a comma-separated string
                const Frequency = ReportActive.join(',');
                const newRow = document.createElement('tr');

                newRow.innerHTML = `
                <td class="ReporterEmail">${element.CompanyReporterEmail}</td>
                <td class="ReportActive">${Frequency}</td>
                <td>
                <button class="btn icon-button" style="color: #02066F;" onclick="editEmpdetails('${element.CompanyReporterEmail}')" data-bs-toggle="modal" data-bs-target="#myModal">
                <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn icon-button" style="color: #02066F;" id="buttonClick" onclick="showLogoutModal ('${element.CompanyReporterEmail}')">
                <i class="fas fa-trash"></i>
                </button>
                </td>

            `;
                tableBody.appendChild(newRow);
                document.getElementById('overlay').style.display = 'none';
            });
        })
        .catch(error => {
            document.getElementById('overlay').style.display = 'none';
        });

}

function viewSecondReportdetails() {
    var reportType = localStorage.getItem('reportType');
    const tableBody = document.getElementById("tBody2");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getAllReportEmail/${company_id}`;

    const newRow = document.createElement('tr');

                newRow.innerHTML = `
                <td class="ReportActive">${reportType}</td>
<td>
    <button class="btn icon-button" onclick="editReportdetails('${reportType}')" data-bs-toggle="modal" data-bs-target="#myModal2" style="background: none; border: none; padding: 0;">
        <i class="fas fa-pencil-alt" style="color: #02066F;"></i>
    </button>
</td>

            `;
                tableBody.appendChild(newRow);

}

// Call fetchData when the page is fully loaded
document.addEventListener('DOMContentLoaded', viewReportdetails);
document.addEventListener('DOMContentLoaded', viewSecondReportdetails);


// Edit Data

function editEmpdetails(companyEmail) {
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/get/${companyEmail}/${company_id}`;
    const freqselect = document.getElementById('frequencySelect');
    const freqselectedValues = [];
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.IsDailyReportActive) freqselectedValues.push('Daily');
            if (data.IsWeeklyReportActive) freqselectedValues.push('Weekly');
            if (data.IsBiWeeklyReportActive) freqselectedValues.push('Biweekly');
            if (data.IsMonthlyReportActive) freqselectedValues.push('Monthly');
            if (data.IsBiMonthlyReportActive) freqselectedValues.push('Bimonthly');

            // Set the selected values
            $(freqselect).selectpicker('val', freqselectedValues);
            document.getElementById("remail").value = data.CompanyReporterEmail;
            document.getElementById("savebtn").value = data.CompanyReporterEmail;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function editReportdetails(reportType) {
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/admin-report-type/update/${company_id}`;
    const freqselect = document.getElementById('frequencySelect2');
    const freqselectedValues = [];
    
    freqselectedValues.push(reportType);

    $(freqselect).selectpicker('val', freqselectedValues);

}

// Delete Data

function deleteEmpdetails(companyEmail) {
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/delete/${companyEmail}/${company_id}/Admin`;

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
                $(".error-msg").show();
                setTimeout(function () {
                    $(".error-msg").hide();
                    window.location.href = "report_setting.html";
                }, 1000);
            } else {
                document.querySelector(".s-msg").textContent = data.message;
                $(".success-msg").show();
                setTimeout(function () {
                    $(".success-msg").hide();
                    window.location.href = "report_setting.html";
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            ;
        });
}



// Validation
// var isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// function validREmail() {
//     const remail = document.getElementById('remail').value;
//     const errorrEmail = document.getElementById('error-email');

//     if (remail.trim() === '') {
//         errorrEmail.textContent = 'Email is required';
//         return false;
//     }
//     else if (!isEmail.test(remail)) {
//         errorrEmail.textContent = 'Email pattern is Invalid';
//         return false;
//     } else {
//         errorrEmail.textContent = '';
//         return true;
//     }

// }


// function validReportDays() {
//     const select = document.getElementById('frequencySelect');
//     const errorMsg = document.getElementById('selectError');

//     if (select.selectedOptions.length === 0) {
//         errorMsg.textContent = 'Please select at least one option.';
//         return false;
//     } else if (select.selectedOptions.length > 2) {
//         errorMsg.textContent = 'Please select only two option.';
//         return false;
//     } 
//     else {
//         errorMsg.textContent = '';
//         return true;
//     }
// }


// function validReportDays2() {
//     const select = document.getElementById('frequencySelect2');
//     const errorMsg = document.getElementById('selectError2');

//     if (select.selectedOptions.length === 0) {
//         errorMsg.textContent = 'Please select at least one option.';
//         return false;
//     } else if (select.selectedOptions.length > 1) {
//         errorMsg.textContent = 'Please select only one option.';
//         return false;
//     } 
//     else {
//         errorMsg.textContent = '';
//         return true;
//     }
// }
// Function to validate email
function validREmail() {
    const remail = document.getElementById('remail').value;
    const errorEmail = document.getElementById('error-email');
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (remail.trim() === '') {
        errorEmail.textContent = 'Email is required';
        return false;
    } else if (!isEmail.test(remail)) {
        errorEmail.textContent = 'Email pattern is invalid';
        return false;
    } else {
        errorEmail.textContent = ''; // Clear error message
        return true;
    }
}

// Function to validate report days selection
function validReportDays() {
    const select = document.getElementById('frequencySelect');
    const errorMsg = document.getElementById('selectError');

    if (select.selectedOptions.length === 0) {
        errorMsg.textContent = 'Please select at least one option.';
        return false;
    } else if (select.selectedOptions.length > 2) {
        errorMsg.textContent = 'Please select only two options.';
        return false;
    } else {
        errorMsg.textContent = ''; // Clear error message
        return true;
    }
}

// Reset the form and error messages
function resetFormAndErrors() {
    document.getElementById('remail').value = ''; // Reset email input
    const frequencySelect = document.getElementById('frequencySelect');
    for (let option of frequencySelect.options) {
        option.selected = false; // Deselect all options
    }
    document.getElementById('error-email').textContent = ''; // Clear email error
    document.getElementById('selectError').textContent = ''; // Clear frequency select error
}

// Function to handle adding report details
function addreportdetails(event) {
    const isEmailValid = validREmail();
    const isDaysValid = validReportDays();

    if (isEmailValid && isDaysValid) {
        // Proceed with saving the details
        console.log("Report details saved successfully.");
    } else {
        event.preventDefault(); // Prevent modal close if validation fails
        console.log("Fix validation errors before submitting.");
    }
}

// Function to validate the second report days selection
function validReportDays2() {
    const select = document.getElementById('frequencySelect2');
    const errorMsg = document.getElementById('selectError2');

    if (select.selectedOptions.length === 0) {
        errorMsg.textContent = 'Please select at least one option.';
        return false;
    } else if (select.selectedOptions.length > 2) {
        errorMsg.textContent = 'Please select only two options.';
        return false;
    } else {
        errorMsg.textContent = ''; // Clear error message
        return true;
    }
}


// Function to handle updating report details
function updateReportdetails() {
    const isValidRdays = validReportDays2();

    if (isValidRdays) {
        const reportSelect = document.getElementById("frequencySelect2");
        const selectedValues = Array.from(reportSelect.selectedOptions).map(option => option.value);
        const company_id = localStorage.getItem('companyID');

        const apiUrl = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/admin-report-type/update/${company_id}`;

        const reportObject = {
            CID: company_id,
            ReportType: selectedValues[0]
        };
        console.log(reportObject);

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                $(".error-msg").show();
                setTimeout(function () {
                    $(".error-msg").hide();
                    window.location.href = "report_setting.html";
                }, 1000);
            } else {
                localStorage.setItem("reportType", selectedValues[0]);
                console.log(selectedValues[0]);
                $(".success-msg").show();
                setTimeout(function () {
                    $(".success-msg").hide();
                    window.location.href = "report_setting.html";
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        document.getElementById('selectError2').textContent = '';
    }
}

// Function to show logout confirmation modal
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

// Attach the reset function to the 'Add Entry' button click event
 document.getElementById('add-entry').addEventListener('click', resetFormAndErrors);
 

// When I click Logo go to home page 
function homePage(){
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click',function (){
    window.open('index.html', 'noopener, noreferrer');
})