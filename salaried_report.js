
const apiUrlBase = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/report/dateRangeReportGet';


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
      console.error("Invalid report type");
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

        if (Array.isArray(data) && data.length === 0) {
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
        console.error('Error:', error);
        document.getElementById('overlay').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      document.getElementById('overlay').style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const selectedValue = localStorage.getItem('reportType');
  document.getElementById("reportName").textContent = `${selectedValue} Report`;
  document.getElementById("report-type-heading").textContent = `${selectedValue} Report`;
  viewDateRangewiseReport();
});


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
  const today = new Date();

  // Calculate the middle of the month based on the number of days
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const midMonthDay = Math.ceil(daysInMonth / 2);

  let startDate, endDate;

  if (today.getDate() >= midMonthDay) {
    // Second half of the month, so return the first half
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), midMonthDay - 1);
  }
  else {
    // First half of the month, so return the second half of the previous month
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

// When I click Logo go to home page 

function homePage(){
  const modalElement = document.getElementById('homePageModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click',function (){
  window.open('index.html', 'noopener, noreferrer');
})
