// app.js — router dan tampilan NusantaraStat. Satu-satunya tugas file ini:
// membaca hash route, merender halaman, dan mengikat semua kontrol.
import { YEARS, INDICATORS, FACTS_2024, PROVINCES, RELEASES, indicatorById, formatNumber } from "./data.js";
import { barChart, lineChart } from "./charts.js";

const view = document.getElementById("view");
const yearSelect = document.getElementById("yearSelect");
let selectedYear = 2024;
let chartMode = "bar";
let provinceSort = "pop";
let provinceQuery = "";

YEARS.forEach((y) => {
  const opt = document.createElement("option");
  opt.value = String(y);
  opt.textContent = String(y);
  if (y === selectedYear) opt.selected = true;
  yearSelect.appendChild(opt);
});
yearSelect.addEventListener("change", () => {
  selectedYear = Number(yearSelect.value);
  render();
});

function navActive(route) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === route);
  });
}

function sourceLine(indicator, year) {
  return `Sumber: ${indicator.source}, ${year}.`;
}

function kpiCard(indicator, year) {
  const v = indicator.values[year];
  const prev = indicator.values[year - 1];
  const delta = prev === undefined ? "" : `${v >= prev ? "+" : ""}${formatNumber(v - prev, 2)} dari ${year - 1}`;
  const down = prev !== undefined && v < prev && indicator.id !== "inflation" && indicator.id !== "poverty" && indicator.id !== "unemployment";
  return `<article class="kpi"><div class="label">${indicator.name}</div>` +
    `<div class="value">${formatNumber(v, 2)} <span style="font-size:15px">${indicator.unit}</span></div>` +
    `<div class="delta${down ? " down" : ""}">${delta}</div>` +
    `<div class="src">${sourceLine(indicator, year)}</div></article>`;
}

