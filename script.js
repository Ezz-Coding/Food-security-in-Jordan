// Pie chart: أنواع الزراعة
new Chart(document.getElementById("agricultureChart"), {
  type: "pie",
  data: {
    labels: ["الزراعة البعلية", "الزراعة المروية", "البيوت البلاستيكية"],
    datasets: [{
      data: [80, 17, 3],
      backgroundColor: ["#66BB6A", "#42A5F5", "#FFCA28"],
      borderRadius: 8
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
    labels: ["القمح", "الزيتون", "الطماطم", "الخضروات"],
    datasets: [{
      label: "إنتاج (ألف طن)",
      data: [25, 200, 500, 1200],
      backgroundColor: ["#FBC02D", "#8D6E63", "#EF5350", "#29B6F6"],
      borderRadius: 12
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

// Line chart: تطور إنتاج الطماطم
new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["2010","2013","2016","2019","2021","2023"],
    datasets: [{
      label: "إنتاج الطماطم (ألف طن)",
      data: [350, 400, 450, 480, 490, 500],
      borderColor: "#EF5350",
      backgroundColor: "rgba(239,83,80,0.2)",
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: "#EF5350"
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } }
  }
});
