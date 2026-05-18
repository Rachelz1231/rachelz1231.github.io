// 六十甲子相关：十神 / 纳音 / 长生十二宫 / 空亡

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_HIDDEN_STEMS,
} from "./constants";

// 找出 (天干, 地支) 在六十甲子中的序号 (0..59)
export function sexagenaryIndex(stem, branch) {
  for (let n = 0; n < 60; n++) {
    if (n % 10 === stem && n % 12 === branch) return n;
  }
  return -1;
}

// 十神：以日主为参照，判断其他天干的关系。
//   同我者比劫 / 我生者食伤 / 我克者财 / 克我者官杀 / 生我者印枭
//   同阴阳为偏，异阴阳为正
function elementIndex(stem) {
  return Math.floor(stem / 2); // 木0 火1 土2 金3 水4
}
export function tenGodOf(dayStem, otherStem) {
  const di = elementIndex(dayStem);
  const oi = elementIndex(otherStem);
  const sameYY = dayStem % 2 === otherStem % 2;
  if (di === oi) return sameYY ? "比肩" : "劫财";
  if ((di + 1) % 5 === oi) return sameYY ? "食神" : "伤官";
  if ((di + 2) % 5 === oi) return sameYY ? "偏财" : "正财";
  if ((oi + 2) % 5 === di) return sameYY ? "七杀" : "正官";
  if ((oi + 1) % 5 === di) return sameYY ? "偏印" : "正印";
  return "";
}

// 纳音（60 项，按六十甲子顺序）
const NAYIN_TABLE = [
  "海中金", "海中金", "炉中火", "炉中火", "大林木", "大林木",
  "路旁土", "路旁土", "剑锋金", "剑锋金", "山头火", "山头火",
  "涧下水", "涧下水", "城头土", "城头土", "白蜡金", "白蜡金",
  "杨柳木", "杨柳木", "泉中水", "泉中水", "屋上土", "屋上土",
  "霹雳火", "霹雳火", "松柏木", "松柏木", "长流水", "长流水",
  "沙中金", "沙中金", "山下火", "山下火", "平地木", "平地木",
  "壁上土", "壁上土", "金箔金", "金箔金", "覆灯火", "覆灯火",
  "天河水", "天河水", "大驿土", "大驿土", "钗钏金", "钗钏金",
  "桑柘木", "桑柘木", "大溪水", "大溪水", "沙中土", "沙中土",
  "天上火", "天上火", "石榴木", "石榴木", "大海水", "大海水",
];
export function nayinOf(stem, branch) {
  return NAYIN_TABLE[sexagenaryIndex(stem, branch)];
}

// 长生十二宫（地势）
const TWELVE_STAGES = [
  "长生", "沐浴", "冠带", "临官", "帝旺",
  "衰", "病", "死", "墓", "绝", "胎", "养",
];
const LONGSHENG_START_BRANCH = [
  11, 6, 2, 9, 2, 9, 5, 0, 8, 3, // 甲乙丙丁戊己庚辛壬癸
];
export function twelveStageOf(dayStem, branch) {
  const isYang = dayStem % 2 === 0;
  const start = LONGSHENG_START_BRANCH[dayStem];
  const offset = isYang
    ? (branch - start + 12) % 12
    : (start - branch + 12) % 12;
  return TWELVE_STAGES[offset];
}

// 空亡（旬空）：基于该柱所在的"旬"。
export function emptyDeathOf(stem, branch) {
  const n = sexagenaryIndex(stem, branch);
  const startBranch = (Math.floor(n / 10) * 10) % 12;
  return [(startBranch + 10) % 12, (startBranch + 11) % 12];
}

// 把一个 pillar 翻译成可显示的形式
export function describePillar(p) {
  return {
    stem: HEAVENLY_STEMS[p.stem],
    branch: EARTHLY_BRANCHES[p.branch],
    stemElement: STEM_ELEMENT[p.stem],
    branchElement: STEM_ELEMENT[BRANCH_HIDDEN_STEMS[p.branch][0]],
    label: HEAVENLY_STEMS[p.stem] + EARTHLY_BRANCHES[p.branch],
  };
}
