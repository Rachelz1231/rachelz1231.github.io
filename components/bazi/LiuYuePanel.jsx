"use client";

import { Card } from "@/components/ui/card";
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_ELEMENT, BRANCH_ELEMENT,
  STEM_YIN_YANG, BRANCH_YIN_YANG,
  monthlyPillars, annualPillar, tenGodOf,
  postalHorseBranch,
} from "@/lib/bazi";
import { StemBranchCell } from "./StemBranchCell";
import { ExternalRelationsCard } from "./ExternalRelationsCard";
import {
  COL_ROW_TEXT, COL_ROW_GLYPH, COL_ROW_LBL, COL_ROW_GLYPH_LBL, pad2,
} from "./shared";

export function LiuYuePanel({
  result, luck, form, liuNianYear, selectedIdx, onSelect, selectedDaYunIdx,
}) {
  if (!luck || !form || liuNianYear == null) return null;
  const dayStem = result.day.stem;
  const months = monthlyPillars(liuNianYear);
  const ap = annualPillar(liuNianYear);
  const items = months.map((m) => ({
    ...m,
    tenGod: tenGodOf(dayStem, m.stem),
  }));

  const sel = selectedIdx != null ? items[selectedIdx] : null;
  const liuNianAge = liuNianYear - form.year;
  const ctxDaYun = selectedDaYunIdx != null
    ? luck.cycles[selectedDaYunIdx]
    : luck.cycles.find((c) => liuNianAge >= c.ageStart && liuNianAge < c.ageEnd);

  const yimaTargets = new Set([
    postalHorseBranch(result.year.branch),
    postalHorseBranch(result.day.branch),
  ]);

  return (
    <Card className="mt-6 overflow-hidden p-0">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="font-serif text-xl font-semibold">
          流月 · {liuNianYear} 年
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {HEAVENLY_STEMS[ap.stem]}{EARTHLY_BRANCHES[ap.branch]}
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">
          按节气划分（立春→立春），共 12 月
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          点击列查看与命局 + 大运 + 流年 的关系
        </p>
      </header>

      <div className="overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-[64px_repeat(12,minmax(0,1fr))]">
          <div className="flex flex-col bg-muted/30">
            <div className={COL_ROW_LBL}>节气</div>
            <div className={COL_ROW_LBL}>区间</div>
            <div className={COL_ROW_LBL}>十神</div>
            <div className={COL_ROW_GLYPH_LBL}>天干</div>
            <div className={COL_ROW_GLYPH_LBL}>地支</div>
            <div className={COL_ROW_LBL}>神煞</div>
          </div>
          {items.map((it, i) => {
            const selected = selectedIdx === i;
            const range = `${pad2(it.startMonth)}/${pad2(it.startDay)}–${pad2(it.endMonth)}/${pad2(it.endDay)}`;
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
                <div className={COL_ROW_TEXT}>
                  <span className="text-[11px] text-muted-foreground">
                    {it.termName}
                  </span>
                </div>
                <div className={COL_ROW_TEXT}>
                  <span className="text-[10px] text-muted-foreground">
                    {range}
                  </span>
                </div>
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
            { stem: ap.stem, branch: ap.branch, label: "岁" },
            { stem: sel.stem, branch: sel.branch, label: "流月" },
          ]}
          headerTitle={`流月 ${HEAVENLY_STEMS[sel.stem]}${EARTHLY_BRANCHES[sel.branch]}（${sel.tenGod}）`}
          headerSub={`${sel.startYear}/${pad2(sel.startMonth)}/${pad2(sel.startDay)} – ${sel.endYear}/${pad2(sel.endMonth)}/${pad2(sel.endDay)} · ${sel.termName}入节 · 流年 ${HEAVENLY_STEMS[ap.stem]}${EARTHLY_BRANCHES[ap.branch]} · 大运 ${HEAVENLY_STEMS[ctxDaYun.stem]}${EARTHLY_BRANCHES[ctxDaYun.branch]}`}
          externalLabel="流月"
        />
      )}
    </Card>
  );
}
