// 数观中国 — 路由与交互：hash 路由、年份切换、排序表、搜索过滤、图表切换、地区对比。

const view = document.getElementById("view");
const state = {
  year: 2024,
  overviewMetric: "gdp",
  chartKind: "line",
  regionMetric: "gdp",
  compare: ["广东", "江苏", "浙江"],
  sortKey: "gdp",
  sortDir: -1,
  query: "",
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function yearOptions(selected) {
  return YEARS.map((y) => '<option value="' + y + '"' + (y === selected ? " selected" : "") + ">" + y + "年</option>").join("");
}

function idxOf(year) {
  return YEARS.indexOf(year);
}

function kpiCard(label, value, unit, desc, down) {
  return '<div class="card"><div class="k">' + esc(label) + '</div>' +
    '<div class="v">' + esc(value) + " <small>" + esc(unit) + "</small></div>" +
    '<div class="d' + (down ? " down" : "") + '">' + esc(desc) + "</div></div>";
}

function yearTable(indicator) {
  const rows = YEARS.map((y, i) =>
    "<tr><td>" + y + "年</td><td class=\"num\">" + indicator.values[i].toLocaleString("zh-CN") +
    "</td><td class=\"num\">" + esc(indicator.unit) + "</td></tr>").join("");
  return '<div class="table-scroll"><table class="data"><thead><tr><th>年份</th><th>数值</th><th>单位</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
}

function chartPanel(indicator, kind) {
  const chart = kind === "bar"
    ? barChart(indicator.years, indicator.values, indicator.unit)
    : lineChart(indicator.years, indicator.values, indicator.unit);
  return '<div class="panel"><h3>' + esc(indicator.name) + "（" + indicator.years[0] + "–" +
    indicator.years[indicator.years.length - 1] + "年，单位：" + esc(indicator.unit) + "）</h3>" +
    '<p class="hint">' + esc(indicator.note) + "</p>" +
    '<div class="controls"><span class="seg" role="group" aria-label="图表类型">' +
    '<button type="button" data-kind="line" aria-pressed="' + (kind === "line") + '">折线图</button>' +
    '<button type="button" data-kind="bar" aria-pressed="' + (kind === "bar") + '">柱状图</button></span></div>' +
    '<div class="chart">' + chart + "</div>" +
    '<p class="src">数据来源：国家统计局年度统计公报与《中国统计年鉴》已公布数据；数值为 headline 数字取整。</p></div>';
}

function bindChartToggle(render) {
  view.querySelectorAll("[data-kind]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.chartKind = btn.getAttribute("data-kind");
      render();
    });
  });
}

function bindYear(selectId, render) {
  const sel = document.getElementById(selectId);
  if (sel) sel.addEventListener("change", () => {
    state.year = parseInt(sel.value, 10);
    render();
  });
}

