// 手写 SVG 图表：折线图与柱状图，不依赖任何图表库。

function niceMax(values) {
  const top = Math.max.apply(null, values);
  if (top <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(top)));
  const scaled = top / power;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return step * power;
}

function fmtNum(v) {
  if (Math.abs(v) >= 10000) return (v / 10000).toFixed(2).replace(/\.?0+$/, "") + "万";
  return String(v);
}

function svgEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

// 折线图：labels 为年份，values 为数值，返回完整 svg 字符串。
function lineChart(labels, values, unit) {
  const w = 720, h = 300, padL = 64, padR = 16, padT = 18, padB = 34;
  const max = niceMax(values);
  const min = Math.min.apply(null, values.concat([0]));
  const span = max - min || 1;
  const x = (i) => padL + (i * (w - padL - padR)) / (labels.length - 1);
  const y = (v) => padT + (1 - (v - min) / span) * (h - padT - padB);
  let grid = "";
  for (let g = 0; g <= 4; g++) {
    const gv = min + (span * g) / 4;
    const gy = y(gv);
    grid += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" class="grid"/>' +
      '<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" class="axis" text-anchor="end">' + fmtNum(Math.round(gv)) + "</text>";
  }
  const points = values.map((v, i) => x(i).toFixed(1) + "," + y(v).toFixed(1)).join(" ");
  let dots = "";
  let labelsRow = "";
  values.forEach((v, i) => {
    dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4" class="dot">' +
      "<title>" + labels[i] + "年：" + v + " " + unit + "</title></circle>";
    labelsRow += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" class="axis" text-anchor="middle">' + labels[i] + "</text>";
  });
  const last = values[values.length - 1];
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="折线图">' + grid +
    '<polyline points="' + points + '" class="line"/>' + dots + labelsRow +
    '<text x="' + (w - padR) + '" y="' + (y(last) - 10).toFixed(1) + '" class="lastval" text-anchor="end">' +
    fmtNum(last) + " " + svgEsc(unit) + "</text></svg>";
}

// 柱状图：每根柱子可点，返回完整 svg 字符串。
function barChart(labels, values, unit) {
  const w = 720, h = 300, padL = 64, padR = 16, padT = 18, padB = 34;
  const max = niceMax(values);
  const slot = (w - padL - padR) / labels.length;
  const bw = Math.min(44, slot * 0.62);
  const y = (v) => padT + (1 - v / max) * (h - padT - padB);
  let grid = "";
  for (let g = 0; g <= 4; g++) {
    const gv = (max * g) / 4;
    const gy = y(gv);
    grid += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" class="grid"/>' +
      '<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" class="axis" text-anchor="end">' + fmtNum(Math.round(gv)) + "</text>";
  }
  let bars = "";
  let labelsRow = "";
  values.forEach((v, i) => {
    const bx = padL + i * slot + (slot - bw) / 2;
    bars += '<rect x="' + bx.toFixed(1) + '" y="' + y(v).toFixed(1) + '" width="' + bw.toFixed(1) +
      '" height="' + (h - padB - y(v)).toFixed(1) + '" rx="3" class="bar">' +
      "<title>" + labels[i] + "年：" + v + " " + unit + "</title></rect>";
    labelsRow += '<text x="' + (padL + i * slot + slot / 2).toFixed(1) + '" y="' + (h - 10) + '" class="axis" text-anchor="middle">' + labels[i] + "</text>";
  });
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="柱状图">' + grid + bars + labelsRow + "</svg>";
}
