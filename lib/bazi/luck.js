// 大运 + 流年。

import { sexagenaryIndex, tenGodOf } from "./sexagenary";
import { findPrevNode, findNextNode } from "./solar-terms";

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
