// charts.js — menggambar grafik SVG dari data, tanpa library luar.
// Satu-satunya tugas file ini: mengubah deret angka menjadi SVG batang/garis.
import { formatNumber } from "./data.js";

function niceMax(values) {
  const top = Math.max(...values.map((v) => Math.abs(v)));
  if (top <= 0) return 1;
  const step = Math.pow(10, Math.floor(Math.log10(top)));
  return Math.ceil(top / step) * step;
}

function axisLabels(min, max) {
  return [min, (min + max) / 2, max];
}

export function barChart(labels, values, options) {
  const opts = options || {};
  const color = opts.color || "#0e7a6b";
  const width = 560, height = 260, padL = 56, padB = 34, padT = 14;
  const min = Math.min(0, ...values);
  const max = niceMax(values);
  const span = max - min || 1;
  const plotW = width - padL - 16, plotH = height - padT - padB;
  const bw = plotW / values.length;
  const y = (v) => padT + plotH - ((v - min) / span) * plotH;
  let bars = "";
  values.forEach((v, i) => {
    const x = padL + i * bw + bw * 0.16;
    const w = bw * 0.68;
    const top = y(Math.max(v, 0));
    const bottom = y(Math.min(v, 0));
    bars += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(1, bottom - top).toFixed(1)}" rx="3" fill="${color}"><title>${labels[i]}: ${formatNumber(v, opts.decimals ?? 2)}</title></rect>`;
    bars += `<text x="${(x + w / 2).toFixed(1)}" y="${(height - 12).toFixed(1)}" text-anchor="middle" font-size="11" fill="#5b6b7a">${labels[i]}</text>`;
    bars += `<text x="${(x + w / 2).toFixed(1)}" y="${(top - 5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#0d2b45">${formatNumber(v, opts.decimals ?? 2)}</text>`;
  });
  const grid = axisLabels(min, max).map((t) =>
    `<line x1="${padL}" y1="${y(t).toFixed(1)}" x2="${width - 16}" y2="${y(t).toFixed(1)}" stroke="#d9e2ea" stroke-width="1"/><text x="${padL - 6}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5b6b7a">${formatNumber(t, 0)}</text>`
  ).join("");
  const baseline = min < 0 ? `<line x1="${padL}" y1="${y(0).toFixed(1)}" x2="${width - 16}" y2="${y(0).toFixed(1)}" stroke="#0d2b45" stroke-width="1.5"/>` : "";
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik batang ${opts.title || ""}">${grid}${baseline}${bars}</svg>`;
}

export function lineChart(labels, values, options) {
  const opts = options || {};
  const color = opts.color || "#0d2b45";
  const width = 560, height = 260, padL = 56, padB = 34, padT = 16;
  const min = Math.min(...values), max = Math.max(...values);
  const lo = min - (max - min) * 0.15, hi = max + (max - min) * 0.15;
  const span = hi - lo || 1;
  const plotW = width - padL - 16, plotH = height - padT - padB;
  const x = (i) => padL + (i / Math.max(1, values.length - 1)) * plotW;
  const y = (v) => padT + plotH - ((v - lo) / span) * plotH;
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const dots = values.map((v, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4.5" fill="${color}"><title>${labels[i]}: ${formatNumber(v, opts.decimals ?? 2)}</title></circle>` +
    `<text x="${x(i).toFixed(1)}" y="${(y(v) - 10).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#0d2b45">${formatNumber(v, opts.decimals ?? 2)}</text>` +
    `<text x="${x(i).toFixed(1)}" y="${height - 12}" text-anchor="middle" font-size="11" fill="#5b6b7a">${labels[i]}</text>`
  ).join("");
  const grid = axisLabels(lo, hi).map((t) =>
    `<line x1="${padL}" y1="${y(t).toFixed(1)}" x2="${width - 16}" y2="${y(t).toFixed(1)}" stroke="#d9e2ea" stroke-width="1"/><text x="${padL - 6}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5b6b7a">${formatNumber(t, opts.decimals ?? 1)}</text>`
  ).join("");
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik garis ${opts.title || ""}">${grid}<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}</svg>`;
}
