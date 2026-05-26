"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  STEM_ELEMENT, BRANCH_ELEMENT,
  strengthAssessment, elementAnalysis,
  computeRelations, tenGodOf,
} from "@/lib/bazi";

const FIVE = ["木", "火", "土", "金", "水"];
const SHENG_NEXT = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const KE_TARGET = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

// 跨盘合冲刑害（带 stem 信息用于细分）
function computeCross(rA, rB) {
  const pillars = [
    { stem: rA.year.stem, branch: rA.year.branch, label: "A年" },
    { stem: rA.month.stem, branch: rA.month.branch, label: "A月" },
    { stem: rA.day.stem, branch: rA.day.branch, label: "A日" },
    { stem: rA.hour.stem, branch: rA.hour.branch, label: "A时" },
    { stem: rB.year.stem, branch: rB.year.branch, label: "B年" },
    { stem: rB.month.stem, branch: rB.month.branch, label: "B月" },
    { stem: rB.day.stem, branch: rB.day.branch, label: "B日" },
    { stem: rB.hour.stem, branch: rB.hour.branch, label: "B时" },
  ];
  const raw = computeRelations(pillars);
  const isCross = (positions) =>
    positions.some((p) => p.startsWith("A")) &&
    positions.some((p) => p.startsWith("B"));
  return {
    stem: raw.stemCombos.filter((it) => isCross(it.positions)),
    liuhe: raw.liuhe.filter((it) => isCross(it.positions)),
    sanhe: raw.sanhe.filter((it) => isCross(it.positions)),
    sanhui: raw.sanhui.filter((it) => isCross(it.positions)),
    chong: raw.chong.filter((it) => isCross(it.positions)),
    xing: raw.xing.filter((it) => isCross(it.positions)),
    hai: raw.hai.filter((it) => isCross(it.positions)),
  };
}

// 桃花 / 红艳跨盘命中
const PEACH_BY_BRANCH = {
  0: 9, 4: 9, 8: 9, 2: 3, 6: 3, 10: 3,
  1: 6, 5: 6, 9: 6, 3: 0, 7: 0, 11: 0,
};
const HONGYAN_BY_STEM = {
  0: 6, 1: 6, 2: 2, 3: 2, 4: 4, 5: 4, 6: 10, 7: 10, 8: 0, 9: 0,
};

function countCrossPeach(self, other) {
  const targets = new Set([
    PEACH_BY_BRANCH[self.year.branch],
    PEACH_BY_BRANCH[self.day.branch],
  ]);
  const branches = [other.year.branch, other.month.branch, other.day.branch, other.hour.branch];
  return branches.filter((b) => targets.has(b)).length;
}
function countCrossHongyan(self, other) {
  const target = HONGYAN_BY_STEM[self.day.stem];
  const branches = [other.year.branch, other.month.branch, other.day.branch, other.hour.branch];
  return branches.filter((b) => b === target).length;
}

// 七杀贴日：对方的日干对自己日主而言是七杀
function isQishaTieRi(self, other) {
  return tenGodOf(self.day.stem, other.day.stem) === "七杀";
}

// 用神互补打分（与 YongShenPanel 相同口径，0–8 之间）
function yongShenScore(rA, rB) {
  const score = (selfRes, otherRes) => {
    const s = strengthAssessment(selfRes);
    const dayEl = s.dayEl;
    const isStrong = s.strength === "身强" || s.strength === "偏强";
    const yongEls = isStrong
      ? [SHENG_NEXT[dayEl], KE_TARGET[dayEl], reverseKe(dayEl)]
      : [reverseSheng(dayEl), dayEl];
    let count = 0;
    for (const k of ["year", "month", "day", "hour"]) {
      const p = otherRes[k];
      if (yongEls.includes(STEM_ELEMENT[p.stem])) count++;
      if (yongEls.includes(BRANCH_ELEMENT[p.branch])) count++;
    }
    if (count >= 5) return 4;
    if (count >= 3) return 3;
    if (count >= 2) return 2;
    if (count >= 1) return 1;
    return 0;
  };
  return score(rA, rB) + score(rB, rA); // 0–8
}
function reverseSheng(el) {
  for (const [k, v] of Object.entries(SHENG_NEXT)) if (v === el) return k;
}
function reverseKe(el) {
  for (const [k, v] of Object.entries(KE_TARGET)) if (v === el) return k;
}

