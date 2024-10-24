// When I click close modal with have any error in this form we need to clear all error msg 
$('#addEntryModal').on('hidden.bs.modal', function () {
  // Clear error messages
  $('#EmpNameError').text(''); 
  $('#EmpTypeError').text(''); 
  $('#dateError').text(''); 
  $('#startTimeError').text(''); 
  $('#endTimeError').text(''); 
  $('#AddEmployee').prop('disabled', true);
  $('#datePicker').prop('value',"");

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

const apiUrlBase = 'https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/dailyreport/getdatebasedata';


const cid = localStorage.getItem('companyID');
var dropdownValue;
var employeeDetails = {}

const datePicker = document.getElementById('datePicker');
const checkinTimeButton = document.getElementById('checkinTime');
const checkoutTimeButton = document.getElementById('checkoutTime');
const AddEmployee = document.getElementById('AddEmployee');
const dateError = document.getElementById('dateError');
const startTimeError = document.getElementById('startTimeError');
const endTimeError = document.getElementById('endTimeError');
const EmpNameError = document.getElementById('EmpNameError');
const EmpTypeError = document.getElementById('EmpTypeError');
// Disable future dates in date picker
const today = new Date();
const year = today.getFullYear();
const month = ('0' + (today.getMonth() + 1)).slice(-2); // Adding 1 since getMonth() is 0-indexed
const day = ('0' + today.getDate()).slice(-2);
const formattedToday = `${year}-${month}-${day}`; // Format: yyyy-mm-dd
datePicker.setAttribute('max', formattedToday);




// Enable end time only after start time is selected
checkinTimeButton.addEventListener('change', () => {
  if (checkinTimeButton.value) {
    checkoutTimeButton.disabled = false;
    startTimeError.textContent = ''; // Clear any previous error
  } else {
    checkoutTimeButton.disabled = true;
    startTimeError.textContent = 'Please select a valid start time.';
  }
});
// Enable the button only if end time is greater than start time
checkoutTimeButton.addEventListener('change', () => {
  if (checkinTimeButton.value && checkoutTimeButton.value > checkinTimeButton.value) {
    AddEmployee.disabled = false;
    endTimeError.textContent = ''; // Clear any previous error
  } else {
    endTimeError.textContent = 'End time must be greater than start time.';
    AddEmployee.disabled = true;
  }
});


function formatDateTimeToTimezone(utcDateTime, timezone) {
  // Append 'Z' to indicate UTC if it's not already present
  if (!utcDateTime.endsWith('Z')) {
    utcDateTime += 'Z';
  }

  // Create a Date object from the UTC date-time string
  const utcDate = new Date(utcDateTime);

  // Use Intl.DateTimeFormat to convert to the specified timezone
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedParts = formatter.formatToParts(utcDate);

  // Extract the individual date and time parts
  const year = formattedParts.find(part => part.type === 'year').value;
  const month = formattedParts.find(part => part.type === 'month').value;
  const day = formattedParts.find(part => part.type === 'day').value;
  const hour = formattedParts.find(part => part.type === 'hour').value;
  const minute = formattedParts.find(part => part.type === 'minute').value;
  const second = formattedParts.find(part => part.type === 'second').value;

  // Return the formatted date-time string in 'YYYY-MM-DD HH:mm:ss' format
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function formatDateTime(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getUTCRangeForDate(timezone) {
  // Get the current date and time in the given timezone
  const currentDate = new Date().toLocaleString("en-US", { timeZone: timezone });

  // Convert to Date object
  const dateInTimeZone = new Date(currentDate);

  // Set the start time to 00:00:00.000 in the timezone
  const startTimeInTimeZone = new Date(dateInTimeZone);
  startTimeInTimeZone.setHours(0, 0, 0, 0); // Set to start of the day

  // Set the end time to 23:59:59.999 in the timezone
  const endTimeInTimeZone = new Date(dateInTimeZone);
  endTimeInTimeZone.setHours(23, 59, 59, 999); // Set to end of the day

  // Convert start and end times to UTC
  const startTimeInUTC = new Date(startTimeInTimeZone.toISOString());
  const endTimeInUTC = new Date(endTimeInTimeZone.toISOString());

  // Format the start and end times to 'YYYY-MM-DD HH:mm:ss'
  const formattedStartTimeUTC = formatDateTime(startTimeInUTC);
  const formattedEndTimeUTC = formatDateTime(endTimeInUTC);

  return {
    startTimeInUTC: formattedStartTimeUTC,
    endTimeInUTC: formattedEndTimeUTC
  };
}

function viewCurrentDateReport() {
  document.getElementById('overlay').style.display = 'flex';

  selectedValue = localStorage.getItem('reportType');
  document.getElementById("reportName").textContent = selectedValue + " Report";

  const tableBody3 = document.getElementById("current-checkin-tbody");
  const heading = document.getElementById("current-checkin-header");
  tableBody3.innerHTML = '';

  // if ($.fn.DataTable.isDataTable('#employeeTable')) {
  //   $('#employeeTable').DataTable().destroy();
  // }


  function myFunction() {
    dropdownValue = document.getElementById("dynamicDropdown").value;
  }

  document.getElementById("dynamicDropdown").addEventListener('change', myFunction);

  // Check employee API URL
  const employeeApiURL = `https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/employee/getall/${cid}`;
  

  fetch(employeeApiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching employee data');
      }
      return response.json();
    })
    .then(data => {
      

      // Populate dropdown with employee names
      let optionsList = [];
      data.forEach(element => {
        let temp = `${element.FName}`;
        employeeDetails[temp] = element;
        optionsList.push(temp);
      });

      const dropdown = document.getElementById("dynamicDropdown");
      dropdown.innerHTML = '<option value="">Select Employee</option>';
      optionsList.forEach(option => {
        const newOption = document.createElement("option");
        newOption.value = option;
        newOption.text = option;
        dropdown.appendChild(newOption);
      });
    })
    .catch(error => {
      
    });

  // Check current date report API
  var date = getCurrentLocalTime().substring(0, 10);
  const apiUrl = `${apiUrlBase}/${cid}/${date}`;


  heading.innerHTML = date;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {


      if (!data.length) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td colspan="5" class="text-center">No Records Found</td>`;
        tableBody3.appendChild(newRow);
        document.getElementById('overlay').style.display = 'none';
        return;
      }

      data.forEach(element => {
        const newRow = document.createElement('tr');
        const checkInTimeUTC = new Date(element.CheckInTime);
        const checkInTimeFormatted = convertToAmPm(checkInTimeUTC);

        if (element.CheckOutTime == null) {
          const datetimeId = `datetime-${element.CheckInTime}-${element.Pin}`;
          const checkOutId = `check_out-${element.CheckInTime}-${element.Pin}`;

          newRow.innerHTML = `
              <td class="Pin">${element.Pin}</td>
              <td class="Name">${(element.Name).split(" ")[0]}</td>
              <td class="CheckInTime">${checkInTimeFormatted}</td>
              <td>
                <div class="text-center">
                  <input type="time" id="${datetimeId}" name="time" class="time-input" step="1">
                  <div class="calendar-icon" onclick="openTimePicker();"></div>
                </div>
              </td>
              <td class="text-center">
                <button type="button" class="btn btn-green" id="${checkOutId}" disabled>Check-out</button>
              </td>
            `;

          tableBody3.appendChild(newRow);

          const datetimeInput = document.getElementById(datetimeId);
          const checkOutButton = document.getElementById(checkOutId);

          datetimeInput.addEventListener('change', function () {
            checkOutButton.disabled = !this.value;
          });

          checkOutButton.addEventListener('click', function () {
            document.getElementById('overlay').style.display = 'flex';

            const dateWithTime = getDateTimeFromTimePicker(datetimeInput.value);

            const date2 = new Date(element.CheckInTime);
            const date1 = new Date(dateWithTime);

            const diffInMs = date1 - date2;
            const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
            const totalHours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;

            const timeWorkedHours = `${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            updateDailyReportAPiData(element.EmpID, element.CID, date, element.Type, element.CheckInSnap, element.CheckInTime, element.CheckOutSnap, dateWithTime, timeWorkedHours);

            datetimeInput.value = '';
            checkOutButton.disabled = true;
          });
        } else {
          const checkInTimeIST = new Date(element.CheckInTime);
          const checkOutTimeIST = new Date(element.CheckOutTime);
          const checkInTimeFormatted = convertToAmPm(new Date(checkInTimeIST));
          const checkOutTimeFormatted = convertToAmPm(new Date(checkOutTimeIST));

          newRow.innerHTML = `
              <td class="Pin">${element.Pin}</td>
              <td class="Name">${(element.Name).split(" ")[0]}</td>
              <td class="CheckInTime">${checkInTimeFormatted}</td>
              <td class="CheckOutTime">${checkOutTimeFormatted}</td>
              <td class="text-center">
                <button type="button" class="btn btn-grey" disabled>Check-out</button>
              </td>
            `;
          tableBody3.appendChild(newRow);
        }
      });

      // Initialize DataTable
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

