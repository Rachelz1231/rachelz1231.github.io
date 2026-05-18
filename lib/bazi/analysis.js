// 综合分析：五行透根 / 日主强弱 / 命格。

import {
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  BRANCH_HIDDEN_STEMS,
  HEAVENLY_STEMS,
} from "./constants";
import { tenGodOf } from "./sexagenary";

// 五行综合分析：计数 + 是否透干 + 是否通根 → 标注"透根/透/有根/无"。
//   count 计入 4 天干 + 4 地支本气（共 8 位）。
//   透 = 天干出现；根 = 任一地支藏干出现同元素。
export function elementAnalysis(result) {
  const tally = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const transp = new Set();
  const rooted = new Set();
  for (const k of ["year", "month", "day", "hour"]) {
    const p = result[k];
    const sEl = STEM_ELEMENT[p.stem];
    const bEl = BRANCH_ELEMENT[p.branch];
    tally[sEl]++;
    tally[bEl]++;
    transp.add(sEl);
    for (const s of BRANCH_HIDDEN_STEMS[p.branch]) rooted.add(STEM_ELEMENT[s]);
  }
  const status = {};
  for (const el of ["木", "火", "土", "金", "水"]) {
    const t = transp.has(el);
    const r = rooted.has(el);
    status[el] = {
      count: tally[el],
      transp: t,
      rooted: r,
      label: t && r ? "透根" : t ? "透" : r ? "有根" : "—",
    };
  }
  return status;
}

// 日主强弱评估：得令 / 得地 / 得势。
export function strengthAssessment(result) {
  const dayStem = result.day.stem;
  const dayEl = STEM_ELEMENT[dayStem];
  const FIVE = ["木", "火", "土", "金", "水"];
  const generates = (a, b) => (FIVE.indexOf(a) + 1) % 5 === FIVE.indexOf(b);
  const isFav = (el) => el === dayEl || generates(el, dayEl);

  // 得令：月支本气与日主关系
  const monthMainStem = BRANCH_HIDDEN_STEMS[result.month.branch][0];
  const monthMainEl = STEM_ELEMENT[monthMainStem];
  const deLing = isFav(monthMainEl);

  // 得地：日主元素出现在任一地支藏干
  let deDi = false;
  const rootedPillars = [];
  for (const k of ["year", "month", "day", "hour"]) {
    const hidden = BRANCH_HIDDEN_STEMS[result[k].branch];
    if (hidden.some((s) => STEM_ELEMENT[s] === dayEl)) {
      deDi = true;
      rootedPillars.push(k);
    }
  }

  // 得势：除日干外的 3 天干 + 4 地支本气中，有利元素数 ≥ 4
  let favorable = 0;
  for (const k of ["year", "month", "hour"]) {
    if (isFav(STEM_ELEMENT[result[k].stem])) favorable++;
  }
  for (const k of ["year", "month", "day", "hour"]) {
    const me = STEM_ELEMENT[BRANCH_HIDDEN_STEMS[result[k].branch][0]];
    if (isFav(me)) favorable++;
  }
  const deShi = favorable >= 4;

  const score = (deLing ? 1 : 0) + (deDi ? 1 : 0) + (deShi ? 1 : 0);
  const strength =
    score === 3 ? "身强" : score === 0 ? "身弱" : score === 2 ? "偏强" : "偏弱";

  return {
    dayEl,
    deLing, deDi, deShi,
    monthMainEl,
    rootedPillars,
    favorableCount: favorable,
    favorableTotal: 7,
    strength,
  };
}

// 命格（月令格局）：以月支本气为先，看月支藏干在年/月/时干上是否透出。
//   建禄格 = 月支本气为日主本元（比肩）；羊刃格 = 月支为日主刃位（劫财）。
//   其余八格按透出的十神命名。
const GEJU_BY_TENGOD = {
  "正官": "正官格",
  "七杀": "七杀格",
  "正印": "正印格",
  "偏印": "偏印格",
  "正财": "正财格",
  "偏财": "偏财格",
  "食神": "食神格",
  "伤官": "伤官格",
  "比肩": "建禄格",
  "劫财": "羊刃格",
};
export function pickGeJu(result) {
  const dayStem = result.day.stem;
  const monthHidden = BRANCH_HIDDEN_STEMS[result.month.branch];
  const otherStems = [result.year.stem, result.month.stem, result.hour.stem];

  const mainStem = monthHidden[0];
  const mainTG = tenGodOf(dayStem, mainStem);
  if (mainTG === "比肩") return { name: "建禄格", note: "月支本气为日主同元" };
  if (mainTG === "劫财") return { name: "羊刃格", note: "月支为日主刃位" };

  // 本气透干
  if (otherStems.includes(mainStem)) {
    return {
      name: GEJU_BY_TENGOD[mainTG] || mainTG,
      note: `月支本气 ${HEAVENLY_STEMS[mainStem]} 透干`,
    };
  }
  // 中气 / 余气透干
  const rootLabels = ["", "中气", "余气"];
  for (let i = 1; i < monthHidden.length; i++) {
    const s = monthHidden[i];
    if (otherStems.includes(s)) {
      const tg = tenGodOf(dayStem, s);
      return {
        name: GEJU_BY_TENGOD[tg] || tg,
        note: `月支${rootLabels[i]} ${HEAVENLY_STEMS[s]} 透干`,
      };
    }
  }
  // 都不透 → 本气十神为格
  return {
    name: GEJU_BY_TENGOD[mainTG] || mainTG,
    note: "月支无透干，取本气十神为格",
  };
}
