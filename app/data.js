// 数观中国 — 全部数字均为国家统计局已公开发布的年度 headline 数据，
// 为便于阅读取整到所示位数；每个图表与表格均标注年份。
// 货币单位：亿元人民币；人口单位：万人；贸易单位：亿元人民币。

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// 国内生产总值（亿元）与同比增速（%）
const GDP = {
  values: [688858, 746395, 832036, 919281, 986515, 1013567, 1149237, 1210207, 1260582, 1349084],
  growth: [7.0, 6.8, 6.9, 6.7, 6.0, 2.2, 8.6, 3.0, 5.2, 5.0],
};

// 年末总人口（万人）与出生人口（万人）
const POPULATION = {
  total: [137462, 138271, 139008, 139538, 140005, 141178, 141260, 141175, 140967, 140828],
  births: [1655, 1786, 1723, 1523, 1465, 1200, 1062, 956, 902, 954],
  deaths: [975, 977, 986, 993, 998, 997, 1014, 1041, 1110, 1093],
};

// 居民消费价格指数（上年=100 的涨幅，%）
const CPI = { values: [1.4, 2.0, 1.6, 2.1, 2.9, 2.5, 0.9, 2.0, 0.2, 0.2] };

// 城镇调查失业率（%，年末/全年均值口径，取全年均值）
const UNEMPLOYMENT = { values: [5.1, 5.0, 5.0, 4.9, 5.2, 5.6, 5.1, 5.6, 5.2, 5.1] };

// 全国居民人均可支配收入（元）
const INCOME = { values: [21966, 23821, 25974, 28228, 30733, 32189, 35128, 36883, 39218, 41314] };

// 货物进出口总额（亿元）、出口（亿元）、进口（亿元）
const TRADE = {
  total: [245502, 243386, 278036, 305501, 315550, 321557, 391009, 420678, 417568, 438468],
  exports: [141255, 138421, 153321, 164177, 172342, 179326, 217348, 239654, 237726, 254545],
  imports: [104247, 104965, 124715, 141324, 143208, 142231, 173661, 181024, 179842, 183923],
};

// 粮食总产量（万吨）
const GRAIN = { values: [66060, 66044, 66161, 65789, 66384, 66949, 68285, 68653, 69541, 70650] };

// 2024 年地区生产总值前 12 省（亿元，取整到百亿）
const REGIONS_2024 = [
  { name: "广东", gdp: 141600, pop: 12780, income: 51475 },
  { name: "江苏", gdp: 137000, pop: 8526, income: 55408 },
  { name: "山东", gdp: 98600, pop: 10110, income: 39870 },
  { name: "浙江", gdp: 90100, pop: 6627, income: 67013 },
  { name: "四川", gdp: 64700, pop: 8360, income: 33236 },
  { name: "河南", gdp: 63600, pop: 9780, income: 30442 },
  { name: "湖北", gdp: 60000, pop: 5835, income: 36290 },
  { name: "福建", gdp: 57700, pop: 4183, income: 45836 },
  { name: "上海", gdp: 53900, pop: 2480, income: 88410 },
  { name: "湖南", gdp: 53300, pop: 6550, income: 34235 },
  { name: "安徽", gdp: 50700, pop: 6124, income: 34876 },
  { name: "北京", gdp: 49800, pop: 2186, income: 86783 },
];

// 指标字典：供搜索、图表切换与表格使用
const INDICATORS = [
  { id: "gdp", name: "国内生产总值", unit: "亿元", years: YEARS, values: GDP.values, note: "2024 年 134.9 万亿元，同比增长 5.0%。" },
  { id: "gdp_growth", name: "GDP 同比增速", unit: "%", years: YEARS, values: GDP.growth, note: "2024 年增长 5.0%，完成全年预期目标。" },
  { id: "population", name: "年末总人口", unit: "万人", years: YEARS, values: POPULATION.total, note: "2024 年末 14.08 亿人，比上年末减少 139 万人。" },
  { id: "births", name: "全年出生人口", unit: "万人", years: YEARS, values: POPULATION.births, note: "2024 年出生 954 万人，出生率 6.77‰。" },
  { id: "cpi", name: "居民消费价格涨幅", unit: "%", years: YEARS, values: CPI.values, note: "2024 年 CPI 上涨 0.2%，物价总体平稳。" },
  { id: "unemployment", name: "城镇调查失业率", unit: "%", years: YEARS, values: UNEMPLOYMENT.values, note: "2024 年全年均值 5.1%，比上年下降 0.1 个百分点。" },
  { id: "income", name: "人均可支配收入", unit: "元", years: YEARS, values: INCOME.values, note: "2024 年 41314 元，名义增长 5.3%。" },
  { id: "trade", name: "货物进出口总额", unit: "亿元", years: YEARS, values: TRADE.total, note: "2024 年 43.85 万亿元，增长 5.0%，规模创历史新高。" },
  { id: "exports", name: "货物出口额", unit: "亿元", years: YEARS, values: TRADE.exports, note: "2024 年出口 25.45 万亿元，增长 7.1%。" },
  { id: "grain", name: "粮食总产量", unit: "万吨", years: YEARS, values: GRAIN.values, note: "2024 年 70650 万吨，首次突破 7 亿吨。" },
];