document.addEventListener('DOMContentLoaded', viewCurrentDateReport);

async function updateDailyReportAPiData(emp_id, cid, date, type, checkin_snap, checkin_time, checkout_snap, checkout_time, time_worked) {

  const userData = {
    CID: cid,
    EmpID: emp_id,
    Date: date,
    TypeID: type,
    CheckInSnap: checkin_snap,
    CheckInTime: checkin_time,
    CheckOutSnap: checkout_snap,
    CheckOutTime: checkout_time,
    TimeWorked: time_worked,
    LastModifiedBy:'Admin'
  }

  var apiBaseUrl = `https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/dailyreport/update/${emp_id}/${cid}/${checkin_time}`;

  try {
    const response = await fetch(apiBaseUrl, {
      method: 'PUT',
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
        setTimeout(() => {
          window.location.href = "report_summary.html";
        }, 1000);

      }
      else {
        alert(data.error);
      }
    }
  } catch (error) {
  }
}


function convertToAmPm(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutesStr + ' ' + ampm;
}



// Weekly Report Date Calculation.

function getLastWeekDateRange() {
  // Today's date
  let today = new Date();

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let dayOfWeek = today.getDay();

  // Calculate the difference to the previous Monday (dayOfWeek - 1)
  // If today is Monday, dayOfWeek - 1 is 0, so we go back 7 days (last Monday)
  let daysSinceLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Calculate last Monday's date
  let lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceLastMonday - 7);

  // Calculate last Sunday's date
  let lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);

  // Format dates to yyyy-mm-dd
  let formatDate = (date) => date.toISOString().split('T')[0];

  let lastMondayStr = formatDate(lastMonday);
  let lastSundayStr = formatDate(lastSunday);

  return {
    startRange: lastMondayStr,
    endRange: lastSundayStr
  };
}

