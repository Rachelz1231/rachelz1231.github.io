// 节气 + 均时差。
// 节气用紫金山公式：D = floor(Y × 0.2422 + C) − floor((Y − 1) / 4)，Y = year mod 100。
// 注：1900–2100 大多数年份日期级精度（个别 ±1 天）；交节临界 ±1 天提示用户核对。

const NODE_TERMS = {
  1:  { name: "小寒", C20: 6.11,   C21: 5.4055, exc: {} },
  2:  { name: "立春", C20: 4.6295, C21: 3.87,   exc: {} },
  3:  { name: "惊蛰", C20: 6.3826, C21: 5.63,   exc: {} },
  4:  { name: "清明", C20: 5.59,   C21: 4.81,   exc: {} },
  5:  { name: "立夏", C20: 6.318,  C21: 5.52,   exc: {} },
  6:  { name: "芒种", C20: 6.5,    C21: 5.678,  exc: {} },
  7:  { name: "小暑", C20: 7.928,  C21: 7.108,  exc: { 2024: -1 } },
  8:  { name: "立秋", C20: 8.35,   C21: 7.5,    exc: {} },
  9:  { name: "白露", C20: 8.44,   C21: 7.646,  exc: {} },
  10: { name: "寒露", C20: 9.098,  C21: 8.318,  exc: {} },
  11: { name: "立冬", C20: 8.218,  C21: 7.438,  exc: {} },
  12: { name: "大雪", C20: 7.9,    C21: 7.18,   exc: {} },
};

export function solarTermDay(year, month) {
  const t = NODE_TERMS[month];
  const Y = year % 100;
  const C = year >= 2000 ? t.C21 : t.C20;
  let d = Math.floor(Y * 0.2422 + C) - Math.floor((Y - 1) / 4);
  if (t.exc[year]) d += t.exc[year];
  return d;
}

export function nodeTermName(month) {
  return NODE_TERMS[month].name;
}

// 给定日期返回前/后最近的"节"
export function findPrevNode(year, month, day) {
  const t = solarTermDay(year, month);
  if (day >= t) return { year, month, day: t, name: nodeTermName(month) };
  const pm = month === 1 ? 12 : month - 1;
  const py = month === 1 ? year - 1 : year;
  return { year: py, month: pm, day: solarTermDay(py, pm), name: nodeTermName(pm) };
}
export function findNextNode(year, month, day) {
  const t = solarTermDay(year, month);
  if (day < t) return { year, month, day: t, name: nodeTermName(month) };
  const nm = month === 12 ? 1 : month + 1;
  const ny = month === 12 ? year + 1 : year;
  return { year: ny, month: nm, day: solarTermDay(ny, nm), name: nodeTermName(nm) };
}

// 均时差（分钟）：基于出生日的年内序号。
//   公式：B = 2π·(N − 81)/365；EoT ≈ 9.87·sin 2B − 7.53·cos B − 1.5·sin B
export function equationOfTime(year, month, day) {
  const start = Date.UTC(year, 0, 1);
  const here = Date.UTC(year, month - 1, day);
  const doy = Math.round((here - start) / 86400000) + 1;
  const B = ((2 * Math.PI) / 365) * (doy - 81);
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}
