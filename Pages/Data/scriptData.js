// ========== JSONPlaceholder ==========
const API_URL = "https://jsonplaceholder.typicode.com/posts";
// ملاحظة: JSONPlaceholder لا يحفظ فعليًا. لو بدك حفظ حقيقي استخدم MockAPI: const API_URL = "https://YOUR.mockapi.io/notes";

(function () {
  const $ = (sel) => document.querySelector(sel);

  // عناصر موجودة في الصفحة
  const searchInput = $("#crop-search");
  const typeSelect  = $("#crop-type");
  const raritySelect= $("#crop-rarity");
  const listEl      = $("#crop-list");
  const chartCanvas = document.getElementById("postsByUserChart");

  // عناصر الإضافة
  const addName   = $("#add-name");
  const addType   = $("#add-type");
  const addRarity = $("#add-rarity");
  const addBtn    = $("#add-btn");

  // حماية إدراج HTML
  const escapeHTML = (s) =>
    String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  // تحويل post -> crop (لوارد من API)
  function mapPostToCrop(p) {
    const types = ["Vegetable", "Grain", "Herb"];
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    const type = types[(p.userId - 1) % types.length];
    const rarity = rarities[(p.id - 1) % rarities.length];
    return {
      id: p.id,
      name: p.title,
      description: p.body,
      type,
      rarity,
      userId: p.userId
    };
  }

  let CROPS = [];
  let postsChart = null;

  // جلب البيانات
  async function loadAPIData() {
    try {
      const res = await fetch(API_URL, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const posts = await res.json();
      CROPS = Array.isArray(posts) ? posts.map(mapPostToCrop) : [];
      renderCropList();
      renderStatsChart();
    } catch (e) {
      console.error("Failed to load JSONPlaceholder:", e);
      if (listEl) listEl.innerHTML = `<li style="color:#c00">Failed to load data</li>`;
    }
  }

  // رسم القائمة مع البحث والفلترة
  function renderCropList() {
    if (!listEl) return;
    const q = (searchInput?.value || "").toLowerCase();
    const t = typeSelect?.value || "";
    const r = raritySelect?.value || "";

    const filtered = CROPS.filter(c => {
      const matchesQ = !q || c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
      const matchesT = !t || c.type === t;
      const matchesR = !r || c.rarity === r;
      return matchesQ && matchesT && matchesR;
    });

    listEl.innerHTML = filtered.map(c => `
      <li class="crop-card" data-id="${c.id}">
        <strong>${escapeHTML(c.name)}</strong>
        <div class="meta">
          <span class="badge">${c.type}</span>
          <span class="badge">${c.rarity}</span>
          <span class="badge">User #${c.userId}</span>
        </div>
        <p>${escapeHTML(c.description || "")}</p>
      </li>
    `).join("");
  }

  // مخطط: عدد العناصر لكل مستخدم
  function renderStatsChart() {
    if (typeof Chart === "undefined" || !chartCanvas) return;

    const counts = {};
    for (const c of CROPS) counts[c.userId] = (counts[c.userId] || 0) + 1;
    const labels = Object.keys(counts).sort((a,b)=>+a - +b);
    const data   = labels.map(k => counts[k]);

    if (postsChart) postsChart.destroy();

    postsChart = new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: labels.map(u => `User ${u}`),
        datasets: [{ label: "Entries", data }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true }, tooltip: { enabled: true } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  // Debounce للبحث
  function debounce(fn, ms = 250) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }
  const rerender = debounce(renderCropList, 200);

  // إضافة عنصر جديد
  async function addCrop() {
    const name = (addName?.value || "").trim();
    const type = addType?.value || "Vegetable";
    const rarity = addRarity?.value || "Common";
    if (!name) { alert("اكتب اسم المحصول"); return; }

    // نبني جسد الطلب
    const payload = {
      title: name,
      body: `${type} • ${rarity}`,
      userId: 1
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const created = await res.json(); // JSONPlaceholder يرجّع ID وهمي

      // نضيفه محليًا على الصفحة (علشان يظهر فورًا)
      const newId = created?.id || (Math.max(0, ...CROPS.map(c => +c.id || 0)) + 1);
      const local = {
        id: newId,
        name,
        description: payload.body,
        type,
        rarity,
        userId: payload.userId
      };
      CROPS.unshift(local); // أضفه بالبداية
      addName.value = "";
      renderCropList();
      renderStatsChart();
    } catch (e) {
      console.error("Add failed:", e);
      alert("فشل الإضافة");
    }
  }

  // Events
  if (searchInput) searchInput.addEventListener("input", rerender);
  if (typeSelect)  typeSelect.addEventListener("change", renderCropList);
  if (raritySelect)raritySelect.addEventListener("change", renderCropList);
  if (addBtn)      addBtn.addEventListener("click", addCrop);

  // Init
  loadAPIData();
})();