function getLastTwoWeeksDateRange() {
  // Today's date
  let today = new Date();

  // Find the start of the current week (Monday)
  let currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

  // Calculate the start of the last two weeks (Monday two weeks ago)
  let startDate = new Date(currentWeekStart);
  startDate.setDate(currentWeekStart.getDate() - 14);

  // Calculate the end of the last two weeks (Sunday two weeks later)
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13); // 14 days - 1 day

  // Format dates to yyyy-mm-dd
  let formatDate = (date) => date.toISOString().split('T')[0];

  let startDateStr = formatDate(startDate);
  let endDateStr = formatDate(endDate);

  return {
    startRange: startDateStr,
    endRange: endDateStr
  };
}

function getLastTwoMonthStartAndEndDates() {
  // Get today's date
  const today = new Date();

  // Calculate the start date (first day of the month two months ago)
  const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);


  // Calculate the end date (last day of the previous month)
  const endDate = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    startRange: formatDate(startDate),
    endRange: formatDate(endDate)
  };
}

function getLastMonthStartAndEndDates() {
  // Set today's date for testing
  const today = new Date();

  // Calculate the start date of the last full month
  const startDateLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  // Calculate the end date of the last full month
  const endDateLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    startRange: formatDate(startDateLastMonth),
    endRange: formatDate(endDateLastMonth)
  };
}

// Function to format date as "yyyy-MM-dd"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// Functions to convert time and calculate totals
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}


function calculateTotalTimeWorked(data) {
  const employeeTimes = {};

  data.forEach(entry => {
    const { Name, Pin, TimeWorked } = entry;

    if (TimeWorked) {
      const minutesWorked = timeToMinutes(TimeWorked);

      if (!employeeTimes[Pin]) {
        employeeTimes[Pin] = { name: Name, totalMinutes: 0 };
      }
      employeeTimes[Pin].totalMinutes += minutesWorked;
    }
  });

  // Convert total minutes to time string
  for (const [pin, details] of Object.entries(employeeTimes)) {
    details.totalHoursWorked = minutesToTime(details.totalMinutes);
  }

  return employeeTimes;
}

function getDateTimeFromTimePicker(timeValue) {
  // Get today's date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');

  // Extract time components from the time value
  const [hours, minutes, seconds] = timeValue.split(':').map(part => part.padStart(2, '0'));

  // Combine date with time
  const combinedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  return combinedDateTime;
}


