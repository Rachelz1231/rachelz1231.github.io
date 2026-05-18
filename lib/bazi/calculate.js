// 主入口：真太阳时校正 + 四柱排盘 + 节气定位。

import { equationOfTime, nodeTermName, solarTermDay } from "./solar-terms";
import { yearPillar, monthPillar, dayPillar, hourPillar, shiftForLateZi } from "./pillars";

// 钟表本地时 → 真太阳时（可能跨日）。
//   lon: 本地经度（东经为正）；tzMeridian: 时区中央经线（UTC 偏移 × 15）。
export function toTrueSolarTime({
  year, month, day, hour, minute = 0, lon, tzMeridian,
}) {
  const longitudeOffset = (lon - tzMeridian) * 4; // 分钟
  const eot = equationOfTime(year, month, day);
  const total = hour * 60 + minute + longitudeOffset + eot;
  let dayShift = 0;
  let m = total;
  while (m < 0) { m += 1440; dayShift -= 1; }
  while (m >= 1440) { m -= 1440; dayShift += 1; }
  const d = new Date(Date.UTC(year, month - 1, day + dayShift));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: Math.floor(m / 60),
    minute: m % 60,
    longitudeOffset,
    equationOfTime: eot,
    totalOffsetMinutes: longitudeOffset + eot,
  };
}

// 主入口：阳历 -> 八字（四柱）。
//   - 年/月柱以节气为界（紫金山公式日期级精度）
//   - 钟表时间假定为当地"标准时"（非夏令时）
//   - 23:00 起视为下一日的"早子时"
//   - 真太阳时 = 钟表 + (经度 − 时区中央经线) × 4 分钟 + 均时差；四柱全部基于真太阳时
export function calculateBazi({
  year, month, day, hour, minute = 0, lon, tzMeridian,
}) {
  let solar = null;
  let y = year, mo = month, d = day, h = hour;
  if (lon != null && tzMeridian != null) {
    solar = toTrueSolarTime({ year, month, day, hour, minute, lon, tzMeridian });
    y = solar.year; mo = solar.month; d = solar.day; h = solar.hour;
  }
  const yp = yearPillar(y, mo, d);
  const mp = monthPillar(yp.stem, y, mo, d);
  const shifted = shiftForLateZi(y, mo, d, h);
  const dp = dayPillar(shifted.year, shifted.month, shifted.day);
  const hp = hourPillar(dp.stem, h);

  // 出生日所属"节"信息 + 当月节气日，便于用户判断是否临近交节
  const thisMonthTermDay = solarTermDay(y, mo);
  const nextMonthTermDay = mo === 12 ? solarTermDay(y + 1, 1) : solarTermDay(y, mo + 1);
  const prevMonthTermDay = mo === 1 ? solarTermDay(y - 1, 12) : solarTermDay(y, mo - 1);
  const afterTerm = d >= thisMonthTermDay;
  const termMonth = afterTerm ? mo : (mo === 1 ? 12 : mo - 1);
  const termYear = afterTerm ? y : (mo === 1 ? y - 1 : y);
  const termDay = afterTerm ? thisMonthTermDay : prevMonthTermDay;
  const isCritical =
    Math.abs(d - thisMonthTermDay) <= 1 ||
    (d <= 2 && Math.abs(d + 31 - prevMonthTermDay) <= 1) ||
    (d >= 27 && Math.abs(d - (nextMonthTermDay + 31)) <= 1);
  const term = {
    name: nodeTermName(termMonth),
    year: termYear,
    month: termMonth,
    day: termDay,
    isCritical,
  };

  return { year: yp, month: mp, day: dp, hour: hp, solar, term };
}
