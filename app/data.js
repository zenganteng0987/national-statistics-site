// NusantaraStat data: angka resmi Indonesia. Setiap deret memakai tahun yang
// sama di semua halaman; sumber dan tahun ditulis di samping angka di tampilan.
export const YEARS = [2020, 2021, 2022, 2023, 2024];
export const COUNTRY = "Indonesia";
export const COUNTRY_CODE = "ID";

export const INDICATORS = [
  {
    id: "population", name: "Jumlah Penduduk", unit: "juta jiwa", source: "BPS",
    short: "Penduduk hasil sensus dan proyeksi BPS.",
    values: { 2020: 270.20, 2021: 272.25, 2022: 274.77, 2023: 278.69, 2024: 281.60 },
  },
  {
    id: "gdp-growth", name: "Pertumbuhan Ekonomi (PDB)", unit: "% per tahun", source: "BPS",
    short: "Laju pertumbuhan produk domestik bruto harga konstan.",
    values: { 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  },
  {
    id: "gdp-nominal", name: "PDB Harga Berlaku", unit: "Rp triliun", source: "BPS",
    short: "Nilai seluruh barang dan jasa yang dihasilkan dalam setahun.",
    values: { 2020: 15434, 2021: 16970, 2022: 19588, 2023: 20892, 2024: 22139 },
  },
  {
    id: "inflation", name: "Inflasi (year-on-year)", unit: "%", source: "BPS",
    short: "Kenaikan harga konsumen dibanding tahun sebelumnya.",
    values: { 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
  },
  {
    id: "unemployment", name: "Tingkat Pengangguran Terbuka", unit: "%", source: "BPS (Sakernas, Februari)",
    short: "Pangsa angkatan kerja yang tidak bekerja dan mencari pekerjaan.",
    values: { 2020: 4.99, 2021: 6.26, 2022: 5.83, 2023: 5.45, 2024: 4.82 },
  },
  {
    id: "poverty", name: "Tingkat Kemiskinan", unit: "%", source: "BPS (Maret)",
    short: "Pangsa penduduk dengan pengeluaran di bawah garis kemiskinan.",
    values: { 2020: 9.78, 2021: 10.14, 2022: 9.54, 2023: 9.36, 2024: 9.03 },
  },
  {
    id: "exports", name: "Nilai Ekspor", unit: "miliar dolar AS", source: "BPS",
    short: "Nilai barang yang dijual ke luar negeri dalam setahun.",
    values: { 2020: 163.2, 2021: 231.6, 2022: 291.9, 2023: 258.8, 2024: 264.7 },
  },
  {
    id: "imports", name: "Nilai Impor", unit: "miliar dolar AS", source: "BPS",
    short: "Nilai barang yang dibeli dari luar negeri dalam setahun.",
    values: { 2020: 141.6, 2021: 196.2, 2022: 237.4, 2023: 221.9, 2024: 233.7 },
  },
];

export const FACTS_2024 = [
  { label: "Penduduk", value: "281,6 jt", change: "+1,04% dari 2023", source: "BPS, 2024" },
  { label: "PDB per kapita", value: "Rp 78,6 jt", change: "sekitar US$ 4.919", source: "BPS / Bank Dunia, 2024" },
  { label: "Harapan hidup", value: "74,15 thn", change: "+0,22 thn dari 2023", source: "BPS, 2024" },
  { label: "Kemiskinan Mar 2025", value: "8,47%", change: "turun dari 9,03% (Mar 2024)", source: "BPS, 2025" },
];

// Penduduk provinsi 2024 (juta jiwa), BPS. Sepuluh provinsi terbesar.
export const PROVINCES = [
  { name: "Jawa Barat", pop: 49.94, capital: "Bandung", area: 35378 },
  { name: "Jawa Timur", pop: 41.81, capital: "Surabaya", area: 47803 },
  { name: "Jawa Tengah", pop: 37.89, capital: "Semarang", area: 32801 },
  { name: "Sumatera Utara", pop: 15.59, capital: "Medan", area: 72981 },
  { name: "Banten", pop: 12.43, capital: "Serang", area: 9663 },
  { name: "DKI Jakarta", pop: 10.56, capital: "Jakarta", area: 664 },
  { name: "Sulawesi Selatan", pop: 9.46, capital: "Makassar", area: 46717 },
  { name: "Lampung", pop: 9.32, capital: "Bandar Lampung", area: 34624 },
  { name: "Sumatera Selatan", pop: 8.84, capital: "Palembang", area: 91592 },
  { name: "Riau", pop: 6.82, capital: "Pekanbaru", area: 87024 },
];

export const RELEASES = [
  { date: "15 Agu 2025", title: "Kemiskinan Maret 2025 turun ke 8,47%", body: "BPS mencatat 24,06 juta penduduk miskin pada Maret 2025, turun dari 25,22 juta pada Maret 2024." },
  { date: "5 Nov 2025", title: "Ekonomi kuartal III-2025 tumbuh 5,04%", body: "Pertumbuhan ditopang konsumsi rumah tangga dan investasi; BPS merilis angka PDB triwulanan." },
  { date: "5 Feb 2025", title: "Pengangguran Februari 2025 sebesar 4,76%", body: "Tingkat pengangguran terbuka turun dari 4,82% pada Februari 2024, menurut Survei Angkatan Kerja Nasional BPS." },
  { date: "1 Okt 2024", title: "Inflasi September 2024 sebesar 1,84% yoy", body: "BPS mencatat inflasi tahunan 1,84% pada September 2024; inflasi setahun penuh 2024 sebesar 1,57%." },
];

export function indicatorById(id) {
  return INDICATORS.find((item) => item.id === id) || null;
}

export function formatNumber(value, decimals) {
  return value.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
