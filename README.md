[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Masque999/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Masque999/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# 数观中国

一个原创的中国国家统计数据网站：总览、人口、经济、就业、物价、贸易、地区七个栏目，
十年关键指标（2015–2024 年）均可交互查看。全部内容为原创文案与手写 SVG 图表，
数字取自国家统计局已公开发布的年度 headline 数据。

## 本地打开

```sh
# 任选其一
python3 -m http.server 8080 --directory app
# 或
npx serve app
```

然后用浏览器打开 http://localhost:8080/ 。

也可以直接双击 `app/index.html` 打开（全部资源均为相对路径，无需联网）。

## 功能

- 年份切换：总览页切换年份，指标卡与指标表同步更新
- 指标切换：总览趋势图可在 10 项指标间切换，折线图 / 柱状图可切换
- 指标搜索：总览页按名称过滤指标表
- 可排序数据表：地区页点击表头按地区生产总值、常住人口、人均可支配收入排序
- 地区对比：地区页勾选最多 4 个地区，柱状图实时对比
- Hash 路由：`#/` 总览、`#/population` 人口、`#/economy` 经济、`#/employment` 就业、
  `#/prices` 物价、`#/trade` 贸易、`#/regions` 地区
- 移动端自适应：窄屏下指标卡两列、表格横向滚动

## 文件结构

```
main.ts            提交入口：复制 app/ 与 screenshots/，写出 dossier.json
vendor/            kit 提供的 makefun-frontend.ts（原样复制）
app/
  index.html       页面骨架与导航
  style.css        全部样式
  data.js          统计数据（2015–2024 年 headline 数字）
  charts.js        手写 SVG 折线图 / 柱状图
  main.js          路由与全部交互逻辑
screenshots/      本站真实渲染截图（桌面 2 张 + 手机 1 张）
shots.json         截图对应的路由与视口
LICENSE            MIT
```

## 数据来源

国家统计局《中国统计年鉴》、年度国民经济和社会发展统计公报等公开出版物已公布数据，
为阅读方便取整呈现；具体口径与修订值以官方发布为准。数据截至 2024 年。