// ---------- 总览 ----------
function renderOverview() {
  const i = idxOf(state.year);
  const metric = INDICATORS.find((m) => m.id === state.overviewMetric);
  const pop = POPULATION.total[i];
  const popPrev = i > 0 ? POPULATION.total[i - 1] : null;
  const popDesc = popPrev === null
    ? "十年起点"
    : pop >= popPrev ? "较上年增加 " + (pop - popPrev) + " 万人" : "较上年减少 " + (popPrev - pop) + " 万人";
  const cards =
    kpiCard("国内生产总值", (GDP.values[i] / 10000).toFixed(2), "万亿元", "同比增长 " + GDP.growth[i] + "%") +
    kpiCard("年末总人口", (pop / 10000).toFixed(2), "亿人", popDesc, popPrev !== null && pop < popPrev) +
    kpiCard("居民消费价格涨幅", CPI.values[i].toFixed(1), "%", "物价总体平稳") +
    kpiCard("人均可支配收入", INCOME.values[i].toLocaleString("zh-CN"), "元", "比上年名义增长约 5%");
  const options = INDICATORS.map((m) =>
    '<option value="' + m.id + '"' + (m.id === state.overviewMetric ? " selected" : "") + ">" + esc(m.name) + "</option>").join("");
  const rows = INDICATORS.filter((m) => m.name.indexOf(state.query) !== -1).map((m) => {
    const v = m.values[idxOf(state.year)];
    return "<tr><td>" + esc(m.name) + "</td><td class=\"num\">" + v.toLocaleString("zh-CN") +
      "</td><td>" + esc(m.unit) + "</td><td>" + esc(m.note) + "</td></tr>";
  }).join("");
  view.innerHTML =
    "<h2>中国国家统计总览</h2>" +
    '<p class="lede">十年关键指标一览：经济总量、人口、物价与居民收入。切换年份查看当年数字，下方图表与表格会同步更新。</p>' +
    '<div class="controls"><label for="yearSel">年份</label>' +
    '<select id="yearSel">' + yearOptions(state.year) + "</select>" +
    '<label for="q">指标搜索</label>' +
    '<input type="search" id="q" placeholder="输入指标名，如 人口" value="' + esc(state.query) + '" aria-label="搜索指标"></div>' +
    '<div class="cards">' + cards + "</div>" +
    '<div class="panel"><h3>十年趋势</h3><div class="controls"><label for="metricSel">指标</label>' +
    '<select id="metricSel">' + options + "</select></div>" +
    '<div class="chart">' + (state.chartKind === "bar" ? barChart(metric.years, metric.values, metric.unit) : lineChart(metric.years, metric.values, metric.unit)) + "</div>" +
    '<p class="hint">单位：' + esc(metric.unit) + "。" + esc(metric.note) + "</p>" +
    '<div class="controls"><span class="seg"><button type="button" data-kind="line" aria-pressed="' + (state.chartKind === "line") + '">折线图</button>' +
    '<button type="button" data-kind="bar" aria-pressed="' + (state.chartKind === "bar") + '">柱状图</button></span></div></div>' +
    '<div class="panel"><h3>' + state.year + "年主要指标表</h3>" +
    '<p class="hint">共 ' + INDICATORS.length + " 项指标，输入关键词可过滤。" + (rows ? "" : "没有匹配的指标。") + "</p>" +
    '<div class="table-scroll"><table class="data"><thead><tr><th>指标</th><th>数值</th><th>单位</th><th>说明</th></tr></thead><tbody>' +
    rows + "</tbody></table></div>" +
    '<p class="src">数据来源：国家统计局年度统计公报与《中国统计年鉴》已公布数据；数值为 headline 数字取整。</p></div>';

  bindYear("yearSel", render);
  document.getElementById("metricSel").addEventListener("change", (e) => {
    state.overviewMetric = e.target.value;
    render();
  });
  document.getElementById("q").addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    render();
    const q = document.getElementById("q");
    q.focus();
    q.setSelectionRange(q.value.length, q.value.length);
  });
  bindChartToggle(render);
}

// ---------- 通用单指标页 ----------
function renderSingle(title, lede, indicator, extra) {
  view.innerHTML =
    "<h2>" + esc(title) + "</h2>" +
    '<p class="lede">' + esc(lede) + "</p>" +
    chartPanel(indicator, state.chartKind) +
    '<div class="panel"><h3>逐年数据</h3>' + yearTable(indicator) +
    '<p class="src">数据来源：国家统计局年度统计公报与《中国统计年鉴》已公布数据；数值为 headline 数字取整。</p></div>' +
    (extra || "");
  bindChartToggle(render);
}

// ---------- 地区页 ----------
function regionRows() {
  const key = state.sortKey;
  const sorted = REGIONS_2024.slice().sort((a, b) =>
    state.sortDir * (a[key] - b[key]));
  return sorted.map((r) => {
    const checked = state.compare.indexOf(r.name) !== -1;
    return "<tr><td><label><input type=\"checkbox\" data-region=\"" + esc(r.name) + '"' +
      (checked ? " checked" : "") + "> " + esc(r.name) + "</label></td>" +
      '<td class="num">' + r.gdp.toLocaleString("zh-CN") + "</td>" +
      '<td class="num">' + r.pop.toLocaleString("zh-CN") + "</td>" +
      '<td class="num">' + r.income.toLocaleString("zh-CN") + "</td></tr>";
  }).join("");
}

