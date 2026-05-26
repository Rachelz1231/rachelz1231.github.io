"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT,
  annualPillar,
  majorLuckCycles,
  tenGodOf,
} from "@/lib/bazi";

// 关系信号触发器：检查给定 流年 + 大运 在某人命局中触发了哪些婚姻信号

const PEACH_BY_BRANCH = {
  0: 9, 4: 9, 8: 9,
  2: 3, 6: 3, 10: 3,
  1: 6, 5: 6, 9: 6,
  3: 0, 7: 0, 11: 0,
};

const HONGYAN_BY_STEM = {
  0: 6, 1: 6, 2: 2, 3: 2, 4: 4, 5: 4, 6: 10, 7: 10, 8: 0, 9: 0,
};

// 六合对
const HE_PAIRS = {
  0: 1, 1: 0,
  2: 11, 11: 2,
  3: 10, 10: 3,
  4: 9, 9: 4,
  5: 8, 8: 5,
  6: 7, 7: 6,
};

// 三合中神（含半合）
const SANHE_MEMBERS = {
  // 申子辰水
  0: { center: 0, peers: [8, 4] },
  8: { center: 0, peers: [0, 4] },
  4: { center: 0, peers: [8, 0] },
  // 寅午戌火
  2: { center: 6, peers: [6, 10] },
  6: { center: 6, peers: [2, 10] },
  10: { center: 6, peers: [2, 6] },
  // 巳酉丑金
  5: { center: 9, peers: [9, 1] },
  9: { center: 9, peers: [5, 1] },
  1: { center: 9, peers: [5, 9] },
  // 亥卯未木
  11: { center: 3, peers: [3, 7] },
  3: { center: 3, peers: [11, 7] },
  7: { center: 3, peers: [11, 3] },
};

// 配偶星天干（按性别 + 日干）：男看财、女看官杀
//   每个日干都有 4 个"广义配偶星"（正/偏 同性/异性各一）—— 这里返回元素，用元素比较
function spouseElements(dayStem, gender) {
  const dayEl = STEM_ELEMENT[dayStem];
  // 财 = 我克者；官杀 = 克我者
  const KE_TARGET = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
  const KE_BY = { 土: "木", 水: "土", 火: "水", 金: "火", 木: "金" };
  if (gender === "male") {
    return [KE_TARGET[dayEl]];
  }
  return [KE_BY[dayEl]];
}

// 检查给定 (stem, branch) 对 person 触发了哪些信号
function detectSignals(personResult, gender, stem, branch) {
  const signals = [];
  const stemEl = STEM_ELEMENT[stem];
  const spouseEls = spouseElements(personResult.day.stem, gender);

  // 1. 配偶星入命
  if (spouseEls.includes(stemEl)) {
    signals.push({
      key: "spouse",
      label: gender === "male" ? "财（妻星）入命" : "官（夫星）入命",
      tone: "bg-amber-100 text-amber-900",
    });
  }

  // 2. 合日支
  const dayBr = personResult.day.branch;
  if (HE_PAIRS[dayBr] === branch) {
    signals.push({
      key: "he",
      label: "合夫妻宫",
      tone: "bg-emerald-100 text-emerald-900",
    });
  }

  // 三合 / 半合 触发夫妻宫
  const sh = SANHE_MEMBERS[dayBr];
  if (sh && sh.peers.includes(branch)) {
    signals.push({
      key: "sanhe",
      label: "三合引动夫妻宫",
      tone: "bg-emerald-50 text-emerald-800",
    });
  }

  // 3. 冲日支
  if ((dayBr - branch + 12) % 12 === 6) {
    signals.push({
      key: "chong",
      label: "冲夫妻宫",
      tone: "bg-rose-100 text-rose-900",
    });
  }

  // 4. 桃花到位
  const peachTargets = new Set([
    PEACH_BY_BRANCH[personResult.year.branch],
    PEACH_BY_BRANCH[personResult.day.branch],
  ]);
  if (peachTargets.has(branch)) {
    signals.push({
      key: "peach",
      label: "桃花到位",
      tone: "bg-pink-100 text-pink-900",
    });
  }

  // 5. 红艳到位
  if (HONGYAN_BY_STEM[personResult.day.stem] === branch) {
    signals.push({
      key: "hongyan",
      label: "红艳到位",
      tone: "bg-pink-50 text-pink-800",
    });
  }

  return signals;
}

// 找出 personResult 在 year 时所属的大运
function findLuckAtYear(luck, year, birthYear) {
  if (!luck || !luck.cycles) return null;
  const age = year - birthYear;
  return luck.cycles.find((c) => age >= c.ageStart && age < c.ageEnd) || null;
}