// 月令关系（生/合/同/冲/克）
function monthRel(rA, rB) {
  const bA = rA.month.branch, bB = rB.month.branch;
  const elA = BRANCH_ELEMENT[bA], elB = BRANCH_ELEMENT[bB];
  const HE_PAIRS = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
  if (bA === bB) return "same";
  if (HE_PAIRS.some(([a, b]) => (a === bA && b === bB) || (a === bB && b === bA))) return "he";
  if (Math.abs(bA - bB) === 6) return "chong";
  const ke = (a, b) => (FIVE.indexOf(a) + 2) % 5 === FIVE.indexOf(b);
  const sheng = (a, b) => (FIVE.indexOf(a) + 1) % 5 === FIVE.indexOf(b);
  if (sheng(elA, elB) || sheng(elB, elA)) return "sheng";
  if (ke(elA, elB) || ke(elB, elA)) return "ke";
  return "none";
}

function clip(v) { return Math.max(0, Math.min(100, v)); }

// 吸引指数 0–100
function attractionScore(rA, rB, cross) {
  let s = 0;
  // 日干相合（最强吸引）
  const HE_STEMS = [[0,5],[1,6],[2,7],[3,8],[4,9]];
  const dayHe = HE_STEMS.some(([a,b]) =>
    (rA.day.stem===a && rB.day.stem===b) || (rA.day.stem===b && rB.day.stem===a));
  if (dayHe) s += 25;
  // 日支相合
  const BHE = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  const dayBranchHe = BHE.some(([a,b]) =>
    (rA.day.branch===a && rB.day.branch===b) || (rA.day.branch===b && rB.day.branch===a));
  if (dayBranchHe) s += 20;
  // 天合地合（叠加 bonus）
  if (dayHe && dayBranchHe) s += 15;
  // 跨盘合（除日柱）
  const otherStemHe = cross.stem.length - (dayHe ? 1 : 0);
  s += Math.min(15, otherStemHe * 5);
  const otherBranchHe = cross.liuhe.length - (dayBranchHe ? 1 : 0);
  s += Math.min(10, otherBranchHe * 4);
  // 跨盘三合 / 三会
  s += Math.min(10, (cross.sanhe.length + cross.sanhui.length) * 4);
  // 跨盘桃花
  const peachAB = countCrossPeach(rA, rB);
  const peachBA = countCrossPeach(rB, rA);
  s += Math.min(15, (peachAB + peachBA) * 5);
  // 跨盘红艳
  const honAB = countCrossHongyan(rA, rB);
  const honBA = countCrossHongyan(rB, rA);
  s += Math.min(10, (honAB + honBA) * 4);
  // 七杀贴日（克的张力）
  if (isQishaTieRi(rA, rB) || isQishaTieRi(rB, rA)) s += 10;
  // 日支冲（也算吸引张力，弱）
  const dayChong = Math.abs(rA.day.branch - rB.day.branch) === 6;
  if (dayChong) s += 5;
  return clip(s);
}

// 合适指数 0–100
function compatScore(rA, rB, cross) {
  let s = 50; // baseline
  // 月令关系
  const mr = monthRel(rA, rB);
  s += { same: 15, he: 18, sheng: 12, ke: -10, chong: -15, none: 0 }[mr];
  // 用神互补（0–8 → +0…+30）
  const ys = yongShenScore(rA, rB);
  s += ys * 4;
  // 日柱平和：日干不克日干 / 日支不冲
  const dayStemKe = (FIVE.indexOf(STEM_ELEMENT[rA.day.stem]) + 2) % 5
    === FIVE.indexOf(STEM_ELEMENT[rB.day.stem]) ||
    (FIVE.indexOf(STEM_ELEMENT[rB.day.stem]) + 2) % 5
    === FIVE.indexOf(STEM_ELEMENT[rA.day.stem]);
  const dayChong = Math.abs(rA.day.branch - rB.day.branch) === 6;
  if (!dayStemKe && !dayChong) s += 8;
  if (dayChong) s -= 10;
  // 跨盘 合 ≥ 冲刑害 → 正向
  const harmony = cross.liuhe.length + cross.sanhe.length + cross.sanhui.length;
  const conflict = cross.chong.length + cross.xing.length + cross.hai.length;
  s += Math.min(10, (harmony - conflict) * 3);
  // 五行皆缺扣分
  const eA = elementAnalysis(rA);
  const eB = elementAnalysis(rB);
  let bothMissing = 0;
  for (const el of FIVE) if (eA[el].count === 0 && eB[el].count === 0) bothMissing++;
  s -= bothMissing * 4;
  // 双方都"身强"或都"身弱"扣点（同向不互补）
  const sA = strengthAssessment(rA).strength;
  const sB = strengthAssessment(rB).strength;
  const strongA = sA === "身强" || sA === "偏强";
  const strongB = sB === "身强" || sB === "偏强";
  if (strongA === strongB) s -= 4;
  return clip(s);
}

