
const apiUrlBase = 'https://vnnex1njb9.execute-api.ap-south-1.amazonaws.com/test/dailyreport/getdatebasedata';

const cid = localStorage.getItem('companyID');


// document.addEventListener("DOMContentLoaded",()=>{
//   document.getElementById("footer_id").style.position = "fixed";
// })

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




function formatDateTime(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getUTCRangeForCustomDate(selectedDate, timezone) {
  // Convert the selected date to a Date object
  const selectedDateTime = new Date(selectedDate);

  // Convert the selected date to the specified timezone
  const dateInTimeZone = new Date(selectedDateTime.toLocaleString("en-US", { timeZone: timezone }));

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


document.addEventListener("DOMContentLoaded", function () {
  selectedValue = localStorage.getItem('reportType');
  document.getElementById("reportName").textContent = selectedValue + " Report";
});

function viewDatewiseReport(dateValue) {
  document.getElementById('overlay').style.display = 'flex';
  document.querySelector(".custom-table-container").style.display = "block";
  document.getElementById("noDateSelect").style.display = "none";
  document.getElementById("download-buttons").style.display = "none";
  const tableBody = document.getElementById("tbody");
  tableBody.innerHTML = '';
 

  if ($.fn.DataTable.isDataTable('#employeeTable')) {
      $('#employeeTable').DataTable().destroy();
  }

  if (dateValue != "test") {
      const apiUrl = `${apiUrlBase}/${cid}/${dateValue}`;

      fetch(apiUrl)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Error: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              try {
                  tableBody.innerHTML = "";
                  let index = 1;
                  // Store data globally for PDF download
                  window.reportData = data.filter(element => element.CheckOutTime != null);
                  
                  data.forEach(element => {
                      const newRow = document.createElement('tr');
                      if (element.CheckOutTime != null) {
                          const checkInTimeUTC = new Date(element.CheckInTime);
                          const checkOutTimeUTC = new Date(element.CheckOutTime);

                          // Convert to AM/PM format if needed
                          const checkInTimeFormatted = convertToAmPm(checkInTimeUTC);
                          const checkOutTimeFormatted = convertToAmPm(checkOutTimeUTC);

                          newRow.innerHTML = `
                              <td class="Name">${element.Name}</td>
                              <td class="Pin">${element.Pin}</td>
                              <td class="CheckInTime">${checkInTimeFormatted}</td>
                              <td class="CheckOutTime">${checkOutTimeFormatted}</td>
                              <td class="TimeWorked">${element.TimeWorked}</td>
                          `;
                          tableBody.appendChild(newRow);
                      }
                  });

                  // Only show download buttons if there's actual data
                  if (window.reportData && window.reportData.length > 0) {
                      // Initialize DataTable after populating the table
                      $('#employeeTable').DataTable({
                          "paging": true,
                          "searching": true,
                          "ordering": true,
                          "info": true
                      });
                      
                      // Show download buttons when data is loaded
                      document.getElementById("download-buttons").style.display = "flex";
                  }

              } catch {
                  const newRow = document.createElement('tr');
                  newRow.innerHTML = `
                      <td colspan="6" class="text-center">No Records Found</td>
                  `;
                  tableBody.appendChild(newRow);
                  // document.getElementById("footer_id").style.position = "fixed";
              }
              document.getElementById('overlay').style.display = 'none';
          })
          .catch(error => {
            
          });
  } else {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <td colspan="6" class="text-center">No Date chosen</td>
      `;
      tableBody.innerHTML = '';
      tableBody.appendChild(newRow);
  }
}

// Trigger report on date change
document.getElementById('dailyReportDate').addEventListener('change', function () {
  const dateValue = this.value;
  viewDatewiseReport(dateValue);
});



function convertToAmPm(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutesStr + ' ' + ampm;
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

function downloadPdf() {
  if (!window.reportData || window.reportData.length === 0) {
    alert('No data to download.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const selectedDate = document.getElementById('dailyReportDate').value;
  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Selected Date';
  
  doc.setFontSize(16);
  doc.text(`Day Wise Report - ${formattedDate}`, 14, 20);

  const columns = ['Employee Name', 'Employee ID', 'Check-in Time', 'Check-out Time', 'Time Worked Hours (HH:MM)'];

  const data = window.reportData.map(element => [
    (element.Name).split(" ")[0],
    element.Pin,
    convertToAmPm(new Date(element.CheckInTime)),
    convertToAmPm(new Date(element.CheckOutTime)),
    element.TimeWorked
  ]);

  doc.autoTable({
    head: [columns],
    body: data,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [2, 6, 111] }
  });

  doc.save(`day_wise_report_${selectedDate || 'report'}.pdf`);
}

function downloadCsv() {
  if (!window.reportData || window.reportData.length === 0) {
    alert('No data to download.');
    return;
  }

  const selectedDate = document.getElementById('dailyReportDate').value;
  const headers = ['Employee Name', 'Employee ID', 'Check-in Time', 'Check-out Time', 'Time Worked Hours (HH:MM)'];
  
  const csvData = window.reportData.map(element => [
    (element.Name).split(" ")[0],
    element.Pin,
    convertToAmPm(new Date(element.CheckInTime)),
    convertToAmPm(new Date(element.CheckOutTime)),
    element.TimeWorked
  ]);

  let csvContent = headers.join(',') + '\n';
  csvData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `day_wise_report_${selectedDate || 'report'}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}