document.addEventListener('DOMContentLoaded', function () {
  // Initialize Flatpickr
  flatpickr(".datetime", {
    enableTime: true,
    enableTime: true,
    enableSeconds: true,
    time_24hr: true,
    dateFormat: "Y-m-d h:i:S",
    minuteIncrement: 1,
    allowInput: true
  });

  // Show modal on button click
  document.getElementById('add-entry').addEventListener('click', function () {
    document.getElementById("checkinTime").value = '';
    document.getElementById("checkoutTime").value = '';
    document.getElementById("type").value = '';
    document.getElementById("dynamicDropdown").value = '';
    var modal = new bootstrap.Modal(document.getElementById('addEntryModal'));
    modal.show();
  });

  // Handle form submission
  var form = document.getElementById('entryForm');

  // Show the formatted start and end datetime with validation
  AddEmployee.addEventListener('click', (event) => {
    let isValid = true;
    // Check if date is selected
    if (!datePicker.value) {
      dateError.textContent = 'Please select a valid date.';
      isValid = false;
    } else {
      dateError.textContent = '';
      EmpTypeError.textContent = "";
      startTimeError.textContent = "";
      EmpNameError.textContent = "";
      endTimeError.textContent = "";
    }
    if (document.getElementById("type").value === "") {
      EmpTypeError.textContent = 'Please select a type.';
      isValid = false;
      dateError.textContent = '';
      startTimeError.textContent = "";
      EmpNameError.textContent = "";
      endTimeError.textContent = "";
    }

    if (document.getElementById("dynamicDropdown").value === "") {
      EmpNameError.textContent = 'Please select a Employee.';
      isValid = false;
      dateError.textContent = '';
      EmpTypeError.textContent = "";
      startTimeError.textContent = "";
      endTimeError.textContent = "";
    }
    // Check if start time is selected
    if (!checkinTimeButton.value) {
      startTimeError.textContent = 'Please select a valid check in time.';
      isValid = false;
      dateError.textContent = '';
      EmpTypeError.textContent = "";
      EmpNameError.textContent = "";
      endTimeError.textContent = "";
    }
    // Check if end time is valid
    if (!checkoutTimeButton.value || checkoutTimeButton.value <= checkinTimeButton.value) {
      endTimeError.textContent = 'Checkout time must be greater than check in time.';
      isValid = false;
      dateError.textContent = '';
      EmpTypeError.textContent = "";
      startTimeError.textContent = "";
      EmpNameError.textContent = "";
    }
    if (isValid) {
      var datePickerValue = datePicker.value;
      const checkinTimeValue = checkinTimeButton.value;
      const checkoutTimeValue = checkoutTimeButton.value;
      const startDateTime = datePickerValue + ' ' + checkinTimeValue + ":00";
      const endDateTimeValue = datePickerValue + ' ' + checkoutTimeValue + ":00";


      document.getElementById('overlay').style.display = 'flex';
      var name = document.getElementById('dynamicDropdown').value;
      var type = document.getElementById('type').value;


      const cid = localStorage.getItem('companyID');
      const date1 = new Date(endDateTimeValue);
      const date2 = new Date(startDateTime);

      // Calculate the difference in milliseconds
      const diffInMs = date1 - date2;

      // Convert the difference from milliseconds to total minutes
      const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

      // Calculate the total hours and remaining minutes
      const totalHours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      // Format the hours and minutes
      const formattedHours = String(totalHours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');

      const timeWorkedHours = formattedHours + ":" + formattedMinutes;

      // Data object to be sent
      var data = {
        CID: cid,
        EmpID: employeeDetails[name]['EmpID'],
        Date: startDateTime.substring(0, 10),
        TypeID: type,
        CheckInSnap: null,
        CheckInTime: startDateTime,
        CheckOutSnap: null,
        CheckOutTime: endDateTimeValue,
        TimeWorked: timeWorkedHours,
        LastModifiedBy:'Admin'
      };

      // Send Post request
      fetch('https://xz00ygqxf0.execute-api.us-west-2.amazonaws.com/test/dailyreport/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          // Close the modal
          var modal = bootstrap.Modal.getInstance(document.getElementById('addEntryModal'));
          AddEmployee.disabled = true;
          modal.hide();
          viewCurrentDateReport();
          // Optionally, you can refresh data or provide a success message
        })
        .catch((error) => {
         
        });
    }
  });
});




function getCurrentDateInTimezone(timezone) {
  // Get the current date and time in UTC
  const now = new Date();

  // Options to format the date in the desired timezone
  const options = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  // Format the date in the desired timezone using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(now);

  // Convert the formatted date to "YYYY-MM-DD" format
  const [month, day, year] = formattedDate.split('/');

  return `${year}-${month}-${day}`;
}


function getCurrentLocalTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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