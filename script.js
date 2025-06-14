const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

// ----- LINE CHART PREVIEWS -----
const previewData = {
  assault: [523, 819, 1215, 1769, 2339, 3025, 3719, 4205],
  burglary: [349, 429, 752, 1194, 1981, 3191, 4801, 6203],
  robbery: [128, 178, 329, 597, 1024, 1903, 3104, 3583],
  vehicleTheft: [223, 308, 529, 869, 1498, 2578, 3776, 4359]
};

function createPreviewChart(canvasId, data, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["2000", "2003", "2006", "2009", "2012", "2015", "2018", "2020"],
      datasets: [{
        data: data,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: color
      }]
    },
    options: {
      plugins: { legend: { display: false }},
      scales: {
        x: { title: { display: true, text: "Year" }},
        y: { title: { display: true, text: "Cases" }}
      }
    }
  });
}

createPreviewChart('assaultPreview', previewData.assault, '#e74c3c');
createPreviewChart('burglaryPreview', previewData.burglary, '#2980b9');
createPreviewChart('robberyPreview', previewData.robbery, '#f1c40f');
createPreviewChart('vehicleTheftPreview', previewData.vehicleTheft, '#9b59b6');

// ----- BAR CHART PREVIEW -----
const barPreviewData2020 = {
  assault: 4205,
  burglary: 6203,
  robbery: 0,
  vehicleTheft: 0
};

function createBarPreview() {
  const ctx = document.getElementById('barPreview').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Assault', 'Burglary', 'Robbery', 'Vehicle Theft'],
      datasets: [{
        label: 'Cases in 2020',
        data: [
          barPreviewData2020.assault,
          barPreviewData2020.burglary,
          barPreviewData2020.robbery,
          barPreviewData2020.vehicleTheft
        ],
        backgroundColor: ['#e74c3c', '#2980b9', '#f1c40f', '#9b59b6']
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { title: { display: true, text: 'Number of Cases' }},
        y: { title: { display: true, text: 'Crime Type' }}
      },
      plugins: { legend: { display: false } }
    }
  });
}

createBarPreview();

// ----- MODAL BAR CHART -----
const barModal = document.getElementById("barModal");
const yearFilter = document.getElementById("yearFilter");
const ctxBar = document.getElementById("barChart").getContext("2d");

const allYears = Array.from({ length: 21 }, (_, i) => (2000 + i).toString());

const crimesPerYear = {
  assault: [523, 819, 1215, 1769, 2339, 3025, 3719, 4205, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  burglary: [349, 429, 752, 1194, 1981, 3191, 4801, 6203, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  robbery: [128, 178, 329, 597, 1024, 1903, 3104, 3583, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  vehicleTheft: [223, 308, 529, 869, 1498, 2578, 3776, 4359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

let barChart = null;

function populateYearFilter() {
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Years";
  yearFilter.appendChild(allOption);

  allYears.forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearFilter.appendChild(opt);
  });

  yearFilter.value = "all";
}

function updateBarChart() {
  const selectedYear = yearFilter.value;

  if (!barChart) {
    barChart = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Assault', 'Burglary', 'Robbery', 'Vehicle Theft'],
        datasets: []
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: { title: { display: true, text: 'Number of Cases' }},
          y: { title: { display: true, text: 'Crime Type' }}
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: '' }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  if (selectedYear === "all") {
    const sums = {
      assault: crimesPerYear.assault.reduce((a,b) => a + b, 0),
      burglary: crimesPerYear.burglary.reduce((a,b) => a + b, 0),
      robbery: crimesPerYear.robbery.reduce((a,b) => a + b, 0),
      vehicleTheft: crimesPerYear.vehicleTheft.reduce((a,b) => a + b, 0)
    };
    barChart.data.datasets = [{
      label: 'Total Cases (2000–2020)',
      data: [sums.assault, sums.burglary, sums.robbery, sums.vehicleTheft],
      backgroundColor: ['#e74c3c', '#2980b9', '#f1c40f', '#9b59b6']
    }];
    barChart.options.plugins.title.text = 'Total Crimes from 2000 to 2020';
  } else {
    const index = allYears.indexOf(selectedYear);
    barChart.data.datasets = [{
      label: `Crimes in ${selectedYear}`,
      data: [
        crimesPerYear.assault[index] || 0,
        crimesPerYear.burglary[index] || 0,
        crimesPerYear.robbery[index] || 0,
        crimesPerYear.vehicleTheft[index] || 0
      ],
      backgroundColor: ['#e74c3c', '#2980b9', '#f1c40f', '#9b59b6']
    }];
    barChart.options.plugins.title.text = `Crime Data for ${selectedYear}`;
  }

  barChart.update();
}

function openModal() {
  barModal.style.display = "block";
  populateYearFilter();
  updateBarChart();
}

function closeModal() {
  barModal.style.display = "none";
}

yearFilter.addEventListener('change', updateBarChart);

window.addEventListener('click', function(event) {
  if (event.target === barModal) {
    closeModal();
  }
});

