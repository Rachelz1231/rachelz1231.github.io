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

// 命格（月令格局）：先看月支是否为日主禄/刃位，再看月支藏干在年/月/时干上是否透出。
//   建禄格 = 月支为日主禄位（甲寅 乙卯 丙戊巳 丁己午 庚申 辛酉 壬亥 癸子）；
//   羊刃格 = 阳干月支为刃位（即下一阴干的禄位：甲卯 丙戊午 庚酉 壬子）；
//   月劫格 = 阴干月支为同类阳干禄位（乙寅 丁己巳 辛申 癸亥），同建禄论。
//   其余按透出的十神命名；比劫不能为格，中气/余气透出比劫不取。
const LU_BRANCH = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // 甲..癸 的禄位地支
const GEJU_BY_TENGOD = {
  "正官": "正官格",
  "七杀": "七杀格",
  "正印": "正印格",
  "偏印": "偏印格",
  "正财": "正财格",
  "偏财": "偏财格",
  "食神": "食神格",
  "伤官": "伤官格",
};
export function pickGeJu(result) {
  const dayStem = result.day.stem;
  const monthBranch = result.month.branch;
  const monthHidden = BRANCH_HIDDEN_STEMS[monthBranch];
  const otherStems = [result.year.stem, result.month.stem, result.hour.stem];
  const isYang = dayStem % 2 === 0;

  if (monthBranch === LU_BRANCH[dayStem]) {
    return { name: "建禄格", note: "月支为日主禄位" };
  }
  if (isYang && monthBranch === LU_BRANCH[dayStem + 1]) {
    return { name: "羊刃格", note: "月支为日主刃位" };
  }
  if (!isYang && monthBranch === LU_BRANCH[dayStem - 1]) {
    return { name: "月劫格", note: "阴干月支为劫财禄位，同建禄论" };
  }

  // 本气 / 中气 / 余气依次看透干，比劫跳过
  const rootLabels = ["本气", "中气", "余气"];
  let skippedBiJie = false;
  for (let i = 0; i < monthHidden.length; i++) {
    const s = monthHidden[i];
    const tg = tenGodOf(dayStem, s);
    if (tg === "比肩" || tg === "劫财") {
      skippedBiJie = true;
      continue;
    }
    if (otherStems.includes(s)) {
      return {
        name: GEJU_BY_TENGOD[tg],
        note: `月支${rootLabels[i]} ${HEAVENLY_STEMS[s]} 透干`,
      };
    }
  }
  // 都不透 → 取第一个非比劫藏干的十神为格（通常即本气）
  for (let i = 0; i < monthHidden.length; i++) {
    const s = monthHidden[i];
    const tg = tenGodOf(dayStem, s);
    if (tg === "比肩" || tg === "劫财") continue;
    return {
      name: GEJU_BY_TENGOD[tg],
      note: skippedBiJie
        ? `比劫不取格，取月支${rootLabels[i]} ${HEAVENLY_STEMS[s]} 的十神为格`
        : `月支无透干，取${rootLabels[i]}十神为格`,
    };
  }
  return { name: "建禄格", note: "月支藏干皆为比劫" };
}
