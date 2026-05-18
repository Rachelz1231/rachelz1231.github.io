// 四柱推算：年柱、月柱、日柱、时柱。

import { solarTermDay } from "./solar-terms";

// 每月"节"之后所属的月支索引
const BRANCH_AFTER_TERM = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
  7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 0,
};

function monthBranchIndex(year, month, day) {
  if (day >= solarTermDay(year, month)) return BRANCH_AFTER_TERM[month];
  const prev = month === 1 ? 12 : month - 1;
  return BRANCH_AFTER_TERM[prev];
}

// 年柱：以当年的立春日为界。
export function yearPillar(year, month, day) {
  let y = year;
  const liChunDay = solarTermDay(year, 2);
  if (month < 2 || (month === 2 && day < liChunDay)) y = year - 1;
  const stem = ((y - 4) % 10 + 10) % 10;
  const branch = ((y - 4) % 12 + 12) % 12;
  return { stem, branch };
}

// 月柱：年干起月干（五虎遁）。
//   月干 = (年干 × 2 + 2 + 距寅月的偏移) mod 10
export function monthPillar(yearStem, year, month, day) {
  const branch = monthBranchIndex(year, month, day);
  const offsetFromYin = (branch - 2 + 12) % 12;
  const stem = (yearStem * 2 + 2 + offsetFromYin) % 10;
  return { stem, branch };
}

// 日柱：以 1900-01-31 = 甲辰日（六十甲子第 41 个，索引 40）为锚。
export function dayPillar(year, month, day) {
  const base = Date.UTC(1900, 0, 31);
  const target = Date.UTC(year, month - 1, day);
  const days = Math.round((target - base) / 86400000);
  const n = ((days + 40) % 60 + 60) % 60;
  return { stem: n % 10, branch: n % 12 };
}

// 时柱：日干起时干（五鼠遁）。
export function hourPillar(dayStem, hour) {
  let branch;
  if (hour === 23 || hour === 0) branch = 0;          // 子
  else branch = Math.floor((hour + 1) / 2) % 12;       // 丑..亥
  const stem = (dayStem * 2 + branch) % 10;
  return { stem, branch };
}

// 23 点起为下一日的早子时：日柱需推进一天。
export function shiftForLateZi(year, month, day, hour) {
  if (hour !== 23) return { year, month, day };
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}
