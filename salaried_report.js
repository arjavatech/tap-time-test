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
    const selectedValue = localStorage.getItem("reportSettingsType");
  document.getElementById("reportName").textContent = `${selectedValue} Report`;
  document.getElementById("report-type-heading").textContent = `${selectedValue} Report`;

  const currentLocation = location.href;
  const menuItems = document.querySelectorAll('.sidebar a');

  menuItems.forEach(item => {
    if (item.href === currentLocation) {
      item.classList.add('active');
    }
  });

  const yearSelect = document.getElementById('yearInput');
  const monthSelect = document.getElementById('monthInput');

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  for (let year = 2025; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  monthNames.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  if (currentMonth === 1) {
    yearSelect.value = currentYear - 1;
    monthSelect.value = 12;
  } else {
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth - 1;
  }

  populateWeekDropdown(parseInt(yearSelect.value), parseInt(monthSelect.value));
  viewDateRangewiseReport();
  toggleHalfVisibility(); // ✅ Add this
});

function viewDateRangewiseReport() {
  const selectedValue = localStorage.getItem("reportSettingsType");
  const showReports = document.getElementById("showTheReports");
  showReports.innerHTML = "";
  document.getElementById("tbody").innerHTML = "";

  const getMonth = parseInt(document.getElementById("monthInput").value);
  const getYear = parseInt(document.getElementById("yearInput").value);
  const cid = localStorage.getItem("companyID");

  let dateRanges = [];

  if (selectedValue === "Weekly") {
    const firstDay = new Date(getYear, getMonth - 1, 1);
    const lastDay = new Date(getYear, getMonth, 0);
    let current = new Date(firstDay);

    while (current <= lastDay) {
      const start = new Date(current);
      const end = new Date(current);
      end.setDate(end.getDate() + 6);
      if (end > lastDay) end.setDate(lastDay.getDate());

      dateRanges.push({ startRange: formatDate(start), endRange: formatDate(end) });
      current.setDate(current.getDate() + 7);
    }

    // Create buttons for weekly
    dateRanges.forEach((range, index) => {
      const btn = document.createElement("button");
      btn.textContent = `Report ${index + 1}: ${range.startRange} - ${range.endRange}`;
      btn.className = "btn report-btn-style m-1 report-button";

      btn.onclick = () => {
        document.querySelectorAll('.report-button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadReportTable(range.startRange, range.endRange, cid);
        document.getElementById("start-date-header").innerHTML = range.startRange;
        document.getElementById("end-date-header").innerHTML = range.endRange;
      };

      showReports.appendChild(btn);
      if (index === 0) btn.click(); // Auto-load first week
    });

  } else if (selectedValue === "Bimonthly") {
    const halfValue = document.getElementById("halfInput").value;
    const daysInMonth = new Date(getYear, getMonth, 0).getDate();
    const mid = Math.ceil(daysInMonth / 2);

    const firstHalf = {
      startRange: `${getYear}-${pad(getMonth)}-01`,
      endRange: `${getYear}-${pad(getMonth)}-${pad(mid)}`
    };
    const secondHalf = {
      startRange: `${getYear}-${pad(getMonth)}-${pad(mid + 1)}`,
      endRange: `${getYear}-${pad(getMonth)}-${pad(daysInMonth)}`
    };

    const halfButtons = [firstHalf, secondHalf];

    halfButtons.forEach((range, index) => {
      const btn = document.createElement("button");
      btn.textContent = `Report ${index + 1}: ${range.startRange} - ${range.endRange}`;
      btn.className = "btn report-btn-style m-1 report-button";

      // Auto-highlight button that matches dropdown
      if ((index === 0 && halfValue === "first") || (index === 1 && halfValue === "second")) {
        btn.classList.add("active");
        loadReportTable(range.startRange, range.endRange, cid);
        document.getElementById("start-date-header").innerHTML = range.startRange;
        document.getElementById("end-date-header").innerHTML = range.endRange;
      }

      btn.onclick = () => {
        document.querySelectorAll(".report-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadReportTable(range.startRange, range.endRange, cid);
        document.getElementById("start-date-header").innerHTML = range.startRange;
        document.getElementById("end-date-header").innerHTML = range.endRange;

        // Update dropdown
        document.getElementById("halfInput").value = index === 0 ? "first" : "second";
      };

      showReports.appendChild(btn);
    });

  } else if (selectedValue === "Monthly") {
    const daysInMonth = new Date(getYear, getMonth, 0).getDate();
    const start = `${getYear}-${pad(getMonth)}-01`;
    const end = `${getYear}-${pad(getMonth)}-${pad(daysInMonth)}`;
    loadReportTable(start, end, cid);
    document.getElementById("start-date-header").innerHTML = start;
    document.getElementById("end-date-header").innerHTML = end;

  } else if (selectedValue === "Biweekly") {
    const today = new Date();
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(end.getDate() - 13);

    const startStr = formatDate(start);
    const endStr = formatDate(end);
    loadReportTable(startStr, endStr, cid);
    document.getElementById("start-date-header").innerHTML = startStr;
    document.getElementById("end-date-header").innerHTML = endStr;
  } else {
    showReports.innerHTML = "";
  }
}

document.getElementById('halfInput').addEventListener('change', viewDateRangewiseReport);


function loadReportTable(startVal, endVal, cid) {
  document.querySelector(".overlay").style.display = "flex";
  const tableBody = document.getElementById("tbody");
  document.getElementById("start-date-header").innerText = startVal;
  document.getElementById("end-date-header").innerText = endVal;

  tableBody.innerHTML = '';
  if ($.fn.DataTable.isDataTable('#employeeTable')) {
    $('#employeeTable').DataTable().clear().destroy();
  }

  const localStorageKey = `report_${cid}_${startVal}_${endVal}`;
  const cachedDataRaw = localStorage.getItem(localStorageKey);

  if (cachedDataRaw) {
    try {
      const cachedData = JSON.parse(cachedDataRaw);
      renderReportTable(cachedData, tableBody);
      document.querySelector(".overlay").style.display = "none";
      return;
    } catch (e) {
      // if corrupted, continue with API call
    }
  }

  const apiUrl = `${apiUrlBase}/${cid}/${startVal}/${endVal}`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        localStorage.setItem(localStorageKey, JSON.stringify(data));
        renderReportTable(data, tableBody);
      } else {
        localStorage.setItem(localStorageKey, JSON.stringify([])); // store empty
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No Records Found</td></tr>`;
        document.getElementById("download-buttons").style.display = "none";
      }
      document.querySelector(".overlay").style.display = "none";
    })
    .catch(() => {
      localStorage.setItem(localStorageKey, JSON.stringify([])); // store empty fallback
      tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No Records Found</td></tr>`;
      document.querySelector(".overlay").style.display = "none";
    });
}

