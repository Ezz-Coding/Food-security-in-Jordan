// Theme Management System
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const toggleIcon = document.querySelector('.theme-toggle i');
    if (toggleIcon) {
      toggleIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) return;

    const nav = document.querySelector('nav');
    if (!nav) return;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = `<i class="material-icons">${this.currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}</i>`;
    toggleButton.setAttribute('aria-label', 'Toggle theme');
    
    toggleButton.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Insert toggle button before the menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      nav.insertBefore(toggleButton, menuToggle);
    } else {
      nav.appendChild(toggleButton);
    }
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});

// Pie chart: أنواع الزراعة
new Chart(document.getElementById("agricultureChart"), {
  type: "pie",
  data: {
    labels: ["Rainfed", "Irrigated", "Greenhouses"],
    datasets: [{
      data: [80, 17, 3],
      backgroundColor: ["#66BB6A", "#42A5F5", "#FFCA28"]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } }
  }
});


// Bar chart: إنتاج المحاصيل
new Chart(document.getElementById("cropsChart"), {
  type: "bar",
  data: {
    labels: ["Wheat", "Olives (fruit)", "Tomatoes"],
    datasets: [{
      label: "Production (thousand tons)",
      data: [30, 125.15, 591.73], // latest reliable values
      backgroundColor: ["#FBC02D", "#8D6E63", "#EF5350"],
      borderRadius: 12
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, title: { display: true, text: "Thousand tons" } } }
  }
});

// Line chart: تطور إنتاج الطماطم
new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023"],
    datasets: [{
      label: "Tomato Production (thousand tons)",
      data: [737, 778, 738, 869, 745, 870, 837, 690, 718, 496, 577, 711, 607, 592],
      borderColor: "#EF5350",
      backgroundColor: "rgba(239,83,80,0.2)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#EF5350"
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { title: { display: true, text: "Thousand tons" } } }
  }
});