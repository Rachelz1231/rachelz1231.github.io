// 合冲刑害关系判定。

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_HIDDEN_STEMS,
} from "./constants";

// 关系表
const STEM_COMBOS_TABLE = [
  [0, 5, "土", "甲己合化土"],
  [1, 6, "金", "乙庚合化金"],
  [2, 7, "水", "丙辛合化水"],
  [3, 8, "木", "丁壬合化木"],
  [4, 9, "火", "戊癸合化火"],
];
const BRANCH_LIUHE_TABLE = [
  [0, 1, "土", "子丑合化土"],
  [2, 11, "木", "寅亥合化木"],
  [3, 10, "火", "卯戌合化火"],
  [4, 9, "金", "辰酉合化金"],
  [5, 8, "水", "巳申合化水"],
  [6, 7, "", "午未相合"],
];
const BRANCH_SANHE_TABLE = [
  [[8, 0, 4], "水", "申子辰三合水局"],
  [[11, 3, 7], "木", "亥卯未三合木局"],
  [[2, 6, 10], "火", "寅午戌三合火局"],
  [[5, 9, 1], "金", "巳酉丑三合金局"],
];
const BRANCH_SANHUI_TABLE = [
  [[2, 3, 4], "木", "寅卯辰三会东方木"],
  [[5, 6, 7], "火", "巳午未三会南方火"],
  [[8, 9, 10], "金", "申酉戌三会西方金"],
  [[11, 0, 1], "水", "亥子丑三会北方水"],
];
const BRANCH_HAI_TABLE = [
  [0, 7, "子未相害"],
  [1, 6, "丑午相害"],
  [2, 5, "寅巳相害"],
  [3, 4, "卯辰相害"],
  [8, 11, "申亥相害"],
  [9, 10, "酉戌相害"],
];

const POS_NAMES = ["年", "月", "日", "时"];

// 通用：对任意 pillars 数组（每个 {stem, branch, label}）计算合冲刑害。
function computeRelations(pillars) {
  const stems = pillars.map((p) => p.stem);
  const branches = pillars.map((p) => p.branch);
  const labels = pillars.map((p) => p.label);
  const findPos = (arr, v) =>
    arr.map((x, i) => (x === v ? i : -1)).filter((i) => i >= 0);

  const stemCombos = [];
  for (const [a, b, el, name] of STEM_COMBOS_TABLE) {
    const pa = findPos(stems, a), pb = findPos(stems, b);
    for (const i of pa) for (const j of pb) {
      stemCombos.push({
        name, element: el,
        positions: [labels[i], labels[j]],
        stems: [a, b],
      });
    }
  }
  const liuhe = [];
  for (const [a, b, el, name] of BRANCH_LIUHE_TABLE) {
    const pa = findPos(branches, a), pb = findPos(branches, b);
    for (const i of pa) for (const j of pb) {
      liuhe.push({ name, element: el, positions: [labels[i], labels[j]] });
    }
  }
  const sanhe = [];
  for (const [trip, el, name] of BRANCH_SANHE_TABLE) {
    const present = trip.map((b) => findPos(branches, b));
    const presentCount = present.filter((p) => p.length > 0).length;
    if (presentCount === 3) {
      const positions = present.flat().map((i) => labels[i]);
      sanhe.push({ name, element: el, positions, complete: true });
    } else if (presentCount === 2) {
      // 半合 — 必须包含中神（子午卯酉，trip[1] 为中神）
      if (present[1].length > 0) {
        const involved = trip.filter((_, idx) => present[idx].length > 0);
        const positions = present.flat().map((i) => labels[i]);
        sanhe.push({
          name: `${involved.map((b) => EARTHLY_BRANCHES[b]).join("")}半合${el}局`,
          element: el, positions, complete: false,
        });
      }
    }
  }
  const sanhui = [];
  for (const [trip, el, name] of BRANCH_SANHUI_TABLE) {
    const present = trip.map((b) => findPos(branches, b));
    if (present.every((p) => p.length > 0)) {
      const positions = present.flat().map((i) => labels[i]);
      sanhui.push({ name, element: el, positions, complete: true });
    }
  }
  const chong = [];
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (Math.abs(branches[i] - branches[j]) === 6) {
        chong.push({
          name: `${EARTHLY_BRANCHES[branches[i]]}${EARTHLY_BRANCHES[branches[j]]}相冲`,
          positions: [labels[i], labels[j]],
        });
      }
    }
  }
  const hai = [];
  for (const [a, b, name] of BRANCH_HAI_TABLE) {
    const pa = findPos(branches, a), pb = findPos(branches, b);
    for (const i of pa) for (const j of pb) {
      hai.push({ name, positions: [labels[i], labels[j]] });
    }
  }
  const xing = [];
  // 子卯相刑
  for (const i of findPos(branches, 0))
    for (const j of findPos(branches, 3))
      xing.push({ name: "子卯相刑（无礼之刑）", positions: [labels[i], labels[j]] });
  // 辰午酉亥自刑
  for (const b of [4, 6, 9, 11]) {
    const ps = findPos(branches, b);
    if (ps.length >= 2) {
      xing.push({
        name: `${EARTHLY_BRANCHES[b]}${EARTHLY_BRANCHES[b]}自刑`,
        positions: ps.map((i) => labels[i]),
      });
    }
  }
  // 寅巳申 / 丑戌未三刑（全员到齐）
  const tripleSets = [
    { branches: [2, 5, 8], name: "寅巳申三刑（无恩之刑）" },
    { branches: [1, 10, 7], name: "丑戌未三刑（持势之刑）" },
  ];
  for (const t of tripleSets) {
    const ps = t.branches.map((b) => findPos(branches, b));
    if (ps.every((p) => p.length > 0)) {
      xing.push({
        name: t.name,
        positions: ps.flat().map((i) => labels[i]),
      });
    }
  }
  return { stemCombos, liuhe, sanhe, sanhui, chong, hai, xing };
}