function tier(att, com) {
  if (att >= 60 && com >= 60) return { name: "天作之合", desc: "吸引与合适双高 —— 罕见的好。珍惜并经营。", tone: "bg-emerald-100 text-emerald-900 border-emerald-300" };
  if (att >= 60 && com < 60) return { name: "纠缠型", desc: "强烈但消耗 —— 心动很大，但长期相处需要主动调适。", tone: "bg-rose-100 text-rose-900 border-rose-300" };
  if (att < 60 && com >= 60) return { name: "慢热长寿型", desc: "淡而真 —— 第一眼平常，相处越久越发现合拍。", tone: "bg-sky-100 text-sky-900 border-sky-300" };
  return { name: "缘浅", desc: "吸引与合适都不强 —— 多半不会主动开始，强求亦无益。", tone: "bg-muted text-muted-foreground border-border" };
}

export function PairSummary({ resultA, resultB, nameA, nameB }) {
  const cross = useMemo(() => computeCross(resultA, resultB), [resultA, resultB]);
  const att = useMemo(() => attractionScore(resultA, resultB, cross), [resultA, resultB, cross]);
  const com = useMemo(() => compatScore(resultA, resultB, cross), [resultA, resultB, cross]);
  const t = tier(att, com);

  return (
    <Card className="mt-6 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-semibold">吸引 vs 合适</h2>
        <span className={`rounded-md border px-2 py-1 text-xs font-medium ${t.tone}`}>
          {t.name}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        八字论关系的两套独立诊断：<strong>吸引</strong>来自反差、张力、合冲（短期化学反应）；
        <strong>合适</strong>来自匹配、节奏、互相滋养（长期可持续）。
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Bar label="吸引指数" value={att} color="rose" />
          <Bar label="合适指数" value={com} color="emerald" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">解读：</strong>{t.desc}
          </p>
        </div>
        <QuadrantChart att={att} com={com} />
      </div>
    </Card>
  );
}

function Bar({ label, value, color }) {
  const colorCls = {
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
  }[color];
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}/100</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${colorCls} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuadrantChart({ att, com }) {
  const size = 240;
  const padding = 24;
  const usable = size - padding * 2;
  // 吸引 → Y axis (top), 合适 → X axis (right)
  const x = padding + (com / 100) * usable;
  const y = padding + (1 - att / 100) * usable;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-[240px] w-[240px]">
      {/* Background quadrants */}
      <rect x={padding} y={padding} width={usable / 2} height={usable / 2} fill="#fff1f2" opacity="0.6" />
      <rect x={padding + usable / 2} y={padding} width={usable / 2} height={usable / 2} fill="#d1fae5" opacity="0.6" />
      <rect x={padding} y={padding + usable / 2} width={usable / 2} height={usable / 2} fill="#f4f4f5" opacity="0.6" />
      <rect x={padding + usable / 2} y={padding + usable / 2} width={usable / 2} height={usable / 2} fill="#e0f2fe" opacity="0.6" />
      {/* Axes */}
      <line x1={padding} y1={padding + usable / 2} x2={padding + usable} y2={padding + usable / 2} stroke="#d4d4d8" strokeWidth="1" />
      <line x1={padding + usable / 2} y1={padding} x2={padding + usable / 2} y2={padding + usable} stroke="#d4d4d8" strokeWidth="1" />
      {/* Border */}
      <rect x={padding} y={padding} width={usable} height={usable} fill="none" stroke="#a1a1aa" strokeWidth="1" />
      {/* Axis labels */}
      <text x={padding + usable / 2} y={padding - 8} textAnchor="middle" fontSize="10" fill="#71717a">吸引 ↑</text>
      <text x={padding + usable + 4} y={padding + usable / 2 + 4} textAnchor="start" fontSize="10" fill="#71717a">合适 →</text>
      {/* Quadrant labels */}
      <text x={padding + usable * 0.25} y={padding + usable * 0.5 - 8} textAnchor="middle" fontSize="9" fill="#9f1239" fontWeight="600">纠缠型</text>
      <text x={padding + usable * 0.75} y={padding + usable * 0.5 - 8} textAnchor="middle" fontSize="9" fill="#065f46" fontWeight="600">天作之合</text>
      <text x={padding + usable * 0.25} y={padding + usable * 0.95} textAnchor="middle" fontSize="9" fill="#52525b" fontWeight="600">缘浅</text>
      <text x={padding + usable * 0.75} y={padding + usable * 0.95} textAnchor="middle" fontSize="9" fill="#0c4a6e" fontWeight="600">慢热长寿</text>
      {/* Position dot */}
      <circle cx={x} cy={y} r="6" fill="#1f2937" stroke="white" strokeWidth="2" />
    </svg>
  );
}
