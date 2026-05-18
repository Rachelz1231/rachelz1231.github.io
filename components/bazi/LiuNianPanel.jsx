"use client";

import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT, BRANCH_ELEMENT,
  STEM_YIN_YANG, BRANCH_YIN_YANG,
  annualPillar, tenGodOf,
  postalHorseBranch,
} from "@/lib/bazi";
import { StemBranchCell } from "./StemBranchCell";
import { ExternalRelationsCard } from "./ExternalRelationsCard";
import {
  COL_ROW_TEXT, COL_ROW_GLYPH, COL_ROW_LBL, COL_ROW_GLYPH_LBL,
} from "./shared";

export function LiuNianPanel({
  result, luck, form, selectedIdx, onSelect, selectedDaYunIdx,
}) {
  if (!luck || !form) return null;
  const dayStem = result.day.stem;
  const startYear = new Date().getFullYear();
  const items = [];
  for (let y = startYear; y < startYear + 10; y++) {
    const ap = annualPillar(y);
    const age = y - form.year;
    const inCycle = luck.cycles.find((c) => age >= c.ageStart && age < c.ageEnd);
    items.push({
      year: y, age,
      stem: ap.stem, branch: ap.branch,
      tenGod: tenGodOf(dayStem, ap.stem),
      cycle: inCycle,
    });
  }

  const sel = selectedIdx != null ? items[selectedIdx] : null;
  // 大运：优先使用用户选中的，否则用流年所在大运
  const ctxDaYun = sel
    ? (selectedDaYunIdx != null ? luck.cycles[selectedDaYunIdx] : sel.cycle)
    : null;

  const yimaTargets = new Set([
    postalHorseBranch(result.year.branch),
    postalHorseBranch(result.day.branch),
  ]);

  return (
    <Card className="mt-6 overflow-hidden p-0">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="font-serif text-xl font-semibold">流年</h2>
        <p className="text-xs text-muted-foreground">
          {startYear}–{startYear + 9}（接下来 10 年）
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          点击列查看与命局 + 大运的关系
        </p>
      </header>

      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-[56px_repeat(10,minmax(0,1fr))]">
          <div className="flex flex-col bg-muted/30">
            <div className={COL_ROW_LBL}>年份</div>
            <div className={COL_ROW_LBL}>实岁</div>
            <div className={COL_ROW_LBL}>十神</div>
            <div className={COL_ROW_GLYPH_LBL}>天干</div>
            <div className={COL_ROW_GLYPH_LBL}>地支</div>
            <div className={COL_ROW_LBL}>大运</div>
            <div className={COL_ROW_LBL}>神煞</div>
          </div>
          {items.map((it, i) => {
            const selected = selectedIdx === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(selected ? null : i)}
                className={`flex flex-col border-l border-border text-center transition-colors ${
                  selected
                    ? "bg-primary/10 ring-2 ring-inset ring-primary/60"
                    : "hover:bg-muted/40"
                }`}
              >
                <div className={COL_ROW_TEXT}>{it.year}</div>
                <div className={COL_ROW_TEXT}>{it.age}</div>
                <div className={COL_ROW_TEXT}>{it.tenGod}</div>
                <div className={COL_ROW_GLYPH}>
                  <StemBranchCell
                    glyph={HEAVENLY_STEMS[it.stem]}
                    element={STEM_ELEMENT[it.stem]}
                    yinYang={STEM_YIN_YANG[it.stem]}
                    small
                  />
                </div>
                <div className={COL_ROW_GLYPH}>
                  <StemBranchCell
                    glyph={EARTHLY_BRANCHES[it.branch]}
                    element={BRANCH_ELEMENT[it.branch]}
                    yinYang={BRANCH_YIN_YANG[it.branch]}
                    small
                  />
                </div>
                <div className={COL_ROW_TEXT}>
                  <span className="text-[11px] text-muted-foreground">
                    {it.cycle
                      ? `${HEAVENLY_STEMS[it.cycle.stem]}${EARTHLY_BRANCHES[it.cycle.branch]}`
                      : "—"}
                  </span>
                </div>
                <div className={COL_ROW_TEXT}>
                  {yimaTargets.has(it.branch) ? (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                      驿马
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {sel && ctxDaYun && (
        <ExternalRelationsCard
          result={result}
          externals={[
            { stem: ctxDaYun.stem, branch: ctxDaYun.branch, label: "运" },
            { stem: sel.stem, branch: sel.branch, label: "岁" },
          ]}
          headerTitle={`流年 ${HEAVENLY_STEMS[sel.stem]}${EARTHLY_BRANCHES[sel.branch]}（${sel.tenGod}）`}
          headerSub={`${sel.year} 年 · ${sel.age} 岁 · 大运 ${HEAVENLY_STEMS[ctxDaYun.stem]}${EARTHLY_BRANCHES[ctxDaYun.branch]}（${ctxDaYun.tenGod}）`}
          externalLabel="岁"
        />
      )}
    </Card>
  );
}