function basePillarsOf(result) {
  return [
    { stem: result.year.stem,  branch: result.year.branch,  label: POS_NAMES[0] },
    { stem: result.month.stem, branch: result.month.branch, label: POS_NAMES[1] },
    { stem: result.day.stem,   branch: result.day.branch,   label: POS_NAMES[2] },
    { stem: result.hour.stem,  branch: result.hour.branch,  label: POS_NAMES[3] },
  ];
}

// 天干合化的"化"是否成立——逐项判定 4 个条件。
//   1) 紧邻：合的两干在相邻柱（年-月 / 月-日 / 日-时）。外柱（运/岁）参与则不限。
//   2) 月令支持：月支本气 = 化神 或 月支本气生化神。
//   3) 化神有根：化神在任一地支藏干中出现。
//   4) 无强克：克化神之元素在天干 + 地支本气中共 < 2 处。
const FIVE = ["木", "火", "土", "金", "水"];
const generatesEl = (a, b) =>
  (FIVE.indexOf(a) + 1) % 5 === FIVE.indexOf(b);
const KE_OF = { 土: "木", 金: "火", 水: "土", 木: "金", 火: "水" };

function evaluateStemHua(combo, allPillars, monthBranch) {
  const huaShen = combo.element;
  const positions = combo.positions;
  const isExt = (p) => p === "运" || p === "岁";
  const anyExternal = positions.some(isExt);

  // 争合检测：合的双方任一字在参与盘面（命局 + 当下外柱）出现多次
  const [stemA, stemB] = combo.stems;
  const allStems = allPillars.map((p) => p.stem);
  const countA = allStems.filter((s) => s === stemA).length;
  const countB = allStems.filter((s) => s === stemB).length;
  const contended = countA > 1 || countB > 1;
  const dupStem = countA > 1 ? stemA : stemB;
  const dupCount = Math.max(countA, countB);

  // 大运 / 流年 参与 → 仅作合的扰动，不独立成化
  if (anyExternal) {
    const which = positions.includes("运") ? "大运" : "流年";
    const checks = [
      {
        name: "外柱参与",
        hit: false,
        hint: `${which}入命与命局成合，作短期扰动，不独立化神`,
      },
    ];
    if (contended) {
      checks.push({
        name: "争合",
        hit: false,
        hint: `${HEAVENLY_STEMS[dupStem]} 共 ${dupCount} 处，能量被瓜分`,
      });
    }
    return { formed: false, external: true, contended, checks };
  }

  const checks = [];

  // 1. 紧邻
  const order = { 年: 0, 月: 1, 日: 2, 时: 3 };
  const sorted = [...positions].sort((a, b) => order[a] - order[b]);
  const adjacent = order[sorted[1]] - order[sorted[0]] === 1;
  checks.push({
    name: "紧邻",
    hit: adjacent,
    hint: adjacent
      ? `${sorted.join("-")} 相邻`
      : `${sorted.join("-")} 隔位，气不通`,
  });

  // 2. 月令
  const monthMainEl = STEM_ELEMENT[BRANCH_HIDDEN_STEMS[monthBranch][0]];
  const inSeason =
    monthMainEl === huaShen || generatesEl(monthMainEl, huaShen);
  checks.push({
    name: "月令",
    hit: inSeason,
    hint: inSeason
      ? monthMainEl === huaShen
        ? `月支为${monthMainEl}，化神当令`
        : `月支为${monthMainEl}，生扶化神 ${huaShen}`
      : `月支为${monthMainEl}，未生扶化神 ${huaShen}`,
  });

  // 3. 化神有根
  const rooted = allPillars.some((p) =>
    BRANCH_HIDDEN_STEMS[p.branch].some((s) => STEM_ELEMENT[s] === huaShen)
  );
  checks.push({
    name: "化神有根",
    hit: rooted,
    hint: rooted
      ? `化神 ${huaShen} 在地支藏干通根`
      : `化神 ${huaShen} 在地支无根`,
  });

  // 4. 无强克
  const keEl = KE_OF[huaShen];
  let keCount = 0;
  for (const p of allPillars) {
    if (STEM_ELEMENT[p.stem] === keEl) keCount++;
    if (STEM_ELEMENT[BRANCH_HIDDEN_STEMS[p.branch][0]] === keEl) keCount++;
  }
  const notSuppressed = keCount < 2;
  checks.push({
    name: "无强克",
    hit: notSuppressed,
    hint: notSuppressed
      ? `克化神 ${keEl} 仅 ${keCount} 处，不构成强克`
      : `克化神 ${keEl} 共 ${keCount} 处，冲化`,
  });

  // 5. 日主弃命（仅当 日干 参与合化时检验）
  //   日主若在命局四柱地支藏干中通根，恋根不化 → 合而不化
  //   日主无根方可弃命相从（化气格的前提）
  if (positions.includes("日")) {
    const baseBranches = allPillars.filter((p) =>
      ["年", "月", "日", "时"].includes(p.label)
    );
    const dayPillar = baseBranches.find((p) => p.label === "日");
    if (dayPillar) {
      const dayEl = STEM_ELEMENT[dayPillar.stem];
      const dayRooted = baseBranches.some((p) =>
        BRANCH_HIDDEN_STEMS[p.branch].some((s) => STEM_ELEMENT[s] === dayEl)
      );
      checks.push({
        name: "日主弃命",
        hit: !dayRooted,
        hint: dayRooted
          ? `日主 ${dayEl} 通根地支，恋根不化`
          : `日主 ${dayEl} 无根，可弃命相从（化气格）`,
      });
    }
  }

  // 6. 无争合：合的双方任一字在命局重复出现 → 能量被瓜分
  checks.push({
    name: "无争合",
    hit: !contended,
    hint: contended
      ? `${HEAVENLY_STEMS[dupStem]} 在四柱出现 ${dupCount} 次，争合分力`
      : "命局内无同字重复",
  });

  return {
    formed: checks.every((c) => c.hit),
    external: false,
    contended,
    checks,
  };
}

