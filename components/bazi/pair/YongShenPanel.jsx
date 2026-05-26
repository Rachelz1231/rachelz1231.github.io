"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  BRANCH_HIDDEN_STEMS,
  strengthAssessment,
  elementAnalysis,
} from "@/lib/bazi";
import { ELEMENT_COLOR } from "../shared";

const FIVE = ["木", "火", "土", "金", "水"];
const SHENG_NEXT = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const KE_TARGET = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

// 简化用神：身强 → 喜耗泄克（财官食伤的五行）；身弱 → 喜帮扶（印比的五行）
function deriveYongShen(strength) {
  const dayEl = strength.dayEl;
  const isStrong = strength.strength === "身强" || strength.strength === "偏强";
  if (isStrong) {
    // 我生(食伤), 我克(财), 克我(官杀)
    return {
      kind: "耗泄克",
      isStrong: true,
      elements: [SHENG_NEXT[dayEl], KE_TARGET[dayEl], reverseKe(dayEl)],
    };
  }
  // 身弱：印(生我), 比劫(同我)
  return {
    kind: "帮扶",
    isStrong: false,
    elements: [reverseSheng(dayEl), dayEl],
  };
}

function reverseSheng(el) {
  // 生我者 = 上一环
  for (const [k, v] of Object.entries(SHENG_NEXT)) if (v === el) return k;
  return null;
}
function reverseKe(el) {
  // 克我者 = 我克的对手在循环里隔两位
  for (const [k, v] of Object.entries(KE_TARGET)) if (v === el) return k;
  return null;
}

// 数另一盘里有多少能量在用神元素上
//   8 位记数：4 天干 + 4 地支本气
function countYongShenInOther(other, yongElements) {
  let count = 0;
  const breakdown = {};
  for (const k of ["year", "month", "day", "hour"]) {
    const p = other[k];
    const sEl = STEM_ELEMENT[p.stem];
    const bEl = BRANCH_ELEMENT[p.branch];
    if (yongElements.includes(sEl)) {
      count++;
      breakdown[sEl] = (breakdown[sEl] || 0) + 1;
    }
    if (yongElements.includes(bEl)) {
      count++;
      breakdown[bEl] = (breakdown[bEl] || 0) + 1;
    }
  }
  return { count, breakdown };
}

// 用神供给评分：0–4 分制（基于 8 位中用神位的占比）
function gradeSupply(count) {
  // count 范围 0–8
  if (count >= 5) return { score: 4, label: "极佳", tone: "bg-emerald-100 text-emerald-900" };
  if (count >= 3) return { score: 3, label: "良好", tone: "bg-emerald-50 text-emerald-800" };
  if (count >= 2) return { score: 2, label: "尚可", tone: "bg-amber-50 text-amber-900" };
  if (count >= 1) return { score: 1, label: "偏弱", tone: "bg-rose-50 text-rose-800" };
  return { score: 0, label: "无", tone: "bg-rose-100 text-rose-900" };
}

export function YongShenPanel({ resultA, resultB, nameA, nameB }) {
  const strA = useMemo(() => strengthAssessment(resultA), [resultA]);
  const strB = useMemo(() => strengthAssessment(resultB), [resultB]);
  const yongA = useMemo(() => deriveYongShen(strA), [strA]);
  const yongB = useMemo(() => deriveYongShen(strB), [strB]);
  const elA = useMemo(() => elementAnalysis(resultA), [resultA]);
  const elB = useMemo(() => elementAnalysis(resultB), [resultB]);

  // A 的用神 + B 提供的部分
  const aFromB = useMemo(
    () => countYongShenInOther(resultB, yongA.elements),
    [resultB, yongA]
  );
  const bFromA = useMemo(
    () => countYongShenInOther(resultA, yongB.elements),
    [resultA, yongB]
  );
  const gradeA = gradeSupply(aFromB.count);
  const gradeB = gradeSupply(bFromA.count);
  const overallScore = gradeA.score + gradeB.score; // 0–8
  const overallTier =
    overallScore >= 7
      ? { label: "天作之合", tone: "bg-emerald-100 text-emerald-900" }
      : overallScore >= 5
        ? { label: "相补相成", tone: "bg-emerald-50 text-emerald-800" }
        : overallScore >= 3
          ? { label: "各有所需", tone: "bg-amber-50 text-amber-900" }
          : overallScore >= 1
            ? { label: "互补有限", tone: "bg-rose-50 text-rose-800" }
            : { label: "几无互补", tone: "bg-rose-100 text-rose-900" };

  return (
    <Card className="mt-6 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-semibold">用神互补</h2>
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${overallTier.tone}`}
        >
          综合 {overallTier.label}（{overallScore}/8）
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        每个人的"用神"是命局的<strong>药</strong> ——
        身强者需耗泄，身弱者需帮扶。
        对方命中是否富含你的用神元素，决定你们能否"互相调候"。
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <YongShenCard
          self={nameA} other={nameB}
          strength={strA} yong={yongA}
          received={aFromB} grade={gradeA}
        />
        <YongShenCard
          self={nameB} other={nameA}
          strength={strB} yong={yongB}
          received={bFromA} grade={gradeB}
        />
      </div>

      <div className="mt-4 rounded-md border border-dashed border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">怎么读这个分：</span>
        分数高 = 对方天然带着你需要的能量，相处会让你感觉"被滋养"；
        分数低 ≠ 不能在一起，只是这段关系不靠"天然契合"驱动，
        更需要双方主动经营（或者依赖大运岁运的支援）。
      </div>
    </Card>
  );
}

function YongShenCard({ self, other, strength, yong, received, grade }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-sm font-semibold text-foreground">{self}</h3>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          日主 {strength.dayEl} · {strength.strength}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        所需用神（{yong.kind}）：
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {yong.elements.map((el) => (
          <span
            key={el}
            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${ELEMENT_COLOR[el]}`}
          >
            {el}
          </span>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{other}</span> 命中提供：
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
          {Object.keys(received.breakdown).length > 0 ? (
            Object.entries(received.breakdown).map(([el, n]) => (
              <span
                key={el}
                className={`rounded px-1.5 py-0.5 text-[11px] ${ELEMENT_COLOR[el]}`}
              >
                {el} × {n}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-rose-700">无</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">供给评分</span>
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${grade.tone}`}
          >
            {grade.score}/4 · {grade.label}
          </span>
        </div>
      </div>
    </div>
  );
}