function renderRegions() {
  const picked = REGIONS_2024.filter((r) => state.compare.indexOf(r.name) !== -1);
  const key = state.regionMetric;
  const unit = key === "gdp" ? "亿元" : key === "pop" ? "万人" : "元";
  const metricLabel = key === "gdp" ? "地区生产总值" : key === "pop" ? "常住人口" : "人均可支配收入";
  const chart = picked.length
    ? barChart(picked.map((r) => r.name), picked.map((r) => r[key]), unit)
    : "<p>请在下方表格中勾选至少一个地区。</p>";
  const arrow = state.sortDir === -1 ? " ↓" : " ↑";
  view.innerHTML =
    "<h2>地区数据</h2>" +
    '<p class="lede">2024 年地区生产总值前 12 的省（直辖市）。点击表头可按该列排序，勾选地区可在上方对比图中比较。</p>' +
    '<div class="panel"><h3>地区对比 — ' + esc(metricLabel) + "（2024 年）</h3>" +
    '<div class="controls"><label for="rmSel">对比指标</label><select id="rmSel">' +
    '<option value="gdp"' + (key === "gdp" ? " selected" : "") + ">地区生产总值</option>" +
    '<option value="pop"' + (key === "pop" ? " selected" : "") + ">常住人口</option>" +
    '<option value="income"' + (key === "income" ? " selected" : "") + ">人均可支配收入</option></select>" +
    '<span class="note">已选 ' + picked.length + " 个地区（最多 4 个）</span></div>" +
    '<div class="chart">' + chart + "</div></div>" +
    '<div class="panel"><h3>2024 年地区表</h3>' +
    '<p class="hint">点击表头排序；勾选行前的复选框加入对比。</p>' +
    '<div class="table-scroll"><table class="data"><thead><tr><th>地区</th>' +
    '<th><button type="button" data-sort="gdp">地区生产总值（亿元）' + (state.sortKey === "gdp" ? arrow : "") + "</button></th>" +
    '<th><button type="button" data-sort="pop">常住人口（万人）' + (state.sortKey === "pop" ? arrow : "") + "</button></th>" +
    '<th><button type="button" data-sort="income">人均可支配收入（元）' + (state.sortKey === "income" ? arrow : "") + "</button></th></tr></thead>" +
    "<tbody>" + regionRows() + "</tbody></table></div>" +
    '<p class="src">数据来源：各省（直辖市）2024 年国民经济和社会发展统计公报已公布数据；生产总值为 headline 数字取整到百亿。</p></div>';

  document.getElementById("rmSel").addEventListener("change", (e) => {
    state.regionMetric = e.target.value;
    render();
  });
  view.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.getAttribute("data-sort");
      if (state.sortKey === k) state.sortDir = -state.sortDir;
      else { state.sortKey = k; state.sortDir = -1; }
      render();
    });
  });
  view.querySelectorAll("[data-region]").forEach((box) => {
    box.addEventListener("change", () => {
      const name = box.getAttribute("data-region");
      const at = state.compare.indexOf(name);
      if (box.checked && at === -1) {
        if (state.compare.length >= 4) { box.checked = false; return; }
        state.compare.push(name);
      } else if (!box.checked && at !== -1) {
        state.compare.splice(at, 1);
      }
      render();
    });
  });
}

// ---------- 路由 ----------
function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  document.querySelectorAll("nav.main a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("data-route") === hash);
  });
  window.scrollTo(0, 0);
  if (hash === "population") {
    const births = INDICATORS.find((m) => m.id === "births");
    renderSingle("人口", "2024 年末全国人口 14.08 亿人，比上年末减少 139 万人；出生 954 万人，出生率 6.77‰，人口已连续三年下降。",
      INDICATORS.find((m) => m.id === "population"),
      '<div class="panel"><h3>出生与死亡人口（2015–2024 年）</h3>' +
      '<p class="hint">2024 年出生 954 万人、死亡 1093 万人，自然增长率为负。</p>' +
      '<div class="chart">' + barChart(births.years, births.values, "万人") + "</div></div>");
  } else if (hash === "economy") {
    renderSingle("经济", "2024 年国内生产总值 134.9 万亿元，同比增长 5.0%；人均国内生产总值 95749 元。",
      INDICATORS.find((m) => m.id === "gdp"),
      '<div class="panel"><h3>GDP 同比增速（2015–2024 年）</h3>' +
      '<div class="chart">' + lineChart(YEARS, GDP.growth, "%") + "</div>" +
      '<p class="hint">2020 年受疫情影响增速回落至 2.2%，2021 年反弹至 8.6%。</p></div>');
  } else if (hash === "employment") {
    renderSingle("就业与收入", "2024 年城镇调查失业率全年均值 5.1%；全国居民人均可支配收入 41314 元，名义增长 5.3%。",
      INDICATORS.find((m) => m.id === "unemployment"),
      '<div class="panel"><h3>人均可支配收入（2015–2024 年）</h3>' +
      '<div class="chart">' + barChart(YEARS, INCOME.values, "元") + "</div>" +
      '<p class="hint">2024 年人均可支配收入 41314 元，十年间接近翻倍。</p></div>');
  } else if (hash === "prices") {
    renderSingle("物价", "2024 年居民消费价格上涨 0.2%，与 2023 年持平，物价总体保持平稳。",
      INDICATORS.find((m) => m.id === "cpi"));
  } else if (hash === "trade") {
    renderSingle("贸易", "2024 年货物进出口总额 43.85 万亿元，增长 5.0%，规模创历史新高；出口 25.45 万亿元，进口 18.39 万亿元。",
      INDICATORS.find((m) => m.id === "trade"),
      '<div class="panel"><h3>出口与进口（2015–2024 年）</h3>' +
      '<div class="chart">' + barChart(YEARS, TRADE.exports, "亿元") + "</div>" +
      '<p class="hint">上图为出口额；2024 年出口 25.45 万亿元，增长 7.1%。</p></div>');
  } else if (hash === "regions") {
    renderRegions();
  } else {
    renderOverview();
  }
}

function render() { route(); }

window.addEventListener("hashchange", route);
route();