// 命局自身的合冲刑害
export function analyzeRelations(result) {
  const base = basePillarsOf(result);
  const raw = computeRelations(base);
  raw.stemCombos = raw.stemCombos.map((c) => ({
    ...c,
    hua: evaluateStemHua(c, base, result.month.branch),
  }));
  return raw;
}

// 命局四柱 + 一/多个外柱（大运 / 流年）的合冲刑害，仅保留涉及任一外柱的项。
//   externals: [{ stem, branch, label }]
//   返回结构与 analyzeRelations 一致，多 hasAny: boolean
export function analyzeWithExternals(result, externals) {
  const base = basePillarsOf(result);
  const all = computeRelations([...base, ...externals]);
  const extSet = new Set(externals.map((e) => e.label));
  const involves = (positions) => positions.some((p) => extSet.has(p));
  const filtered = {
    stemCombos: all.stemCombos
      .filter((it) => involves(it.positions))
      .map((c) => ({
        ...c,
        hua: evaluateStemHua(c, [...base, ...externals], result.month.branch),
      })),
    liuhe:      all.liuhe.filter((it) => involves(it.positions)),
    sanhe:      all.sanhe.filter((it) => involves(it.positions)),
    sanhui:     all.sanhui.filter((it) => involves(it.positions)),
    chong:      all.chong.filter((it) => involves(it.positions)),
    hai:        all.hai.filter((it) => involves(it.positions)),
    xing:       all.xing.filter((it) => involves(it.positions)),
  };
  filtered.hasAny = Object.values(filtered).some(
    (v) => Array.isArray(v) && v.length > 0
  );
  return filtered;
}