function indicatorTable(year) {
  const rows = INDICATORS.map((ind) =>
    `<tr><td><a href="#/indicator/${ind.id}">${ind.name}</a></td><td class="num">${formatNumber(ind.values[year], 2)}</td><td>${ind.unit}</td><td>${ind.source}, ${year}</td></tr>`
  ).join("");
  return `<table><thead><tr><th>Indikator</th><th class="num">Nilai ${year}</th><th>Satuan</th><th>Sumber</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function homePage() {
  navActive("home");
  const pop = indicatorById("population");
  const gdp = indicatorById("gdp-growth");
  const labels = YEARS.map(String);
  const chart = chartMode === "bar"
    ? barChart(labels, YEARS.map((y) => pop.values[y]), { title: "Jumlah penduduk", decimals: 1 })
    : lineChart(labels, YEARS.map((y) => pop.values[y]), { title: "Jumlah penduduk", decimals: 1, color: "#0e7a6b" });
  const cards = FACTS_2024.map((f) =>
    `<article class="kpi"><div class="label">${f.label}</div><div class="value" style="font-size:24px">${f.value}</div><div class="delta">${f.change}</div><div class="src">Sumber: ${f.source}</div></article>`
  ).join("");
  const releases = RELEASES.map((r) =>
    `<article class="ind"><span class="badge">${r.date}</span><b style="display:block;margin-top:6px">${r.title}</b><p style="margin:6px 0 0;font-size:14px;color:#5b6b7a">${r.body}</p></article>`
  ).join("");
  view.innerHTML = `
  <section class="hero"><h1>Statistik Indonesia, satu tempat, angka yang bisa dicek</h1>
  <p>Penduduk, ekonomi, kemiskinan, dan provinsi — dari data resmi Badan Pusat Statistik. Pilih tahun di atas, buka indikatornya, dan lihat sumber di tiap angka.</p>
  <p class="updated">Data terbaru: kemiskinan Maret 2025 sebesar 8,47% (BPS) · PDB 2024 tumbuh 5,03% (BPS)</p></section>
  <div class="kpis">${kpiCard(pop, selectedYear)}${kpiCard(gdp, selectedYear)}${kpiCard(indicatorById("inflation"), selectedYear)}${kpiCard(indicatorById("poverty"), selectedYear)}</div>
  <section class="card"><h2>Jumlah penduduk ${YEARS[0]}–${YEARS[YEARS.length - 1]}</h2>
  <p class="lede">Indonesia bertambah sekitar 2–4 juta jiwa per tahun. Angka dalam juta jiwa.</p>
  <div class="controls"><button class="btn ghost" id="toggleChart">Tampilkan sebagai ${chartMode === "bar" ? "garis" : "batang"}</button>
  <span class="chart-note">Grafik digambar dari data BPS di file data.js.</span></div>
  ${chart}<p class="srcnote">Sumber: BPS, ${YEARS[0]}–${YEARS[YEARS.length - 1]}. Pilih tahun di bilah atas untuk mengubah kartu angka di atas.</p></section>
  <div class="grid2">
    <section class="card"><h2>Indikator utama ${selectedYear}</h2><p class="lede">Klik nama indikator untuk melihat deret lengkapnya.</p>${indicatorTable(selectedYear)}</section>
    <section class="card"><h2>Sekilas 2024</h2><p class="lede">Fakta kunci tahun terakhir yang lengkap.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${cards}</div></section>
  </div>
  <section class="card"><h2>Rilis terbaru</h2><p class="lede">Berita angka resmi yang paling dicari.</p><div class="ind-list">${releases}</div></section>`;
  document.getElementById("toggleChart").addEventListener("click", () => {
    chartMode = chartMode === "bar" ? "line" : "bar";
    render();
  });
}

function economyPage() {
  navActive("economy");
  const labels = YEARS.map(String);
  const gdp = indicatorById("gdp-growth");
  const infl = indicatorById("inflation");
  const exp = indicatorById("exports");
  const imp = indicatorById("imports");
  view.innerHTML = `
  <section class="card"><h2>Ekonomi Indonesia</h2><p class="lede">Pertumbuhan, harga, dan perdagangan luar negeri — semua dari BPS.</p>
  <div class="kpis">${kpiCard(gdp, selectedYear)}${kpiCard(infl, selectedYear)}${kpiCard(exp, selectedYear)}${kpiCard(imp, selectedYear)}</div></section>
  <div class="grid2">
  <section class="card"><h3>Pertumbuhan ekonomi (% per tahun)</h3>${lineChart(labels, YEARS.map((y) => gdp.values[y]), { title: "Pertumbuhan ekonomi", decimals: 2, color: "#0e7a6b" })}<p class="srcnote">Sumber: BPS, 2020–2024. Tahun 2020 minus karena pandemi.</p></section>
  <section class="card"><h3>Inflasi (% year-on-year)</h3>${barChart(labels, YEARS.map((y) => infl.values[y]), { title: "Inflasi", decimals: 2, color: "#e9a13b" })}<p class="srcnote">Sumber: BPS, 2020–2024. Puncak 5,51% pada 2022.</p></section>
  </div>
  <section class="card"><h3>Ekspor dan impor (miliar dolar AS)</h3>
  ${barChart(labels, YEARS.map((y) => exp.values[y]), { title: "Ekspor", decimals: 1 })}
  <p class="srcnote">Sumber: BPS, 2020–2024. Surplus dagang 2024: ekspor US$ 264,7 miliar dikurangi impor US$ 233,7 miliar = US$ 31,0 miliar.</p>
  ${indicatorTable(selectedYear)}</section>`;
}

function peoplePage() {
  navActive("people");
  const labels = YEARS.map(String);
  const pov = indicatorById("poverty");
  const unemp = indicatorById("unemployment");
  view.innerHTML = `
  <section class="card"><h2>Penduduk dan kesejahteraan</h2><p class="lede">Siapa penduduk Indonesia, berapa yang miskin, dan berapa yang menganggur.</p>
  <div class="kpis">${kpiCard(indicatorById("population"), selectedYear)}${kpiCard(pov, selectedYear)}${kpiCard(unemp, selectedYear)}<article class="kpi"><div class="label">Harapan hidup</div><div class="value">74,15 <span style="font-size:15px">tahun</span></div><div class="delta">+0,22 thn dari 2023</div><div class="src">Sumber: BPS, 2024.</div></article></div></section>
  <div class="grid2">
  <section class="card"><h3>Kemiskinan (% penduduk, Maret)</h3>${lineChart(labels, YEARS.map((y) => pov.values[y]), { title: "Kemiskinan", decimals: 2, color: "#b3402e" })}<p class="srcnote">Sumber: BPS, Maret 2020–2024. Maret 2025: 8,47%.</p></section>
  <section class="card"><h3>Pengangguran (% angkatan kerja, Februari)</h3>${barChart(labels, YEARS.map((y) => unemp.values[y]), { title: "Pengangguran", decimals: 2 })}<p class="srcnote">Sumber: BPS (Sakernas), Februari 2020–2024. Februari 2025: 4,76%.</p></section>
  </div>
  <section class="card"><h3>Provinsi terpadat 2024</h3><p class="lede">Tiga provinsi di Pulau Jawa menampung lebih dari separuh penduduk Indonesia.</p>
  ${provinceTable(PROVINCES.slice(0, 5))}
  <p class="srcnote">Sumber: BPS, 2024. <a href="#/provinces">Lihat semua provinsi</a></p></section>`;
}

function provinceTable(list) {
  const rows = list.map((p) =>
    `<tr><td><a href="#/provinces?prov=${encodeURIComponent(p.name)}">${p.name}</a></td><td>${p.capital}</td><td class="num">${formatNumber(p.pop, 2)}</td><td class="num">${formatNumber(p.area, 0)}</td></tr>`
  ).join("");
  return `<table><thead><tr><th>Provinsi</th><th>Ibu kota</th><th class="num">Penduduk 2024 (juta)</th><th class="num">Luas (km²)</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function provincesPage() {
  navActive("provinces");
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const chosen = params.get("prov") || PROVINCES[0].name;
  const detail = PROVINCES.find((p) => p.name === chosen) || PROVINCES[0];
  const filtered = PROVINCES.filter((p) => p.name.toLowerCase().includes(provinceQuery.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => provinceSort === "name" ? a.name.localeCompare(b.name, "id") : b.pop - a.pop);
  const share = ((detail.pop / 281.6) * 100).toFixed(1);
  view.innerHTML = `
  <section class="card"><h2>Provinsi</h2><p class="lede">Penduduk sepuluh provinsi terbesar, 2024 (BPS). Cari, urutkan, lalu klik provinsi untuk detailnya.</p>
  <div class="controls"><input type="search" id="provSearch" placeholder="Cari provinsi…" value="${provinceQuery.replace(/"/g, "")}" aria-label="Cari provinsi">
  <select id="provSort" aria-label="Urutkan provinsi"><option value="pop"${provinceSort === "pop" ? " selected" : ""}>Terpadat dulu</option><option value="name"${provinceSort === "name" ? " selected" : ""}>Nama A–Z</option></select></div>
  ${barChart(sorted.map((p) => p.name.replace("Sulawesi Selatan", "Sulsel").replace("Sumatera Utara", "Sumut").replace("Sumatera Selatan", "Sumsel").replace("Jawa Barat", "Jabar").replace("Jawa Timur", "Jatim").replace("Jawa Tengah", "Jateng").replace("DKI Jakarta", "Jakarta")), sorted.map((p) => p.pop), { title: "Penduduk provinsi", decimals: 1 })}
  <p class="srcnote">Sumber: BPS, 2024. Grafik mengikuti pencarian dan urutan yang dipilih.</p>
  ${provinceTable(sorted)}
  <p class="srcnote">Sumber: BPS, 2024. Luas wilayah menurut BPS.</p></section>
  <section class="card"><h3>${detail.name} — profil singkat</h3>
  <p>Ibu kota <strong>${detail.capital}</strong>. Penduduk 2024: <strong>${formatNumber(detail.pop, 2)} juta jiwa</strong> — sekitar ${share}% dari penduduk Indonesia. Luas wilayah ${formatNumber(detail.area, 0)} km².</p>
  <p class="srcnote">Sumber: BPS, 2024.</p>
  <div class="controls"><label for="provPick">Pilih provinsi:</label><select id="provPick">${PROVINCES.map((p) => `<option${p.name === detail.name ? " selected" : ""}>${p.name}</option>`).join("")}</select></div></section>`;
  document.getElementById("provSearch").addEventListener("input", (e) => { provinceQuery = e.target.value; render(); const s = document.getElementById("provSearch"); s.focus(); s.setSelectionRange(s.value.length, s.value.length); });
  document.getElementById("provSort").addEventListener("change", (e) => { provinceSort = e.target.value; render(); });
  document.getElementById("provPick").addEventListener("change", (e) => { window.location.hash = `#/provinces?prov=${encodeURIComponent(e.target.value)}`; });
}

function indicatorPage(id) {
  const ind = indicatorById(id);
  if (!ind) { view.innerHTML = `<section class="card"><h2>Indikator tidak ditemukan</h2><p><a href="#/">Kembali ke beranda</a></p></section>`; return; }
  navActive("");
  const labels = YEARS.map(String);
  const chart = chartMode === "bar"
    ? barChart(labels, YEARS.map((y) => ind.values[y]), { title: ind.name, decimals: 2 })
    : lineChart(labels, YEARS.map((y) => ind.values[y]), { title: ind.name, decimals: 2, color: "#0e7a6b" });
  const rows = YEARS.map((y) => `<tr><td>${y}</td><td class="num">${formatNumber(ind.values[y], 2)}</td><td>${ind.unit}</td><td>${ind.source}, ${y}</td></tr>`).join("");
  const others = INDICATORS.filter((o) => o.id !== id).map((o) => `<a class="ind" href="#/indicator/${o.id}"><b>${o.name}</b><div class="v">${formatNumber(o.values[selectedYear], 2)} ${o.unit}</div><div class="s">Sumber: ${o.source}, ${selectedYear}</div></a>`).join("");
  view.innerHTML = `
  <section class="card"><p><a href="#/">← Beranda</a> · <span class="badge">${ind.source}</span></p>
  <h2>${ind.name}</h2><p class="lede">${ind.short}</p>
  <div class="kpis">${kpiCard(ind, selectedYear)}</div>
  <div class="controls"><button class="btn ghost" id="toggleChart">Tampilkan sebagai ${chartMode === "bar" ? "garis" : "batang"}</button></div>
  ${chart}
  <table style="margin-top:14px"><thead><tr><th>Tahun</th><th class="num">Nilai</th><th>Satuan</th><th>Sumber</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="srcnote">Sumber: ${ind.source}, ${YEARS[0]}–${YEARS[YEARS.length - 1]}. Angka tahunan resmi; tahun berjalan memakai rilis terakhir yang tersedia.</p></section>
  <section class="card"><h3>Indikator lain</h3><div class="ind-list">${others}</div></section>`;
  document.getElementById("toggleChart").addEventListener("click", () => {
    chartMode = chartMode === "bar" ? "line" : "bar";
    render();
  });
}

function aboutPage() {
  navActive("about");
  view.innerHTML = `
  <section class="card"><h2>Sumber data dan cara kerja situs</h2>
  <p class="lede">NusantaraStat adalah proyek mandiri untuk latihan membaca statistik. Bukan situs resmi pemerintah dan tidak terafiliasi dengan BPS.</p>
  <h3>Dari mana angkanya?</h3>
  <table><thead><tr><th>Topik</th><th>Sumber</th><th>Tahun</th></tr></thead><tbody>
  <tr><td>Penduduk, PDB, inflasi, ekspor-impor</td><td>Badan Pusat Statistik (BPS)</td><td>2020–2024</td></tr>
  <tr><td>Pengangguran</td><td>BPS, Survei Angkatan Kerja Nasional (Sakernas)</td><td>Februari 2020–2024</td></tr>
  <tr><td>Kemiskinan</td><td>BPS</td><td>Maret 2020–2024, plus Maret 2025</td></tr>
  <tr><td>PDB per kapita dolar AS</td><td>Bank Dunia, indikator NY.GDP.PCAP.CD</td><td>2024</td></tr>
  <tr><td>Harapan hidup</td><td>BPS</td><td>2024</td></tr>
  </tbody></table>
  <h3 style="margin-top:18px">Cara memakai situs ini</h3>
  <p>1. Pilih tahun di bilah atas — kartu angka dan tabel mengikuti tahun itu.<br>
  2. Buka halaman Ekonomi, Penduduk, atau Provinsi dari menu.<br>
  3. Klik nama indikator untuk melihat deret 2020–2024, grafik, dan tabel sumbernya.<br>
  4. Di halaman Provinsi, cari dan urutkan daftar, lalu pilih provinsi untuk profil singkatnya.</p>
  <div class="notice">Catatan: angka dibulatkan ke dua desimal untuk dibaca; nilai asli BPS dapat berbeda pada desimal ketiga. Bila angka di sini berbeda dengan rilis BPS terbaru, rilis BPS-lah yang berlaku.</div>
  <p class="srcnote">Seluruh grafik digambar dari data di file data.js — tidak ada angka yang diambil dari internet saat halaman dibuka.</p></section>`;
}

function render() {
  const hash = window.location.hash || "#/";
  const path = hash.split("?")[0];
  if (path === "#/" || path === "" || path === "#") homePage();
  else if (path === "#/economy") economyPage();
  else if (path === "#/people") peoplePage();
  else if (path === "#/provinces") provincesPage();
  else if (path.startsWith("#/indicator/")) indicatorPage(path.replace("#/indicator/", ""));
  else if (path === "#/about") aboutPage();
  else homePage();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
