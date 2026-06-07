// 大运 + 流年 + 流月。

import { sexagenaryIndex, tenGodOf } from "./sexagenary";
import { findPrevNode, findNextNode, solarTermDay, nodeTermName } from "./solar-terms";

// 大运排盘：
//   方向：阳年男 / 阴年女 → 顺行；阴年男 / 阳年女 → 逆行
//   起运岁数 = 距最近节气天数 / 3（三日折一年）
//   首步干支 = 月柱 +1（顺）或 −1（逆），逐 10 年递推
export function majorLuckCycles({
  pillars, birthYear, birthMonth, birthDay, birthHour = 0, birthMinute = 0, gender,
}) {
  const yearStem = pillars.year.stem;
  const dayStem = pillars.day.stem;
  const monthStem = pillars.month.stem;
  const monthBranch = pillars.month.branch;
  const isYangYear = yearStem % 2 === 0;
  const isMale = gender === "male";
  const forward = (isYangYear && isMale) || (!isYangYear && !isMale);

  const birthMs = Date.UTC(birthYear, birthMonth - 1, birthDay, birthHour, birthMinute);
  const targetTerm = forward
    ? findNextNode(birthYear, birthMonth, birthDay)
    : findPrevNode(birthYear, birthMonth, birthDay);
  const termMs = Date.UTC(targetTerm.year, targetTerm.month - 1, targetTerm.day, 0, 0);
  const days = Math.abs(termMs - birthMs) / 86400000;
  const startAge = days / 3;

  const cycles = [];
  let n = sexagenaryIndex(monthStem, monthBranch);
  for (let i = 0; i < 10; i++) {
    n = forward ? (n + 1) % 60 : (n - 1 + 60) % 60;
    const stem = n % 10;
    const branch = n % 12;
    const ageStart = startAge + i * 10;
    const ageEnd = ageStart + 10;
    cycles.push({
      stem, branch,
      ageStart, ageEnd,
      yearStart: birthYear + Math.floor(ageStart),
      yearEnd: birthYear + Math.floor(ageEnd),
      tenGod: tenGodOf(dayStem, stem),
    });
  }
  return { forward, startAge, cycles, targetTerm };
}

// 流年（年柱）：按公历元旦切换；交节细节略。
export function annualPillar(year) {
  const stem = ((year - 4) % 10 + 10) % 10;
  const branch = ((year - 4) % 12 + 12) % 12;
  return { stem, branch };
}

// 流月：以"节"为界，从立春(Y) 到 立春(Y+1)，共 12 个月柱。
//   月支固定顺序：寅(2) 卯(3) 辰(4) 巳(5) 午(6) 未(7) 申(8) 酉(9) 戌(10) 亥(11) 子(0) 丑(1)
//   月干由五虎遁推出：月干 = (年干 × 2 + 2 + 距寅月偏移) mod 10
const MONTH_BRANCH_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
// 月支 → 起始"节"所在的公历月份（仅丑月在次年）
const BRANCH_TO_TERM_MONTH = {
  2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7,
  8: 8, 9: 9, 10: 10, 11: 11, 0: 12, 1: 1,
};

export function monthlyPillars(year) {
  const yearStem = ((year - 4) % 10 + 10) % 10;
  const out = [];
  for (let k = 0; k < 12; k++) {
    const branch = MONTH_BRANCH_ORDER[k];
    const offsetFromYin = (branch - 2 + 12) % 12;
    const stem = (yearStem * 2 + 2 + offsetFromYin) % 10;
    const termMonth = BRANCH_TO_TERM_MONTH[branch];
    const startYear = branch === 1 ? year + 1 : year;
    const startDay = solarTermDay(startYear, termMonth);
    out.push({
      branch, stem,
      startYear, startMonth: termMonth, startDay,
      termName: nodeTermName(termMonth),
    });
  }
  // 终止日 = 下一月的起始（最后一个丑月止于 立春(year+1)）
  for (let k = 0; k < 12; k++) {
    const nxt = k < 11
      ? out[k + 1]
      : {
          startYear: year + 1,
          startMonth: 2,
          startDay: solarTermDay(year + 1, 2),
        };
    out[k].endYear = nxt.startYear;
    out[k].endMonth = nxt.startMonth;
    out[k].endDay = nxt.startDay;
  }
  return out;
}
