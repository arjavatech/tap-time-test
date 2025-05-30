const apiUrlBase = 'https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/report/dateRangeReportGet';

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


function viewDateRangewiseReport() {
  document.getElementById('overlay').style.display = 'flex';
  const tableBody = document.getElementById("tbody");
  const table = $('#employeeTable').DataTable(); // Get DataTable instance
  table.clear().destroy(); // Clear existing DataTable instance

  tableBody.innerHTML = '';
  const cid = localStorage.getItem('companyID');

  let dateRange = {};
  const selectedValue = localStorage.getItem('reportType');

  switch (selectedValue) {
   
    case "Weekly":
      dateRange = getLastWeekDateRange();
      break;
    case "Monthly":
      dateRange = getLastMonthStartAndEndDates();
      break;
    case "Bimonthly":
      dateRange = getLastTwoMonthStartAndEndDates();
      break;
    case "Biweekly":
      dateRange = getLastTwoWeeksDateRange();
      break;
    default:
 
      return;
  }

  const startVal = dateRange.startRange;
  const endVal = dateRange.endRange;

  document.getElementById("start-date-header").innerHTML = startVal;
  document.getElementById("end-date-header").innerHTML = endVal;

  const apiUrl = `${apiUrlBase}/${cid}/${startVal}/${endVal}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
   
      try {
        const totalTimeWorked = calculateTotalTimeWorked(data);
      

        if (!Array.isArray(data) || data.length === 0) {
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
                      <td colspan="3" class="text-center">No Records Found</td>
                  `;
          tableBody.appendChild(newRow);
        } else {
          Object.entries(totalTimeWorked).forEach(([pin, Employeedata]) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                          <td class="Name">${Employeedata.name}</td>
                          <td class="Pin">${pin}</td>
                          <td class="TimeWorked">${Employeedata.totalHoursWorked}</td>
                      `;
            tableBody.appendChild(newRow);
          });
        }

        $('#employeeTable').DataTable({ // Reinitialize DataTable
          "paging": true,
          "searching": true,
          "ordering": true,
          "info": true
        });

        document.getElementById('overlay').style.display = 'none';
      } catch (error) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
                      <td colspan="3" class="text-center">No Records Found</td>
                  `;
        tableBody.appendChild(newRow);
      
        document.getElementById('overlay').style.display = 'none';
      }
    })
    .catch(error => {
  
      document.getElementById('overlay').style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const selectedValue = localStorage.getItem('reportType');
  document.getElementById("reportName").textContent = `${selectedValue} Report`;
  document.getElementById("report-type-heading").textContent = `${selectedValue} Report`;
  viewDateRangewiseReport();
});

// Weekly Report Date Calculation
function getLastWeekDateRange() {
  let today = new Date();
  let dayOfWeek = today.getDay();
  let daysSinceLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  let lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceLastMonday - 7);
  let lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);

  let formatDate = (date) => date.toISOString().split('T')[0];

  let lastMondayStr = formatDate(lastMonday);
  let lastSundayStr = formatDate(lastSunday);

  return {
    startRange: lastMondayStr,
    endRange: lastSundayStr
  };
}

function getLastTwoWeeksDateRange() {
  let today = new Date();
  let currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
  let startDate = new Date(currentWeekStart);
  startDate.setDate(currentWeekStart.getDate() - 14);
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);

  let formatDate = (date) => date.toISOString().split('T')[0];

  let startDateStr = formatDate(startDate);
  let endDateStr = formatDate(endDate);

  return {
    startRange: startDateStr,
    endRange: endDateStr
  };
}

function getLastTwoMonthStartAndEndDates() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const midMonthDay = Math.ceil(daysInMonth / 2);

  let startDate, endDate;
  if (today.getDate() >= midMonthDay) {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), midMonthDay - 1);
  } else {
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const daysInPrevMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).getDate();
    startDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), Math.ceil(daysInPrevMonth / 2));
    endDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
  }

  const padToTwoDigits = (num) => num.toString().padStart(2, '0');

  return {
    startRange: `${startDate.getFullYear()}-${padToTwoDigits(startDate.getMonth() + 1)}-${padToTwoDigits(startDate.getDate())}`,
    endRange: `${endDate.getFullYear()}-${padToTwoDigits(endDate.getMonth() + 1)}-${padToTwoDigits(endDate.getDate())}`
  };
}

function getLastMonthStartAndEndDates() {
  const today = new Date();
  const startDateLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDateLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    startRange: formatDate(startDateLastMonth),
    endRange: formatDate(endDateLastMonth)
  };
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
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


// When I click Logo go to home page 
function calculateTotalTimeWorked(data) {
  const employeeTimes = {};

  data.forEach(entry => {
    const { Name, Pin, CheckInTime, CheckOutTime } = entry;

    if (!Name || !Pin || !CheckInTime) {
   
      return;
    }

    // Convert CheckInTime and CheckOutTime to Date objects
    const checkInDate = new Date(CheckInTime);
    const checkOutDate = CheckOutTime ? new Date(CheckOutTime) : new Date(); // Use current time if CheckOutTime is null

    const timeDifferenceInMinutes = Math.floor((checkOutDate - checkInDate) / 1000 / 60); // Convert time difference to minutes

    if (!employeeTimes[Pin]) {
      employeeTimes[Pin] = { name: Name, totalMinutes: 0 };
    }

    employeeTimes[Pin].totalMinutes += timeDifferenceInMinutes;
  });

  // Convert totalMinutes to HH:MM format
  for (const [pin, details] of Object.entries(employeeTimes)) {
    details.totalHoursWorked = minutesToTime(details.totalMinutes);
  }

 
  return employeeTimes;
}

function homePage(){
  const modalElement = document.getElementById('homePageModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click',function (){
  window.open('index.html', 'noopener, noreferrer');
})