function renderReportTable(data, tableBody) {
  const totalTimeWorked = calculateTotalTimeWorked(data);

  if (!data || data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No Records Found</td></tr>`;
    document.getElementById("download-buttons").style.display = "none";
    return;
  }

  Object.entries(totalTimeWorked).forEach(([pin, emp]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${pin}</td>
      <td>${emp.totalHoursWorked}</td>
    `;
    tableBody.appendChild(row);
  });

  $('#employeeTable').DataTable();
  document.getElementById("download-buttons").style.display = "flex";
}


function pad(n) {
  return n.toString().padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}



function toggleHalfVisibility() {
  const type = localStorage.getItem("reportSettingsType");
  const weekWrapper = document.getElementById("weekInputWrapper");
  const halfWrapper = document.getElementById("halfInputWrapper");

  weekWrapper.style.display = (type === "Weekly") ? "inline-block" : "none";
  halfWrapper.style.display = (type === "Bimonthly") ? "inline-block" : "none";

}

function populateWeekDropdown(year, month) {
  const weekSelect = document.getElementById('weekInput');
  weekSelect.innerHTML = '';

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  let current = new Date(firstDay);
  let weekCount = 0;

  while (current <= lastDay) {
    if (current.getDay() === 1) { // Only if it's Monday
      weekCount++;
      const option = document.createElement('option');
      option.value = weekCount;
      option.textContent = `Week ${weekCount}`;
      weekSelect.appendChild(option);
    }
    current.setDate(current.getDate() + 1);
  }
}

// Weekly Report Date Calculation
function getWeeklyReport(year, month) {
  const weekNum = parseInt(document.getElementById("weekInput").value);

  const firstDay = new Date(year, month - 1, 1);
  while (firstDay.getDay() !== 1) {
    firstDay.setDate(firstDay.getDate() + 1);
  }

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() + (weekNum - 1) * 7);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const lastDayOfMonth = new Date(year, month, 0);
  const format = (d) => d.toISOString().split("T")[0];

  return {
    startRange: format(startDate),
    endRange: format(endDate > lastDayOfMonth ? lastDayOfMonth : endDate)
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


function getBimonthlyReport(year, month) {
  const selectedHalf = document.getElementById("halfInput")?.value || "first";
  const daysInMonth = new Date(year, month, 0).getDate(); // full days in month
  const mid = Math.ceil(daysInMonth / 2);

  let startDate, endDate;

  if (selectedHalf === "first") {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month - 1, mid);
  } else {
    startDate = new Date(year, month - 1, mid + 1);
    endDate = new Date(year, month - 1, daysInMonth);
  }

  const pad = (n) => n.toString().padStart(2, '0');

  return {
    startRange: `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`,
    endRange: `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}`
  };
}


function getMonthlyReport(year, month) {
  const today = new Date();
  // const startDateLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  // const endDateLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  const startDateLastMonth = new Date(year, month - 1, 1);
  const endDateLastMonth = new Date(year, month, 0);

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

function homePage() {
  const modalElement = document.getElementById('homePageModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

document.getElementById('homePageYes').addEventListener('click', function () {
  window.open('index.html', 'noopener, noreferrer');
})

function downloadPdf() {
  if (!window.reportData || window.reportData.length === 0) {
    alert('No data to download.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const selectedValue = localStorage.getItem('reportType');
  const startDate = document.getElementById('start-date-header').textContent;
  const endDate = document.getElementById('end-date-header').textContent;

  doc.setFontSize(16);
  doc.text(`${selectedValue} Report (${startDate} to ${endDate})`, 14, 20);

  const columns = ['Name', 'Pin', 'Total Worked Hours (HH:MM)'];

  const data = window.reportData.map(element => [
    element.Name,
    element.Pin,
    element.TotalHours
  ]);

  doc.autoTable({
    head: [columns],
    body: data,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [2, 6, 111] }
  });

  doc.save(`${selectedValue.toLowerCase()}_report.pdf`);
}

function downloadCsv() {
  if (!window.reportData || window.reportData.length === 0) {
    alert('No data to download.');
    return;
  }

  const headers = ['Name', 'Pin', 'Total Worked Hours (HH:MM)'];

  const csvData = window.reportData.map(element => [
    element.Name,
    element.Pin,
    element.TotalHours
  ]);

  let csvContent = headers.join(',') + '\n';
  csvData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const selectedValue = localStorage.getItem('reportType');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${selectedValue.toLowerCase()}_report.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