export function RelationshipTimeline({
  resultA, resultB, formA, formB, nameA, nameB,
}) {
  const startYear = new Date().getFullYear();
  const YEARS = 15;

  // 双方大运
  const luckA = useMemo(() => buildLuck(resultA, formA), [resultA, formA]);
  const luckB = useMemo(() => buildLuck(resultB, formB), [resultB, formB]);

  const rows = useMemo(() => {
    const out = [];
    for (let y = startYear; y < startYear + YEARS; y++) {
      const ap = annualPillar(y);
      const luckCycleA = findLuckAtYear(luckA, y, formA.year);
      const luckCycleB = findLuckAtYear(luckB, y, formB.year);

      // A 的信号：流年 + 当前大运
      const aSignals = [];
      aSignals.push(...detectSignals(resultA, formA.gender, ap.stem, ap.branch).map((s) => ({ ...s, src: "流年" })));
      if (luckCycleA) {
        aSignals.push(...detectSignals(resultA, formA.gender, luckCycleA.stem, luckCycleA.branch).map((s) => ({ ...s, src: "大运" })));
      }
      const bSignals = [];
      bSignals.push(...detectSignals(resultB, formB.gender, ap.stem, ap.branch).map((s) => ({ ...s, src: "流年" })));
      if (luckCycleB) {
        bSignals.push(...detectSignals(resultB, formB.gender, luckCycleB.stem, luckCycleB.branch).map((s) => ({ ...s, src: "大运" })));
      }

      const resonance = aSignals.length > 0 && bSignals.length > 0;
      const intensity = resonance ? aSignals.length + bSignals.length : 0;

      out.push({
        year: y,
        ageA: y - formA.year,
        ageB: y - formB.year,
        ap,
        luckA: luckCycleA,
        luckB: luckCycleB,
        aSignals: dedupeSignals(aSignals),
        bSignals: dedupeSignals(bSignals),
        resonance,
        intensity,
      });
    }
    return out;
  }, [resultA, resultB, formA, formB, luckA, luckB, startYear]);

  const topResonance = useMemo(() => {
    return [...rows]
      .filter((r) => r.resonance)
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3);
  }, [rows]);

  return (
    <Card className="mt-6 p-6">
      <h2 className="font-serif text-xl font-semibold">关系触发窗口</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        未来 {YEARS} 年内，双方大运 + 流年对各自夫妻宫 / 配偶星 / 桃花红艳的触发情况。
        <strong>双方共振年</strong> = 同年都有信号 → 关系节点最可能出现的窗口。
      </p>

      {topResonance.length > 0 && (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-900">
            🌟 最强共振年 TOP 3
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {topResonance.map((r) => (
              <span
                key={r.year}
                className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-900"
              >
                {r.year}（共 {r.intensity} 个信号）
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left text-muted-foreground">
              <th className="px-2 py-2">年份</th>
              <th className="px-2 py-2">流年</th>
              <th className="px-2 py-2">{nameA}（{nameA === "甲方" ? "" : ""}）</th>
              <th className="px-2 py-2">{nameB}</th>
              <th className="px-2 py-2">共振</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.year}
                className={`border-b border-border align-top ${
                  r.resonance ? "bg-emerald-50/50" : ""
                }`}
              >
                <td className="px-2 py-2">
                  <p className="font-medium text-foreground">{r.year}</p>
                  <p className="text-[10px] text-muted-foreground">
                    A:{r.ageA}岁 / B:{r.ageB}岁
                  </p>
                </td>
                <td className="px-2 py-2">
                  <span className="font-serif text-sm">
                    {HEAVENLY_STEMS[r.ap.stem]}{EARTHLY_BRANCHES[r.ap.branch]}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <SignalCell
                    signals={r.aSignals}
                    luck={r.luckA}
                  />
                </td>
                <td className="px-2 py-2">
                  <SignalCell
                    signals={r.bSignals}
                    luck={r.luckB}
                  />
                </td>
                <td className="px-2 py-2">
                  {r.resonance ? (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-900">
                      ★ {r.intensity}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">读法：</span>
        信号越多越强，越可能成事；
        但<strong>性质</strong>也要看 —— 合 / 配偶星入命 → 有利结合；
        冲夫妻宫 → 关系动荡；桃花红艳 → 感情活跃但未必长久。
        共振年是<strong>窗口</strong>，不是"非要发生不可"。
      </div>
    </Card>
  );
}

function SignalCell({ signals, luck }) {
  if (signals.length === 0) {
    return (
      <span className="text-[10px] text-muted-foreground">
        {luck && (
          <span>
            运 {HEAVENLY_STEMS[luck.stem]}{EARTHLY_BRANCHES[luck.branch]}
          </span>
        )}
      </span>
    );
  }
  return (
    <div className="space-y-1">
      {luck && (
        <p className="text-[10px] text-muted-foreground">
          运 {HEAVENLY_STEMS[luck.stem]}{EARTHLY_BRANCHES[luck.branch]}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {signals.map((s, i) => (
          <span
            key={i}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${s.tone}`}
            title={`来源：${s.src}`}
          >
            {s.label}
            <span className="ml-0.5 text-[8px] opacity-60">{s.src === "大运" ? "运" : "岁"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function dedupeSignals(signals) {
  // 同一 key 在 流年 + 大运 都出现 → 保留两条都展示（更强）
  // 这里简单去重相同 key+src
  const seen = new Set();
  const out = [];
  for (const s of signals) {
    const k = `${s.key}-${s.src}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function buildLuck(result, form) {
  if (!result || !form) return null;
  const solar = result.solar
    ? {
        year: result.solar.year,
        month: result.solar.month,
        day: result.solar.day,
        hour: result.solar.hour,
        minute: Math.floor(result.solar.minute),
      }
    : { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute };
  return majorLuckCycles({
    pillars: result,
    birthYear: solar.year, birthMonth: solar.month,
    birthDay: solar.day, birthHour: solar.hour,
    birthMinute: solar.minute,
    gender: form.gender,
  });
}
