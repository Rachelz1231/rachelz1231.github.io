// 神煞 / 墓库：常用的几个支神标记。

// 墓库：四库各自所"藏"的五行（土本身不入库；土在辰戌丑未中只是库主）
//   辰 → 水库；戌 → 火库；未 → 木库；丑 → 金库
const TOMB_ELEMENT = {
  1: "金",  // 丑
  4: "水",  // 辰
  7: "木",  // 未
  10: "火", // 戌
};
export function tombElement(branchIdx) {
  return TOMB_ELEMENT[branchIdx] || null;
}

// 驿马（命理标志奔波、迁移）。
//   驿马 = 年/日支所属三合局之"长生位"的对冲：
//     申子辰（水局，长生申）→ 驿马 寅
//     寅午戌（火局，长生寅）→ 驿马 申
//     巳酉丑（金局，长生巳）→ 驿马 亥
//     亥卯未（木局，长生亥）→ 驿马 巳
const POSTAL_HORSE_BY_BRANCH = {
  0: 2, 4: 2, 8: 2,   // 申子辰 → 寅
  2: 8, 6: 8, 10: 8,  // 寅午戌 → 申
  1: 11, 5: 11, 9: 11, // 巳酉丑 → 亥
  3: 5, 7: 5, 11: 5,  // 亥卯未 → 巳
};
export function postalHorseBranch(refBranch) {
  return POSTAL_HORSE_BY_BRANCH[refBranch];
}

// 计算命局中各柱的"驿马"命中情况。
//   anchors: 通常用 [年支, 日支] 任一对应即算（多数派别认可）
//   返回 [bool, bool, bool, bool] 对应 年/月/日/时
export function postalHorseHits(result) {
  const branches = [
    result.year.branch, result.month.branch, result.day.branch, result.hour.branch,
  ];
  const targets = new Set([
    postalHorseBranch(result.year.branch),
    postalHorseBranch(result.day.branch),
  ]);
  return branches.map((b) => targets.has(b));
}
